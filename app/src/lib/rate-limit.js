import connectDB from './mongodb';
import RateLimit from '@/models/RateLimit';
import { headers } from 'next/headers';

/**
 * Rate Limiter utility using MongoDB.
 * 
 * @param {string} action - The action being performed (e.g., 'login', 'register')
 * @param {number} limit - Max attempts allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, remaining: number}>}
 */
export async function rateLimit(action, limit = 10, windowMs = 60 * 1000) {
  const headersList = await headers();
  // Simple IP extraction (works behind most proxies)
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
             headersList.get('x-real-ip') || 
             '127.0.0.1';
  
  const key = `rate_limit:${ip}:${action}`;

  await connectDB();

  const now = new Date();
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { 
      $inc: { points: 1 },
      $setOnInsert: { expireAt: new Date(now.getTime() + windowMs) }
    },
    { upsert: true, new: true }
  );

  if (doc.points > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - doc.points };
}

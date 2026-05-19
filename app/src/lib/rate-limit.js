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
/**
 * Resets the rate limit for a specific action and IP.
 */
export async function resetRateLimit(action) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 
             headersList.get('x-real-ip')?.trim() || 
             headersList.get('host')?.split(':')[0] || 
             '127.0.0.1';

  const key = `rate_limit:${ip}:${action}`;
  await connectDB();
  await RateLimit.deleteOne({ key });
}

/**
 * Rate Limiter utility using MongoDB.
 * 
 * @returns {Promise<{success: boolean, remaining: number, resetTime?: Date}>}
 */
export async function rateLimit(action, limit = 10, windowMs = 60 * 1000) {
  const headersList = await headers();

  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 
             headersList.get('x-real-ip')?.trim() || 
             headersList.get('host')?.split(':')[0] || 
             '127.0.0.1';

  const key = `rate_limit:${ip}:${action}`;

  await connectDB();

  // 1. Check current points to avoid unnecessary increments if already blocked
  const existing = await RateLimit.findOne({ key });
  if (existing && existing.points >= limit) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[RateLimit] BLOCKED | Action: ${action} | Key: ${key} | Points: ${existing.points}/${limit}`);
    }
    return { success: false, remaining: 0, resetTime: existing.expireAt };
  }

  // 2. Increment or create
  const now = new Date();
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { 
      $inc: { points: 1 },
      $setOnInsert: { expireAt: new Date(now.getTime() + windowMs) }
    },
    { upsert: true, returnDocument: 'after' }
  );

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[RateLimit] Action: ${action} | Key: ${key} | Points: ${doc.points}/${limit}`);
  }

  if (doc.points > limit) {
    return { success: false, remaining: 0, resetTime: doc.expireAt };
  }

  return { success: true, remaining: limit - doc.points, resetTime: doc.expireAt };
}


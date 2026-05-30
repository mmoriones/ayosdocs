import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

/**
 * Handles GET requests for email verification.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    await connectDB();

    // Find user with matching token and ensure it hasn't expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    // 1. Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    // 2. Generate a secure, short-lived token for immediate auto-login
    const autoLoginToken = crypto.randomBytes(32).toString('hex');
    user.verificationLoginToken = autoLoginToken;
    user.verificationLoginTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute window

    await user.save();

    // 3. Redirect to the high-fidelity success page with the login token
    return NextResponse.redirect(new URL(`/verified?token=${autoLoginToken}`, req.url));
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.redirect(new URL('/login?error=verification_failed', req.url));
  }
}

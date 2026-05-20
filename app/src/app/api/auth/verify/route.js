import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
      // Token is invalid or expired
      // Redirect to home with an error parameter (you can handle this on the frontend)
      return NextResponse.redirect(new URL('/?error=invalid_token', req.url));
    }

    // Update user status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to the success page
    return NextResponse.redirect(new URL('/verified', req.url));
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
  }
}

import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Handles POST requests for the contact form.
 */
export async function POST(req) {
  try {
    // 1. Rate Limiting (5 messages per hour per IP)
    const limiter = await rateLimit('contact', 5, 60 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();

    // 2. Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (name.length < 2 || message.length < 10) {
      return NextResponse.json(
        { error: 'Name or message is too short.' },
        { status: 400 }
      );
    }

    // 3. Send Email
    await sendContactEmail({ name, email, message });

    return NextResponse.json(
      { message: 'Message sent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

import nodemailer from 'nodemailer';

/**
 * Reusable mail transporter using Zoho SMTP.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
});

/**
 * Sends a contact form email to the admin.
 * 
 * @param {Object} data - The form data.
 * @param {string} data.name - Name of the sender.
 * @param {string} data.email - Email of the sender.
 * @param {string} data.message - Message content.
 */
export const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: `"${name}" <${process.env.ZOHO_FROM_EMAIL}>`, // Sent via alias
    to: process.env.ZOHO_USER, // Received by you
    replyTo: email, // Direct reply goes to the user
    subject: `[Contact Form] Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #075985;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends a verification email to a new user.
 * 
 * @param {string} email - The user's email address.
 * @param {string} token - The verification token.
 * @param {string} [baseUrl] - The base URL for the verification link (optional).
 */
export const sendVerificationEmail = async (email, token, baseUrl) => {
  const base = baseUrl || process.env.NEXTAUTH_URL;
  const confirmLink = `${base}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_FROM_EMAIL}>`,
    to: email,
    subject: "Verify your AyosDocs account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #eee; rounded: 12px;">
        <h2 style="color: #075985; text-align: center;">Welcome to AyosDocs!</h2>
        <p>Thanks for signing up. To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #075985; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

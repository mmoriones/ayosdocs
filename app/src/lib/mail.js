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
    from: `"${name}" <${process.env.ZOHO_SUPPORT_EMAIL}>`, // Sent via alias
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
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
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

/**
 * Sends a password reset email to the user.
 * 
 * @param {string} email - The user's email address.
 * @param {string} token - The password reset token.
 * @param {string} [baseUrl] - The base URL for the reset link (optional).
 */
export const sendResetPasswordEmail = async (email, token, baseUrl) => {
  const base = baseUrl || process.env.NEXTAUTH_URL;
  const resetLink = `${base}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
    to: email,
    subject: "Reset your AyosDocs password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #075985; text-align: center;">Reset Your Password</h2>
        <p>You recently requested to reset your password for your AyosDocs account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #075985; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends an email to a Google OAuth user who requested a password reset.
 * 
 * @param {string} email - The user's email address.
 */
export const sendGoogleAuthResetEmail = async (email) => {
  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
    to: email,
    subject: "Regarding your AyosDocs password reset request",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #075985; text-align: center;">Sign in with Google</h2>
        <p>You recently requested to reset your password for AyosDocs. However, your account is linked to your Google account.</p>
        <p>To access your account, please use the <strong>"Continue with Google"</strong> button on the login page. Since you use Google to sign in, you don't have a separate password for AyosDocs.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #075985; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Go to AyosDocs
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">If you have any questions, feel free to reply to this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

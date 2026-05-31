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

const commonStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #1C1C1E;
  text-align: center;
`;

const buttonStyles = `
  background: linear-gradient(to top, #0038A8 0%, #0059E0 100%);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 900;
  display: inline-block;
  font-size: 16px;
  box-shadow: 0 8px 24px rgba(0, 56, 168, 0.2);
`;

const footerStyles = `
  font-size: 12px;
  color: #8E8E93;
  margin-top: 40px;
  border-top: 1px solid #F2F2F7;
  padding-top: 20px;
`;

/**
 * Sends a contact form email to the admin.
 */
export const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: `"${name}" <${process.env.ZOHO_SUPPORT_EMAIL}>`, 
    to: process.env.ZOHO_USER, 
    replyTo: email, 
    subject: `[Contact Form] Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="${commonStyles}">
        <h2 style="color: #0038A8; font-weight: 900; tracking: -0.02em;">New Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: 0; border-top: 1px solid #F2F2F7; margin: 20px 0;" />
        <p style="text-align: left; background: #F9F9FB; padding: 20px; border-radius: 16px; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends a verification email to a new user.
 */
export const sendVerificationEmail = async (email, token, baseUrl) => {
  const base = baseUrl || process.env.NEXTAUTH_URL;
  const confirmLink = `${base}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
    to: email,
    subject: "Verify your AyosDocs account",
    html: `
      <div style="${commonStyles}">
        <img src="https://ayosdocs.com/favicon.svg" alt="AyosDocs" width="64" height="64" style="margin-bottom: 24px;" />
        <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 16px; tracking: -0.02em;">Verify your email</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #3A3A3C; margin-bottom: 32px;">
         Thanks for joining AyosDocs. To start tracking your government requirements, please confirm your email address.
        </p>
        <a href="${confirmLink}" style="${buttonStyles}">
          Verify Email Address
        </a>
        <p style="font-size: 14px; color: #8E8E93; margin-top: 32px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email to the user.
 */
export const sendResetPasswordEmail = async (email, token, baseUrl) => {
  const base = baseUrl || process.env.NEXTAUTH_URL;
  const resetLink = `${base}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
    to: email,
    subject: "Reset your AyosDocs password",
    html: `
      <div style="${commonStyles}">
        <img src="https://ayosdocs.com/favicon.svg" alt="AyosDocs" width="64" height="64" style="margin-bottom: 24px;" />
        <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 16px; tracking: -0.02em;">Reset Password</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #3A3A3C; margin-bottom: 32px;">
          We received a request to reset the password for your account. Click the button below to set a new one:
        </p>
        <a href="${resetLink}" style="${buttonStyles}">
          Reset My Password
        </a>
        <p style="font-size: 14px; color: #8E8E93; margin-top: 32px;">
          This link will expire in 1 hour. If you didn't request this, you can ignore this email.
        </p>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends an email to a Google OAuth user who requested a password reset.
 */
export const sendGoogleAuthResetEmail = async (email) => {
  const mailOptions = {
    from: `"AyosDocs" <${process.env.ZOHO_AUTH_EMAIL}>`,
    to: email,
    subject: "Regarding your AyosDocs password reset request",
    html: `
      <div style="${commonStyles}">
        <img src="https://ayosdocs.com/favicon.svg" alt="AyosDocs" width="64" height="64" style="margin-bottom: 24px;" />
        <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 16px; tracking: -0.02em;">Google Login Only</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #3A3A3C; margin-bottom: 32px;">
          Your AyosDocs account is linked directly to your Google account. You don't have a separate password to reset.
        </p>
        <a href="${process.env.NEXTAUTH_URL}/login" style="${buttonStyles}">
          Login with Google
        </a>
        <div style="${footerStyles}">
          &copy; ${new Date().getFullYear()} AyosDocs. All rights reserved.
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const BACKEND_URL = process.env.BACKEND_URL;
  const verifyLink = `${BACKEND_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"AyosDocs" <contact@ayosdocs.com>`,
    to: email,
    subject: "Verify your email",
    html: `
        <h3>Verify your account</h3>
        <p>Click the link below:</p>
        <a href="${verifyLink}">${verifyLink}</a>
    `
  });
};

module.exports = {
  sendVerificationEmail
};

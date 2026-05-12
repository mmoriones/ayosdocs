const User = require('../models/User');
const crypto = require('crypto');
const authService = require('../services/authService');
const emailService = require('../services/emailService');

/**
 * Controller to handle user registration.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({
          message: "Email already registered. Please verify your email."
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await authService.hashPassword(password);
    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken: token,
      isVerified: false,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60 // 1 hour
    });

    await newUser.save();
    await emailService.sendVerificationEmail(email, token);

    res.status(201).json({ message: "Registration successful. Please verify your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller to handle user login.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.googleAuth) {
      return res.status(400).json({ message: "Please login using Google" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await authService.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = authService.generateToken(user);
    res.json({
      token,
      isNewUser: false,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        onboarded: user.onboarded
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller to handle email verification.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();
    res.redirect(`${process.env.FRONTEND_URL}/verified`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller to resend verification email.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 3600000;

    await user.save();
    await emailService.sendVerificationEmail(email, token);

    res.json({ message: "Verification email resent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controller to handle Google OAuth login.
 * 
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;
    const userData = await authService.verifyGoogleToken(access_token);
    const { email, name, picture } = userData;

    let isNewUser = false;
    let user = await User.findOne({ email });

    if (!user) {
      isNewUser = true;
      user = await User.create({
        fullName: name,
        email,
        picture,
        password: null,
        googleAuth: true,
        isVerified: true,
        onboarded: false
      });
    } else if (user.googleAuth && user.picture !== picture) {
      // Update picture if it changed
      user.picture = picture;
      await user.save();
    }

    const token = authService.generateToken(user);
    res.json({
      token,
      isNewUser,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        picture: user.picture,
        onboarded: user.onboarded
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  googleLogin
};

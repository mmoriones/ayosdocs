const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const User = require('../models/User.js');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const FRONTEND_URL = process.env.FRONTEND_URL
const BACKEND_URL = process.env.BACKEND_URL

// POST: register
router.post('/register', async (req, res) => {
    try{
        const { fullName, email, password } = req.body;

        //check if user exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isVerified) {
                return res.status(400).json({
                message: "Email already registered. Please verify your email."
                });
            }

            return res.status(400).json({
                message: "User already exist"
            });
            }


        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // generate token
        const token = crypto.randomBytes(32).toString("hex");

        const verifyLink = `${BACKEND_URL}/api/auth/verify/${token}`;

        //create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            verificationToken: token,
            isVerified: false,
            verificationTokenExpires: Date.now() + 1000 * 60 * 60 // 1 hour
        });

        await newUser.save();

        // send mail
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

        res.status(201).json({ message: "Registration successful. Please verify your email." });
    } 
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

//resend verification email
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) {
    return res.status(400).json({ message: "Already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000;

  await user.save();

  // send email again
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

  res.json({ message: "Verification email resent" });
});

//verify email
router.get('/verify/:token', async (req, res) => {
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

    res.redirect(`${FRONTEND_URL}/verified`);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//POST: login
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        //find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (user.googleAuth) {
            return res.status(400).json({
                message: "Please login using Google"
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first"
            });
            }

        //validate pass
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // create JWT
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// google oauth
router.post("/google", async (req, res) => {
    try {
        const { access_token } = req.body;

        const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        }
        );

        const { email, name } = googleRes.data;

        let user = await User.findOne({ email });

        if (!user) {
        user = await User.create({
            fullName: name,
            email,
            password: null,
            googleAuth: true,
            isVerified: true
        });
        }

        const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );

        res.json({
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin
        }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Google authentication failed" });
    }
    });

module.exports = router;
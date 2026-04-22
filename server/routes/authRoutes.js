const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const User = require('../models/User.js');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST: register
router.post('/register', async (req, res) => {
    try{
        const { fullName, email, password } = req.body;

        //check if user exist
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ 
            message: "User already exist"
        });

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } 
    catch (err) {
        res.status(500).json({error: err.message});
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
        console.log(req.body);

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
            password: null
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
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

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

//GET: verify email
//router.get('/verify/:token')

module.exports = router;
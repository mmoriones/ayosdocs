const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST: register
router.post('/register', authController.register);

// POST: login
router.post('/login', authController.login);

// GET: verify email
router.get('/verify/:token', authController.verifyEmail);

// POST: resend verification email
router.post('/resend-verification', authController.resendVerification);

// POST: google oauth
router.post("/google", authController.googleLogin);

module.exports = router;

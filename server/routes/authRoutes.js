const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Email/Password Auth Disabled for simplified Google-only flow
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/verify/:token', authController.verifyEmail);
// router.post('/resend-verification', authController.resendVerification);

// POST: google oauth
router.post("/google", authController.googleLogin);

module.exports = router;

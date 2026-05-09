const mongoose = require('mongoose');

/**
 * Mongoose schema for User profiles.
 * Stores personal information, authentication state, and guide progress.
 * 
 * @property {string} fullName - The user's full name.
 * @property {string} [picture] - URL to the user's profile picture.
 * @property {string} email - The user's email address (unique).
 * @property {string} [password] - Hashed password for email/password auth.
 * @property {string} [verificationToken] - Token for email verification.
 * @property {Date} [verificationTokenExpires] - Expiration date for the verification token.
 * @property {boolean} [googleAuth=false] - Whether the user signed up via Google.
 * @property {boolean} [isVerified=false] - Whether the user's email is verified.
 * @property {Array<{guideSlug: string, completedTasks: string}>} savedProgress - User's progress on various guides.
 */
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    picture: { type: String },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    googleAuth: {
        type: Boolean,
        default: false
    },
    isVerified: { type: Boolean, default: false },
    onboarded: { type: Boolean, default: false },
    savedProgress: [
        {
            guideSlug: String,
            completedTasks: String
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

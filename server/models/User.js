const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    isAdmin: { type: Boolean, default : false },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: false },
    googleAuth: {
        type: Boolean,
        default: false
        },
    isVerified: { type: Boolean, default: false },
    savedProgress: [
        {
            guideSlug: String,
            completedTasks: String
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
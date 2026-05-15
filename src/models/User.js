import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    picture: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
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
    trackedBundles: [
        {
            bundleId: String,
            startedAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

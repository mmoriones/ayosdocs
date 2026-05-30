import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    verificationLoginToken: String,
    verificationLoginTokenExpires: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    savedProgress: [
        {
            guideSlug: String,
            completedTasks: String,
            isFavorite: { type: Boolean, default: false },
            updatedAt: { type: Date, default: Date.now }
        }
    ],
    trackedBundles: [
        {
            bundleId: String,
            startedAt: { type: Date, default: Date.now }
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., rate_limit:1.2.3.4:login
  points: { type: Number, default: 0 },
  expireAt: { type: Date, required: true },
});

// TTL index for automatic deletion
rateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);

export default RateLimit;

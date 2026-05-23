import mongoose from 'mongoose';

const GuideStatsSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  bookmarks: {
    type: Number,
    default: 0,
  },
  lastInteraction: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.GuideStats || mongoose.model('GuideStats', GuideStatsSchema);

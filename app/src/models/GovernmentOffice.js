import mongoose from 'mongoose';

const governmentOfficeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  agency: {
    type: String,
    required: true,
    enum: ['DFA', 'PSA', 'NBI', 'SSS', 'LTO', 'PhilHealth', 'PAG-IBIG', 'BIR', 'Post Office', 'Others'],
  },
  branchType: {
    type: String,
    enum: ['Main', 'Regional', 'Satellite', 'Mall-based'],
    default: 'Satellite',
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  // Aggregated Stats (Cached for performance)
  stats: {
    avgRating: { type: Number, default: 0 },
    totalReports: { type: Number, default: 0 },
    avgWaitTime: { 
      type: String, 
      enum: ['fast', 'medium', 'slow', 'N/A'],
      default: 'N/A' 
    },
    appointmentDifficulty: {
      type: String,
      enum: ['easy', 'moderate', 'difficult', 'N/A'],
      default: 'N/A'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

const GovernmentOffice = mongoose.models.GovernmentOffice || mongoose.model('GovernmentOffice', governmentOfficeSchema);

export default GovernmentOffice;

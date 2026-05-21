import mongoose from 'mongoose';

const officeReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentOffice',
    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  ratings: {
    speed: { type: Number, min: 1, max: 5, required: true },
    friendliness: { type: Number, min: 1, max: 5, required: true },
    management: { type: Number, min: 1, max: 5, required: true },
    cleanliness: { type: Number, min: 1, max: 5, required: true },
  },
  appointment: {
    type: String,
    enum: ['easy', 'moderate', 'difficult'],
    required: true,
  },
  waitingTime: {
    type: String,
    enum: ['fast', 'medium', 'slow'], // Maps to <1hr, 1-3hr, Whole Day
    required: true,
  },
  extraRequirements: {
    type: Boolean,
    default: false,
  },
  fixerActivity: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    maxLength: 500,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved', // Auto-approve for now, can change to pending later
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Prevent multiple reports from the same user for the same office on the same day
officeReportSchema.index({ user: 1, office: 1, visitDate: 1 }, { unique: true });

const OfficeReport = mongoose.models.OfficeReport || mongoose.model('OfficeReport', officeReportSchema);

export default OfficeReport;

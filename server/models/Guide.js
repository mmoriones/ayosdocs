const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  lastUpdated: { type: String, default: () => new Date().toLocaleDateString() },
  content: { type: String, required: true },
  checklist: [
    {
      task: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Guide', guideSchema);
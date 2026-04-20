const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'nbi-clearance-guide'
  lastUpdated: { type: String, default: () => new Date().toLocaleDateString() },
  content: { type: String, required: true }, // Long SEO text/Markdown
  checklist: [
    {
      task: String,
      completed: { type: Boolean, default: false }
    }
  ],
  category: String
});

module.exports = mongoose.model('Guide', guideSchema);
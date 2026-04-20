const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide.js');

// GET a single guide by its slug
router.get('/:slug', async (req, res) => {
  try {
    const guide = await Guide.findOne({ slug: req.params.slug });
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
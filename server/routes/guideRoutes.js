const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide.js');

//search a guide
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) return res.json([]);

    const guides = await Guide.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { slug: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(5)
    .select("title slug category");

    res.json(guides);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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
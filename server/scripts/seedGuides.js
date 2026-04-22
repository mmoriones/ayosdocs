require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Guide = require('../models/Guide');

const guidesDir = path.join(__dirname, '../data/guides');

const loadGuides = () => {
  const files = fs.readdirSync(guidesDir);

  const guides = files.map(file => {
    const guidePath = path.join(guidesDir, file);
    return require(guidePath);
  });

  return guides;
};

const addGuide = async (guideData) => {
  const result = await Guide.replaceOne(
    { slug: guideData.slug },
    guideData,
    { upsert: true, returnDocument: 'after' }
  );

  console.log(`✅ Synced: ${guideData.slug}`);
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("🚀 Starting guide sync...");

    const Guides = loadGuides();

    // upsert guides
    await Promise.all(Guides.map(addGuide));

    // remove outdated guides
    const slugs = Guides.map(g => g.slug);

    const deleted = await Guide.deleteMany({
      slug: { $nin: slugs }
    });

    console.log(`🧹 Removed ${deleted.deletedCount} outdated guides`);

    console.log("✨ Guide sync complete!");
    process.exit();

  })
  .catch(err => {
    console.error("❌ Database error:", err);
    process.exit(1);
  });

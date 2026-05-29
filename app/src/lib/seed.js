/**
 * SEEDING UTILITY
 * 
 * Seeds default guide engagement stats into the database on first run.
 * Uses a safety check (count === 0) to prevent duplicate seeding.
 */

import connectDB from "@/lib/mongodb";
import GuideStats from "@/models/GuideStats";

const initialGuideStats = [
  { slug: 'passport-appointment', views: 5240, bookmarks: 842 },
  { slug: 'nbi-clearance', views: 4850, bookmarks: 620 },
  { slug: 'psa-birth-certificate', views: 4210, bookmarks: 512 },
  { slug: 'sss-registration', views: 3890, bookmarks: 430 },
  { slug: 'national-id', views: 3100, bookmarks: 390 },
  { slug: 'driver-license-renewal', views: 2800, bookmarks: 310 },
  { slug: 'pag-ibig-housing-loan', views: 2400, bookmarks: 280 }
];

export async function seedGuideStats() {
  try {
    await connectDB();
    
    const count = await GuideStats.countDocuments();
    if (count === 0) {
      await GuideStats.insertMany(initialGuideStats);
      console.log('Successfully seeded initial guide statistics.');
    }
  } catch (error) {
    console.error('Error seeding guide stats:', error);
  }
}

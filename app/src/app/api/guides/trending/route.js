import connectDB from "@/lib/mongodb";
import GuideStats from "@/models/GuideStats";
import { getAllGuides } from "@/lib/guides";
import { seedGuideStats } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Auto-seed if empty
    const count = await GuideStats.countDocuments();
    if (count === 0) {
      await seedGuideStats();
    }

    const trendingStats = await GuideStats.find()
      .sort({ views: -1 })
      .limit(5);

    const allGuides = getAllGuides(true);
    
    // Merge stats with guide metadata from Markdown
    const trendingGuides = trendingStats.map(stat => {
      const guide = allGuides.find(g => g.slug === stat.slug);
      if (!guide) return null;
      
      return {
        ...guide,
        stats: {
          views: stat.views > 1000 ? `${(stat.views / 1000).toFixed(1)}k` : stat.views.toString(),
          bookmarks: stat.bookmarks
        }
      };
    }).filter(Boolean);

    return NextResponse.json(trendingGuides);
  } catch (error) {
    console.error("Fetch Trending Guides Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { getAllGuides } from "@/lib/guides";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const guides = getAllGuides(true);
    
    // Sort by lastUpdated (latest first)
    const sortedGuides = guides
      .filter(g => g.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    // For the widget, we only need the top 5
    const latest = sortedGuides.slice(0, 5).map(g => ({
      title: g.shortTitle || g.title,
      slug: g.slug,
      lastUpdated: g.lastUpdated,
      type: 'Updated' // We can improve this logic later if we track "New" vs "Updated"
    }));

    return NextResponse.json(latest);
  } catch (error) {
    console.error("Recently Updated API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { validateCSRF } from "@/lib/security";

export async function POST(request) {
  try {
    // CSRF Protection
    const isCsrfValid = await validateCSRF();
    if (!isCsrfValid) {
      return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.isVerified) {
      return NextResponse.json({ message: "Account verification required" }, { status: 403 });
    }

    const { guideSlug, completedTasks } = await request.json();

    if (!guideSlug || typeof guideSlug !== 'string') {
      return NextResponse.json({ message: "Invalid guide slug" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.savedProgress) user.savedProgress = [];
    
    // Find existing entry to preserve isFavorite status and handle duplicates
    const existingEntry = user.savedProgress.find(p => p.guideSlug === guideSlug);
    const isFavorite = existingEntry ? existingEntry.isFavorite : false;

    // Remove all instances of this guideSlug (including duplicates)
    user.savedProgress = user.savedProgress.filter(p => p.guideSlug !== guideSlug);

    // Add a single clean entry
    user.savedProgress.push({ 
      guideSlug, 
      completedTasks,
      isFavorite,
      updatedAt: Date.now()
    });

    // Explicitly mark as modified for nested array updates
    user.markModified('savedProgress');

    await user.save();

    return NextResponse.json({ message: "Progress saved successfully", savedProgress: user.savedProgress });
  } catch (error) {
    console.error("Update Progress Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

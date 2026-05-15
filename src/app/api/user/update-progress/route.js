import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);

    if (progressIndex > -1) {
      user.savedProgress[progressIndex].completedTasks = completedTasks;
    } else {
      user.savedProgress.push({ guideSlug, completedTasks });
    }

    await user.save();

    return NextResponse.json({ message: "Progress saved successfully", savedProgress: user.savedProgress });
  } catch (error) {
    console.error("Update Progress Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

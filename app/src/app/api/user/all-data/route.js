import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.isVerified) {
      return NextResponse.json({ message: "Account verification required" }, { status: 403 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Progress data retrieved successfully",
      savedProgress: user.savedProgress || [],
      trackedBundles: user.trackedBundles || []
    });
  } catch (error) {
    console.error("All Data Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

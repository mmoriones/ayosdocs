import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { validateCSRF } from "@/lib/security";

export async function DELETE(request, { params }) {
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

    const { slug } = await params;
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.savedProgress) user.savedProgress = [];
    user.savedProgress = user.savedProgress.filter(p => p.guideSlug !== slug);
    await user.save();

    return NextResponse.json({ message: "Progress deleted successfully", savedProgress: user.savedProgress });
  } catch (error) {
    console.error("Delete Progress Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

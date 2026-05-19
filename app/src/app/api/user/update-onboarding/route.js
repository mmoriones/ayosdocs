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

    const { onboarded } = await request.json();
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { onboarded },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Onboarding status updated", onboarded: user.onboarded });
  } catch (error) {
    console.error("Update Onboarding Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

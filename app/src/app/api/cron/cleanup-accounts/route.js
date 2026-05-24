import { headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    await connectDB();
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({ deletedAt: { $lte: cutoff } });
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} expired accounts.`
    });
  } catch (error) {
    console.error("Cron Cleanup Error:", error);
    return NextResponse.json({ message: "Cleanup failed" }, { status: 500 });
  }
}

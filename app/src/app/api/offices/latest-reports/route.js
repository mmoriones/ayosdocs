import connectDB from "@/lib/mongodb";
import OfficeReport from "@/models/OfficeReport";
import GovernmentOffice from "@/models/GovernmentOffice";
import { NextResponse } from "next/server";

/**
 * GET /api/offices/latest-reports
 * Fetches the most recent verified office experience reports.
 */
export async function GET() {
  try {
    await connectDB();

    const reports = await OfficeReport.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('office', 'name agency city province')
      .lean();

    const formattedReports = reports.map(report => ({
      id: report._id,
      officeName: report.office.name,
      agency: report.office.agency,
      location: `${report.office.city}, ${report.office.province}`,
      rating: ((report.ratings.speed + report.ratings.friendliness + report.ratings.management + report.ratings.cleanliness) / 4).toFixed(1),
      waitTime: report.waitingTime === 'fast' ? '< 1 hr' : report.waitingTime === 'medium' ? '1-3 hrs' : 'Whole Day',
      comment: report.comment,
      createdAt: report.createdAt
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error("Latest Reports API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

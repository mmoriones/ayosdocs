import connectDB from "@/lib/mongodb";
import GovernmentOffice from "@/models/GovernmentOffice";
import { seedOffices } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    
    // Auto-seed if empty (for development)
    const count = await GovernmentOffice.countDocuments();
    if (count === 0) {
      await seedOffices();
    }

    const { searchParams } = new URL(request.url);
    const agency = searchParams.get('agency');
    const search = searchParams.get('search');

    let query = { isActive: true };

    if (agency && agency !== 'All Agencies') {
      query.agency = agency;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { province: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const offices = await GovernmentOffice.find(query).sort({ "stats.avgRating": -1 });

    return NextResponse.json(offices);
  } catch (error) {
    console.error("Fetch Offices Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import GovernmentOffice from "@/models/GovernmentOffice";
import OfficeReport from "@/models/OfficeReport";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Server action to submit an office experience report.
 */
export async function submitOfficeReportAction(formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: "Unauthorized" };

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to submit reports." };
    }

    // Rate limit: 2 reports per day per user
    const userLimit = await rateLimit(`rate-office:${session.user.id}`, 2, 24 * 60 * 60 * 1000);
    if (!userLimit.success) {
      return { success: false, message: "You have reached your daily limit for submitting reports." };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const { 
      officeId, 
      visitDate, 
      ratings, 
      appointment, 
      waitingTime, 
      extraRequirements, 
      fixerActivity, 
      comment, 
      isAnonymous 
    } = formData;

    // Validate office exists
    const office = await GovernmentOffice.findById(officeId);
    if (!office) return { success: false, message: "Government office not found" };

    // Create the report
    const report = await OfficeReport.create({
      user: user._id,
      office: officeId,
      visitDate: new Date(visitDate),
      ratings,
      appointment,
      waitingTime,
      extraRequirements: extraRequirements === 'yes',
      fixerActivity: fixerActivity === 'yes',
      comment,
      isAnonymous,
      status: 'approved' // Auto-approve for now
    });

    // Update Office Stats (Simple Aggregation)
    const allReports = await OfficeReport.find({ office: officeId, status: 'approved' });
    const totalReports = allReports.length;
    
    let totalScore = 0;
    const waitTimeCounts = { fast: 0, medium: 0, slow: 0 };
    const appointmentCounts = { easy: 0, moderate: 0, difficult: 0 };

    allReports.forEach(r => {
      const avgR = (r.ratings.speed + r.ratings.friendliness + r.ratings.management + r.ratings.cleanliness) / 4;
      totalScore += avgR;
      waitTimeCounts[r.waitingTime]++;
      appointmentCounts[r.appointment]++;
    });

    const avgRating = totalReports > 0 ? (totalScore / totalReports).toFixed(1) : 0;
    
    // Find the mode for waitingTime and appointment
    const avgWaitTime = Object.keys(waitTimeCounts).reduce((a, b) => waitTimeCounts[a] > waitTimeCounts[b] ? a : b);
    const appointmentDifficulty = Object.keys(appointmentCounts).reduce((a, b) => appointmentCounts[a] > appointmentCounts[b] ? a : b);

    office.stats = {
      avgRating: parseFloat(avgRating),
      totalReports,
      avgWaitTime,
      appointmentDifficulty
    };

    await office.save();

    revalidatePath("/offices");
    revalidatePath("/rate");

    return { 
      success: true, 
      message: "Your report has been published successfully. Thank you for contributing!" 
    };
  } catch (error) {
    console.error("Submit Office Report Action Error:", error);
    if (error.code === 11000) {
      return { success: false, message: "You have already submitted a report for this office on this visit date." };
    }
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Server action to get all offices (alternative to API for Server Components)
 */
export async function getOfficesAction(filters = {}) {
  try {
    await connectDB();
    const query = { isActive: true, ...filters };
    const offices = await GovernmentOffice.find(query).sort({ "stats.avgRating": -1 });
    return JSON.parse(JSON.stringify(offices));
  } catch (error) {
    console.error("Get Offices Action Error:", error);
    return [];
  }
}

'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

/**
 * Server action to update guide progress.
 */
export async function updateProgressAction(guideSlug, completedTasks) {
  if (!guideSlug || typeof guideSlug !== 'string') {
    return { success: false, message: "Invalid guide slug" };
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);

    if (progressIndex > -1) {
      user.savedProgress[progressIndex].completedTasks = completedTasks;
    } else {
      user.savedProgress.push({ guideSlug, completedTasks });
    }

    await user.save();
    
    // Revalidate paths that might show this progress
    revalidatePath("/my-progress");
    revalidatePath(`/guides/${guideSlug}`);
    revalidatePath("/");

    return { success: true, message: "Progress saved successfully" };
  } catch (error) {
    console.error("Update Progress Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Server action to update onboarding status.
 */
export async function updateOnboardingAction(onboarded) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { onboarded },
      { new: true }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    revalidatePath("/");
    revalidatePath("/onboarding");

    return { success: true, message: "Onboarding status updated" };
  } catch (error) {
    console.error("Update Onboarding Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Server action to delete guide progress.
 */
export async function deleteProgressAction(slug) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.savedProgress = user.savedProgress.filter(p => p.guideSlug !== slug);
    await user.save();

    revalidatePath("/my-progress");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Progress deleted successfully" };
  } catch (error) {
    console.error("Delete Progress Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

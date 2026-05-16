'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { bundles } from "@/data/bundles";

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

    if (!user.savedProgress) user.savedProgress = [];
    const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);

    if (progressIndex > -1) {
      user.savedProgress[progressIndex].completedTasks = completedTasks;
    } else {
      user.savedProgress.push({ guideSlug, completedTasks });
    }

    await user.save();
    
    // Revalidate paths that might show this progress
    revalidatePath("/my-docs");
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

    if (!user.savedProgress) user.savedProgress = [];
    user.savedProgress = user.savedProgress.filter(p => p.guideSlug !== slug);
    await user.save();

    revalidatePath("/my-docs");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Progress deleted successfully" };
  } catch (error) {
    console.error("Delete Progress Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Server action to start tracking a bundle.
 */
export async function startBundleAction(bundleId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: "Unauthorized" };

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return { success: false, message: "Bundle not found" };

    // 1. Add to tracked bundles if not already there
    if (!user.trackedBundles) user.trackedBundles = [];
    if (!user.savedProgress) user.savedProgress = [];

    if (!user.trackedBundles.some(b => b.bundleId === bundleId)) {
      user.trackedBundles.push({ bundleId });
    }

    // 2. Bulk enroll in all guides in the bundle flow
    const bundleGuides = bundle.flow.flatMap(stage => stage.guides);
    
    bundleGuides.forEach(slug => {
      const alreadyTracked = user.savedProgress.some(p => p.guideSlug === slug);
      if (!alreadyTracked) {
        user.savedProgress.push({
          guideSlug: slug,
          completedTasks: "" // Initially no tasks completed
        });
      }
    });

    await user.save();

    revalidatePath("/my-docs");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${bundleId}`);

    return { success: true, message: "Workflow started and guides added to your dashboard" };
  } catch (error) {
    console.error("Start Bundle Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

/**
 * Server action to stop tracking a bundle.
 */
export async function stopBundleAction(bundleId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: "Unauthorized" };

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    if (!user.trackedBundles) user.trackedBundles = [];
    user.trackedBundles = user.trackedBundles.filter(b => b.bundleId !== bundleId);
    await user.save();

    revalidatePath("/my-docs");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${bundleId}`);

    return { success: true, message: "Workflow stopped" };
  } catch (error) {
    console.error("Stop Bundle Action Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

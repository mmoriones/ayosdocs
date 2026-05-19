'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { bundles } from "@/data/bundles";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

/**
 * Server action to check if an email already exists in the database.
 */
export async function checkEmailAction(email) {
  // Rate limiting to prevent email harvesting
  const ipLimit = await rateLimit('check-email', 15);
  if (!ipLimit.success) return { exists: false };

  if (!email || !email.includes('@')) return { exists: false };
  
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return { 
      exists: !!user,
      isGoogle: user?.googleAuth || false
    };
  } catch (error) {
    return { exists: false };
  }
}

/**
 * Server action to register a new user with email and password.
 */
export async function registerUserAction(formData) {
  // Rate limiting (3 attempts per 15 minutes)
  const ipLimit = await rateLimit('register', 3, 15 * 60 * 1000);
  if (!ipLimit.success) {
    const remainingMs = ipLimit.resetTime ? ipLimit.resetTime.getTime() - Date.now() : 15 * 60 * 1000;
    const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
    return { 
      success: false, 
      message: `Too many registration attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.` 
    };
  }

  const fullName = formData.get('fullName')?.trim();
  const email = formData.get('email')?.trim().toLowerCase();
  const password = formData.get('password');

  // Basic presence check
  if (!fullName || !email || !password) {
    return { success: false, message: "All fields are required" };
  }

  // Full Name validation
  if (fullName.length < 2) {
    return { success: false, message: "Full name must be at least 2 characters long" };
  }
  if (fullName.length > 70) {
    return { success: false, message: "Full name must be less than 70 characters" };
  }
  // Basic name regex: allow letters, spaces, and common name punctuation
  const nameRegex = /^[a-zA-Z\s.\-&']+$/;
  if (!nameRegex.test(fullName)) {
    return { success: false, message: "Full name contains invalid characters" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please provide a valid email address" };
  }
  if (email.length > 100) {
    return { success: false, message: "Email must be less than 100 characters" };
  }

  // Password validation
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { success: false, message: "Password must be less than 128 characters" };
  }

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.googleAuth) {
        return { success: false, message: "This email is linked to a Google account. Please sign in with Google." };
      }
      return { success: false, message: "Email already registered" };
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      fullName,
      email,
      password,
      googleAuth: false,
      isVerified: false,
    });

    // Reset rate limit on success
    await resetRateLimit('register');

    return { success: true, message: "Account created successfully! You can now sign in." };
  } catch (error) {
    console.error("Register User Action Error:", error);
    return { success: false, message: "Failed to create account. Please try again." };
  }
}

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

    await user.save();

    revalidatePath("/my-docs");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${bundleId}`);

    return { success: true, message: "Workflow started and added to your dashboard" };
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

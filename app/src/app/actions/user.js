'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { bundles } from "@/data/bundles";
import { rateLimit, resetRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sendVerificationEmail, sendResetPasswordEmail, sendGoogleAuthResetEmail } from "@/lib/mail";
import crypto from "crypto";

/**
 * Server action to check rate limit status without incrementing.
 */
export async function checkRateLimitAction(action, limit) {
  return await getRateLimitInfo(action, limit);
}

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
    
    if (user && user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now();
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      let lockoutMessage = '';
      
      if (remainingSeconds < 120) {
        lockoutMessage = `Account temporarily locked. Try again in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`;
      } else {
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
        lockoutMessage = `Account temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
      }
      
      return {
        exists: true,
        isGoogle: user.googleAuth,
        locked: true,
        lockoutMessage
      };
    }

    return { 
      exists: !!user,
      isGoogle: user?.googleAuth || false,
      locked: false
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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      fullName,
      email,
      password,
      googleAuth: false,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (mailError) {
      console.error("Failed to send verification email during registration:", mailError);
      // We still return success because the account was created, 
      // but the user might need to resend the verification email later.
    }

    return { 
      success: true, 
      message: "Account created successfully! Please check your email to verify your account." 
    };
  } catch (error) {
    console.error("Register User Action Error:", error);
    return { success: false, message: "Failed to create account. Please try again." };
  }
}

/**
 * Server action to resend the verification email.
 */
export async function resendVerificationAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "You must be signed in to resend verification." };
    }

    // Rate limiting for resending email (1 per 2 minutes)
    const resendLimit = await rateLimit(`resend-verify:${session.user.id}`, 1, 2 * 60 * 1000);
    if (!resendLimit.success) {
      return { success: false, message: "Please wait a few minutes before requesting another email." };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    if (user.isVerified) {
      return { success: false, message: "Account is already verified." };
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const host = (await headers()).get("host");
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    await sendVerificationEmail(user.email, verificationToken, baseUrl);

    return { success: true, message: "Verification email sent! Please check your inbox." };
  } catch (error) {
    console.error("Resend Verification Action Error:", error);
    return { success: false, message: "Failed to send verification email. Please try again later." };
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

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to save progress." };
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

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to update onboarding." };
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

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to remove guides." };
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
 * Server action to toggle favorite status of a guide.
 */
export async function toggleFavoriteAction(guideSlug) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: "Unauthorized" };

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to favorite guides." };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const progressIndex = user.savedProgress.findIndex(p => p.guideSlug === guideSlug);
    
    let isFavorite;
    if (progressIndex === -1) {
      // If guide is not tracked, add it as a favorite with empty progress
      user.savedProgress.push({
        guideSlug,
        completedTasks: "",
        isFavorite: true,
        updatedAt: Date.now()
      });
      isFavorite = true;
    } else {
      user.savedProgress[progressIndex].isFavorite = !user.savedProgress[progressIndex].isFavorite;
      // Do not update updatedAt for favorite toggles to prevent UI jumping/rearranging
      isFavorite = user.savedProgress[progressIndex].isFavorite;
    }
    
    // Explicitly mark as modified for nested array updates
    user.markModified('savedProgress');
    
    await user.save();
    
    revalidatePath("/my-docs");
    revalidatePath(`/guides/${guideSlug}`);
    revalidatePath("/");
    
    return { 
      success: true, 
      isFavorite,
      message: isFavorite ? "Added to favorites" : "Removed from favorites" 
    };
  } catch (error) {
    console.error("Toggle Favorite Action Error:", error);
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

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to track bundles." };
    }

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

    if (!session.user.isVerified) {
      return { success: false, message: "Account verification required to stop tracking bundles." };
    }

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

/**
 * Server action to request a password reset.
 */
export async function requestPasswordResetAction(email) {
  if (!email || !email.includes('@')) {
    return { success: false, message: "Please provide a valid email address." };
  }

  // Rate limiting (3 requests per hour)
  const resetLimit = await rateLimit(`pw-reset-req:${email.toLowerCase()}`, 3, 60 * 60 * 1000);
  if (!resetLimit.success) {
    return { success: false, message: "Too many requests. Please try again in an hour." };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return { success: false, message: "No account found with that email address." };
    }

    if (user.googleAuth && !user.password) {
      await sendGoogleAuthResetEmail(user.email);
      return { success: true, message: "If an account exists with that email, a reset link has been sent." };
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const host = (await headers()).get("host");
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    await sendResetPasswordEmail(user.email, resetToken, baseUrl);

    return { success: true, message: "If an account exists with that email, a reset link has been sent." };
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return { success: false, message: "Failed to process request. Please try again later." };
  }
}

/**
 * Server action to reset password using a token.
 */
export async function resetPasswordAction(token, password) {
  if (!token || !password || password.length < 8) {
    return { success: false, message: "Invalid request. Password must be at least 8 characters." };
  }

  if (password.length > 128) {
    return { success: false, message: "Password must be less than 128 characters." };
  }

  try {
    await connectDB();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Also unlock account if it was locked due to too many login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();

    return { success: true, message: "Password has been reset successfully. You can now log in." };
  } catch (error) {
    console.error("Reset Password Action Error:", error);
    return { success: false, message: "Failed to reset password. Please try again later." };
  }
}

/**
 * Server action to change the current user's password.
 */
export async function changePasswordAction(currentPassword, newPassword) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters." };
  }

  if (newPassword.length > 128) {
    return { success: false, message: "New password is too long." };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    // If they already have a password, they MUST provide the correct current one
    if (user.password) {
      if (!currentPassword) {
        return { success: false, message: "Current password is required." };
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return { success: false, message: "Incorrect current password." };
      }
      
      // Polish: Check if new password is same as current
      const isSameAsOld = await user.comparePassword(newPassword);
      if (isSameAsOld) {
        return { success: false, message: "New password must be different from your current password." };
      }
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    
    // Clear any active reset tokens for security
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("Change Password Action Error:", error);
    return { success: false, message: "Failed to update password. Please try again later." };
  }
}

/**
 * Server action to update user profile information.
 */
export async function updateUserProfileAction(formData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const fullName = formData.get('fullName')?.trim();

  if (!fullName || fullName.length < 2) {
    return { success: false, message: "Full name must be at least 2 characters long." };
  }

  if (fullName.length > 70) {
    return { success: false, message: "Full name must be less than 70 characters." };
  }

  const nameRegex = /^[a-zA-Z\s.\-&']+$/;
  if (!nameRegex.test(fullName)) {
    return { success: false, message: "Full name contains invalid characters." };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    user.fullName = fullName;
    await user.save();

    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Update Profile Action Error:", error);
    return { success: false, message: "Failed to update profile. Please try again later." };
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OnboardingClient from './OnboardingClient';

export const metadata = {
  title: 'Onboarding | AyosDocs',
  description: 'Complete your AyosDocs setup to start tracking your government application progress.',
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  
  // If not logged in, NextAuth usually handles this, but let's be explicit
  if (!session) {
    redirect("/");
  }

  // If unverified, redirect to home (onboarding requires verification to save)
  if (!session.user.isVerified) {
    redirect("/");
  }

  return <OnboardingClient />;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { updateOnboardingAction } from '@/app/actions/user';
import axios from 'axios';

/**
 * OnboardingClient Component
 */
export default function OnboardingClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const completeOnboarding = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const result = await updateOnboardingAction(true);
        if (result.success) {
          // Update the session to reflect the new onboarding status
          await update({ onboarded: true });
        }
      } catch (error) {
        console.error("Failed to update onboarding status:", error);
      }
    };

    completeOnboarding();
  }, [status, update]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-ctp-base text-ctp-text">
      <div className="w-20 h-20 bg-ctp-sky-10 text-ctp-sky-800 rounded-2xl flex items-center justify-center mb-6 border border-ctp-surface1 shadow-sm">
        <CheckCircle size={40} strokeWidth={2.5} />
      </div>
      
      <h1 className="text-3xl font-bold text-ctp-text mb-3 tracking-tight">
        You&apos;re all set!
      </h1>
      
      <p className="text-ctp-subtext1 max-w-sm mb-10 leading-relaxed font-medium text-lg">
        Welcome to AyosDocs. You have successfully completed the onboarding process.
        Your progress will now be saved securely in the cloud.
      </p>

      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2.5 bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        <span>Return Home</span>
      </button>
    </div>
  );
}

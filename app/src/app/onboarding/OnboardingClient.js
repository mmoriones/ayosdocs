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
      <div className="w-24 h-24 bg-ctp-sky-800/10 text-ctp-sky-800 rounded-full flex items-center justify-center mb-8 shadow-inner border border-ctp-sky-800/20">
        <CheckCircle size={48} strokeWidth={3} />
      </div>
      
      <h1 className="text-4xl font-black text-ctp-text mb-4 uppercase tracking-tight">
        You&apos;re all set!
      </h1>
      
      <p className="text-ctp-subtext1 max-w-md mb-12 leading-relaxed font-bold text-lg opacity-80 uppercase tracking-tight">
        Welcome to AyosDocs. You have successfully completed the onboarding process.
        Your progress will now be saved securely in the cloud.
      </p>

      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-3 bg-ctp-sky-800 hover:opacity-90 text-ctp-base px-10 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-ctp-sky-800/20 text-[14px] uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={20} strokeWidth={3} />
        <span>Return Home</span>
      </button>
    </div>
  );
}

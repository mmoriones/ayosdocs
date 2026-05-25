'use client';

import { ArrowRight, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/context';

/**
 * Onboarding banner for the dashboard.
 */
const OnboardingBanner = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;

  const handleAction = () => {
    if (isLoggedIn && !isVerified) {
      showToast({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your email to start the onboarding bundle.'
      });
      return;
    }
    router.push('/onboarding');
  };

  return (
    <div className="w-full bg-ctp-mantle border border-ctp-surface1 rounded-xl overflow-hidden relative group shadow-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative z-10 p-6 flex flex-col gap-6">
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-ctp-sky-800/10 border border-ctp-sky-800/20 text-ctp-sky-800 text-ui-detail font-bold uppercase tracking-widest">
              <HelpCircle size={12} />
              <span>Getting Started</span>
            </div>
            
            {isLoggedIn && !isVerified && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-ctp-yellow/10 border border-ctp-yellow/20 text-ctp-yellow-800 text-ui-detail font-bold uppercase tracking-widest">
                <ShieldAlert size={12} />
                <span>Verify Email</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ctp-text tracking-tight leading-tight">
              Start your first application
            </h2>
            <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">
              Let us walk you through the process of finding the right guides and tracking your progress step-by-step.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            {[
              "Find guides",
              "Follow steps",
              "Sync progress"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 group/item opacity-80">
                <CheckCircle size={12} className="text-ctp-sky-800" strokeWidth={2.5} />
                <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={handleAction}
            className={`w-full font-bold px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] text-xs tracking-wide ${
              isLoggedIn && !isVerified 
                ? 'bg-ctp-surface1 text-ctp-subtext1 cursor-not-allowed border border-ctp-surface2' 
                : 'bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base shadow-lg shadow-ctp-sky-800/20'
            }`}
          >
            <span>{isLoggedIn && !isVerified ? "Verification Required" : "Launch Tutorial"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;

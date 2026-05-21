'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, ArrowRight, ShieldCheck, Cloud, Layout, Sparkles } from 'lucide-react';
import { updateOnboardingAction } from '@/app/actions/user';

/**
 * OnboardingClient Component - System setup success view.
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
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-ctp-base text-ctp-text">
      <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="space-y-6 relative">
          <div className="flex justify-center relative">
            <div className="w-20 h-20 rounded-2xl bg-ctp-green/10 border border-ctp-green/20 flex items-center justify-center text-ctp-green shadow-xl shadow-ctp-green/5 relative z-10">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 bg-ctp-green/10 rounded-2xl blur-3xl animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-ctp-text tracking-tight leading-tight">
              Workspace Initialized!
            </h1>
            <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed max-w-sm mx-auto">
              Welcome, <span className="text-ctp-text font-bold">{session?.user?.name?.split(' ')[0] || 'Citizen'}</span>. Your personal government documentation dashboard is now active and ready.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Cloud, title: "Cloud Sync Active", desc: "Progress saved instantly" },
            { icon: Layout, title: "Custom Dashboard", desc: "Track major life goals" },
            { icon: ShieldCheck, title: "Verified Identity", desc: "Secure account access" },
            { icon: Sparkles, title: "Smart Guides", desc: "Step-by-step logic" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-ctp-mantle border border-ctp-surface1 rounded-xl space-y-2 text-left hover:border-ctp-sky-800/30 transition-all group shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-inner group-hover:scale-105 transition-transform">
                <item.icon size={14} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[11px] text-ctp-text uppercase tracking-tight">{item.title}</h4>
                <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-3 bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white px-10 py-3.5 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-ctp-sky-800/20 text-xs uppercase tracking-widest mx-auto"
          >
            <span>Enter My Dashboard</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

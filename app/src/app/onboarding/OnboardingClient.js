'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, ArrowRight, ShieldCheck, Cloud, Layout, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { updateOnboardingAction } from '@/app/actions/user';

/**
 * OnboardingClient Component - System setup success view.
 */
export default function OnboardingClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const completeOnboarding = async () => {
      if (status !== 'authenticated' || session?.user?.onboarded) return;
      
      try {
        const result = await updateOnboardingAction(true);
        if (result.success) {
          // Update the session to reflect the new onboarding status
          await update({ onboarded: true });
          // Invalidate user data to refresh dashboard
          queryClient.invalidateQueries({ queryKey: ['user-data'] });
        }
      } catch (error) {
        console.error("Failed to update onboarding status:", error);
      }
    };

    completeOnboarding();
  }, [status, session?.user?.onboarded, update, queryClient]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-ctp-base text-ctp-text">
      <div className="max-w-xl w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="space-y-6 relative">
          <div className="flex justify-center relative">
            <div className="w-20 h-20 rounded-2xl bg-ctp-green/[0.04] border border-ctp-green/20 flex items-center justify-center text-ctp-green shadow-sm relative z-10">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 bg-ctp-green/10 rounded-2xl blur-3xl animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-ctp-text tracking-tight uppercase">
              System Ready
            </h1>
            <p className="text-ui-label text-ctp-subtext1 font-medium leading-relaxed max-w-sm mx-auto">
              Welcome, <span className="text-ctp-text font-bold uppercase">{session?.user?.name?.split(' ')[0] || 'Citizen'}</span>. Your secure government documentation workspace has been successfully initialized.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Cloud, title: "Cloud Sync Active", desc: "INSTANT DATA BACKUP" },
            { icon: Layout, title: "Goal Tracking", desc: "MAJOR LIFE EVENTS" },
            { icon: ShieldCheck, title: "Secure Identity", desc: "ENCRYPTED ACCESS" },
            { icon: Sparkles, title: "Smart Logic", desc: "GUIDED WORKFLOWS" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl space-y-3 text-left hover:border-ctp-sky-800/20 transition-all group shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-mantle transition-colors">
                <item.icon size={16} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-ctp-text uppercase tracking-tight">{item.title}</h4>
                <p className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-[0.15em] opacity-60 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-3 bg-ctp-sky-800 hover:bg-ctp-sky-700 text-white px-12 py-4 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-ctp-sky-800/20 text-xs uppercase tracking-widest mx-auto"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

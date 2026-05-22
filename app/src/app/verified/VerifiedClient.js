'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";

/**
 * VerifiedClient Component
 */
export default function VerifiedClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    // Show toast once on mount
    showToast({
      type: 'success',
      title: 'Email Verified',
      message: 'Your account has been successfully verified.'
    });

    // We still update the session in the background to ensure local state is fresh
    // but we don't block the UI on it.
    update();

    const timer = setTimeout(() => {
      router.push("/");
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base px-6 text-ctp-text">
      <div className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm p-10 md:p-12 max-w-md w-full text-center space-y-10 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="space-y-6 relative">
          <div className="flex justify-center relative">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-ctp-green/10 border border-ctp-green/20 text-ctp-green shadow-xl shadow-ctp-green/5 relative z-10">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 bg-ctp-green/10 rounded-2xl blur-3xl animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight uppercase tracking-widest">Email Verified</h2>
            <p className="text-sm font-medium text-ctp-subtext1 leading-relaxed">
              Your identity has been confirmed. You now have full access to workspace sync and bundle tracking.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10 pt-4">
          <button
            onClick={() => router.push("/")}
            className="group w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-[0.98] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Home size={14} />
            Enter My Dashboard
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
          </button>
        </div>

        <p className="text-[9px] font-bold text-ctp-subtext1 mt-6 uppercase tracking-widest animate-pulse opacity-60">
          Auto-redirecting shortly...
        </p>
      </div>
    </div>
  );
}

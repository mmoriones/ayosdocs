'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

/**
 * VerifiedClient Component
 */
export default function VerifiedClient() {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    showToast({
      type: 'success',
      title: 'Email Verified',
      message: 'Your account has been successfully verified.'
    });

    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base px-4 text-ctp-text">
      <div className="bg-ctp-mantle border border-ctp-surface0 rounded-[2.5rem] shadow-xl p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center rounded-3xl bg-ctp-sky-800/10 border border-ctp-sky-800/20 shadow-inner">
            <CheckCircle className="text-ctp-sky-800" size={40} strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-ctp-text tracking-tight uppercase">
          Email verified
        </h2>

        <p className="text-[16px] font-medium text-ctp-subtext1 mt-3 mb-10 leading-relaxed opacity-80">
          Your account has been successfully verified. You&apos;ll be redirected shortly.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-ctp-sky-800 hover:opacity-90 text-ctp-base font-black py-4 rounded-2xl transition-all shadow-xl shadow-ctp-sky-800/20 active:scale-[0.98] uppercase tracking-widest text-[14px]"
        >
          Go to Home
        </button>

        <p className="text-[11px] font-black text-ctp-subtext0 mt-6 uppercase tracking-widest animate-pulse">
          Redirecting in 3 seconds...
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, LayoutGrid, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui";

/**
 * High-fidelity, automatic-login verification success page.
 */
export default function VerifiedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { status, update } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(!!token);

  useEffect(() => {
    const autoLogin = async () => {
      if (!token) return;

      try {
        const result = await signIn('verify-login', {
          token,
          redirect: false,
        });

        if (result.ok) {
          // Success! Refresh session
          await update();
          // Short delay to show the success UI
          setTimeout(() => router.push('/'), 2500);
        } else {
          setIsLoggingIn(false);
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        setIsLoggingIn(false);
      }
    };

    autoLogin();
  }, [token, router, update]);

  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col items-center justify-center px-6 animate-in fade-in duration-700">
      <div className="w-full max-w-[480px] flex flex-col items-center text-center">
        {/* Verification Stage */}
        <div className="relative mb-10">
          <div className="w-24 h-24 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-center text-[#34C759] shadow-inner shadow-[#34C759]/5 relative z-10">
             <CheckCircle2 size={48} strokeWidth={2.5} className="animate-in zoom-in-50 duration-700" />
          </div>
          <div className="absolute inset-0 bg-[#34C759]/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <h1 className="text-[34px] font-black text-[#1C1C1E] tracking-tight leading-tight mb-4">
          Account Verified
        </h1>
        
        <p className="text-[17px] font-medium text-gray-500 mb-12 leading-relaxed max-w-[320px]">
          Your email has been confirmed. We&apos;re getting your <span className="text-[#0038A8] font-bold">personalized dashboard</span> ready.
        </p>

        {isLoggingIn ? (
          <div className="flex flex-col items-center gap-4 bg-white/40 rounded-[32px] p-8 border border-white/50 backdrop-blur-sm w-full animate-in slide-in-from-bottom-4 duration-1000">
             <Loader2 className="w-8 h-8 animate-spin text-[#0038A8]" />
             <p className="text-[14px] font-bold text-[#1C1C1E] uppercase tracking-widest">
               Authenticating...
             </p>
          </div>
        ) : (
          <div className="w-full space-y-4 animate-in fade-in duration-500">
            <Button
              onClick={() => router.push('/')}
              size="lg"
              leftIcon={<LayoutGrid size={20} strokeWidth={2.5} />}
              className="w-full h-14 rounded-3xl font-black shadow-[0_8px_24px_rgba(0,56,168,0.1)]"
              style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
            >
              Enter Dashboard
            </Button>
            <p className="text-[13px] font-medium text-gray-400">
              Auto-login failed? <button onClick={() => router.push('/login')} className="text-[#0038A8] font-bold hover:underline">Sign in manually</button>
            </p>
          </div>
        )}

        {/* Brand Subtle Logo */}
        <div className="mt-20 opacity-20 flex items-center gap-2 grayscale brightness-50">
          <Image src="/ayosdocs.webp" alt="AyosDocs" width={24} height={24} />
          <span className="text-lg font-black tracking-tight text-[#1C1C1E]">
            AyosDocs
          </span>
        </div>
      </div>
    </div>
  );
}

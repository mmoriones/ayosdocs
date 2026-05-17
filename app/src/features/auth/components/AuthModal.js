'use client';

import Image from 'next/image';
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { signIn, useSession } from 'next-auth/react';
import { useToast } from "@/context/ToastContext";

const AuthModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const { status } = useSession();
  const [isExchanging, setIsExchanging] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && isOpen) {
      onClose();
    }
  }, [status, isOpen, onClose]);

  const handleGoogleLogin = async () => {
    setIsExchanging(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error("Login error:", error);
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Something went wrong. Please try again.'
      });
      setIsExchanging(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || status === 'authenticated') return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface1 overflow-hidden animate-slide-down pointer-events-auto">
        <button
          onClick={onClose}
          disabled={isExchanging}
          className="absolute top-5 right-5 z-50 p-2 rounded-full text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-all active:scale-95 disabled:opacity-50 border border-transparent hover:border-ctp-surface1"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="p-8 pt-10 relative">
          {isExchanging && (
            <div className="absolute inset-0 z-20 bg-ctp-mantle/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-ctp-sky-800 mb-3" strokeWidth={2.5} />
                <h3 className="text-base font-bold text-ctp-text">Signing you in...</h3>
                <p className="text-xs font-medium text-ctp-subtext1 mt-1">Please wait a moment</p>
              </div>
            </div>
          )}

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              Sign in to AyosDocs
            </h2>
            <p className="text-sm font-medium text-ctp-subtext1 mt-2 leading-relaxed">
              Save your progress and access your checklists across all your devices.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isExchanging}
            className="w-full flex items-center justify-center gap-3 bg-ctp-base border border-ctp-surface1 hover:bg-ctp-mantle text-ctp-text font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={18}
              height={18}
              className="w-4.5 h-4.5"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[11px] font-medium text-ctp-subtext0 leading-relaxed px-4">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-ctp-sky-800 transition-colors">Terms of Service</span> and <span className="underline cursor-pointer hover:text-ctp-sky-800 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

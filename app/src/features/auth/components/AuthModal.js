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

      <div className="relative w-full max-w-md bg-ctp-mantle/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-ctp-surface0/60 overflow-hidden animate-slide-down pointer-events-auto">
        <button
          onClick={onClose}
          disabled={isExchanging}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-subtext1 transition-all active:scale-90 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-10 pt-12 relative">
          {isExchanging && (
            <div className="absolute inset-0 z-20 bg-ctp-mantle/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-ctp-sky-800 mb-4" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-ctp-text">Signing you in...</h3>
                <p className="text-[13px] font-medium text-ctp-subtext1 mt-1.5">Please wait a moment</p>
              </div>
            </div>
          )}

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              Sign in to AyosDocs
            </h2>
            <p className="text-[14px] font-medium text-ctp-subtext1 mt-2.5 leading-relaxed">
              Save your progress and access your checklists across all your devices.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isExchanging}
            className="w-full flex items-center justify-center gap-3 bg-ctp-mantle border border-ctp-surface2 hover:bg-ctp-surface1 text-ctp-text font-bold py-4 rounded-[20px] transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[11px] font-medium text-ctp-subtext0 leading-relaxed px-4">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

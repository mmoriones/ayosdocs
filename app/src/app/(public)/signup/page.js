'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  Button,
} from '@/components/ui';
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';
import { SocialProviders, SignupForm } from '@/features/auth/components/shared';

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    isExchanging,
    exchangingMethod,
    statusMessage,
    handleGoogleLogin,
    handleEmailSignUp,
    formData,
    handleInputChange,
    isFormValid,
    getFieldError,
  } = useAuthLogic({
    initialMode: 'signup',
    onSuccess: () => router.push('/')
  });

  // Navigate to login after successful signup
  useEffect(() => {
    if (statusMessage?.type === 'success') {
      const timer = setTimeout(() => router.push('/login'), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage, router]);

  if (status !== 'unauthenticated') {
    return null;
  }

  const handleGuestMode = () => {
    document.cookie = "guest-access=true; path=/; max-age=86400";
    router.push('/');
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 lg:px-12 pb-12 animate-in fade-in duration-500 bg-ctp-mantle">
      <div className="w-full max-w-[480px] mx-auto space-y-8">
        <div className="bg-ctp-base border border-ctp-surface1 rounded-xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-[28px] font-bold text-ctp-text tracking-tight">
              Sign up to AyosDocs
            </h1>
          </div>

          {statusMessage && (
            <div className={`mb-8 p-4 rounded-xl border flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              statusMessage.type === 'error'
                ? 'bg-ctp-red/10 border-ctp-red/20 text-ctp-red'
                : 'bg-ctp-green/10 border-ctp-green/20 text-ctp-green'
            }`}>
              <div className="flex items-start gap-3">
                {statusMessage.type === 'error' ? (
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                )}
                <p className="text-[13px] font-bold leading-tight">{statusMessage.text}</p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <SignupForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailSignUp}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-ctp-surface1"></span>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-ctp-base px-6 text-[11px] font-medium text-ctp-subtext1">or</span>
              </div>
            </div>

            <SocialProviders
              onGoogleLogin={handleGoogleLogin}
              onGuestClick={handleGuestMode}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              showEmailOption={false}
              variant="page"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-ctp-subtext1 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-ctp-sky-800 hover:underline font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center px-10">
          <p className="text-[11px] text-ctp-subtext1 leading-relaxed">
            By continuing, I agree to AyosDocs&apos;s{' '}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">terms</Link>,{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">privacy policy</Link>, and{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">cookie policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';
import { ForgotPasswordForm } from '@/features/auth/components/shared';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    isExchanging,
    exchangingMethod,
    statusMessage,
    handleForgotPasswordSubmit,
    formData,
    handleInputChange,
    isFormValid,
    getFieldError,
  } = useAuthLogic({
    initialMode: 'forgot-password',
    onSuccess: () => router.push('/')
  });

  if (status !== 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 lg:px-12 pb-12 animate-in fade-in duration-500 bg-ctp-mantle">
      <div className="w-full max-w-[480px] mx-auto space-y-8">
        <div className="bg-ctp-base border border-ctp-surface1 rounded-xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-[28px] font-bold text-ctp-text tracking-tight">
              Reset your password
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

          <ForgotPasswordForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleForgotPasswordSubmit}
            isExchanging={isExchanging}
            exchangingMethod={exchangingMethod}
            isFormValid={isFormValid}
            getFieldError={getFieldError}
          />

          <div className="mt-8 text-center">
            <Link href="/login" className="text-[14px] text-ctp-sky-800 hover:underline font-bold transition-colors">
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft
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

  if (status === 'authenticated') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col items-center animate-in fade-in duration-700">
      {/* Mobile-Friendly Header with Back Button */}
      <div className="w-full max-w-[1200px] px-6 pt-10 pb-6 flex justify-between items-start relative">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
        </button>
      </div>

      <div className="w-full max-w-[480px] px-6 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex-1">
            <h1 className="text-[28px] font-black text-[#1C1C1E] tracking-tight leading-tight">
              Reset Password
            </h1>
            <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed max-w-[240px]">
              We&apos;ll send you a link to <span className="text-[#0038A8] font-bold">recover your account</span>.
            </p>
          </div>
          
          {/* 3D Illustration */}
          <div className="w-24 h-24 relative -mr-2 drop-shadow-xl animate-float opacity-80">
             <Image 
              src="/assets/ui/ForgotPassword.webp" 
              alt="Recover" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-2xl border flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 ${
            statusMessage.type === 'error'
              ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
              : 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
          }`}>
            <div className="flex items-start gap-3">
              {statusMessage.type === 'error' ? (
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              )}
              <p className="text-[13px] font-bold leading-tight">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white">
          <ForgotPasswordForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleForgotPasswordSubmit}
            isExchanging={isExchanging}
            exchangingMethod={exchangingMethod}
            isFormValid={isFormValid}
            getFieldError={getFieldError}
          />
        </div>

        {/* Footer Link */}
        <div className="mt-10 mb-12 text-center">
          <Link href="/login" className="text-[15px] font-bold text-[#0038A8] hover:underline transition-all">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}

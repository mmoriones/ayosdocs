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
import {
  Button,
} from '@/components/ui';
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

  const isSuccess = statusMessage?.type === 'success';

  if (status === 'authenticated') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col items-center animate-in fade-in duration-700">
      {/* Mobile-Friendly Header with Back Button */}
      <div className="w-full max-w-[1200px] px-6 pt-10 pb-6 flex justify-between items-start relative">
        {!isSuccess && (
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
          >
            <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="w-full max-w-[480px] px-6 flex flex-col">
        {isSuccess ? (
          /* High-Fidelity Success View */
          <div className="flex flex-col items-center text-center pt-4 animate-in zoom-in-95 fade-in duration-500">
             <div className="w-24 h-24 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-center text-[#34C759] mb-8 shadow-inner shadow-[#34C759]/5">
                <CheckCircle2 size={48} strokeWidth={2.5} className="animate-in zoom-in-50 duration-700" />
             </div>
             
             <h1 className="text-[34px] font-black text-[#1C1C1E] tracking-tight leading-tight mb-4">
               Reset link sent
             </h1>
             
             <p className="text-[17px] font-medium text-gray-500 mb-10 leading-relaxed">
               Please check your inbox. We&apos;ve sent recovery instructions to <br/>
               <span className="text-[#0038A8] font-bold">{formData.email}</span>.
             </p>

             <div className="w-full">
                <Button
                  onClick={() => router.push('/login')}
                  size="lg"
                  className="w-full h-14 rounded-3xl font-black shadow-[0_8px_24px_rgba(0,56,168,0.1)]"
                  style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
                >
                  Return to Login
                </Button>
             </div>
          </div>
        ) : (
          /* Standard Forgot Password View */
          <>
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

            {/* Status Messages (Errors only) */}
            {statusMessage && statusMessage.type === 'error' && (
              <div className={`mb-6 p-5 rounded-[24px] border backdrop-blur-md animate-in fade-in zoom-in-95 duration-500 shadow-sm bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-[#FF3B30]/20 bg-[#FF3B30]/10">
                    <AlertCircle size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-[14px] font-black leading-tight mb-1">Recovery Error</p>
                    <p className="text-[13px] font-medium opacity-80 leading-relaxed">{statusMessage.text}</p>
                  </div>
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
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

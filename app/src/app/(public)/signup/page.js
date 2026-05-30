'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
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
import { SignupForm } from '@/features/auth/components/shared';

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    isExchanging,
    exchangingMethod,
    statusMessage,
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
        {/* Welcome Section */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex-1">
            <h1 className="text-[28px] font-black text-[#1C1C1E] tracking-tight leading-none">
              Create Account
            </h1>
            <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed max-w-[240px]">
              Sign up to simplify your <span className="text-[#0038A8] font-bold">government transactions</span>.
            </p>
          </div>
          
          {/* 3D Illustration */}
          <div className="w-24 h-24 relative -mr-2 drop-shadow-xl animate-float opacity-80">
             <Image 
              src="/assets/ui/CreateAccount.webp" 
              alt="Join us" 
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
          <div className="space-y-6">
            <SignupForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailSignUp}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-10 mb-12 text-center">
          <p className="text-[15px] font-medium text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0038A8] font-bold hover:underline transition-all">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
import { SocialProviders, LoginForm } from '@/features/auth/components/shared';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    isExchanging,
    exchangingMethod,
    statusMessage,
    handleGoogleLogin,
    handleEmailLogin,
    formData,
    handleInputChange,
    isFormValid,
    getFieldError,
  } = useAuthLogic({
    initialMode: 'login',
    onSuccess: () => router.push('/')
  });

  const handleGuestMode = () => {
    document.cookie = "guest-access=true; path=/; max-age=86400";
    router.push('/');
  };

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
              Welcome Back
            </h1>
            <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed max-w-[240px]">
              Log in to continue your journey with <span className="text-[#0038A8] font-bold">AyosDocs</span>.
            </p>
          </div>
          
          {/* 3D Illustration */}
          <div className="w-24 h-24 relative -mr-2 drop-shadow-xl animate-float opacity-90">
             <Image 
              src="/assets/ui/Stack1.webp" 
              alt="Welcome" 
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
              : statusMessage.type === 'google-suggestion'
              ? 'bg-[#0038A8]/10 border-[#0038A8]/20 text-[#0038A8]'
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
            <LoginForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailLogin}
              onForgotPassword={() => router.push('/forgot-password')}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100"></span>
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-white px-4 text-gray-400 font-bold uppercase tracking-[0.2em]">
                  Or Continue With
                </span>
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
        </div>

        {/* Footer Link */}
        <div className="mt-10 mb-12 text-center">
          <p className="text-[15px] font-medium text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#0038A8] font-bold hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

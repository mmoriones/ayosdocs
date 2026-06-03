'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  AuthPageHeader,
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

  // Safe redirection after render
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col items-center animate-in fade-in duration-700">
      <AuthPageHeader
        onBackClick={() => router.back()}
        onGuestClick={handleGuestMode}
      />

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
          <div className="w-24 h-24 relative -mr-2 drop-shadow-xl opacity-90">
             <Image 
              src="/assets/ui/Stack1.webp" 
              alt="Welcome" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

        {/* High-Fidelity Status Messages */}
        {statusMessage && (
          <div className={`mb-6 p-5 rounded-[24px] border backdrop-blur-md animate-in fade-in zoom-in-95 duration-500 shadow-sm ${
            statusMessage.type === 'error'
              ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
              : statusMessage.type === 'google-suggestion'
              ? 'bg-[#0038A8]/10 border-[#0038A8]/20 text-[#0038A8]'
              : 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                statusMessage.type === 'error' ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20' : statusMessage.type === 'google-suggestion' ? 'bg-[#0038A8]/10 border-[#0038A8]/20' : 'bg-[#34C759]/10 border-[#34C759]/20'
              }`}>
                {statusMessage.type === 'error' ? (
                  <AlertCircle size={20} strokeWidth={2.5} />
                ) : (
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[14px] font-black leading-tight mb-1">
                  {statusMessage.type === 'error' ? 'Login Alert' : statusMessage.type === 'google-suggestion' ? 'Google Sign-in' : 'Success'}
                </p>
                <p className="text-[13px] font-medium opacity-80 leading-relaxed">
                  {statusMessage.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-gradient-to-b from-white to-[#F5F8FE] rounded-[40px] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white">
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

            <div className="flex items-center gap-4 py-2">
              <span className="flex-1 border-t border-gray-100"></span>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] shrink-0">
                Or Continue With
              </span>
              <span className="flex-1 border-t border-gray-100"></span>
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

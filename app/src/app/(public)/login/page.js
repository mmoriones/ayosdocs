'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Button,
} from '@/components/ui';
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';
import { SocialProviders, LoginForm, SignupForm, ForgotPasswordForm } from '@/features/auth/components/shared';

export default function LoginPage() {
  const router = useRouter();
  
  const {
    mode,
    changeMode,
    isExchanging,
    statusMessage,
    handleGoogleLogin,
    handleEmailLogin,
    handleEmailSignUp,
    handleForgotPasswordSubmit,
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

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 lg:px-12 pb-12 animate-in fade-in duration-500">
      
      {isExchanging && (
        <div className="fixed inset-0 z-[70] bg-ctp-base/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center mb-4 shadow-sm">
              <Image src="/favicon.svg" alt="AyosDocs" width={24} height={24} className="animate-pulse-slow" />
           </div>
           <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.2em] animate-pulse">Authenticating...</p>
        </div>
      )}

      <div className="w-full max-w-[480px] mx-auto space-y-8">
        <div className="bg-ctp-base border border-ctp-surface1 rounded-xl p-10 md:p-14">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-[28px] font-bold text-ctp-text tracking-tight">
              {mode === 'signup' ? 'Sign up to AyosDocs' : mode === 'forgot-password' ? 'Reset your password' : 'Sign in to AyosDocs'}
            </h1>
          </div>

          {statusMessage && (
            <div className={`mb-8 p-4 rounded-xl border flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              statusMessage.type === 'error' 
                ? 'bg-ctp-red/10 border-ctp-red/20 text-ctp-red' 
                : statusMessage.type === 'google-suggestion'
                ? 'bg-ctp-sky-800/10 border-ctp-sky-800/20 text-ctp-sky-800'
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

              {statusMessage.type === 'google-suggestion' && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={
                    <Image
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      width={14}
                      height={14}
                    />
                  }
                  onClick={handleGoogleLogin}
                  className="w-full border-ctp-sky-800/30 text-ctp-sky-800 text-[11px] font-bold uppercase tracking-widest"
                >
                  Use Google Account
                </Button>
              )}
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-6">
              <LoginForm 
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleEmailLogin}
                onForgotPassword={() => changeMode('forgot-password')}
                isExchanging={isExchanging}
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
                showEmailOption={false}
                variant="page"
              />
            </div>
          ) : mode === 'signup' ? (
            <div className="space-y-6">
              <SignupForm 
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleEmailSignUp}
                isExchanging={isExchanging}
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
                showEmailOption={false}
                variant="page"
              />
            </div>
          ) : (
            <ForgotPasswordForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleForgotPasswordSubmit}
              isExchanging={isExchanging}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
          )}

          <div className="mt-10 text-center">
            {mode === 'login' ? (
              <p className="text-[14px] text-ctp-subtext1 font-medium">
                Don&apos;t have an account?{' '}
                <button onClick={() => changeMode('signup')} className="text-ctp-sky-800 hover:underline font-bold transition-colors">
                  Sign up
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-[14px] text-ctp-subtext1 font-medium">
                Already have an account?{' '}
                <button onClick={() => changeMode('login')} className="text-ctp-sky-800 hover:underline font-bold transition-colors">
                  Log in
                </button>
              </p>
            ) : (
              <button onClick={() => changeMode('login')} className="text-[14px] text-ctp-sky-800 hover:underline font-bold transition-colors">
                Return to log in
              </button>
            )}
          </div>
        </div>

        <div className="text-center px-10">
          <p className="text-[11px] text-ctp-subtext1 leading-relaxed">
            By continuing, I agree to AyosDocs&apos;s{' '}
            <Link href="/terms" className="text-ctp-sky-800 hover:underline">terms</Link>,{' '}
            <Link href="/privacy" className="text-ctp-sky-800 hover:underline">privacy policy</Link>, and{' '}
            <Link href="/privacy" className="text-ctp-sky-800 hover:underline">cookie policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

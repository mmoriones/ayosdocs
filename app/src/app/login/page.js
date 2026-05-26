'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Badge,
} from '@/components/ui';
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';
import { SocialProviders, LoginForm, SignupForm, ForgotPasswordForm } from '@/features/auth/components/shared';

/**
 * High-Fidelity Login Page
 * Combines the GitHub/Cloudflare aesthetic with shared auth logic.
 */
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
    // Set a cookie to remember guest access for the session
    document.cookie = "guest-access=true; path=/; max-age=86400"; // 24 hours
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center p-4 lg:p-8 selection:bg-ctp-sky-800/30">
      
      {/* Container - Using the same border and shadow style as major cards */}
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-ctp-base border border-ctp-surface1 rounded-[2rem] shadow-2xl overflow-hidden min-h-[640px] relative">
        
        {/* Loading Overlay - Covers entire container */}
        {isExchanging && (
          <div className="absolute inset-0 z-[70] bg-ctp-base/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center mb-4 shadow-xl">
                <Image src="/favicon.svg" alt="AyosDocs" width={24} height={24} className="animate-pulse-slow" />
             </div>
             <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.2em] animate-pulse">Authenticating...</p>
          </div>
        )}

        {/* Left Section: The Login Form (GitHub-style Minimalism) */}
        <div className="lg:w-[450px] p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-ctp-surface1 relative overflow-hidden">

          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-ctp-sky-800 flex items-center justify-center mb-6 shadow-lg shadow-ctp-sky-800/20">
              <Image src="/favicon.svg" alt="AyosDocs" width={24} height={24} className="brightness-0 invert" />
            </div>
            <h1 className="text-2xl font-bold text-ctp-text tracking-tight uppercase">
              {mode === 'signup' ? 'Create Account' : mode === 'forgot-password' ? 'Reset Password' : 'Sign in'}
            </h1>
            <p className="text-sm font-medium text-ctp-subtext1 mt-2 max-w-[300px]">
              {mode === 'signup' 
                ? 'Join AyosDocs to start tracking your government requirements.' 
                : mode === 'forgot-password'
                ? 'Enter your email to receive a reset link.'
                : 'Access your government workflow dashboard.'}
            </p>
          </div>

          {statusMessage && (
            <div className={`mb-6 p-4 rounded-xl border flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              statusMessage.type === 'error' 
                ? 'bg-ctp-red/10 border-ctp-red/20 text-ctp-red' 
                : statusMessage.type === 'google-suggestion'
                ? 'bg-ctp-sky-800/10 border-ctp-sky-800/20 text-ctp-sky-800'
                : 'bg-ctp-green/10 border-ctp-green/20 text-ctp-green'
            }`}>
              <div className="flex items-start gap-3">
                {statusMessage.type === 'error' ? (
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                )}
                <p className="text-sm font-semibold leading-tight">{statusMessage.text}</p>
              </div>

              {statusMessage.type === 'google-suggestion' && (
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-ctp-base border border-ctp-sky-800/30 hover:bg-ctp-sky-800/10 text-ctp-sky-800 text-xs font-bold py-2 rounded-lg transition-all active:scale-[0.98]"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={14}
                    height={14}
                  />
                  Continue with Google instead
                </button>
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-ctp-surface1"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-ctp-base px-4 text-ctp-subtext1 font-bold tracking-widest">Or continue with</span>
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
            <SignupForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailSignUp}
              isExchanging={isExchanging}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
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

          <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-1">
            {mode === 'login' ? (
              <>
                <p className="text-ui-subhead text-ctp-subtext1 font-medium">
                  New to AyosDocs?
                </p>
                <Button variant="link" onClick={() => changeMode('signup')}>
                  Create an account
                </Button>
              </>
            ) : mode === 'signup' ? (
              <>
                <p className="text-ui-subhead text-ctp-subtext1 font-medium">
                  Already have an account?
                </p>
                <Button variant="link" onClick={() => changeMode('login')}>
                  Sign in
                </Button>
              </>
            ) : (
              <Button variant="link" onClick={() => changeMode('login')}>
                Back to Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Right Section: Showcase/Branding (Cloudflare-style Analytics Aesthetic) */}
        <div className="flex-1 bg-ctp-mantle/30 relative flex flex-col p-8 lg:p-16 justify-center overflow-hidden">
          
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-ctp-sky-800 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-ctp-mauve rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <Badge variant="sky" className="px-3 py-1 font-bold tracking-widest">V1.0 LIVE</Badge>
              <h2 className="text-4xl font-bold text-ctp-text leading-tight tracking-tight uppercase">
                Master your <br/>
                <span className="text-ctp-sky-800">government docs</span>
              </h2>
              <p className="text-lg text-ctp-subtext1 font-medium max-w-[420px] leading-relaxed">
                Join thousands of Filipinos using our interactive guides to navigate bureaucracy with ease.
              </p>
            </div>

            {/* Feature Highlights with Cloudflare-style cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[500px]">
              <Card background="base" className="p-4 border-ctp-surface1/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 rounded-lg bg-ctp-sky-800/10 text-ctp-sky-800">
                    <Zap size={16} />
                  </div>
                  <span className="text-xs font-bold text-ctp-text uppercase tracking-widest">Fast Track</span>
                </div>
                <p className="text-ui-micro text-ctp-subtext1 font-medium leading-tight">Step-by-step procedures for every agency.</p>
              </Card>

              <Card background="base" className="p-4 border-ctp-surface1/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 rounded-lg bg-ctp-mauve/10 text-ctp-mauve">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-xs font-bold text-ctp-text uppercase tracking-widest">Verified</span>
                </div>
                <p className="text-ui-micro text-ctp-subtext1 font-medium leading-tight">Crowdsourced office wait times and ratings.</p>
              </Card>
            </div>

            {/* Stats / Social Proof */}
            <div className="pt-8 border-t border-ctp-surface1 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-ctp-text">150+</p>
                <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Active Guides</p>
              </div>
              <div className="w-px h-10 bg-ctp-surface1" />
              <div>
                <p className="text-2xl font-bold text-ctp-text">12k+</p>
                <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Citizen Reports</p>
              </div>
            </div>
          </div>
          
          {/* Subtle Bottom Link */}
          <div className="absolute bottom-8 left-8 lg:left-16 flex items-center gap-4 text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

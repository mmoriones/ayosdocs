'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal, Button } from '@/components/ui';
import { useAuthUI } from "@/components/Providers";
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';
import { SocialProviders, LoginForm, SignupForm, ForgotPasswordForm } from '@/features/auth/components/shared';

const AuthModal = ({ isOpen, onClose }) => {
  const {
    mode,
    changeMode,
    isExchanging,
    exchangingMethod,
    statusMessage,
    handleGoogleLogin,
    handleEmailLogin,
    handleEmailSignUp,
    handleForgotPasswordSubmit,
    formData,
    handleInputChange,
    isFormValid,
    getFieldError,
    cleanupGoogleSignIn
  } = useAuthLogic({ 
    isOpen, 
    onClose,
    onSuccess: onClose 
  });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      closeOnOverlay={!isExchanging}
      size="md"
      noPadding={true}
      contentClassName="p-0 overflow-hidden"
      animationClassName="animate-slide-down"
    >
      <div className="relative">
        <button
          onClick={() => {
            cleanupGoogleSignIn();
            onClose();
          }}
          className="absolute top-5 right-5 z-[60] p-2 rounded-full text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-all active:scale-95 border border-transparent hover:border-ctp-surface1"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {mode !== 'initial' && (
          <button
            onClick={() => changeMode('initial')}
            disabled={isExchanging}
            className="absolute top-5 left-5 z-50 p-2 rounded-full text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-all active:scale-95 disabled:opacity-50"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="p-8 pt-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              {mode === 'initial' ? 'Login to AyosDocs' : mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-sm font-medium text-ctp-subtext1 mt-2 leading-relaxed px-4">
              {mode === 'initial' 
                ? 'Save your progress and access your checklists across all your devices.'
                : mode === 'login'
                ? 'Login with your email and password to continue.'
                : mode === 'signup'
                ? 'Join AyosDocs to start tracking your government requirements.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
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

          {mode === 'initial' ? (
            <SocialProviders 
              onGoogleLogin={handleGoogleLogin}
              onEmailClick={() => changeMode('login')}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              variant="modal"
            />
          ) : mode === 'login' ? (
            <LoginForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailLogin}
              onForgotPassword={() => changeMode('forgot-password')}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
          ) : mode === 'signup' ? (
            <SignupForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailSignUp}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
          ) : (
            <ForgotPasswordForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleForgotPasswordSubmit}
              isExchanging={isExchanging}
              exchangingMethod={exchangingMethod}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
          )}

          {mode !== 'initial' && mode !== 'forgot-password' && (
            <div className="text-center text-sm text-ctp-subtext1 mt-4 flex flex-col sm:flex-row items-center justify-center gap-1">
              {mode === 'login' ? (
                <>
                  <p>Don&apos;t have an account?</p>
                  <Button variant="link" onClick={() => changeMode('signup')}>
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <p>Already have an account?</p>
                  <Button variant="link" onClick={() => changeMode('login')}>
                    Sign in
                  </Button>
                </>
              )}
            </div>
          )}

           <p className="text-center text-[11px] text-ctp-subtext1 leading-relaxed mt-6">
            By continuing, I agree to AyosDocs&apos;s{' '}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">terms</Link>,{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">privacy policy</Link>, and{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-ctp-sky-800 hover:underline">cookie policy</Link>.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default function ClientAuthWrapper() {
  const { isAuthModalOpen, closeAuthModal } = useAuthUI();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}

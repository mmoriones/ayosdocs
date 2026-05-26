'use client';

import Image from 'next/image';
import { X, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal, Button } from '@/components/ui';
import { useAuthLogic } from '../hooks/useAuthLogic';
import { SocialProviders, LoginForm, SignupForm, ForgotPasswordForm } from './shared';

const AuthModal = ({ isOpen, onClose }) => {
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

        <div className="p-8 pt-10 relative">
          {isExchanging && (
            <div className="absolute inset-0 z-50 bg-ctp-base flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="flex flex-col items-center max-w-xs text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center relative z-10 shadow-xl overflow-hidden group">
                    <Image 
                      src="/favicon.svg" 
                      alt="AyosDocs" 
                      width={48} 
                      height={48} 
                      className="animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-ctp-sky-800/10 via-transparent to-transparent opacity-50" />
                  </div>
                  <div className="absolute -inset-4 bg-ctp-sky-800/5 rounded-[40px] blur-2xl animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-ctp-text tracking-tight uppercase">AyosDocs</h3>
                  <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.25em] opacity-60">Securing your session</p>
                </div>

                <div className="mt-10 w-48 h-1 bg-ctp-surface0 rounded-full overflow-hidden relative">
                   <div className="absolute inset-0 bg-ctp-sky-800/10" />
                   <div className="h-full bg-ctp-sky-800 animate-progress-loading shadow-[0_0_8px_var(--sky-800)]" />
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              {mode === 'initial' ? 'Sign in to AyosDocs' : mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-sm font-medium text-ctp-subtext1 mt-2 leading-relaxed px-4">
              {mode === 'initial' 
                ? 'Save your progress and access your checklists across all your devices.'
                : mode === 'login'
                ? 'Sign in with your email and password to continue.'
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
              variant="modal"
            />
          ) : mode === 'login' ? (
            <LoginForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleEmailLogin}
              onForgotPassword={() => changeMode('forgot-password')}
              isExchanging={isExchanging}
              isFormValid={isFormValid}
              getFieldError={getFieldError}
            />
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

          <p className="mt-8 text-center text-ui-micro font-medium text-ctp-subtext0 leading-relaxed px-6 uppercase tracking-wider opacity-60">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-ctp-sky-800">Terms</span> and <span className="underline cursor-pointer hover:text-ctp-sky-800">Privacy</span>.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;


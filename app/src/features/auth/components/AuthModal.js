'use client';

import Image from 'next/image';
import { useEffect, useState } from "react";
import { X, Loader2, Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn, useSession } from 'next-auth/react';
import { useToast } from "@/context/ToastContext";
import { registerUserAction, checkEmailAction } from "@/app/actions/user";

const AuthModal = ({ isOpen, onClose }) => {
  const { status } = useSession();
  const [isExchanging, setIsExchanging] = useState(false);
  const [mode, setMode] = useState('initial'); // 'initial', 'login', 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'error' | 'success', text: string }
  const [emailTaken, setEmailTaken] = useState(null); // null, 'email', 'google'
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (status === 'authenticated' && isOpen) {
      onClose();
    }
  }, [status, isOpen, onClose]);

  // Debounced email check
  useEffect(() => {
    // Only proceed if we're in signup mode and have a potentially valid email
    if (mode !== 'signup' || !formData.email || !formData.email.includes('@') || emailTaken) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      const result = await checkEmailAction(formData.email);
      if (result.exists) {
        setEmailTaken(result.isGoogle ? 'google' : 'email');
      } else {
        setEmailTaken(null);
      }
      setIsCheckingEmail(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email, mode, emailTaken]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closing
      setTimeout(() => {
        setMode('initial');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setStatusMessage(null);
        setEmailTaken(null);
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      }, 300);
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setIsExchanging(true);
    setStatusMessage(null);
    try {
      await signIn('google');
    } catch (error) {
      console.error("Login error:", error);
      setStatusMessage({
        type: 'error',
        text: 'Google login failed. Please try again.'
      });
      setIsExchanging(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsExchanging(true);
    setStatusMessage(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result.error) {
        if (result.error === 'GoogleAccountOnly') {
          setStatusMessage({
            type: 'google-suggestion',
            text: 'It looks like you usually sign in with Google.'
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: result.error === 'CredentialsSignin' ? 'Invalid credentials' : result.error
          });
        }
      } else {
        // Success handled by useEffect session status
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred.'
      });
    } finally {
      setIsExchanging(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    
    if (emailTaken) return;

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Passwords do not match.'
      });
      return;
    }

    setIsExchanging(true);
    setStatusMessage(null);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('password', formData.password);

      const result = await registerUserAction(data);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: result.message
        });
        // Clear sensitive data but keep email for login
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setTimeout(() => setMode('login'), 2000);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message
        });
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsExchanging(false);
    }
  };

  const handleInputChange = (e) => {
    if (statusMessage) setStatusMessage(null);
    const { name, value } = e.target;
    
    // Clear email taken status immediately when user changes email
    if (name === 'email') {
      setEmailTaken(null);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setStatusMessage(null);
    setEmailTaken(null);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s.\-&']+$/;

    if (mode === 'login') {
      return (
        emailRegex.test(formData.email) &&
        formData.password.length >= 8
      );
    }

    if (mode === 'signup') {
      return (
        formData.fullName.trim().length >= 2 &&
        nameRegex.test(formData.fullName) &&
        emailRegex.test(formData.email) &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword &&
        !emailTaken &&
        !isCheckingEmail
      );
    }

    return true;
  };

  const isFieldInvalid = (fieldName) => {
    return getFieldError(fieldName) !== '';
  };

  const getFieldError = (fieldName) => {
    const value = formData[fieldName];
    if (!value || value.length === 0) return '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s.\-&']+$/;

    switch (fieldName) {
      case 'fullName':
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!nameRegex.test(value)) return 'Name contains invalid characters';
        return '';
      case 'email':
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        if (mode === 'signup') {
          if (emailTaken === 'email') return 'Email already registered';
          if (emailTaken === 'google') return 'Email linked to Google account';
        }
        return '';
      case 'password':
        if (mode === 'login') return '';
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || status === 'authenticated') return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface1 overflow-hidden animate-slide-down pointer-events-auto">
        <button
          onClick={onClose}
          disabled={isExchanging}
          className="absolute top-5 right-5 z-50 p-2 rounded-full text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-all active:scale-95 disabled:opacity-50 border border-transparent hover:border-ctp-surface1"
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
            <div className="absolute inset-0 z-20 bg-ctp-mantle/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-ctp-sky-800 mb-3" strokeWidth={2.5} />
                <h3 className="text-base font-bold text-ctp-text">Processing...</h3>
                <p className="text-xs font-medium text-ctp-subtext1 mt-1">Please wait a moment</p>
              </div>
            </div>
          )}

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              {mode === 'initial' ? 'Sign in to AyosDocs' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm font-medium text-ctp-subtext1 mt-2 leading-relaxed px-4">
              {mode === 'initial' 
                ? 'Save your progress and access your checklists across all your devices.'
                : mode === 'login'
                ? 'Sign in with your email and password to continue.'
                : 'Join AyosDocs to start tracking your government requirements.'}
            </p>
          </div>

          {statusMessage && (
            <div className={`mb-6 p-4 rounded-xl border flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              statusMessage.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                : statusMessage.type === 'google-suggestion'
                ? 'bg-ctp-sky-800/10 border-ctp-sky-800/20 text-ctp-sky-800'
                : 'bg-green-500/10 border-green-500/20 text-green-500'
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
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isExchanging}
                className="w-full flex items-center justify-center gap-3 bg-ctp-base border border-ctp-surface1 hover:bg-ctp-mantle text-ctp-text font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="w-4.5 h-4.5"
                />
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-ctp-surface1"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-ctp-mantle px-2 text-ctp-subtext1 font-semibold">Or continue with</span>
                </div>
              </div>

              <button
                onClick={() => changeMode('login')}
                disabled={isExchanging}
                className="w-full flex items-center justify-center gap-3 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                <Mail size={18} className="text-ctp-subtext1" />
                Email and Password
              </button>

              <p className="text-center text-sm text-ctp-subtext1 mt-4">
                Don&apos;t have an account?{' '}
                <button 
                  onClick={() => changeMode('signup')}
                  className="text-ctp-sky-800 font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignUp} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <div className="relative">
                    <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('fullName') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                      maxLength={70}
                      autoComplete="off"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-4 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                        isFieldInvalid('fullName') 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-ctp-surface1 focus:border-ctp-sky-800'
                        }`}
                    />
                  </div>
                  {isFieldInvalid('fullName') && (
                    <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      {getFieldError('fullName')}
                    </p>
                  )}
                </div>
              )}
              
              <div className="space-y-1">
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('email') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    maxLength={100}
                    autoComplete="off"
                    value={formData.email}                    onChange={handleInputChange}
                    className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-4 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                      isFieldInvalid('email') 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-ctp-surface1 focus:border-ctp-sky-800'
                      }`}
                  />
                </div>
                {isFieldInvalid('email') && (
                  <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('password') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="off"
                    value={formData.password}                    onChange={handleInputChange}
                    className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-12 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                      isFieldInvalid('password') 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-ctp-surface1 focus:border-ctp-sky-800'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isFieldInvalid('password') ? 'text-red-500/70' : 'text-ctp-subtext1 hover:text-ctp-text'}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isFieldInvalid('password') && (
                  <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    {getFieldError('password')}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('confirmPassword') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      minLength={8}
                      maxLength={128}
                      autoComplete="off"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-12 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                        isFieldInvalid('confirmPassword') 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-ctp-surface1 focus:border-ctp-sky-800'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isFieldInvalid('confirmPassword') ? 'text-red-500/70' : 'text-ctp-subtext1 hover:text-ctp-text'}`}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {isFieldInvalid('confirmPassword') && (
                    <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      {getFieldError('confirmPassword')}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isExchanging || !isFormValid()}
                className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-700 disabled:bg-ctp-surface1 disabled:text-ctp-subtext1 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md mt-2"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-ctp-subtext1 mt-4">
                {mode === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => changeMode('signup')}
                      className="text-ctp-sky-800 font-bold hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => changeMode('login')}
                      className="text-ctp-sky-800 font-bold hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          )}

          <p className="mt-8 text-center text-[10px] font-medium text-ctp-subtext0 leading-relaxed px-6 uppercase tracking-wider opacity-60">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-ctp-sky-800">Terms</span> and <span className="underline cursor-pointer hover:text-ctp-sky-800">Privacy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

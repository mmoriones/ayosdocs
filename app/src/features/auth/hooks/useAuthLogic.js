'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useToast } from "@/context";
import { 
  registerUserAction, 
  checkEmailAction, 
  checkRateLimitAction, 
  requestPasswordResetAction 
} from "@/app/actions/user";

/**
 * useAuthLogic Hook
 * Consolidates all authentication state and logic for use in both
 * modals and full-page login screens.
 */
export function useAuthLogic({ 
  initialMode = 'initial', 
  onSuccess, 
  onClose,
  isOpen = true 
} = {}) {
  const { status } = useSession();
  const { showToast } = useToast();
  
  const [mode, setMode] = useState(initialMode);
  const [isExchanging, setIsExchanging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [emailTaken, setEmailTaken] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Refs for tracking/cancelling in-progress Google sign-in
  const isExchangingRef = useRef(isExchanging);
  const safetyTimerRef = useRef(null);
  const focusHandlerRef = useRef(null);

  useEffect(() => {
    isExchangingRef.current = isExchanging;
  }, [isExchanging]);

  // Handle successful authentication via session status
  useEffect(() => {
    if (status === 'authenticated' && onSuccess) {
      onSuccess();
    }
  }, [status, onSuccess]);

  const cleanupGoogleSignIn = useCallback(() => {
    clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = null;
    if (focusHandlerRef.current) {
      window.removeEventListener('focus', focusHandlerRef.current);
      focusHandlerRef.current = null;
    }
  }, []);

  // 1. Pre-check rate limits when mode changes
  useEffect(() => {
    if (!isOpen || mode === 'initial') return;

    const checkLimits = async () => {
      const action = mode === 'signup' ? 'register' : 'login';
      const limit = mode === 'signup' ? 3 : 5;
      
      try {
        const result = await checkRateLimitAction(action, limit);
        if (!result.success) {
          const resetTime = result.resetTime ? new Date(result.resetTime) : null;
          if (!resetTime) return;

          const remainingMs = resetTime.getTime() - Date.now();
          if (remainingMs <= 0) {
            setStatusMessage(null);
            return;
          }

          if (mode === 'signup') {
            const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
            setStatusMessage({
              type: 'error',
              text: `Too many registration attempts. Please try again in about ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`
            });
          } else {
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            setStatusMessage({
              type: 'error',
              text: `Too many login attempts. Please try again in ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`
            });
          }
        }
      } catch (error) {
        console.error("Check rate limit error:", error);
      }
    };

    checkLimits();
  }, [isOpen, mode]);

  // 2. Debounced email check
  useEffect(() => {
    if (!formData.email || !formData.email.includes('@')) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const result = await checkEmailAction(formData.email);
        
        if (mode === 'signup') {
          if (result.exists) {
            setEmailTaken(result.isGoogle ? 'google' : 'email');
          } else {
            setEmailTaken(null);
          }
        } else if (mode === 'login') {
          if (result.locked) {
            setStatusMessage({
              type: 'error',
              text: result.lockoutMessage
            });
          } else {
            setStatusMessage(prev => (prev?.text.includes('Account temporarily locked') ? null : prev));
          }
        }
      } catch (err) {
        console.error("Email check error:", err);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email, mode]);

  const handleGoogleLogin = async () => {
    cleanupGoogleSignIn();
    setIsExchanging(true);
    setStatusMessage(null);
    
    safetyTimerRef.current = setTimeout(() => {
      setIsExchanging(false);
    }, 15000);

    const handleFocus = () => {
      setTimeout(() => {
        setIsExchanging(false);
        window.removeEventListener('focus', handleFocus);
        clearTimeout(safetyTimerRef.current);
      }, 500);
    };
    focusHandlerRef.current = handleFocus;
    window.addEventListener('focus', handleFocus);

    try {
      const result = await signIn('google', { 
        callbackUrl: window.location.href 
      });
      
      if (result?.error) {
        cleanupGoogleSignIn();
        setIsExchanging(false);
        setStatusMessage({
          type: 'error',
          text: result.error
        });
      }
    } catch (error) {
      cleanupGoogleSignIn();
      console.error("Login error:", error);
      setStatusMessage({
        type: 'error',
        text: 'Google login failed. Please try again.'
      });
      setIsExchanging(false);
    }
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    setIsExchanging(true);
    setStatusMessage(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result.error) {
        if (result.error === 'AccountPermanentlyDeleted') {
          setStatusMessage({
            type: 'error',
            text: 'This account has been permanently deleted and can no longer be recovered.'
          });
        } else if (result.error === 'GoogleAccountOnly') {
          setStatusMessage({
            type: 'google-suggestion',
            text: 'It looks like you usually sign in with Google.'
          });
        } else {
          const isRateLimited = result.error.includes('Too many') || result.error.includes('locked');
          setStatusMessage({
            type: 'error',
            text: result.error === 'CredentialsSignin' ? 'Invalid credentials' : result.error
          });
          
          if (isRateLimited) {
            showToast({
              type: 'error',
              title: 'Security Alert',
              message: result.error
            });
          }
        }
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
    if (e) e.preventDefault();
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
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setTimeout(() => setMode('login'), 5000);
      } else {
        const isRateLimited = result.message.includes('Too many');
        setStatusMessage({
          type: 'error',
          text: result.message
        });

        if (isRateLimited) {
          showToast({
            type: 'error',
            title: 'Action Throttled',
            message: result.message
          });
        }
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

  const handleForgotPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsExchanging(true);
    setStatusMessage(null);
    try {
      const result = await requestPasswordResetAction(formData.email);
      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: 'Success! A reset link has been sent to your email.'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message
        });
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

  const handleInputChange = (e) => {
    if (statusMessage) setStatusMessage(null);
    const { name, value } = e.target;
    
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
      return emailRegex.test(formData.email) && formData.password.length >= 8;
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

    if (mode === 'forgot-password') {
      return emailRegex.test(formData.email);
    }

    return true;
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

  return {
    mode,
    setMode,
    changeMode,
    isExchanging,
    setIsExchanging,
    statusMessage,
    setStatusMessage,
    formData,
    setFormData,
    handleInputChange,
    handleGoogleLogin,
    handleEmailLogin,
    handleEmailSignUp,
    handleForgotPasswordSubmit,
    isFormValid,
    getFieldError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    emailTaken,
    isCheckingEmail,
    cleanupGoogleSignIn
  };
}

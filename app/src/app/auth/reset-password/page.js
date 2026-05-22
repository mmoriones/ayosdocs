'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resetPasswordAction } from '@/app/actions/user';
import { useToast } from '@/context/ToastContext';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', text: string }

  useEffect(() => {
    if (!token) {
      setStatus({
        type: 'error',
        text: 'Invalid or missing reset token. Please request a new reset link.'
      });
    }
  }, [token]);

  const handleInputChange = (e) => {
    if (status) setStatus(null);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFieldError = (fieldName) => {
    const value = formData[fieldName];
    if (!value || value.length === 0) return '';

    switch (fieldName) {
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const isFieldInvalid = (fieldName) => {
    return getFieldError(fieldName) !== '';
  };

  const isFormValid = () => {
    return (
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      !!token
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await resetPasswordAction(token, formData.password);
      if (result.success) {
        setStatus({ type: 'success', text: result.message });
        showToast({
          type: 'success',
          title: 'Password Reset',
          message: 'Your password has been updated successfully.'
        });
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setStatus({ type: 'error', text: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface1 overflow-hidden animate-slide-down">
      <div className="p-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ctp-sky-800/10 text-ctp-sky-800 mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-ctp-text tracking-tight">Create New Password</h2>
          <p className="text-sm font-medium text-ctp-subtext1 mt-2 leading-relaxed">
            Your identity has been verified. Please choose a strong new password for your account.
          </p>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200 ${
            status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            {status.type === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <p className="text-sm font-semibold leading-tight">{status.text}</p>
          </div>
        )}

        {status?.type === 'success' ? (
          <div className="text-center space-y-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm text-ctp-subtext1">Redirecting you to the home page...</p>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"
            >
              <ArrowLeft size={16} />
              Go to Home now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('password') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting || !token}
                  className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-12 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                    isFieldInvalid('password') 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-ctp-surface1 focus:border-ctp-sky-800'
                  } disabled:opacity-50`}
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

            <div className="space-y-1.5">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${isFieldInvalid('confirmPassword') ? 'text-red-500' : 'text-ctp-subtext1'}`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isSubmitting || !token}
                  className={`w-full bg-ctp-base border rounded-xl py-3.5 pl-12 pr-12 text-ctp-text text-sm outline-none transition-all placeholder:text-ctp-subtext0 ${
                    isFieldInvalid('confirmPassword') 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-ctp-surface1 focus:border-ctp-sky-800'
                  } disabled:opacity-50`}
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

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-700 disabled:bg-ctp-surface1 disabled:text-ctp-subtext1 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>

            {!isSubmitting && !token && (
              <div className="text-center pt-2">
                <Link href="/" className="text-xs font-bold text-ctp-sky-800 hover:underline">
                  Return to Home
                </Link>
              </div>
            )}
          </form>
        )}
      </div>
      <div className="bg-ctp-surface0/30 p-4 border-t border-ctp-surface1 text-center">
        <p className="text-[10px] font-medium text-ctp-subtext0 uppercase tracking-widest">
          Secure Password Reset System
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base p-6 font-sans">
      <Suspense fallback={
        <div className="w-full max-w-md bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface1 p-8 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-ctp-sky-800 mb-4" />
          <p className="text-ctp-subtext1 font-medium">Loading secure form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { resetPasswordAction } from '@/app/actions/user';
import { useToast } from '@/context';
import { Button, Input, AuthPageHeader } from '@/components/ui';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [status, setStatus] = useState(() => token ? null : {
    type: 'error',
    text: 'Invalid or missing reset token. Please request a new reset link.'
  });

  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  const isPasswordSecure = hasMinLength && hasNumber && hasUppercase;

  const handleInputChange = (e) => {
    if (status) setStatus(null);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFieldError = (name) => {
    if (name === 'password') return '';
    if (name === 'confirmPassword' && formData.confirmPassword && formData.confirmPassword !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const isFormValid = () => {
    return (
      isPasswordSecure &&
      formData.password === formData.confirmPassword &&
      !!token
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasAttempted(true);
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await resetPasswordAction(token, formData.password);
      if (result.success) {
        setStatus({ type: 'success', text: result.message });
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your password has been reset successfully.'
        });
        setTimeout(() => router.push('/login'), 3000);
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
    <>
      <AuthPageHeader onBackClick={() => router.push('/login')} />
      <div className="w-full max-w-[480px] px-6 flex flex-col animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div className="flex-1">
          <h1 className="text-[28px] font-black text-[#1C1C1E] tracking-tight leading-tight">
            New Password
          </h1>
          <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed max-w-[240px]">
            Please choose a <span className="text-[#0038A8] font-bold">strong new password</span> for your account.
          </p>
        </div>
        
        {/* 3D Illustration */}
        <div className="w-24 h-24 relative -mr-2 drop-shadow-xl opacity-80">
           <Image 
            src="/assets/ui/Lock.webp" 
            alt="Secure" 
            fill 
            className="object-contain" 
            priority
          />
        </div>
      </div>

      {/* Status Messages */}
      {status && (
        <div className={`mb-6 p-5 rounded-[24px] border backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 shadow-sm ${
          status.type === 'error'
            ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
            : 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              status.type === 'error' ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20' : 'bg-[#34C759]/10 border-[#34C759]/20'
            }`}>
              {status.type === 'error' ? <AlertCircle size={20} strokeWidth={2.5} /> : <CheckCircle2 size={20} strokeWidth={2.5} />}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-[14px] font-black leading-tight mb-1">{status.type === 'error' ? 'Action Required' : 'Success'}</p>
              <p className="text-[13px] font-medium opacity-80 leading-relaxed">{status.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white">
        {status?.type === 'success' ? (
          <div className="text-center space-y-6 py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759] mb-2">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <p className="text-[15px] font-medium text-gray-500">Your password has been updated. Redirecting to login...</p>
            <Button
              onClick={() => router.push('/login')}
              size="lg"
              className="w-full text-white border-none"
              style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
            >
              Go to Login now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-1 group">
              <Input
                label="New Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 8 characters"
                leftIcon={Lock}
                maxLength={128}
                disabled={isSubmitting || !token}
                error={getFieldError('password')}
                required
              />
              
              {/* Password Strength Indicators */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 pb-2">
                <PasswordHint label="8+ characters" active={hasMinLength} />
                <PasswordHint label="1 number" active={hasNumber} />
                <PasswordHint label="1 uppercase" active={hasUppercase} />
              </div>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repeat new password"
              leftIcon={Lock}
              maxLength={128}
              disabled={isSubmitting || !token}
              error={getFieldError('confirmPassword')}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !isFormValid()}
                isLoading={isSubmitting}
                style={{ background: (isSubmitting || !isFormValid()) ? undefined : 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
                className="w-full text-white border-none"
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  </>
  );
}

function PasswordHint({ label, active }) {
  return (
    <div className={`flex items-center gap-1.5 transition-colors duration-300 ${active ? 'text-[#34C759]' : 'text-gray-300'}`}>
      <CheckCircle2 size={14} strokeWidth={3} />
      <span className="text-[11px] font-bold">{label}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#0038A8] mb-4" />
          <p className="text-gray-400 font-medium">Loading secure form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

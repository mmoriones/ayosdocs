'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resetPasswordAction } from '@/app/actions/user';
import { useToast } from '@/context';
import { Button, Input, Card} from '@/components/ui';

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
  const [status, setStatus] = useState(() => token ? null : {
    type: 'error',
    text: 'Invalid or missing reset token. Please request a new reset link.'
  });

  const handleInputChange = (e) => {
    if (status) setStatus(null);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFieldError = (name) => {
    if (name === 'password' && formData.password && formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (name === 'confirmPassword' && formData.confirmPassword && formData.confirmPassword !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
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
        setTimeout(() => router.push('/'), 3000);
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
    <Card 
      background="mantle" 
      className="w-full max-w-md animate-slide-down"
      noPadding
      footer={
        <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest text-center">
          Secure Password Reset System
        </p>
      }
    >
      <div className="p-8 md:p-10">
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
            status.type === 'error' ? 'bg-ctp-red/[0.07] border-ctp-red/20 text-ctp-red' : 'bg-ctp-green/[0.07] border-ctp-green/20 text-ctp-green'
          }`}>
            {status.type === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <p className="text-sm font-semibold leading-tight">{status.text}</p>
          </div>
        )}

        {status?.type === 'success' ? (
          <div className="text-center space-y-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-ctp-green/[0.07] border border-ctp-green/20 flex items-center justify-center text-ctp-green mb-2">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm text-ctp-subtext1">Redirecting you to the home page...</p>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-ctp-mantle/50 border border-ctp-surface1 hover:bg-ctp-mantle text-ctp-text px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"
            >
              <ArrowLeft size={16} />
              Go to Home now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 8 characters"
              maxLength={128}
              disabled={isSubmitting || !token}
              error={getFieldError('password')}
              leftIcon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repeat new password"
              maxLength={128}
              disabled={isSubmitting || !token}
              error={getFieldError('confirmPassword')}
              leftIcon={Lock}
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Update Password
            </Button>

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
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base p-6 font-sans text-ctp-text">
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

'use client';

import { Mail, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';

/**
 * ForgotPasswordForm Component
 * Shared password reset request form.
 */
export function ForgotPasswordForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isExchanging, 
  exchangingMethod,
  isFormValid,
  getFieldError
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 w-full">
      <Input
        name="email"
        type="email"
        placeholder="Email address"
        required
        maxLength={100}
        leftIcon={Mail}
        value={formData.email}
        onChange={onInputChange}
        error={getFieldError('email')}
        disabled={isExchanging}
      />

      <Button
        type="submit"
        isLoading={exchangingMethod === 'reset'}
        disabled={isExchanging || !isFormValid()}
        className="w-full h-11 text-[13px] font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white mt-1"
        rightIcon={<ArrowRight size={18} />}
      >
        Send Reset Link
      </Button>
    </form>
  );
}

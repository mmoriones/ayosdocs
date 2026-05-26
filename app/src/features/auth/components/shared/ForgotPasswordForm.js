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
  isFormValid,
  getFieldError
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full">
      <Input
        name="email"
        type="email"
        placeholder="Email address"
        required
        leftIcon={Mail}
        value={formData.email}
        onChange={onInputChange}
        error={getFieldError('email')}
        disabled={isExchanging}
      />

      <Button
        type="submit"
        disabled={isExchanging || !isFormValid()}
        className="w-full py-3.5 h-auto text-sm font-bold rounded-xl shadow-md active:scale-[0.98] transition-all mt-2"
        rightIcon={<ArrowRight size={18} />}
      >
        Send Reset Link
      </Button>
    </form>
  );
}

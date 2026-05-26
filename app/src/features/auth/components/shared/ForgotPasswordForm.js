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
    <form onSubmit={onSubmit} className="space-y-1 w-full">
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="email@example.com"
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
        className="w-full py-3 h-auto text-sm font-bold rounded-lg shadow-md active:scale-[0.98] transition-all mt-2"
        rightIcon={<ArrowRight size={16} />}
      >
        Send Reset Link
      </Button>
    </form>
  );
}

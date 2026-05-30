'use client';

import { Mail } from 'lucide-react';
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
    <form onSubmit={onSubmit} className="space-y-4 w-full">
      <Input
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your registered email"
        required
        maxLength={100}
        leftIcon={Mail}
        value={formData.email}
        onChange={onInputChange}
        error={getFieldError('email')}
        disabled={isExchanging}
      />

      <div className="pt-2">
        <Button
          type="submit"
          isLoading={exchangingMethod === 'reset'}
          disabled={isExchanging || !isFormValid()}
          style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
          className="w-full h-14 text-[17px] font-black rounded-3xl shadow-[0_8px_24px_rgba(0,56,168,0.15)] active:scale-[0.98] transition-all text-white border-none"
        >
          Send Reset Link
        </Button>
      </div>
    </form>
  );
}

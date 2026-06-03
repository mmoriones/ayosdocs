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
  const isDisabled = isExchanging || !isFormValid();

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
          size="lg"
          isLoading={exchangingMethod === 'reset'}
          disabled={isDisabled}
          style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
          className="w-full text-white border-none rounded-full"
        >
          Send Reset Link
        </Button>
      </div>
    </form>
  );
}

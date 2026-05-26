'use client';

import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';

/**
 * SignupForm Component
 * Shared registration form used in modals and pages.
 */
export function SignupForm({ 
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
        label="Full Name"
        name="fullName"
        type="text"
        placeholder="Juan Dela Cruz"
        required
        leftIcon={UserIcon}
        value={formData.fullName}
        onChange={onInputChange}
        error={getFieldError('fullName')}
        disabled={isExchanging}
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="juan@example.com"
        required
        leftIcon={Mail}
        value={formData.email}
        onChange={onInputChange}
        error={getFieldError('email')}
        disabled={isExchanging}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={Lock}
          value={formData.password}
          onChange={onInputChange}
          error={getFieldError('password')}
          disabled={isExchanging}
        />
        
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={Lock}
          value={formData.confirmPassword}
          onChange={onInputChange}
          error={getFieldError('confirmPassword')}
          disabled={isExchanging}
        />
      </div>

      <Button
        type="submit"
        disabled={isExchanging || !isFormValid()}
        className="w-full py-3 h-auto text-sm font-bold rounded-lg shadow-md active:scale-[0.98] transition-all mt-2"
        rightIcon={<ArrowRight size={16} />}
      >
        Create Account
      </Button>
    </form>
  );
}

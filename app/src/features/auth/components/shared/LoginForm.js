'use client';

import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';

/**
 * LoginForm Component
 * Shared email/password login form used in modals and pages.
 */
export function LoginForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onForgotPassword, 
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

      <div className="space-y-1">
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
        
        <div className="flex justify-end px-1">
          <Button 
            variant="link"
            onClick={onForgotPassword}
            disabled={isExchanging}
            className="font-bold lowercase normal-case first-letter:uppercase"
          >
            Forgot password?
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isExchanging || !isFormValid()}
        className="w-full py-3 h-auto text-sm font-bold rounded-lg shadow-md active:scale-[0.98] transition-all mt-2"
        rightIcon={<ArrowRight size={16} />}
      >
        Sign In
      </Button>
    </form>
  );
}

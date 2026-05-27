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
  exchangingMethod,
  isFormValid,
  getFieldError
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 w-full">
      <div className="space-y-1">
        <div className="px-1">
          <label className="text-[13px] font-bold text-ctp-text">Email</label>
        </div>
        <Input
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          maxLength={100}
          value={formData.email}
          onChange={onInputChange}
          error={getFieldError('email')}
          disabled={isExchanging}
          className="bg-ctp-base border-ctp-surface1 focus:border-ctp-sky-800 h-11"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <label className="text-[13px] font-bold text-ctp-text">Password</label>
          <button 
            type="button"
            onClick={onForgotPassword}
            disabled={isExchanging}
            className="text-[13px] font-medium text-ctp-sky-800 hover:underline transition-all disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          maxLength={128}
          value={formData.password}
          onChange={onInputChange}
          error={getFieldError('password')}
          disabled={isExchanging}
          className="bg-ctp-base border-ctp-surface1 focus:border-ctp-sky-800 h-11"
        />
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          isLoading={exchangingMethod === 'email'}
          disabled={isExchanging || !isFormValid()}
          className="w-full h-11 text-[13px] font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white"
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}

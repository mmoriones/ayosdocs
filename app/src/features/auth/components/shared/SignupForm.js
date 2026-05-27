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
  exchangingMethod,
  isFormValid,
  getFieldError
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 w-full">
      <div className="space-y-1">
        <label className="text-[13px] font-bold text-ctp-text px-1">Full Name</label>
        <Input
          name="fullName"
          type="text"
          placeholder="Juan Dela Cruz"
          required
          minLength={2}
          maxLength={70}
          value={formData.fullName}
          onChange={onInputChange}
          error={getFieldError('fullName')}
          disabled={isExchanging}
          className="bg-ctp-base border-ctp-surface1 focus:border-ctp-sky-800 h-11"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[13px] font-bold text-ctp-text px-1">Email</label>
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
        <label className="text-[13px] font-bold text-ctp-text px-1">Password</label>
        <Input
          name="password"
          type="password"
          placeholder="Min. 8 characters"
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

      <div className="space-y-1">
        <label className="text-[13px] font-bold text-ctp-text px-1">Confirm Password</label>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          minLength={8}
          maxLength={128}
          value={formData.confirmPassword}
          onChange={onInputChange}
          error={getFieldError('confirmPassword')}
          disabled={isExchanging}
          className="bg-ctp-base border-ctp-surface1 focus:border-ctp-sky-800 h-11"
        />
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          isLoading={exchangingMethod === 'signup'}
          disabled={isExchanging || !isFormValid()}
          className="w-full h-11 text-[13px] font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white"
        >
          Sign up
        </Button>
      </div>
    </form>
  );
}

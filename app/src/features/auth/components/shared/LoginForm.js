'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';

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
  const [rememberMe, setRememberMe] = useState(false);
  const isDisabled = isExchanging || !isFormValid();

  return (
    <form onSubmit={onSubmit} className="space-y-2 w-full">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        leftIcon={Mail}
        required
        maxLength={100}
        value={formData.email}
        onChange={onInputChange}
        error={getFieldError('email')}
        disabled={isExchanging}
      />

      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        leftIcon={Lock}
        required
        minLength={8}
        maxLength={128}
        value={formData.password}
        onChange={onInputChange}
        error={getFieldError('password')}
        disabled={isExchanging}
      />

      <div className="flex items-center justify-between px-1 py-1">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
          <span className="text-[13px] font-bold text-gray-500 group-hover:text-[#1C1C1E] transition-colors">Remember me</span>
        </label>
        <button 
          type="button"
          onClick={onForgotPassword}
          disabled={isExchanging}
          className="text-[13px] font-bold text-[#0038A8] hover:underline transition-all disabled:opacity-50"
        >
          Forgot Password?
        </button>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          isLoading={exchangingMethod === 'email'}
          disabled={isDisabled}
          style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
          className="w-full text-white border-none rounded-full"
        >
          Login
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Mail, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';
import Link from 'next/link';

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
  const [agreed, setAgreed] = useState(false);
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);

  return (
    <form onSubmit={onSubmit} className="space-y-2 w-full">
      <Input
        name="fullName"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        leftIcon={UserIcon}
        required
        minLength={2}
        maxLength={70}
        value={formData.fullName}
        onChange={onInputChange}
        error={getFieldError('fullName')}
        disabled={isExchanging}
      />

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

      <div className="space-y-3">
        <Input
          name="password"
          type="password"
          label="Create Password"
          placeholder="Create a password"
          leftIcon={Lock}
          required
          minLength={8}
          maxLength={128}
          value={formData.password}
          onChange={onInputChange}
          error={getFieldError('password')}
          disabled={isExchanging}
          containerClassName="!space-y-1"
        />
        
        {/* Password Strength Indicators */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-1">
          <PasswordHint label="8+ characters" active={hasMinLength} />
          <PasswordHint label="1 number" active={hasNumber} />
          <PasswordHint label="1 uppercase" active={hasUppercase} />
        </div>
      </div>

      <div className="px-1 py-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox 
            id="agree" 
            checked={agreed}
            onCheckedChange={setAgreed}
            className="mt-1 flex-shrink-0" 
          />
          <span className="text-[13px] font-medium text-gray-500 leading-tight">
            I agree to the <Link href="/terms" className="text-[#0038A8] font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#0038A8] font-bold hover:underline">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          isLoading={exchangingMethod === 'signup'}
          disabled={isExchanging || !isFormValid() || !agreed}
          style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
          className="w-full h-14 text-[17px] font-black rounded-3xl shadow-[0_8px_24px_rgba(0,56,168,0.15)] active:scale-[0.98] transition-all text-white border-none"
        >
          Join AyosDocs
        </Button>
      </div>
    </form>
  );
}

function PasswordHint({ label, active }) {
  return (
    <div className={`flex items-center gap-1.5 transition-colors duration-300 ${active ? 'text-[#34C759]' : 'text-gray-300'}`}>
      <CheckCircle2 size={14} strokeWidth={3} />
      <span className="text-[11px] font-bold">{label}</span>
    </div>
  );
}

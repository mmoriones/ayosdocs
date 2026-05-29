'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Standardized Input component.
 * Matches the classic AuthModal design: spacious, rounded-xl, and high-contrast.
 * 
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.error
 * @param {React.ReactNode} [props.leftIcon]
 * @param {boolean} [props.fullWidth=true]
 */
export default function Input({
  label,
  error,
  leftIcon: LeftIcon,
  type = 'text',
  className = '',
  containerClassName = '',
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const hasError = !!error;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[13px] font-bold text-gray-500 ml-5">
          {label}
        </label>
      )}

      <div className="relative group">
        {LeftIcon && (
          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
            disabled ? 'text-gray-300' : hasError ? 'text-[#FF3B30]' : 'text-gray-400 group-focus-within:text-[#0038A8]'
          }`}>
            <LeftIcon size={18} strokeWidth={2.5} />
          </div>
        )}

        <input
          type={inputType}
          disabled={disabled}
          className={`
            w-full bg-white border-[2px] rounded-full py-4 text-[15px] text-[#1C1C1E] outline-none transition-all placeholder:text-gray-400
            ${LeftIcon ? 'pl-14' : 'pl-6'}
            ${isPassword ? 'pr-14' : 'pr-6'}
            ${hasError 
              ? 'border-[#FF3B30]/50 focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/5' 
              : 'border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:border-[#0038A8]/20 focus:ring-4 focus:ring-[#0038A8]/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-gray-100'}
            ${className}
          `}
          {...props}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext1 hover:text-ctp-text transition-colors outline-none focus:text-ctp-sky-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <div className="min-h-[20px] pt-1">
        {hasError && (
          <div className="flex items-center gap-1.5 ml-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={11} className="text-[#FF3B30]" />
            <p className="text-[11px] font-bold text-[#FF3B30]">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

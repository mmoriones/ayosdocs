'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Standardized Input component.
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
        <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {LeftIcon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            disabled ? 'text-ctp-surface2' : hasError ? 'text-ctp-red' : 'text-ctp-subtext1 group-focus-within:text-ctp-sky-800'
          }`}>
            <LeftIcon size={18} strokeWidth={2} />
          </div>
        )}

        <input
          type={inputType}
          disabled={disabled}
          className={`
            w-full bg-ctp-base border rounded-xl py-3.5 text-sm text-ctp-text outline-none transition-all placeholder:text-ctp-subtext0
            ${LeftIcon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${hasError 
              ? 'border-ctp-red/50 focus:border-ctp-red' 
              : 'border-ctp-surface1 focus:border-ctp-sky-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
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

      {hasError && (
        <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={12} className="text-ctp-red" />
          <p className="text-[10px] font-bold text-ctp-red uppercase tracking-tight">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

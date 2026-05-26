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
        <label className="text-ui-detail font-bold text-ctp-subtext1 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {LeftIcon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            disabled ? 'text-ctp-surface2' : hasError ? 'text-ctp-red' : 'text-ctp-subtext0 group-focus-within:text-ctp-sky-800'
          }`}>
            <LeftIcon size={16} strokeWidth={2} />
          </div>
        )}

        <input
          type={inputType}
          disabled={disabled}
          className={`
            w-full bg-ctp-base border rounded-lg py-2.5 text-sm text-ctp-text outline-none transition-all placeholder:text-ctp-subtext1/50
            ${LeftIcon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-10' : 'pr-3.5'}
            ${hasError 
              ? 'border-ctp-red/50 focus:border-ctp-red focus:ring-4 focus:ring-ctp-red/5' 
              : 'border-ctp-surface1 focus:border-ctp-sky-800 focus:ring-4 focus:ring-ctp-sky-800/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-ctp-mantle' : 'hover:border-ctp-surface2'}
            ${className}
          `}
          {...props}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ctp-subtext1 hover:text-ctp-text transition-colors outline-none focus:text-ctp-sky-800"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      <div className="min-h-[20px] pt-1">
        {hasError && (
          <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-0.5 duration-200">
            <AlertCircle size={10} className="text-ctp-red" />
            <p className="text-ui-micro font-bold text-ctp-red uppercase tracking-wide">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

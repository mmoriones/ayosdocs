'use client';

import { Loader2 } from 'lucide-react';

/**
 * Standardized Button component.
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.97] rounded-lg disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap";
  
  const variants = {
    primary: "bg-ctp-sky-800 hover:bg-ctp-sky-700 text-white shadow-sm shadow-ctp-sky-800/10 disabled:bg-ctp-surface1 disabled:text-ctp-subtext1 disabled:shadow-none",
    secondary: "bg-ctp-mantle/50 border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle hover:border-ctp-sky-800/30 shadow-sm disabled:opacity-50",
    outline: "bg-transparent border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle/50 hover:border-ctp-sky-800/30 disabled:opacity-50",
    ghost: "bg-transparent text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 disabled:opacity-50",
    danger: "bg-[var(--danger)] text-white shadow-sm shadow-[var(--danger)]/20 hover:bg-[var(--danger-hover)] disabled:opacity-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px] uppercase tracking-wider",
    md: "px-5 py-2.5 text-xs uppercase tracking-widest",
    lg: "px-8 py-3.5 text-sm uppercase tracking-widest"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={combinedClassName}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      
      {children}
      
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
}

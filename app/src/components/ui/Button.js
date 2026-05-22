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
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] rounded-xl disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-ctp-sky-800 hover:bg-ctp-sky-700 text-white shadow-md disabled:bg-ctp-surface1 disabled:text-ctp-subtext1 disabled:shadow-none",
    secondary: "bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text border border-ctp-surface1 disabled:opacity-50",
    outline: "bg-transparent border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle disabled:opacity-50",
    ghost: "bg-transparent text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-mantle disabled:opacity-50",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 disabled:opacity-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
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

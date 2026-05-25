'use client';

import { Loader2 } from 'lucide-react';

/**
 * Standardized Button component.
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'} [props.variant='primary']
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
  const isLink = variant === 'link';

  const baseStyles = "inline-flex items-center justify-center font-bold transition-all disabled:cursor-not-allowed whitespace-nowrap";
  const shapeStyles = isLink ? "active:scale-[0.97]" : "rounded-lg active:scale-[0.98]";
  const liftStyles = "hover:-translate-y-px hover:shadow-lg active:translate-y-0";
  const rippleStyles = "relative overflow-hidden after:absolute after:inset-0 after:bg-white/10 after:opacity-0 after:transition-opacity active:after:opacity-100";
  const overlayStyles = "relative overflow-hidden before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-[0.03]";

  const enableFeedback = !disabled && !isLoading;

  const variants = {
    primary: "bg-ctp-sky-800 hover:bg-ctp-sky-700 text-white shadow-ctp-sky-800/10 disabled:bg-ctp-surface1 disabled:text-ctp-subtext1 disabled:shadow-none",
    secondary: "bg-ctp-mantle/50 border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle hover:border-ctp-sky-800/30 disabled:opacity-50",
    outline: "bg-transparent border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle/50 hover:border-ctp-sky-800/30 disabled:opacity-50",
    ghost: "bg-transparent text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 disabled:opacity-50",
    danger: "bg-[var(--danger)] text-white shadow-[var(--danger)]/20 hover:bg-[var(--danger-hover)] disabled:opacity-50",
    link: "text-ctp-sky-800 hover:text-ctp-sky-700 disabled:opacity-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs uppercase tracking-ui-caps",
    md: "px-5 py-2.5 text-ui-label uppercase tracking-ui-caps",
    lg: "px-8 py-3.5 text-base uppercase tracking-ui-caps",
    link: "text-ui-detail uppercase tracking-ui-caps"
  };

  const feedbackStyles = isLink
    ? ""
    : (enableFeedback ? `${liftStyles} ${rippleStyles}` : "");

  const combinedClassName = `${baseStyles} ${shapeStyles} ${feedbackStyles} ${variants[variant]} ${sizes[isLink ? 'link' : size]} ${className}`;

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

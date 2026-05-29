import { Loader2 } from 'lucide-react';

/**
 * Standardized Button component.
 * Supports polymorphic rendering via the 'as' prop.
 * 
 * @param {Object} props
 * @param {React.ElementType} [props.as='button']
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 */
export default function Button({ 
  as: Component = 'button',
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
  const shapeStyles = isLink ? "active:scale-[0.97]" : "rounded-[18px] lg:rounded-[22px] active:scale-[0.98]";
  const liftStyles = "hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0";
  const rippleStyles = "relative overflow-hidden after:absolute after:inset-0 after:bg-black/5 after:opacity-0 after:transition-opacity active:after:opacity-100";
  
  const enableFeedback = !disabled && !isLoading;

  const variants = {
    primary: "bg-[#0038A8] text-white shadow-[0_8px_30px_rgba(0,56,168,0.15)]",
    secondary: "bg-white border border-gray-100 text-[#0038A8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#0038A8]/20",
    outline: "bg-transparent border border-gray-200 text-[#1C1C1E] hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:text-[#0038A8] hover:bg-[#0038A8]/5",
    danger: "bg-[#FF3B30] text-white shadow-[0_8px_30px_rgba(255,59,48,0.15)]",
    link: "text-[#0038A8] hover:opacity-80"
  };

  const sizes = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-6 py-3 text-[15px]",
    lg: "px-10 py-4 text-[17px]",
    link: "text-[14px]"
  };

  const feedbackStyles = isLink
    ? ""
    : (enableFeedback ? `${liftStyles} ${rippleStyles}` : "");

  const combinedClassName = `${baseStyles} ${shapeStyles} ${feedbackStyles} ${variants[variant]} ${sizes[isLink ? 'link' : size]} ${className}`;

  // If used as a button, include the type prop
  const componentProps = Component === 'button' ? { type, ...props } : props;

  return (
    <Component
      disabled={disabled || isLoading}
      onClick={onClick}
      className={combinedClassName}
      {...componentProps}
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
    </Component>
  );
}

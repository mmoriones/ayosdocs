import { Loader2 } from 'lucide-react';

/**
 * Standardized Button component.
 * Supports polymorphic rendering via the 'as' prop.
 * 
 * @param {Object} props
 * @param {React.ElementType} [props.as='button']
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'icon'} [props.variant='primary']
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
  const isDisabled = disabled || isLoading;

  const baseStyles = "inline-flex items-center justify-center font-black transition-all whitespace-nowrap";
  const shapeStyles = isLink ? "" : variant === 'icon' ? "rounded-full" : "rounded-[22px]";
  
  const interactionStyles = isLink 
    ? "active:scale-[0.97] hover:opacity-80" 
    : (isDisabled 
        ? "opacity-40 shadow-none cursor-not-allowed pointer-events-none" 
        : "active:scale-90 hover:-translate-y-0.5 hover:shadow-xl"
      );

  const variants = {
    primary: "bg-[#0038A8] text-white shadow-[0_8px_24px_rgba(0,56,168,0.15)]",
    secondary: "bg-white border border-gray-100 text-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-gray-200",
    outline: "bg-transparent border border-gray-200 text-[#1C1C1E] hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:text-[#0038A8] hover:bg-[#0038A8]/5",
    danger: "bg-[#FF3B30] text-white shadow-[0_8px_24px_rgba(255,59,48,0.15)]",
    link: "text-[#0038A8]",
    icon: "bg-white shadow-sm text-[#1C1C1E]"
  };

  const sizes = {
    sm: "px-4 h-10 text-[13px]",
    md: "px-6 h-12 text-[15px]",
    lg: "px-10 h-14 text-[17px]",
    link: "text-[14px]",
    icon: {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12"
    }
  };

  const sizeStyles = variant === 'icon' ? sizes.icon[size] : sizes[isLink ? 'link' : size];
  const combinedClassName = `${baseStyles} ${shapeStyles} ${interactionStyles} ${variants[variant]} ${sizeStyles} ${className}`;

  // If used as a button, include the type prop
  const componentProps = Component === 'button' ? { type, ...props } : props;

  return (
    <Component
      disabled={isDisabled}
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

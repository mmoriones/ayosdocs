import { X } from 'lucide-react';

/**
 * Reusable Banner component for tips, alerts, and information.
 * 
 * @param {Object} props
 * @param {'sky' | 'teal' | 'sapphire' | 'green' | 'orange' | 'white'} props.variant - The color theme of the banner.
 * @param {import('lucide-react').LucideIcon} props.icon - The icon to display on the left.
 * @param {string} [props.title] - Optional bold title prefix.
 * @param {React.ReactNode} props.children - The main content of the banner.
 * @param {Function} [props.onClose] - Optional callback for the close button.
 * @param {string} [props.className] - Additional CSS classes.
 */
const Banner = ({ 
  variant = 'sky', 
  icon: Icon, 
  title, 
  children, 
  onClose, 
  className = "" 
}) => {
  const variants = {
    sky: "bg-[#0038A8]/5 border-[#0038A8]/10 text-[#1C1C1E]",
    green: "bg-[#34C759]/5 border-[#34C759]/10 text-[#1C1C1E]",
    orange: "bg-[#FF9500]/5 border-[#FF9500]/10 text-[#1C1C1E]",
    red: "bg-[#FF3B30]/5 border-[#FF3B30]/10 text-[#1C1C1E]",
    white: "bg-white border-gray-100 text-[#1C1C1E] shadow-sm",
  };

  const iconVariants = {
    sky: "text-[#0038A8]",
    green: "text-[#34C759]",
    orange: "text-[#FF9500]",
    red: "text-[#FF3B30]",
    white: "text-gray-400",
  };

  const closeButtonVariants = {
    sky: "text-gray-400 hover:text-[#0038A8]",
    green: "text-gray-400 hover:text-[#34C759]",
    orange: "text-gray-400 hover:text-[#FF9500]",
    red: "text-gray-400 hover:text-[#FF3B30]",
    white: "text-gray-400 hover:text-[#1C1C1E]",
  };

  return (
    <div className={`border rounded-[16px] p-4 flex gap-4 animate-in fade-in slide-in-from-top-1 duration-200 ${variants[variant]} ${className.includes('items-') ? '' : 'items-start'} ${className}`}>
      {Icon && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-black/5 ${iconVariants[variant]} ${className.includes('items-center') ? '' : 'mt-0.5'}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      )}
      <div className="flex-1 text-[14px] font-medium leading-relaxed">
        {title && <span className="font-bold mr-2">{title}</span>}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`click-ripple transition-colors flex-shrink-0 mt-0.5 outline-none focus:ring-2 focus:ring-current/10 rounded ${closeButtonVariants[variant]}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Banner;

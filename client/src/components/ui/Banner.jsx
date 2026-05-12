import { X } from 'lucide-react';

/**
 * Reusable Banner component for tips, alerts, and information.
 * 
 * @param {Object} props
 * @param {'teal' | 'orange' | 'blue' | 'white'} props.variant - The color theme of the banner.
 * @param {import('lucide-react').LucideIcon} props.icon - The icon to display on the left.
 * @param {string} [props.title] - Optional bold title prefix.
 * @param {React.ReactNode} props.children - The main content of the banner.
 * @param {Function} [props.onClose] - Optional callback for the close button.
 * @param {string} [props.className] - Additional CSS classes.
 */
const Banner = ({ 
  variant = 'teal', 
  icon: Icon, 
  title, 
  children, 
  onClose, 
  className = "" 
}) => {
  const variants = {
    teal: "bg-teal-50/50 border-teal-100 text-teal-800",
    orange: "bg-orange-50/50 border-orange-100 text-orange-800",
    blue: "bg-blue-50/50 border-blue-100 text-blue-800",
    white: "bg-white border-gray-100 text-gray-800 shadow-sm",
  };

  const iconBgVariants = {
    teal: "bg-teal-100 text-teal-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    white: "bg-gray-50 text-gray-400",
  };

  const closeButtonVariants = {
    teal: "text-teal-400 hover:text-teal-600",
    orange: "text-orange-400 hover:text-orange-600",
    blue: "text-blue-400 hover:text-blue-600",
    white: "text-gray-400 hover:text-gray-600",
  };

  return (
    <div className={`border rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${variants[variant]} ${className}`}>
      {Icon && (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${iconBgVariants[variant]}`}>
          <Icon size={14} />
        </div>
      )}
      <div className="flex-1 text-sm leading-relaxed">
        {title && <span className="font-bold mr-1">{title}:</span>}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`transition-colors flex-shrink-0 ${closeButtonVariants[variant]}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Banner;

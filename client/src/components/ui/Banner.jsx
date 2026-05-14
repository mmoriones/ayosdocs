import { X } from 'lucide-react';

/**
 * Reusable Banner component for tips, alerts, and information.
 * 
 * @param {Object} props
 * @param {'teal' | 'sapphire' | 'green' | 'orange' | 'white'} props.variant - The color theme of the banner.
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
    sky: "bg-ctp-sky-50/50 border-ctp-sky-300/20 text-ctp-sky-800",
    teal: "bg-ctp-sky-50/50 border-ctp-sky-300/20 text-ctp-sky-800",
    sapphire: "bg-ctp-sky-50/50 border-ctp-sky-300/20 text-ctp-sky-800",
    green: "bg-ctp-green/10 border-ctp-green/20 text-ctp-green",
    orange: "bg-ctp-orange/10 border-ctp-orange/20 text-ctp-orange",
    white: "bg-ctp-mantle border-ctp-surface0 text-ctp-text shadow-sm",
  };

  const iconBgVariants = {
    sky: "bg-ctp-sky-50 text-ctp-sky-800",
    teal: "bg-ctp-sky-50 text-ctp-sky-800",
    sapphire: "bg-ctp-sky-50 text-ctp-sky-800",
    green: "bg-ctp-green/20 text-ctp-green",
    orange: "bg-ctp-orange/20 text-ctp-orange",
    white: "bg-ctp-surface0 text-ctp-subtext1",
  };

  const closeButtonVariants = {
    sky: "text-ctp-sky-800/50 hover:text-ctp-sky-800",
    teal: "text-ctp-sky-800/50 hover:text-ctp-sky-800",
    sapphire: "text-ctp-sky-800/50 hover:text-ctp-sky-800",
    green: "text-ctp-green/50 hover:text-ctp-green",
    orange: "text-ctp-orange/50 hover:text-ctp-orange",
    white: "text-ctp-subtext0 hover:text-ctp-text",
  };

  return (
    <div className={`border rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${variants[variant]} ${className}`}>
      {Icon && (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${iconBgVariants[variant]}`}>
          <Icon size={14} />
        </div>
      )}
      <div className="flex-1 text-[14px] leading-relaxed">
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

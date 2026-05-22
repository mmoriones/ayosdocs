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
    sky: "bg-ctp-sky-10 border-ctp-sky-300/20 text-ctp-sky-800",
    teal: "bg-ctp-teal/5 border-ctp-teal/20 text-ctp-teal",
    sapphire: "bg-ctp-sky-10 border-ctp-sky-300/20 text-ctp-sky-800",
    green: "bg-ctp-green/5 border-ctp-green/20 text-ctp-green",
    orange: "bg-ctp-orange/5 border-ctp-orange/20 text-ctp-orange",
    white: "bg-ctp-mantle border-ctp-surface1 text-ctp-text shadow-sm",
  };

  const iconBgVariants = {
    sky: "bg-ctp-base text-ctp-sky-800 shadow-sm",
    teal: "bg-ctp-base text-ctp-teal shadow-sm",
    sapphire: "bg-ctp-base text-ctp-sky-800 shadow-sm",
    green: "bg-ctp-base text-ctp-green shadow-sm",
    orange: "bg-ctp-base text-ctp-orange shadow-sm",
    white: "bg-ctp-base text-ctp-subtext0 shadow-sm",
  };

  const closeButtonVariants = {
    sky: "text-ctp-sky-800/40 hover:text-ctp-sky-800",
    teal: "text-ctp-teal/40 hover:text-ctp-teal",
    sapphire: "text-ctp-sky-800/40 hover:text-ctp-sky-800",
    green: "text-ctp-green/40 hover:text-ctp-green",
    orange: "text-ctp-orange/40 hover:text-ctp-orange",
    white: "text-ctp-subtext0 hover:text-ctp-text",
  };

  return (
    <div className={`border rounded-xl p-3 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200 ${variants[variant]} ${className.includes('items-') ? '' : 'items-start'} ${className}`}>
      {Icon && (
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border border-current/10 ${iconBgVariants[variant]} ${className.includes('items-center') ? '' : 'mt-0.5'}`}>
          <Icon size={12} />
        </div>
      )}
      <div className="flex-1 text-sm leading-relaxed">
        {title && <span className="font-semibold mr-1.5">{title}:</span>}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`transition-colors flex-shrink-0 mt-0.5 ${closeButtonVariants[variant]}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Banner;

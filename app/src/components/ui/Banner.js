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
    sky: "bg-ctp-sky-800/[0.04] border-ctp-sky-800/10 text-ctp-text",
    teal: "bg-ctp-teal/[0.04] border-ctp-teal/10 text-ctp-text",
    sapphire: "bg-ctp-sky-800/[0.04] border-ctp-sky-800/10 text-ctp-text",
    green: "bg-ctp-green/[0.04] border-ctp-green/10 text-ctp-text",
    orange: "bg-ctp-orange/[0.04] border-ctp-orange/10 text-ctp-text",
    white: "bg-ctp-mantle border-ctp-surface1 text-ctp-text",
  };

  const iconVariants = {
    sky: "text-ctp-sky-800",
    teal: "text-ctp-teal",
    sapphire: "text-ctp-sky-800",
    green: "text-ctp-green",
    orange: "text-ctp-orange",
    white: "text-ctp-subtext0",
  };

  const closeButtonVariants = {
    sky: "text-ctp-subtext1 hover:text-ctp-sky-800",
    teal: "text-ctp-subtext1 hover:text-ctp-teal",
    sapphire: "text-ctp-subtext1 hover:text-ctp-sky-800",
    green: "text-ctp-subtext1 hover:text-ctp-green",
    orange: "text-ctp-subtext1 hover:text-ctp-orange",
    white: "text-ctp-subtext1 hover:text-ctp-text",
  };

  return (
    <div className={`border rounded-lg p-3 flex gap-3.5 animate-in fade-in slide-in-from-top-1 duration-200 ${variants[variant]} ${className.includes('items-') ? '' : 'items-start'} ${className}`}>
      {Icon && (
        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border border-current/10 bg-ctp-base shadow-sm ${iconVariants[variant]} ${className.includes('items-center') ? '' : 'mt-0.5'}`}>
          <Icon size={12} strokeWidth={3} />
        </div>
      )}
      <div className="flex-1 text-[11px] font-medium leading-relaxed">
        {title && <span className="font-bold uppercase tracking-widest text-[9px] mr-1.5 opacity-80">{title}:</span>}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`transition-colors flex-shrink-0 mt-0.5 outline-none focus:ring-2 focus:ring-current/10 rounded ${closeButtonVariants[variant]}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Banner;

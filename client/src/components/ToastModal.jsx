import React, { useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

/**
 * Singleton modal component used for displaying non-blocking notifications.
 * Managed by the ToastProvider and rendered at the root level of the application.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the notification is visible.
 * @param {'success'|'error'|'info'} [props.type="success"] - The visual style and icon variant.
 * @param {string} props.title - Heading text for the notification.
 * @param {string} props.message - Descriptive body text.
 * @param {Function} props.onClose - Callback to dismiss the notification.
 * @returns {JSX.Element|null} The rendered ToastModal component or null.
 */
const ToastModal = ({ isOpen, type = "success", title, message, onClose }) => {
  // Implementation of an optional auto-hide timer.
  // Standard toast behavior often involves automatic dismissal after a set duration.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        // Auto-dismissal is currently disabled to ensure the user acknowledges the message.
        // onClose(); 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Lock body scroll when the toast is open to focus user attention and prevent background actions.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mapping of notification types to specific Lucide icons and Tailwind colors.
  const icons = {
    success: <CheckCircle className="text-ctp-sapphire" size={28} />,
    error: <AlertCircle className="text-ctp-red" size={28} />,
    info: <Info className="text-ctp-blue" size={28} />,
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
      {/* Backdrop - Intercepts clicks and blocks background */}
      <div 
        className="absolute inset-0 bg-ctp-crust/20 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content - Refined Card Style */}
      <div className="relative w-full max-w-[320px] bg-ctp-mantle rounded-[28px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-ctp-surface0 p-6 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ctp-subtext0 hover:text-ctp-subtext1 rounded-full transition-all active:scale-90"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Container */}
          <div className="mb-4">
            <div className="p-3 bg-ctp-base rounded-2xl border border-ctp-surface0/50 shadow-sm">
              {icons[type] || icons.success}
            </div>
          </div>

          {/* Text Content */}
          <h4 className="text-[16px] font-bold text-ctp-text tracking-tight">
            {title}
          </h4>
          
          <p className="text-[13px] font-medium text-ctp-subtext1 mt-2 leading-relaxed px-2">
            {message}
          </p>

          {/* Action Button - Emphasized */}
          <button
            onClick={onClose}
            className="mt-6 px-12 py-2.5 bg-ctp-sapphire hover:opacity-90 text-ctp-base font-bold rounded-xl transition-all active:scale-[0.98] text-[13px] shadow-sm shadow-ctp-sapphire/20"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;

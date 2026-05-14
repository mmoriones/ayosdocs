import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Reusable modal for confirming destructive or critical actions.
 * Supports different visual variants (danger, warning, info) for varying severity levels.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Callback to cancel and close the modal.
 * @param {Function} props.onConfirm - Callback to execute the confirmed action.
 * @param {string} [props.title="Are you sure?"] - Heading text.
 * @param {string} [props.message="This action cannot be undone."] - Descriptive message.
 * @param {string} [props.confirmText="Confirm"] - Text for the confirmation button.
 * @param {string} [props.cancelText="Cancel"] - Text for the cancellation button.
 * @param {'danger'|'warning'|'info'} [props.variant="danger"] - Visual theme of the modal.
 * @returns {JSX.Element|null} The rendered ConfirmModal component or null.
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // danger, warning, info
}) => {
  
  // Prevention of background scrolling ensures focus remains on the confirmation action.
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

  // Mapping of logical variants to specific CSS classes for consistent styling.
  const variantStyles = {
    danger: "bg-ctp-red hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-red/20",
    warning: "bg-ctp-peach hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-peach/20",
    info: "bg-ctp-sapphire hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-sapphire/20"
  };

  const iconStyles = {
    danger: "text-ctp-red bg-ctp-red/10 border-ctp-red/20",
    warning: "text-ctp-peach bg-ctp-peach/10 border-ctp-peach/20",
    info: "text-ctp-sapphire bg-ctp-sapphire/10 border-ctp-sapphire/20"
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-ctp-crust/20 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* MODAL */}
      <div className="relative w-full max-w-[340px] bg-ctp-mantle rounded-[28px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-ctp-surface0 p-7 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-ctp-subtext0 hover:text-ctp-subtext1 rounded-full transition-all active:scale-90"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* ICON */}
          <div className="mb-5">
            <div className={`p-4 rounded-2xl border shadow-sm ${iconStyles[variant]}`}>
              <AlertCircle size={28} />
            </div>
          </div>

          {/* TEXT */}
          <h3 className="text-[18px] font-bold text-ctp-text tracking-tight leading-tight mb-2">
            {title}
          </h3>
          <p className="text-[13px] font-medium text-ctp-subtext1 mb-8 leading-relaxed px-2">
            {message}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold text-ctp-subtext1 bg-ctp-base hover:bg-ctp-surface0 transition-all active:scale-[0.98] border border-ctp-surface0"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98] ${variantStyles[variant]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

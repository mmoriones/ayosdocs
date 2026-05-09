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
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-100",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-100",
    info: "bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-100"
  };

  const iconStyles = {
    danger: "text-red-600 bg-red-50 border-red-100/50",
    warning: "text-amber-600 bg-amber-50 border-amber-100/50",
    info: "text-teal-600 bg-teal-50 border-teal-100/50"
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* MODAL */}
      <div className="relative w-full max-w-[340px] bg-white rounded-[28px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 p-7 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-300 hover:text-slate-500 rounded-full transition-all active:scale-90"
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
          <h3 className="text-[18px] font-bold text-slate-900 tracking-tight leading-tight mb-2">
            {title}
          </h3>
          <p className="text-[13px] font-medium text-slate-500 mb-8 leading-relaxed px-2">
            {message}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98] border border-slate-100"
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

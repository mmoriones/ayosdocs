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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Mapping of logical variants to specific CSS classes for consistent styling.
  const variantStyles = {
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-50",
    warning: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-50",
    info: "bg-teal-50 text-teal-600 hover:bg-teal-100 focus:ring-teal-50"
  };

  const iconStyles = {
    danger: "text-red-600 bg-red-50",
    warning: "text-yellow-600 bg-yellow-50",
    info: "text-teal-600 bg-teal-50"
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      {/* MODAL */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-scaleIn">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* ICON */}
          <div className={`p-4 rounded-full mb-6 ${iconStyles[variant]}`}>
            <AlertCircle size={28} />
          </div>

          {/* TEXT */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            {message}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition active:scale-95 focus:ring-4 ${variantStyles[variant]}`}
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

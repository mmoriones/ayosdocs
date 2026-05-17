'use client';

import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Reusable modal for confirming destructive or critical actions.
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

  const variantStyles = {
    danger: "bg-ctp-red hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-red/20",
    warning: "bg-ctp-orange hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-orange/20",
    info: "bg-ctp-sky-800 hover:opacity-90 text-ctp-base shadow-sm shadow-ctp-sky-800/20"
  };

  const iconVariants = {
    danger: "text-ctp-red bg-ctp-red/10 border-ctp-red/20",
    warning: "text-ctp-orange bg-ctp-orange/10 border-ctp-orange/20",
    info: "text-ctp-sky-800 bg-ctp-sky-800/10 border-ctp-sky-800/20"
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
      <div 
        className="absolute inset-0 bg-ctp-crust/20 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-[340px] bg-ctp-mantle rounded-2xl shadow-xl border border-ctp-surface1 p-6 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ctp-subtext1 hover:text-ctp-text rounded-full transition-all active:scale-95 border border-transparent hover:border-ctp-surface1"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className={`p-3.5 rounded-xl border shadow-sm ${iconVariants[variant]}`}>
              <AlertCircle size={24} />
            </div>
          </div>

          <h3 className="text-lg font-bold text-ctp-text tracking-tight leading-tight mb-2">
            {title}
          </h3>
          <p className="text-sm font-medium text-ctp-subtext1 mb-6 leading-relaxed px-1">
            {message}
          </p>

          <div className="flex items-center gap-2.5 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-ctp-subtext1 bg-ctp-base hover:bg-ctp-surface1 transition-all active:scale-[0.98] border border-ctp-surface1"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] ${variantStyles[variant]}`}
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

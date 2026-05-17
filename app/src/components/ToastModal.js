'use client';

import React, { useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

const ToastModal = ({ isOpen, type = "success", title, message, onClose }) => {
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

  const icons = {
    success: <CheckCircle className="text-ctp-sky-800" size={28} />,
    error: <AlertCircle className="text-red-500" size={28} />,
    info: <Info className="text-ctp-sky-800" size={28} />,
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[300px] bg-ctp-mantle rounded-2xl shadow-xl border border-ctp-surface1 p-6 pointer-events-auto animate-slide-down">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ctp-subtext1 hover:text-ctp-text rounded-full transition-all active:scale-95 border border-transparent hover:border-ctp-surface1"
        >
          <X size={14} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="p-3 bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm">
              {icons[type] || icons.success}
            </div>
          </div>

          <h4 className="text-base font-bold text-ctp-text tracking-tight">
            {title}
          </h4>
          
          <p className="text-xs font-medium text-ctp-subtext1 mt-1.5 leading-relaxed px-1">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white font-semibold rounded-lg transition-all active:scale-[0.98] text-xs shadow-sm"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;

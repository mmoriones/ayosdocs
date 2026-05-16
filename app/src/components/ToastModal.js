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
      
      <div className="relative w-full max-w-[320px] bg-ctp-mantle rounded-[28px] shadow-xl border border-ctp-surface0 p-6 pointer-events-auto animate-slide-down">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ctp-subtext0 hover:text-ctp-subtext1 rounded-full transition-all active:scale-90"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="p-3 bg-ctp-base rounded-2xl border border-ctp-surface0/50 shadow-sm">
              {icons[type] || icons.success}
            </div>
          </div>

          <h4 className="text-[16px] font-bold text-ctp-text tracking-tight">
            {title}
          </h4>
          
          <p className="text-[13px] font-medium text-ctp-subtext1 mt-2 leading-relaxed px-2">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-6 px-12 py-2.5 bg-ctp-sky-800 hover:opacity-90 text-white font-bold rounded-xl transition-all active:scale-[0.98] text-[13px]"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;

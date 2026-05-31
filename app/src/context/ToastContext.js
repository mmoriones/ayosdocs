'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// --- Inlined from components/ToastModal.js ---
const ToastModal = ({ isOpen, type = "success", title, message, onClose }) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-ctp-green" size={20} />,
    error: <AlertCircle className="text-ctp-red" size={20} />,
    warning: <AlertTriangle className="text-ctp-yellow" size={20} />,
    info: <Info className="text-ctp-sky" size={20} />,
  };

  const borderColors = {
    success: "border-ctp-green/20",
    error: "border-ctp-red/20",
    warning: "border-ctp-yellow/20",
    info: "border-ctp-sky/20",
  };

  return (
    <div className="fixed top-24 right-6 z-[300] w-full max-w-sm pointer-events-none animate-in slide-in-from-right duration-300">
      <div className={`relative w-full bg-ctp-mantle rounded-2xl shadow-2xl border ${borderColors[type] || borderColors.success} p-5 pointer-events-auto backdrop-blur-md bg-ctp-mantle/95`}>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ctp-subtext1 hover:text-ctp-text rounded-full transition-all active:scale-95"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            {icons[type] || icons.success}
          </div>

          <div className="space-y-1 pr-4">
            <h4 className="text-sm font-bold text-ctp-text tracking-tight">
              {title}
            </h4>
            
            <p className="text-xs font-medium text-ctp-subtext1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-ctp-sky-800/10 w-full overflow-hidden rounded-b-2xl">
           <div className="h-full bg-ctp-sky-800/20 animate-toast-progress origin-left" />
        </div>
      </div>
    </div>
  );
};
// --- End of ToastModal ---

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(({ type = 'success', title = '', message = '' }) => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({
      isOpen: true,
      type,
      title,
      message
    });

    // Auto-dismiss after 5 seconds
    timerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
      timerRef.current = null;
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastModal 
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

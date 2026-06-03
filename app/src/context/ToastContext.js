'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// --- Inlined from components/ToastModal.js ---
const ToastModal = ({ isOpen, type = "success", title, message, onClose }) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-[#34C759]" size={18} strokeWidth={3} />,
    error: <AlertCircle className="text-[#FF3B30]" size={18} strokeWidth={3} />,
    warning: <AlertTriangle className="text-[#FF9500]" size={18} strokeWidth={3} />,
    info: <Info className="text-[#007AFF]" size={18} strokeWidth={3} />,
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-auto max-w-[90vw] pointer-events-none animate-in slide-in-from-top-4 duration-500">
      <div className="bg-white/80 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60 px-6 py-3.5 pointer-events-auto flex items-center gap-3">
        <div className="shrink-0">
          {icons[type] || icons.success}
        </div>

        <div className="flex flex-col min-w-0">
          <h4 className="text-[14px] font-bold text-[#1C1C1E] tracking-tight whitespace-nowrap">
            {title}
          </h4>
          {message && (
            <p className="text-[11px] font-medium text-gray-500 leading-none mt-0.5 truncate">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="ml-2 p-1 text-gray-300 hover:text-gray-500 transition-colors active:scale-90"
        >
          <X size={14} strokeWidth={3} />
        </button>
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

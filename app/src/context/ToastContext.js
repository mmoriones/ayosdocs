'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastModal from '../components/ToastModal';

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

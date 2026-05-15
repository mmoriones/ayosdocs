'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastModal from '../components/ToastModal';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showToast = useCallback(({ type = 'success', title = '', message = '' }) => {
    setToast({
      isOpen: true,
      type,
      title,
      message
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
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

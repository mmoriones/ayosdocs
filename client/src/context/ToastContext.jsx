import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastModal from '../components/ToastModal';

const ToastContext = createContext();

/**
 * Context provider for managing global toast notifications.
 * Renders a singleton ToastModal that is controlled by state.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} The ToastProvider component.
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  /**
   * Triggers the visibility of the toast modal with provided content.
   * Callback is memoized to prevent unnecessary re-renders of consuming components.
   * 
   * @param {Object} options - Notification options.
   * @param {'success'|'error'|'info'} [options.type='success'] - Visual variant of the toast.
   * @param {string} [options.title=''] - Heading text.
   * @param {string} [options.message=''] - Body text.
   */
  const showToast = useCallback(({ type = 'success', title = '', message = '' }) => {
    setToast({
      isOpen: true,
      type,
      title,
      message
    });
  }, []);

  /**
   * Hides the active toast notification.
   */
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* A single instance of the modal is reused for all notifications. */}
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

/**
 * Custom hook to trigger toast notifications from any component.
 * 
 * @returns {{showToast: Function, hideToast: Function}} The toast context value.
 * @throws {Error} If used outside of a ToastProvider.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

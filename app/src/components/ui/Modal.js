'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  closeOnEsc = true,
  noPadding = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  animationClassName = 'animate-in fade-in zoom-in-95 duration-300',
}) {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  const handleKeyDown = useCallback((e) => {
    if (closeOnEsc && e.key === 'Escape') onClose();
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none ${className}`}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300 ${overlayClassName}`}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      <div className={`relative w-full ${sizes[size]} bg-ctp-mantle rounded-xl shadow-2xl border border-ctp-surface1 pointer-events-auto ${animationClassName} ${contentClassName} overflow-hidden`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-ctp-surface1">
            <h2 className="text-lg font-bold text-ctp-text tracking-tight">{title}</h2>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-ctp-subtext1 hover:text-ctp-text rounded-lg transition-all active:scale-95 border border-transparent hover:border-ctp-surface1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        {!title && showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-ctp-subtext1 hover:text-ctp-text rounded-lg transition-all active:scale-95 border border-transparent hover:border-ctp-surface1 z-10"
          >
            <X size={16} />
          </button>
        )}

        <div className={`${noPadding ? '' : 'p-6'} max-h-[90vh] overflow-y-auto custom-scrollbar`}>
          {children}
        </div>
      </div>
    </div>
  );
}

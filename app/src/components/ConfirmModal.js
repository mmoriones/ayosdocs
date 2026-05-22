'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

/**
 * Reusable modal for confirming destructive or critical actions.
 * Powered by the generic Modal component.
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
  const iconVariants = {
    danger: "text-ctp-red bg-ctp-red/10 border-ctp-red/20",
    warning: "text-ctp-orange bg-ctp-orange/10 border-ctp-orange/20",
    info: "text-ctp-sky-800 bg-ctp-sky-800/10 border-ctp-sky-800/20"
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      contentClassName="max-w-[340px]"
    >
      <div className="flex flex-col items-center text-center py-2">
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
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 font-semibold"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'info' ? 'primary' : 'danger'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui';

/**
 * Reusable modal for confirming destructive or critical actions.
 * Powered by the generic Modal component, styled with iOS aesthetics.
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
  const config = {
    danger: {
      bg: "bg-[#FFEFF5]/90",
      border: "border-[#FF3B30]/20",
      icon: <AlertTriangle size={42} className="text-[#FF3B30]" fill="#FF3B30" fillOpacity={0.1} />
    },
    warning: {
      bg: "bg-[#FFF9E0]/90",
      border: "border-[#FF9500]/20",
      icon: <AlertTriangle size={42} className="text-[#FF9500]" fill="#FF9500" fillOpacity={0.1} />
    },
    info: {
      bg: "bg-[#EDF4FF]/90",
      border: "border-[#007AFF]/20",
      icon: <AlertTriangle size={42} className="text-[#007AFF]" fill="#007AFF" fillOpacity={0.1} />
    }
  };

  const current = config[variant] || config.danger;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      noPadding
      showClose={false}
      contentClassName={`!backdrop-blur-2xl !rounded-[32px] border ${current.border} ${current.bg} !shadow-2xl max-w-[320px] overflow-hidden`}
    >
      <div className="flex flex-col items-center pt-8">
        {/* Warning Icon - iOS Style */}
        <div className="mb-4">
          {current.icon}
        </div>

        {/* Text Content */}
        <div className="px-8 pb-6 text-center">
          <h3 className="text-[22px] font-black text-[#1C1C1E] tracking-tight leading-tight mb-2">
            {title}
          </h3>
          <p className="text-[14px] font-medium text-gray-500 leading-snug">
            {message}
          </p>
        </div>

        {/* Action Buttons - iOS Grid Style */}
        <div className="w-full flex border-t border-black/5">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-[17px] font-bold text-[#007AFF] active:bg-black/5 transition-colors border-r border-black/5 outline-none"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-4 text-[17px] font-black active:bg-black/5 transition-colors outline-none ${
              variant === 'danger' ? 'text-[#FF3B30]' : 'text-[#007AFF]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

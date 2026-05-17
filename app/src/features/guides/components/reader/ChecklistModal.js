'use client';

import { X } from "lucide-react";
import { useEffect } from "react";

/**
 * Modal component used for mobile-specific views of the checklist and table of contents.
 */
const ChecklistModal = ({ isOpen, onClose, title, children, maxHeight = "85vh" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ctp-crust/60 backdrop-blur-[6px] z-[200] flex items-end lg:hidden touch-none">
      <div
        className="bg-ctp-mantle w-full rounded-t-2xl flex flex-col animate-in slide-in-from-bottom duration-500 ease-out touch-auto border-t border-ctp-surface1"
        style={{ maxHeight }}
      >
        <div className="px-6 py-6 border-b border-ctp-surface1 flex items-center justify-between">
          <h3 className="font-bold text-lg text-ctp-text tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors border border-ctp-surface1 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40 overscroll-contain custom-scrollbar">
          {children}
        </div>
      </div>
    </div>  );
};

export default ChecklistModal;

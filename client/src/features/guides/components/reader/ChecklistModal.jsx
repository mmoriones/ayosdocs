import { X } from "lucide-react";
import { useEffect } from "react";

/**
 * Modal component used for mobile-specific views of the checklist and table of contents.
 * Slides up from the bottom of the screen.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is currently visible.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {string} props.title - The title displayed in the modal header.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal.
 * @param {string} [props.maxHeight="85vh"] - The maximum height of the modal.
 * @returns {JSX.Element|null} The rendered ChecklistModal component or null.
 */
const ChecklistModal = ({ isOpen, onClose, title, children, maxHeight = "85vh" }) => {
  // Prevention of background scrolling when the modal is active.
  // This is a common UX pattern to ensure the user stays focused on the modal content.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    // Cleanup resets the overflow styles when the component is unmounted.
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ctp-crust/60 backdrop-blur-[6px] z-[200] flex items-end lg:hidden touch-none">
      <div 
        className="bg-ctp-mantle w-full rounded-t-[3rem] flex flex-col animate-in slide-in-from-bottom duration-500 ease-out touch-auto border-t border-ctp-surface0"
        style={{ maxHeight }}
      >
        {/* HEADER */}
        <div className="px-8 py-8 border-b border-ctp-surface0 flex items-center justify-between">
          <h3 className="font-black text-[20px] text-ctp-text uppercase tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-3 -mr-3 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors shadow-sm"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-48 overscroll-contain custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:hidden touch-none">
      <div 
        className="bg-white w-full rounded-t-3xl flex flex-col animate-in slide-in-from-bottom duration-300 touch-auto"
        style={{ maxHeight }}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-44 overscroll-contain custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;

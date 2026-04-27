import { X } from "lucide-react";
import { useEffect } from "react";

const GuideModal = ({ isOpen, onClose, title, children, maxHeight = "85vh" }) => {
  // Prevent background scroll when modal is open
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
        <div className="flex-1 overflow-y-auto p-6 pb-34">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GuideModal;

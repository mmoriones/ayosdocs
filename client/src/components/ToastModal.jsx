import React, { useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

const ToastModal = ({ isOpen, type = "success", title, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        // onClose(); // Uncomment to auto-hide
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-teal-600" size={24} />,
    error: <AlertCircle className="text-red-600" size={24} />,
    info: <Info className="text-blue-600" size={24} />,
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-fadeIn" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4">
            {icons[type] || icons.success}
          </div>

          {/* Text */}
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-2">{message}</p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 text-teal-600 font-semibold hover:bg-teal-50 rounded-xl transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;

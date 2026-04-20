import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border-2 
        bg-white border-gray-100 
        dark:bg-[#242729] dark:border-gray-800 transition-all duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors
            text-gray-400 hover:bg-gray-100 hover:text-gray-600
            dark:text-gray-500 dark:hover:bg-[#1a1c1e] dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-gray-800 dark:text-gray-100">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {view === 'register' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" placeholder="Juan Dela Cruz" />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" placeholder="juan@example.com" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Password</label>
              <input type="password" className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" placeholder="••••••••" />
            </div>

            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-colors mt-2 shadow-lg shadow-teal-900/20">
              {view === 'login' ? 'Login' : 'Join Filo-Docs'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-teal-600 dark:text-teal-500 hover:underline underline-offset-4"
            >
              {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
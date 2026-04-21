import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react"; 
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const [showPassword, setShowPassword] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);

      if (view === 'login') {
        const userData = {
          ...res.data.user,
          token: res.data.token
        };

        localStorage.setItem("user", JSON.stringify(userData));

        alert("Login Successful!");
        onClose();
        window.location.reload();
      } else {
        alert("Registration Successful! Please login.");
        setView('login');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border-2 
        bg-white border-gray-100 dark:bg-[#242729] dark:border-gray-800 transition-all duration-300">

        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1c1e]">
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-gray-800 dark:text-gray-100">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {view === 'register' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Full Name</label>
                <input 
                  name="fullName"
                  type="text" 
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" 
                  placeholder="Juan Dela Cruz" 
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" 
                placeholder="juan@example.com" 
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-1">Password</label>
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-[#1a1c1e] border-gray-100 dark:border-gray-800 focus:border-teal-600 outline-none transition-colors dark:text-white" 
              />
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[34px] text-gray-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-colors mt-2 shadow-lg shadow-teal-900/20">
              {view === 'login' ? 'Login' : 'Join AyosDocs'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(""); }}
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
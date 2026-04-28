import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { showToast } = useToast();
  const { login } = useAuth();

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

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          access_token: tokenResponse.access_token
        });

        const userData = {
          ...res.data.user,
          token: res.data.token
        };

        login(userData);
        
        showToast({
          type: 'success',
          title: 'Welcome back!',
          message: 'You have successfully logged in with Google.'
        });

        onClose();

      } catch (err) {
        showToast({
          type: 'error',
          title: 'Login Failed',
          message: 'Google login failed. Please try again.'
        });
        setError("Google login failed");
      }
    },
    onError: () => {
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Google Login Failed'
      });
      setError("Google Login Failed");
    }
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, formData);

      if (view === 'login') {
        const userData = {
          ...res.data.user,
          token: res.data.token
        };

        login(userData);

        showToast({
          type: 'success',
          title: 'Login Successful',
          message: 'Welcome back to AyosDocs!'
        });
        onClose();
      } else {
        showToast({
          type: 'success',
          title: 'Account Created',
          message: 'Registration Successful! Please login.'
        });
        setView('login');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: errorMsg
      });
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

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>

        {/* CONTENT */}
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {view === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {view === 'login'
                ? 'Continue tracking your progress and guides'
                : 'Start tracking your requirements easily'}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-500 font-medium">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {view === 'register' && (
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@example.com"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
              />
            </div>

            <div className="relative">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-teal-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
            >
              {view === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-400">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* GOOGLE */}
          <button
            onClick={googleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* SWITCH */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setView(view === 'login' ? 'register' : 'login');
                setError("");
                setFormData({
                  fullName: "",
                  email: "",
                  password: ""
                });
                setShowPassword(false); // ✅ FIXED
              }}
              className="text-sm text-teal-600 hover:underline"
            >
              {view === 'login'
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );

};

export default AuthModal;
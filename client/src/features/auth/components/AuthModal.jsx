import { useEffect } from "react";
import { X } from "lucide-react";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { showToast } = useToast();
  const { login } = useAuth();

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
      }
    },
    onError: () => {
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Google Login Failed'
      });
    }
  });

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
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Sign in to AyosDocs
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Save your progress and access your checklists across all your devices.
            </p>
          </div>

          {/* GOOGLE */}
          <button
            onClick={googleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-4 rounded-xl transition shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );

};

export default AuthModal;
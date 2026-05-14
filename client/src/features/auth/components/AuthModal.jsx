import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

/**
 * Modal component for user authentication via Google OAuth.
 * Orchestrates the login flow and synchronizes the session with the backend server.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Callback to close the modal.
 * @returns {JSX.Element|null} The rendered AuthModal component or null.
 */
const AuthModal = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { showToast } = useToast();
  const { login, isLoggedIn } = useAuth();
  const [isExchanging, setIsExchanging] = useState(false);

  // Defensive closure: ensures the modal closes automatically if the user state becomes truthy.
  // This addresses cases where the manual onClose might not execute as expected.
  useEffect(() => {
    if (isLoggedIn && isOpen) {
      onClose();
    }
  }, [isLoggedIn, isOpen, onClose]);

  // Integration with Google OAuth using the @react-oauth/google library.
  // The 'implicit' flow is used to obtain an access token directly from Google.
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setIsExchanging(true);
      try {
        // Exchange the Google access token for a JWT from the application's backend.
        // This ensures the user is registered or logged in within the local database.
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          access_token: tokenResponse.access_token
        });

        const userData = {
          ...res.data.user,
          token: res.data.token,
          isNewUser: res.data.isNewUser
        };

        // Saving the user session to global state and local storage.
        login(userData);
        
        // Determination of the welcome message is based on whether the user is new.
        // Returning users are greeted with "Welcome back!", even if they haven't finished onboarding.
        const isFirstTime = res.data.isNewUser;

        showToast({
          type: 'success',
          title: isFirstTime ? 'Welcome to AyosDocs!' : 'Welcome back!',
          message: isFirstTime 
            ? 'Your account has been created. Start tracking your documents today!' 
            : 'You have successfully logged in with Google.'
        });

        onClose();

      } catch (error) {
        console.error("Login exchange error:", error);
        showToast({
          type: 'error',
          title: 'Login Failed',
          message: 'Google login failed. Please try again.'
        });
      } finally {
        setIsExchanging(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Google Login Failed'
      });
      setIsExchanging(false);
    }
  });

  // Lock scrolling of the underlying page when the authentication modal is active.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // If the modal is not open, or the user is already logged in, do not render anything.
  if (!isOpen || isLoggedIn) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-ctp-crust/40 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-ctp-mantle/95 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.05)] border border-ctp-surface0/60 overflow-hidden animate-in fade-in zoom-in-95 duration-300 pointer-events-auto">

        {/* CLOSE */}
        <button
          onClick={onClose}
          disabled={isExchanging}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-subtext1 transition-all active:scale-90 disabled:opacity-50 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* CONTENT */}
        <div className="p-10 pt-12 relative">
          
          {/* LOADING OVERLAY */}
          {isExchanging && (
            <div className="absolute inset-0 z-20 bg-ctp-mantle/80 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-ctp-sky-800 mb-4" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-ctp-text tracking-tight">Signing you in...</h3>
                <p className="text-[13px] font-medium text-ctp-subtext1 mt-1.5">Please wait a moment</p>
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight">
              Sign in to AyosDocs
            </h2>

            <p className="text-[14px] font-medium text-ctp-subtext1 mt-2.5 leading-relaxed">
              Save your progress and access your checklists across all your devices.
            </p>
          </div>

          {/* GOOGLE */}
          <button
            onClick={() => !isExchanging && googleLogin()}
            type="button"
            disabled={isExchanging}
            className="w-full flex items-center justify-center gap-3 bg-ctp-mantle border border-ctp-surface2 hover:bg-ctp-surface1 text-ctp-text font-bold py-4 rounded-[20px] transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[11px] font-medium text-ctp-subtext0 leading-relaxed px-4">
            By continuing, you agree to our <span className="text-ctp-subtext1 underline decoration-ctp-surface2 cursor-pointer">Terms of Service</span> and <span className="text-ctp-subtext1 underline decoration-ctp-surface2 cursor-pointer">Privacy Policy</span>.
          </p>

        </div>
      </div>
    </div>
  );

};

export default AuthModal;

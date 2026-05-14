import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

/**
 * Temporary onboarding page.
 * Sets the onboarded state to true in both backend and local state.
 * 
 * @returns {JSX.Element} The rendered Onboarding page.
 */
const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    /**
     * Persists the onboarding status to the backend database.
     */
    const completeOnboarding = async () => {
      if (!user) return;
      
      try {
        await axios.put(`${API_URL}/api/user/onboarding`, 
          { onboarded: true },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // Sync the local state and localStorage with the new onboarding status.
        updateUser({ onboarded: true });
      } catch (error) {
        console.error("Failed to update onboarding status:", error);
      }
    };

    completeOnboarding();
  }, [user, API_URL, updateUser]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-ctp-base">
      <div className="w-20 h-20 bg-ctp-sky-800/10 text-ctp-sky-800 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} strokeWidth={2.5} />
      </div>
      
      <h1 className="text-3xl font-extrabold text-ctp-text mb-4">
        You're all set!
      </h1>
      
      <p className="text-ctp-subtext1 max-w-md mb-10 leading-relaxed font-medium">
        Welcome to AyosDocs. You have successfully completed the onboarding process.
        Your progress will now be saved across all your devices.
      </p>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base px-8 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-ctp-sky-800/10"
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        <span>Return Home</span>
      </button>
    </div>
  );
};

export default Onboarding;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

/**
 * Page component rendered after a successful email verification.
 * Confirms verification via a toast and automatically redirects the user to the Home page.
 * 
 * @returns {JSX.Element} The rendered Verified confirmation page.
 */
const Verified = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Account Verified | AyosDocs";
  }, []);

  // Execution of the verification confirmation and redirection logic.
  useEffect(() => {
    showToast({
      type: 'success',
      title: 'Email Verified',
      message: 'Your account has been successfully verified.'
    });

    // Implementation of an automatic redirection after a 3-second delay.
    // This allows the user time to read the confirmation message.
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Cleanup ensures the timer is cleared if the user manually navigates away.
    return () => clearTimeout(timer);
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base px-4">

      <div className="bg-ctp-mantle border border-ctp-surface0 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-ctp-sky-800/10">
            <CheckCircle className="text-ctp-sky-800" size={32} />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-ctp-text">
          Email verified
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-ctp-subtext0 mt-2 mb-6">
          Your account has been successfully verified. You’ll be redirected shortly.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base font-medium py-3 rounded-xl transition shadow-sm"
        >
          Go to Home
        </button>

        {/* SMALL NOTE */}
        <p className="text-xs text-ctp-subtext0 mt-4">
          Redirecting in 3 seconds...
        </p>

      </div>
    </div>
  );
};

export default Verified;

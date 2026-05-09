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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-100">
            <CheckCircle className="text-teal-600" size={32} />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Email verified
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-2 mb-6">
          Your account has been successfully verified. You’ll be redirected shortly.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl transition"
        >
          Go to Home
        </button>

        {/* SMALL NOTE */}
        <p className="text-xs text-gray-400 mt-4">
          Redirecting in 3 seconds...
        </p>

      </div>
    </div>
  );
};

export default Verified;

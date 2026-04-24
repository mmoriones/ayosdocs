import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Verified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // auto redirect after 3s (optional)
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 rounded-2xl shadow-xl border-2 bg-white border-gray-100 text-center">
        
        <h2 className="text-xl font-black uppercase text-gray-800 mb-2">
          Email Verified 🎉
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Your account has been successfully verified.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Verified;

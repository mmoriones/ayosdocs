import { CheckSquare, Square, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';

const ChecklistCard = ({ title, initialSteps, slug, isFullPage = false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();

  const [steps, setSteps] = useState(initialSteps || []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSavedProgress = async () => {
      // Only fetch if logged in, slug exists, and it's not the default getting-started
      if (!isLoggedIn || !slug || slug === 'getting-started') return;

      const storedUser = JSON.parse(localStorage.getItem("user"));

      try {
        const response = await fetch(`${API_URL}/api/user/get-progress/${slug}`, {
          headers: { 'Authorization': `Bearer ${storedUser.token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // data.completedTasks is a string like "0,1,3"
          const completedIndices = data.completedTasks.split(',').map(Number);

          setSteps(prevSteps => prevSteps.map((step, index) => ({
            ...step,
            completed: completedIndices.includes(index)
          })));
        }
      } catch (error) {
        console.error("Error fetching saved progress:", error);
      }
    };

    fetchSavedProgress();
  }, [isLoggedIn, slug, initialSteps]);

  useEffect(() => {
    if (initialSteps) setSteps(initialSteps);
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, [initialSteps]);

  // Checkbox Logic
  const handleToggleStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].completed = !updatedSteps[index].completed;
    setSteps(updatedSteps);
  };

  // Database Update Logic
  const handleSaveProgress = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please log in to save your progress.");
      setIsAuthModalOpen(true);
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user.token) {
      console.error("Token not found in local storage.");
      return;
    }

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const completedTaskIndices = steps
        .map((s, i) => (s.completed ? i : null))
        .filter((i) => i !== null)
        .join(",");

      const response = await fetch(`${API_URL}/api/user/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          guideSlug: slug,
          completedTasks: completedTaskIndices
        }),
      });

      if (response.ok) {
        alert("Progress saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const progress = Math.round((steps.filter(s => s.completed).length / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {isFullPage
            ? "Requirements List"
            : slug === "getting-started"
              ? "Continue your progress"
              : title}
        </h3>
        <div className="h-px bg-gray-100 mt-3" />
      </div>

      {/* STEPS */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={`${slug}-${step.id || index}`}
            onClick={() => handleToggleStep(index)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            {/* NUMBER / CHECK */}
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold shrink-0
          ${step.completed
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {step.completed ? "✓" : index + 1}
            </div>

            {/* TEXT */}
            <p
              className={`text-sm transition-colors
          ${step.completed
                  ? "text-gray-800 line-through"
                  : "text-gray-600 group-hover:text-gray-800"
                }`}
            >
              {step.task}
            </p>
          </div>
        ))}
      </div>

      {/* PROGRESS */}
      {slug !== "getting-started" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="space-y-3">

        {/* VIEW GUIDE */}
        {slug !== "getting-started" && !isFullPage && (
          <button
            onClick={() => navigate(`/guides/${slug}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 
        text-sm font-medium rounded-lg border border-gray-200 
        text-gray-700 hover:bg-gray-50 transition"
          >
            View Full Guide
            <ArrowRight size={16} />
          </button>
        )}

        {/* AUTH / SAVE */}
        {!isLoggedIn ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 
        text-white text-sm py-2.5 rounded-lg font-medium transition"
          >
            Sign up to save progress
          </button>
        ) : (
          <button
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-2.5 
        text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 
        rounded-lg transition disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : "Save Guide Progress"}
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>

  );
};

export default ChecklistCard;
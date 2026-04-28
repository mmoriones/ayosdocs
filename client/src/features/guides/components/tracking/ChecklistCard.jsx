import { CheckSquare, Square, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../../auth/components/AuthModal';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';

const ChecklistCard = ({ title, initialSteps, slug, isFullPage = false, isModal=false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [steps, setSteps] = useState(initialSteps || []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync initial steps when guide changes
  useEffect(() => {
    if (initialSteps) setSteps(initialSteps);
  }, [initialSteps]);

  // Fetch saved progress
  useEffect(() => {
    const fetchSavedProgress = async () => {
      if (!isLoggedIn || !slug || slug === "getting-started" || !user?.token) return;

      try {
        const response = await fetch(`${API_URL}/api/user/get-progress/${slug}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const completedIndices = data.completedTasks
            ? data.completedTasks.split(",").map(Number)
            : [];

          setSteps((prevSteps) =>
            prevSteps.map((step, index) => ({
              ...step,
              completed: completedIndices.includes(index),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching saved progress:", error);
      }
    };

    fetchSavedProgress();
  }, [isLoggedIn, slug, user]);

  // Toggle step
  const handleToggleStep = (index) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  };

  // Save progress
  const handleSaveProgress = async () => {
    if (!isLoggedIn || !user?.token) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSaving(true);

    try {
      const completedTaskIndices = steps
        .map((s, i) => (s.completed ? i : null))
        .filter((i) => i !== null)
        .join(",");

      const response = await fetch(`${API_URL}/api/user/update-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          guideSlug: slug,
          completedTasks: completedTaskIndices,
        }),
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Progress Saved',
          message: 'Your checklist progress has been updated.'
        });
      } else {
        const errorData = await response.json();
        console.error("Save error:", errorData.message);
        showToast({
          type: 'error',
          title: 'Save Error',
          message: 'Failed to save progress. Please try again.'
        });
      }
    } catch (error) {
      console.error("Failed to save:", error);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'An error occurred while saving. Check your connection.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Progress calculation (safe)
  const progress = steps.length
    ? Math.round(
      (steps.filter((s) => s.completed).length / steps.length) * 100
    )
    : 0;
  const hasCompletedSteps = steps.some((s) => s.completed);

  return (
    <div className={`space-y-5 ${isModal ? "" : "bg-white rounded-2xl border border-gray-100 shadow-sm p-6"}`}>

      {/* HEADER */}
      {!isModal && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {isFullPage
              ? "Requirements List"
              : slug === "getting-started"
                ? "Continue your progress"
                : title}
          </h3>
          <div className="h-px bg-gray-100" />
        </div>
      )}

      {/* STEPS */}
      <div className="max-h-72 overflow-y-auto pr-2">
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[21.5px] top-[10px] bottom-[10px] w-px bg-gray-200"></div>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={`${slug}-${step.id || index}`}
                onClick={() => handleToggleStep(index)}
                className="flex items-center gap-3 cursor-pointer group 
                     py-2.5 px-1 mx-2 rounded-md
                     active:bg-gray-100 relative"
              >
                {/* NUMBER / CHECK */}
                <div
                  className={`z-10 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-medium shrink-0
            ${step.completed
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {step.completed ? "✓" : index + 1}
                </div>

                {/* TEXT */}
                <p
                  className={`text-sm leading-snug transition-colors
            ${step.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-800 group-hover:text-gray-800"
                    }`}
                >
                  {step.task}
                </p>
              </div>
            ))}
          </div>
        </div>
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
        {slug !== "getting-started" && !isFullPage && !isModal && (
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
            disabled={isSaving || !hasCompletedSteps}
            className={`w-full flex items-center justify-center gap-2 py-2.5 
              text-sm font-medium text-white rounded-lg transition
              ${hasCompletedSteps
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed"
              }
              disabled:opacity-50`}
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

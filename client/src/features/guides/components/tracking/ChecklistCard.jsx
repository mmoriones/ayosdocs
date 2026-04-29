import { CheckSquare, Square, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthModal from '../../../auth/components/AuthModal';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';

const ChecklistCard = ({ title, initialSteps, slug, isFullPage = false, isModal=false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { user, isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState(initialSteps || []);

  // Use TanStack Query to fetch saved progress
  const { data: savedData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['progress', slug, user?.token],
    queryFn: async () => {
      if (!isLoggedIn || !slug || slug === "getting-started" || !user?.token) return null;
      
      const response = await fetch(`${API_URL}/api/user/get-progress/${slug}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!isLoggedIn && !!slug && slug !== "getting-started" && !!user?.token,
  });

  // Sync steps from initialSteps and savedData
  useEffect(() => {
    if (!initialSteps) return;

    const completedIndices = savedData?.completedTasks
      ? savedData.completedTasks.split(",").filter(s => s !== "").map(Number)
      : [];

    setSteps(initialSteps.map((step, index) => ({
      ...step,
      completed: completedIndices.includes(index),
    })));
  }, [initialSteps, savedData, slug]);

  // Use TanStack Query for saving progress
  const saveMutation = useMutation({
    mutationFn: async (completedTaskIndices) => {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save progress');
      }
      return response.json();
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Progress Saved',
        message: 'Your checklist progress has been updated.'
      });
      // Invalidate both the single guide progress and the global user data
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
    },
    onError: (error) => {
      console.error("Save error:", error.message);
      showToast({
        type: 'error',
        title: 'Save Error',
        message: error.message || 'Failed to save progress. Please try again.'
      });
    }
  });

  // Toggle step
  const handleToggleStep = (index) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  };

  // Save progress
  const handleSaveProgress = () => {
    if (!isLoggedIn || !user?.token) {
      openAuthModal();
      return;
    }

    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    saveMutation.mutate(completedTaskIndices);
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
        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-teal-600" size={24} />
          </div>
        ) : (
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[22px] top-[10px] bottom-[10px] w-px bg-gray-200"></div>

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
        )}
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
            onClick={openAuthModal}
            className="w-full bg-teal-600 hover:bg-teal-700 
                text-white text-sm py-2.5 rounded-lg font-medium transition"
          >
            Sign up to save progress
          </button>
        ) : (
          <button
            onClick={handleSaveProgress}
            disabled={saveMutation.isPending || !hasCompletedSteps}
            className={`w-full flex items-center justify-center gap-2 py-2.5 
              min-h-[44px] text-sm font-medium text-white rounded-lg transition-all duration-200
              ${hasCompletedSteps
                ? "bg-teal-600 hover:bg-teal-700 active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed"
              }
              disabled:opacity-70 disabled:cursor-wait`}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving Progress...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Guide Progress</span>
              </>
            )}
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </div>

  );
};

export default ChecklistCard;

import { 
  Check, 
  Bookmark, 
  BookOpen, 
  Lock, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight, 
  Save, 
  Loader2,
  Scan,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { getGuideIcon } from '../../../../utils/guideIcons';

/**
 * Component for rendering and managing a guide's checklist.
 * Handles progress fetching, local state tracking, and saving updates to the server.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.title - The title of the guide.
 * @param {Array<{task: string}>} props.initialSteps - The raw list of tasks from the guide data.
 * @param {string} props.slug - The unique identifier for the guide.
 * @param {boolean} [props.inGuidePage=false] - Whether the card is displayed within a full guide page.
 * @param {boolean} [props.isModal=false] - Whether the card is rendered inside a mobile modal.
 * @returns {JSX.Element} The rendered ChecklistCard component.
 */
const ChecklistCard = ({ title, initialSteps, slug, inGuidePage = false, isModal = false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local state manages the checked/unchecked status of steps before saving.
  const [steps, setSteps] = useState(initialSteps || []);
  const icon = getGuideIcon(slug);

  // TanStack Query handles fetching the user's saved progress from the backend.
  // Using a query key ensures data is cached and invalidated correctly across components.
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

  // Synchronization of the local checklist state with the data fetched from the server.
  // Indices are parsed from a comma-separated string stored in the database.
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

  // Mutation for persisting checklist changes to the database.
  // Success triggers a toast notification and invalidates relevant queries to refresh data.
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
      // Invalidation of queries ensures that other parts of the UI (like dashboards) reflect the update.
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

  // Calculation of indices helps enforce a sequential completion workflow.
  // Users are encouraged to complete tasks in order.
  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const lastCompletedIndex = nextStepIndex === -1 
    ? (steps.length > 0 ? steps.length - 1 : -1) 
    : nextStepIndex - 1;

  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  /**
   * Toggles the completion status of a step.
   * Logic restricts actions to the current "next" step or the "last" completed step.
   * 
   * @param {number} index - The index of the step being toggled.
   */
  const handleStepAction = (index) => {
    const isNext = index === nextStepIndex;
    const isLast = index === lastCompletedIndex;

    // Enforcing sequential progression by ignoring clicks on non-adjacent steps.
    if (!isNext && !isLast) return;

    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  };

  /**
   * Prepares and sends the current checklist state to the backend.
   * Prompts the user to login if a session is not active.
   */
  const handleSaveProgress = () => {
    if (!isLoggedIn || !user?.token) {
      openAuthModal();
      return;
    }

    // Mapping indices of completed steps into a string format for storage.
    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    saveMutation.mutate(completedTaskIndices);
  };

  // Progress calculation
  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;
  const hasCompletedSteps = steps.some((s) => s.completed);

  if (isLoadingProgress) {
    return (
      <div className={`flex items-center justify-center py-16 ${isModal ? "" : "bg-white rounded-2xl border border-gray-100 shadow-sm"}`}>
        <Loader2 className="animate-spin text-teal-600" size={28} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden ${isModal ? "" : "bg-white rounded-3xl border border-gray-100 shadow-sm transition-all"}`}>
      
      {/* HEADER SECTION */}
      {!isModal && (
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {inGuidePage ? (slug === "getting-started" ? "Your journey" : "Requirements List") : "Your Progress"}
            </h3>
            
            {!inGuidePage && (
              <button 
                onClick={() => navigate('/my-progress')}
                className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 uppercase tracking-tighter"
              >
                Dashboard <ChevronRight size={12} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 w-full">
              {!inGuidePage && (
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-xs p-2.5">
                  <img src={icon} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="space-y-1 flex-1">
                {!isModal && !inGuidePage && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    Continue your last guide
                  </p>
                )}
                
                <h4 className="text-[15px] font-bold text-gray-900 leading-tight">
                  {slug === "getting-started" ? "Getting Started" : title}
                </h4>
                
                {isLoggedIn ? (
                  <p className="text-[11px] font-bold text-teal-600">
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400 font-medium">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>

              {!inGuidePage && isLoggedIn && (
                <button className="p-2 text-gray-300 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-gray-100 transition shrink-0 bg-white shadow-xs active:scale-95">
                  <Bookmark size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS BAR (Logged in only) */}
      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${isModal ? "px-0" : "px-5"} mt-4 mb-2`}>
          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-teal-600 shrink-0">{progress}%</span>
          </div>
        </div>
      )}

      {/* AUTH BANNER (Guest only) */}
      {!isLoggedIn && (
        <div className={`${isModal ? "px-0" : "px-4"} mt-4`}>
          <div className="bg-teal-50/50 border border-teal-100/30 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-600 shadow-sm shrink-0">
              <Lock size={14} />
            </div>
            <p className="text-[10px] font-semibold text-teal-800 leading-tight">
              Sign up to track <br className="hidden sm:block" /> your progress.
            </p>
          </div>
        </div>
      )}

      {/* CHECKLIST ITEMS - Hidden in compact mode on home page */}
      {(inGuidePage || isModal) && (
        <div className={`${isModal ? "px-0 py-3" : "px-5 py-4"} space-y-1 ${inGuidePage || isModal ? "" : "max-h-[380px] overflow-y-auto custom-scrollbar"}`}>
          {steps.map((step, index) => {
            const isNextStep = index === nextStepIndex;
            const isLastStep = index === lastCompletedIndex;
            const isClickable = isNextStep || isLastStep;

            return (
              <div 
                key={index}
                onClick={() => handleStepAction(index)}
                className={`flex items-start gap-4 p-2.5 rounded-2xl transition-all duration-200 group
                  ${isNextStep ? "bg-teal-50/50 border border-teal-100/50" : "border border-transparent"}
                  ${isClickable ? "cursor-pointer hover:bg-gray-50 hover:border-gray-100" : "cursor-default"}
                  ${!isClickable && !step.completed ? "opacity-50" : ""}
                `}
              >
                <div className="shrink-0 mt-0.5">
                  {step.completed ? (
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : isNextStep ? (
                    <div className="w-5 h-5 rounded-full border-2 border-teal-600 flex items-center justify-center bg-white shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pt-0.5">
                  <p className={`text-[13px] font-medium leading-relaxed transition-colors
                    ${step.completed ? "text-gray-400 line-through" : isNextStep ? "text-teal-900 font-bold" : "text-gray-700 group-hover:text-gray-900"}
                  `}>
                    {step.task}
                  </p>
                  {isNextStep && (
                    <p className="text-[10px] font-bold text-teal-600 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-teal-600" />
                      {index === 0 ? "Start here" : index === steps.length - 1 ? "Final requirement" : "Next requirement"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEXT STEP HIGHLIGHT - Only show in compact mode on home page or in guide page */}
      {nextStep && (inGuidePage || (!isModal && !inGuidePage)) && (
        <div className={`${isModal ? "px-0" : "px-5"} mb-5 mt-2`}>
          <div 
            className={`flex items-start gap-2.5 p-3 rounded-xl border transition shadow-sm bg-teal-50/40 border-teal-100/50
              ${(!inGuidePage && !isModal) ? "cursor-pointer hover:bg-teal-100/30" : "cursor-default"}
            `}
            onClick={() => {
              if (!inGuidePage && !isModal) {
                navigate(`/guides/${slug}`);
              }
            }}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600/10 flex items-center justify-center text-teal-600">
                <Scan size={14} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-teal-900 line-clamp-1">{nextStep.task}</p>
              <p className="text-[10px] font-bold text-teal-600 mt-0.5">
                {nextStepIndex === 0 ? "First step" : nextStepIndex === steps.length - 1 ? "Final step" : "Next step"}
              </p>
            </div>
            {!inGuidePage && !isModal && <ChevronRight size={14} className="text-gray-400 self-center" />}
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS - Only show button to go to checklist when in compact mode on home page */}
      {!inGuidePage && !isModal && (
        <div className="px-5 pb-5 pt-0">
          <button 
            onClick={() => navigate(`/guides/${slug}`)}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-[13px] transition flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98]"
          >
            Go to checklist
          </button>
        </div>
      )}

      {/* FULL FOOTER ACTIONS - Hidden in compact mode */}
      {(inGuidePage || isModal) && (
        <div className={`${isModal ? "px-0 pb-6" : "p-4"} pt-1.5 mt-auto`}>
        <div className="space-y-2.5">
          {progress === 100 ? (
            <div className="mt-6 bg-teal-50/50 border border-teal-100/50 rounded-3xl p-6 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100">
                <Check size={20} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <p className="text-[15px] font-bold text-teal-900">Requirements Complete!</p>
                <p className="text-[12px] text-teal-700 font-medium px-4">
                  You've successfully checked off all items for this guide.
                </p>
              </div>
              
              <div className="w-full pt-1 space-y-2">
                {isLoggedIn ? (
                  <button 
                    onClick={handleSaveProgress}
                    disabled={saveMutation.isPending}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.95] shadow-sm shadow-teal-100"
                  >
                    {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saveMutation.isPending ? "Saving..." : "Save Progress"}
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.95] shadow-sm shadow-teal-100"
                  >
                    <UserPlus size={16} />
                    Sign up to track this
                  </button>
                )}

                {!inGuidePage && (
                  <button 
                    onClick={() => navigate(`/guides/${slug}`)}
                    className="w-full bg-white border border-teal-200 text-teal-700 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.95]"
                  >
                    <BookOpen size={16} />
                    Open Guide
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm shadow-teal-100"
                  >
                    <UserPlus size={16} />
                    Create Account
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[9px] font-semibold text-gray-400">
                    <ShieldCheck size={10} className="text-teal-600/50" />
                    <span>Free • Secure • Quick</span>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleSaveProgress}
                  disabled={saveMutation.isPending || !hasCompletedSteps}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-[0.98]
                    ${hasCompletedSteps 
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-100" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                    disabled:opacity-70 disabled:cursor-wait
                  `}
                >
                  {saveMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saveMutation.isPending ? "Saving..." : "Save Progress"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      )}

    </div>
  );
};

export default ChecklistCard;

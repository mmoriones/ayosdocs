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
      <div className={`flex items-center justify-center py-12 ${isModal ? "" : "bg-ctp-base rounded-2xl border border-ctp-surface0 shadow-sm"}`}>
        <Loader2 className="animate-spin text-ctp-green" size={28} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden ${isModal ? "" : "bg-ctp-mantle rounded-[2rem] border border-ctp-surface0 shadow-sm transition-all"}`}>
      
      {/* HEADER SECTION */}
      {!isModal && (
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-widest leading-none">
              {inGuidePage ? (slug === "getting-started" ? "Your journey" : "Requirements List") : "Your Progress"}
            </h3>
            
            {!inGuidePage && (
              <button 
                onClick={() => navigate('/my-progress')}
                className="text-[14px] font-bold text-ctp-green hover:text-ctp-green-500 flex items-center gap-0.5 uppercase tracking-tighter"
              >
                Dashboard <ChevronRight size={12} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 w-full">
              {!inGuidePage && (
                <div className="w-12 h-12 rounded-xl bg-ctp-base flex items-center justify-center shrink-0 border border-ctp-surface0 shadow-xs p-2.5">
                  <img src={icon} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="space-y-1 flex-1">
                {!isModal && !inGuidePage && (
                  <p className="text-[14px] text-ctp-subtext0 font-bold uppercase tracking-tighter">
                    Continue your last guide
                  </p>
                )}
                
                <h4 className="text-[18px] font-bold text-ctp-text leading-tight">
                  {slug === "getting-started" ? "Getting Started" : title}
                </h4>
                
                {isLoggedIn ? (
                  <p className="text-[14px] font-bold text-ctp-green">
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-[14px] text-ctp-subtext1 font-medium">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>

              {!inGuidePage && isLoggedIn && (
                <button className="p-2 text-ctp-subtext0 hover:text-ctp-green hover:bg-ctp-surface0 rounded-xl border border-ctp-surface0 transition shrink-0 bg-ctp-base shadow-xs active:scale-95">
                  <Bookmark size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS BAR (Logged in only) */}
      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${isModal ? "px-0" : "px-6"} mt-4 mb-2`}>
          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-2 bg-ctp-surface0 rounded-full overflow-hidden">
              <div 
                className="h-full bg-ctp-green rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[14px] font-bold text-ctp-green shrink-0">{progress}%</span>
          </div>
        </div>
      )}

      {/* AUTH BANNER (Guest only) */}
      {!isLoggedIn && (
        <div className={`${isModal ? "px-0" : "px-4"} mt-4`}>
          <div className="bg-ctp-green/10 border border-ctp-green/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-green shadow-sm shrink-0">
              <Lock size={14} />
            </div>
            <p className="text-[14px] font-semibold text-ctp-green leading-tight">
              Sign up to track <br className="hidden sm:block" /> your progress.
            </p>
          </div>
        </div>
      )}

      {/* CHECKLIST ITEMS - Hidden in compact mode on home page */}
      {(inGuidePage || isModal) && (
        <div className={`${isModal ? "px-0 py-4" : "px-6 py-6"} space-y-2 ${inGuidePage || isModal ? "" : "max-h-[380px] overflow-y-auto custom-scrollbar"}`}>
          {steps.map((step, index) => {
            const isNextStep = index === nextStepIndex;
            const isLastStep = index === lastCompletedIndex;
            const isClickable = isNextStep || isLastStep;

            return (
              <div 
                key={index}
                onClick={() => handleStepAction(index)}
                className={`flex items-start gap-4 p-3 rounded-2xl transition-all duration-200 group
                  ${isNextStep ? "bg-ctp-green/5 border border-ctp-green/20" : "border border-transparent"}
                  ${isClickable ? "cursor-pointer hover:bg-ctp-surface0" : "cursor-default"}
                  ${!isClickable && !step.completed ? "opacity-50" : ""}
                `}
              >
                <div className="shrink-0 mt-0.5">
                  {step.completed ? (
                    <div className="w-6 h-6 rounded-full bg-ctp-green flex items-center justify-center text-ctp-base shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : isNextStep ? (
                    <div className="w-6 h-6 rounded-full border-2 border-ctp-green flex items-center justify-center bg-ctp-base shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-ctp-green animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-ctp-surface1 bg-ctp-base flex items-center justify-center text-[14px] font-bold text-ctp-subtext0">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pt-0.5">
                  <p className={`text-[18px] font-medium leading-relaxed transition-colors
                    ${step.completed ? "text-ctp-subtext1 line-through" : isNextStep ? "text-ctp-text font-bold" : "text-ctp-text group-hover:text-ctp-green"}
                  `}>
                    {step.task}
                  </p>
                  {isNextStep && (
                    <p className="text-[14px] font-bold text-ctp-green mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ctp-green" />
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
        <div className={`${isModal ? "px-0" : "px-6"} mb-6 mt-2`}>
          <div 
            className={`flex items-start gap-3 p-4 rounded-xl border transition shadow-sm bg-ctp-green/5 border-ctp-green/20
              ${(!inGuidePage && !isModal) ? "cursor-pointer hover:bg-ctp-green/10" : "cursor-default"}
            `}
            onClick={() => {
              if (!inGuidePage && !isModal) {
                navigate(`/guides/${slug}`);
              }
            }}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-lg bg-ctp-green/10 flex items-center justify-center text-ctp-green">
                <Scan size={18} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[18px] font-bold text-ctp-text line-clamp-1">{nextStep.task}</p>
              <p className="text-[14px] font-bold text-ctp-green mt-0.5">
                {nextStepIndex === 0 ? "First step" : nextStepIndex === steps.length - 1 ? "Final step" : "Next step"}
              </p>
            </div>
            {!inGuidePage && !isModal && <ChevronRight size={18} className="text-ctp-subtext0 self-center" />}
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS - Only show button to go to checklist when in compact mode on home page */}
      {!inGuidePage && !isModal && (
        <div className="px-6 pb-6 pt-0">
          <button 
            onClick={() => navigate(`/guides/${slug}`)}
            className="w-full bg-ctp-base border border-ctp-surface0 text-ctp-text py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 hover:bg-ctp-surface0 active:scale-[0.98]"
          >
            Go to checklist
          </button>
        </div>
      )}

      {/* FULL FOOTER ACTIONS - Hidden in compact mode */}
      {(inGuidePage || isModal) && (
        <div className={`${isModal ? "px-0 pb-8" : "p-6"} pt-2 mt-auto`}>
        <div className="space-y-4">
          {progress === 100 ? (
            <div className="mt-8 bg-ctp-green/5 border border-ctp-green/20 rounded-[2rem] p-8 flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-12 h-12 rounded-full bg-ctp-green flex items-center justify-center text-ctp-base shadow-md">
                <Check size={24} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <p className="text-[18px] font-bold text-ctp-text">Requirements Complete!</p>
                <p className="text-[14px] text-ctp-subtext1 font-medium px-4">
                  You've successfully checked off all items for this guide.
                </p>
              </div>
              
              <div className="w-full pt-2 space-y-3">
                {isLoggedIn ? (
                  <button 
                    onClick={handleSaveProgress}
                    disabled={saveMutation.isPending}
                    className="w-full bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 active:scale-[0.95] shadow-lg"
                  >
                    {saveMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {saveMutation.isPending ? "Saving..." : "Save Progress"}
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 active:scale-[0.95] shadow-lg"
                  >
                    <UserPlus size={20} />
                    Sign up to track this
                  </button>
                )}

                {!inGuidePage && (
                  <button 
                    onClick={() => navigate(`/guides/${slug}`)}
                    className="w-full bg-ctp-base border border-ctp-green/20 text-ctp-green py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 active:scale-[0.95]"
                  >
                    <BookOpen size={20} />
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
                    className="w-full bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
                  >
                    <UserPlus size={20} />
                    Create Account
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[14px] font-semibold text-ctp-subtext0">
                    <ShieldCheck size={14} className="text-ctp-green/50" />
                    <span>Free • Secure • Quick</span>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleSaveProgress}
                  disabled={saveMutation.isPending || !hasCompletedSteps}
                  className={`w-full py-4 rounded-xl font-bold text-[18px] transition flex items-center justify-center gap-2 active:scale-[0.98]
                    ${hasCompletedSteps 
                      ? "bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base shadow-lg" 
                      : "bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed"}
                    disabled:opacity-70 disabled:cursor-wait
                  `}
                >
                  {saveMutation.isPending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
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

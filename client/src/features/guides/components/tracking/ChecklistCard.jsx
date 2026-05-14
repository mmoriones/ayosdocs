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
 * @param {boolean} [props.isBare=false] - Whether to remove card-like container and styling.
 * @returns {JSX.Element} The rendered ChecklistCard component.
 */
const ChecklistCard = ({ 
  title, 
  initialSteps, 
  slug, 
  agency,
  inGuidePage = false, 
  isModal = false,
  isBare = false 
}) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local state manages the checked/unchecked status of steps before saving.
  const [steps, setSteps] = useState(initialSteps || []);
  const icon = getGuideIcon(slug, agency);

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

  // Dynamic Content based on purpose
  const cardLabel = inGuidePage 
    ? (slug === "getting-started" ? "Your Journey" : "Requirements Tracker") 
    : "Your Progress";

  if (isLoadingProgress) {
    return (
      <div className={`flex items-center justify-center py-12 ${isModal || isBare ? "" : "bg-ctp-base rounded-[2.5rem] border border-ctp-surface0 soft-shadow"}`}>
        <Loader2 className="animate-spin text-ctp-sapphire" size={28} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-[2.5rem] border border-ctp-surface0 soft-shadow"
    }`}>
      
      {/* HEADER SECTION */}
      {!isModal && !isBare && (
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] leading-none">
              {cardLabel}
            </h3>
            
            {!inGuidePage && (
              <button 
                onClick={() => navigate('/my-progress')}
                className="text-[11px] font-black text-ctp-sapphire hover:text-ctp-blue flex items-center gap-1 uppercase tracking-widest transition-colors"
              >
                Dashboard <ChevronRight size={14} strokeWidth={3} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5 w-full">
              {/* Agency Icon: Hide in guide page to avoid redundancy */}
              {!inGuidePage && (
                <div className="w-16 h-16 rounded-2xl bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface0 shadow-sm p-4">
                  <img src={icon} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="space-y-2 flex-1">
                {!isModal && !inGuidePage && (
                  <p className="text-[11px] text-ctp-subtext0 font-black uppercase tracking-widest">
                    Continue where you left off
                  </p>
                )}
                
                {/* Title: Only show if NOT in a guide page (Home view) or if in a Modal (context for mobile) */}
                {(!inGuidePage || isModal) && (
                  <h4 className="font-black text-ctp-text leading-tight uppercase tracking-tight text-[22px]">
                    {slug === "getting-started" ? "Getting Started" : title}
                  </h4>
                )}
                
                {isLoggedIn ? (
                  <p className={`font-black text-ctp-sapphire uppercase tracking-tight ${inGuidePage && !isModal ? "text-[16px]" : "text-[14px]"}`}>
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-[14px] text-ctp-subtext1 font-bold uppercase tracking-tight opacity-80">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>

              {/* Bookmark Toggle: Hide in guide page as it's in the page header */}
              {!inGuidePage && isLoggedIn && (
                <button className="p-3 text-ctp-subtext1 hover:text-ctp-sapphire hover:bg-ctp-mantle rounded-xl border border-ctp-surface0 transition-all shrink-0 bg-ctp-base shadow-sm active:scale-95">
                  <Bookmark size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* PROGRESS BAR (Logged in only) */}
      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-8"} mt-8 mb-2`}>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-ctp-mantle rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(32,159,181,0.2)] ${
                  progress === 100 ? 'bg-ctp-mauve shadow-ctp-mauve/20' : 'bg-ctp-sapphire'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-[14px] font-black shrink-0 tracking-widest ${
              progress === 100 ? 'text-ctp-mauve' : 'text-ctp-sapphire'
            }`}>{progress}%</span>
          </div>
        </div>
      )}

      {/* AUTH BANNER (Guest only) */}
      {!isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-8"} mt-8`}>
          <div className="bg-ctp-sapphire/5 border border-ctp-sapphire/10 rounded-2xl p-6 flex items-center gap-5 group cursor-pointer hover:bg-ctp-sapphire/10 transition-all soft-shadow" onClick={openAuthModal}>
            <div className="w-12 h-12 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-sapphire shadow-sm shrink-0 border border-ctp-surface0 group-hover:scale-110 transition-transform">
              <Lock size={20} strokeWidth={3} />
            </div>
            <p className="text-[14px] font-black text-ctp-sapphire leading-tight uppercase tracking-tight">
              Sign up to track <br /> your progress
            </p>
          </div>
        </div>
      )}

      {/* CHECKLIST ITEMS - Only show in guide, modal, or bare mode */}
      {(inGuidePage || isModal || isBare) && (
        <div className={`
          ${(isModal || isBare) ? "px-0 py-8" : "px-8 py-10"} 
          space-y-3 
          ${(inGuidePage && !isBare) ? "lg:max-h-[480px] overflow-y-auto custom-scrollbar" : ""}
        `}>
          {steps.map((step, index) => {
            const isNextStep = index === nextStepIndex;
            const isLastStep = index === lastCompletedIndex;
            const isClickable = isNextStep || isLastStep;

            return (
              <div 
                key={index}
                onClick={() => handleStepAction(index)}
                className={`flex items-start gap-5 p-5 rounded-2xl transition-all duration-200 group border
                  ${isNextStep ? "bg-ctp-sapphire/5 border-ctp-sapphire/20 soft-shadow" : "border-transparent"}
                  ${isClickable ? "cursor-pointer hover:bg-ctp-mantle" : "cursor-default"}
                  ${!isClickable && !step.completed ? "opacity-50" : ""}
                `}
              >
                <div className="shrink-0 mt-1">
                  {step.completed ? (
                    <div className="w-7 h-7 rounded-full bg-ctp-mauve flex items-center justify-center text-ctp-base shadow-lg shadow-ctp-mauve/20">
                      <Check size={16} strokeWidth={4} />
                    </div>
                  ) : isNextStep ? (
                    <div className="w-7 h-7 rounded-full border-2 border-ctp-sapphire flex items-center justify-center bg-ctp-base shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-ctp-sapphire animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-ctp-surface0 bg-ctp-base flex items-center justify-center text-[12px] font-black text-ctp-subtext0">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`text-[16px] font-bold leading-relaxed transition-colors tracking-tight
                    ${step.completed ? "text-ctp-subtext1 line-through" : "text-ctp-text group-hover:text-ctp-sapphire"}
                  `}>
                    {step.task}
                  </p>
                  {isNextStep && (
                    <p className="text-[12px] font-black text-ctp-sapphire mt-1.5 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-ctp-sapphire animate-pulse" />
                      {index === 0 ? "Start journey" : index === steps.length - 1 ? "Final requirement" : "Next requirement"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEXT STEP HIGHLIGHT - Only show in Home View */}
      {nextStep && !inGuidePage && !isModal && (
        <div className="px-8 mb-10 mt-4">
          <div 
            className="flex items-start gap-5 p-6 rounded-2xl border bg-ctp-sapphire/5 border-ctp-sapphire/20 cursor-pointer hover:bg-ctp-sapphire/10 transition-all soft-shadow group"
            onClick={() => navigate(`/guides/${slug}`)}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-surface0 flex items-center justify-center text-ctp-sapphire shadow-sm group-hover:scale-110 transition-transform">
                <Scan size={24} strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-black text-ctp-text line-clamp-1 uppercase tracking-tight">{nextStep.task}</p>
              <p className="text-[12px] font-black text-ctp-sapphire mt-1.5 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ctp-sapphire" />
                {nextStepIndex === 0 ? "Begin here" : nextStepIndex === steps.length - 1 ? "Last step" : "Next step"}
              </p>
            </div>
            <ChevronRight size={22} className="text-ctp-subtext1 self-center group-hover:translate-x-1 transition-transform" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS - Home View Only */}
      {!inGuidePage && !isModal && (
        <div className="px-8 pb-8 pt-0">
          <button 
            onClick={() => navigate(`/guides/${slug}`)}
            className="w-full bg-ctp-mantle border border-ctp-surface0 text-ctp-text py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-ctp-surface0 active:scale-[0.98] shadow-sm"
          >
            Continue Workflow
          </button>
        </div>
      )}

      {/* FULL FOOTER ACTIONS - Guide Page, Modal, or Bare */}
      {(inGuidePage || isModal || isBare) && (
        <div className={`${(isModal || isBare) ? "px-0 pb-10" : "p-10"} pt-4 mt-auto`}>
        <div className="space-y-6">
          {progress === 100 ? (
            <div className="bg-ctp-mauve/5 border border-ctp-mauve/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 soft-shadow">
              <div className="w-16 h-16 rounded-full bg-ctp-mauve flex items-center justify-center text-ctp-base shadow-xl shadow-ctp-mauve/20">
                <Check size={32} strokeWidth={4} />
              </div>
              <div className="space-y-2">
                <p className="text-[22px] font-black text-ctp-text uppercase tracking-tight">Requirement Complete!</p>
                {isLoggedIn ? (
                  <p className="text-[14px] text-ctp-subtext1 font-bold uppercase tracking-tight px-6 leading-relaxed opacity-80">
                    You've successfully completed all requirements. Your progress is synced to the cloud.
                  </p>
                ) : (
                  <p className="text-[14px] text-ctp-mauve font-black uppercase tracking-tight px-4 leading-relaxed">
                    Excellent work! Sign up now to permanently save your progress.
                  </p>
                )}
              </div>
              
              <div className="w-full pt-4">
                {isLoggedIn ? (
                  <button 
                    onClick={handleSaveProgress}
                    disabled={saveMutation.isPending}
                    className="w-full bg-ctp-mauve hover:bg-ctp-mauve/90 text-ctp-base py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.95] shadow-xl shadow-ctp-mauve/20"
                  >
                    {saveMutation.isPending ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} strokeWidth={3} />}
                    {saveMutation.isPending ? "Syncing..." : "Update Journey"}
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-ctp-mauve hover:bg-ctp-mauve/90 text-ctp-base py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.95] shadow-xl shadow-ctp-mauve/20"
                  >
                    <UserPlus size={24} strokeWidth={3} />
                    Sign up to Save
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-ctp-sapphire hover:bg-ctp-blue text-ctp-base py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-ctp-sapphire/20"
                  >
                    <UserPlus size={24} strokeWidth={3} />
                    Create Free Account
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] opacity-60">
                    <ShieldCheck size={14} className="text-ctp-sapphire" strokeWidth={3} />
                    <span>Secure Cloud Sync</span>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleSaveProgress}
                  disabled={saveMutation.isPending || !hasCompletedSteps}
                  className={`w-full py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl
                    ${hasCompletedSteps 
                      ? "bg-ctp-sapphire hover:bg-ctp-blue text-ctp-base shadow-ctp-sapphire/20" 
                      : "bg-ctp-mantle text-ctp-subtext0 cursor-not-allowed shadow-none border border-ctp-surface0"}
                    disabled:opacity-70 disabled:cursor-wait
                  `}
                >
                  {saveMutation.isPending ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Save size={24} strokeWidth={3} />
                  )}
                  {saveMutation.isPending ? "Syncing..." : "Save Progress"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      )}

    </div>
  );
};

export default ChecklistCard;

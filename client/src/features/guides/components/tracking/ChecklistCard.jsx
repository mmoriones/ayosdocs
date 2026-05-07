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
  Landmark,
  FileText,
  CreditCard,
  UserCircle,
  ReceiptText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthModal from '../../../auth/components/AuthModal';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';

// Icon mapping based on slug to match TrendingGuides.jsx
const getGuideIcon = (slug) => {
  const mapping = {
    'nbi-clearance': FileText,
    'passport-appointment': BookOpen,
    'sss-registration': ShieldCheck,
    'umid-application': CreditCard,
    'philhealth-application': UserCircle,
    'digital-tin': ReceiptText,
  };
  return mapping[slug] || Landmark;
};

const ChecklistCard = ({ title, initialSteps, slug, inGuidePage = false, isModal = false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { user, isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState(initialSteps || []);
  const GuideIcon = getGuideIcon(slug);

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

  // Find next step and last completed step
  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const lastCompletedIndex = nextStepIndex === -1 
    ? (steps.length > 0 ? steps.length - 1 : -1) 
    : nextStepIndex - 1;

  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  // Handle step completion/uncompletion sequentially
  const handleStepAction = (index) => {
    const isCompleted = steps[index].completed;
    const isNext = index === nextStepIndex;
    const isLast = index === lastCompletedIndex;

    if (!isNext && !isLast) return;

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
    <div className={`flex flex-col overflow-hidden ${isModal ? "" : "bg-white rounded-2xl border border-gray-100 shadow-sm"}`}>
      
      {/* HEADER SECTION */}
      {!isModal && (
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                <GuideIcon size={22} className="text-teal-600" />
              </div>
              
              <div className="space-y-1">
                {!isModal && !inGuidePage && (
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                      Recent Activity
                    </p>
                  </div>
                )}
                
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                  {slug === "getting-started" ? "Continue your progress" : inGuidePage ? "Requirements List" : title}
                </h3>
                
                {isLoggedIn ? (
                  <p className="text-[11px] font-bold text-teal-600/80">
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 font-medium">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>
            </div>
            
            {isLoggedIn && (
              <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-gray-100 transition shrink-0 bg-white shadow-sm active:scale-95">
                <Bookmark size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PROGRESS BAR (Logged in only) */}
      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${isModal ? "px-0" : "px-4"} mt-4`}>
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

      {/* CHECKLIST ITEMS */}
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

      {/* NEXT STEP HIGHLIGHT */}
      {nextStep && (
        <div className={`${isModal ? "px-0" : "px-4"} mb-3`}>
          <div 
            className={`flex items-start gap-2.5 p-2 rounded-xl border transition shadow-sm bg-teal-50/40 border-teal-100/50
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

      {/* FOOTER ACTIONS */}
      <div className={`${isModal ? "px-0 pb-6" : "p-4"} pt-1.5 mt-auto`}>
        <div className="space-y-2.5">
          {progress === 100 ? (
            <div className="bg-teal-50/50 border border-teal-100/50 rounded-2xl p-5 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200/50">
                <Check size={24} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-teal-900">Requirements Complete!</p>
                <p className="text-xs text-teal-700 font-medium px-4">
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </div>
  );
};

export default ChecklistCard;

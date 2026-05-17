'use client';

import { 
  Check, 
  Bookmark, 
  Lock, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight, 
  Save, 
  Loader2,
  Scan,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import { useToast } from '@/context/ToastContext';
import { getGuideIcon } from '@/lib/guideIcons';
import { updateProgressAction } from '@/app/actions/user';
import Image from 'next/image';
import axios from 'axios';

/**
 * Component for rendering and managing a guide's checklist.
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
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState(initialSteps || []);
  const icon = getGuideIcon(slug, agency);

  const { data: savedData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['progress', slug],
    queryFn: async () => {
      if (!isLoggedIn || !slug || slug === "getting-started") return null;
      const response = await axios.get(`/api/user/get-progress/${slug}`);
      return response.data;
    },
    enabled: isLoggedIn && !!slug && slug !== "getting-started",
  });

  const saveMutation = useMutation({
    mutationFn: async (completedTaskIndices) => {
      const result = await updateProgressAction(slug, completedTaskIndices);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
    },
    onError: (error) => {
      console.error("Save error:", error.message);
      showToast({
        type: 'error',
        title: 'Sync Error',
        message: 'Failed to sync progress. It will retry on your next action.'
      });
    }
  });

  // State synchronization from server/props
  const [prevSlug, setPrevSlug] = useState(slug);
  const [prevSavedTasks, setPrevSavedTasks] = useState(savedData?.completedTasks);

  // Sync state if slug changes (switching guides)
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setSteps(initialSteps || []);
    setPrevSavedTasks(savedData?.completedTasks);
  } 
  // Sync state if server data changes and we aren't currently syncing
  else if (savedData?.completedTasks !== prevSavedTasks && !saveMutation.isPending) {
    setPrevSavedTasks(savedData?.completedTasks);
    
    const completedIndices = savedData?.completedTasks
      ? savedData.completedTasks.split(",").filter(s => s !== "").map(Number)
      : [];

    const nextStepsFromData = (initialSteps || []).map((step, index) => ({
      ...step,
      completed: completedIndices.includes(index),
    }));
    
    // We only update if the current local state is actually different 
    // from what the server just sent us.
    const currentLocalIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    if (savedData?.completedTasks !== currentLocalIndices) {
      setSteps(nextStepsFromData);
    }
  }

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const lastCompletedIndex = nextStepIndex === -1 
    ? (steps.length > 0 ? steps.length - 1 : -1) 
    : nextStepIndex - 1;

  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  const handleStepAction = (index) => {
    const isNext = index === nextStepIndex;
    const isLast = index === lastCompletedIndex;
    if (!isNext && !isLast) return;

    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, completed: !step.completed } : step
    );

    setSteps(newSteps);
  };

  // Debounced Auto-save Effect
  useEffect(() => {
    if (!isLoggedIn || !slug || slug === "getting-started" || !steps.length) return;

    // Don't sync on initial load (when savedData is first applied)
    // We only want to sync when the user interacts
    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    // Compare with what's currently in savedData to avoid redundant calls
    if (savedData?.completedTasks === completedTaskIndices) return;

    const timeout = setTimeout(() => {
      saveMutation.mutate(completedTaskIndices);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [steps, isLoggedIn, slug, savedData?.completedTasks, saveMutation.mutate]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;
  const hasCompletedSteps = steps.some((s) => s.completed);

  const cardLabel = inGuidePage 
    ? (slug === "getting-started" ? "Your Journey" : "Requirements Tracker") 
    : "Your Progress";

  if (isLoadingProgress) {
    return (
      <div className={`flex items-center justify-center py-12 ${isModal || isBare ? "" : "bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm"}`}>
        <Loader2 className="animate-spin text-ctp-sky-800" size={24} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm"
    }`}>
      
      {!isBare && (
        <div className={`${isModal ? "p-0" : "p-6"} pb-0`}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-[0.2em] leading-none">
                {cardLabel}
              </h3>
              {isLoggedIn && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ctp-mantle border border-ctp-surface1">
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 size={10} className="animate-spin text-ctp-sky-800" />
                      <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest">Syncing</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1 h-1 rounded-full bg-ctp-green" />
                      <span className="text-[9px] font-bold text-ctp-subtext0 uppercase tracking-widest">Saved</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {!inGuidePage && (
              <button 
                onClick={() => router.push('/my-docs')}
                className="text-[10px] font-bold text-ctp-sky-800 hover:opacity-80 flex items-center gap-1 uppercase tracking-widest transition-colors"
              >
                Dashboard <ChevronRight size={12} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 w-full">
              {!inGuidePage && (
                <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 shadow-sm p-3">
                  <Image src={icon} alt="" width={32} height={32} className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="space-y-1 flex-1">
                {!isModal && !inGuidePage && (
                  <p className="text-[10px] text-ctp-subtext0 font-semibold uppercase tracking-wider">
                    Continue where you left off
                  </p>
                )}
                
                {(!inGuidePage || isModal) && (
                  <h4 className="font-semibold text-ctp-text leading-tight tracking-tight text-xl">
                    {slug === "getting-started" ? "Getting Started" : title}
                  </h4>
                )}
                
                {isLoggedIn ? (
                  <p className={`font-semibold text-ctp-sky-800 tracking-tight ${inGuidePage && !isModal ? "text-base" : "text-sm"}`}>
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-sm text-ctp-subtext0 font-medium tracking-tight">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>

              {!inGuidePage && isLoggedIn && (
                <button className="p-2 text-ctp-subtext0 hover:text-ctp-sky-800 hover:bg-ctp-mantle rounded-lg border border-ctp-surface1 transition-all shrink-0 bg-ctp-base shadow-sm active:scale-95">
                  <Bookmark size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-6"} mt-6 mb-2`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1">
              <div 
                className="h-full transition-all duration-1000 ease-out bg-ctp-sky-800"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold shrink-0 tracking-wider text-ctp-sky-800">{progress}%</span>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-6"} mt-6`}>
          <div className="bg-ctp-sky-10 border border-ctp-sky-300/20 rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-ctp-sky-50 transition-all shadow-sm" onClick={openAuthModal}>
            <div className="w-10 h-10 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0 border border-ctp-sky-300/20 group-hover:scale-105 transition-transform">
              <Lock size={18} />
            </div>
            <p className="text-sm font-semibold text-ctp-sky-800 leading-tight tracking-tight">
              Sign up to track <br /> your progress
            </p>
          </div>
        </div>
      )}

      {(inGuidePage || isModal || isBare) && (
        <div className={`
          ${(isModal || isBare) ? "px-0 py-4" : "px-6 py-6"} 
          ${(inGuidePage && !isBare) ? "lg:max-h-[520px] overflow-y-auto custom-scrollbar" : ""}
        `}>
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isNextStep = index === nextStepIndex;
              const isLastStep = index === lastCompletedIndex;
              const isClickable = isNextStep || isLastStep;
              const isUpcoming = !step.completed && !isNextStep;

              return (
                <div 
                  key={index}
                  onClick={() => handleStepAction(index)}
                  className={`flex items-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${step.completed ? "bg-ctp-sky-800/[0.03]" : ""}
                    ${isNextStep ? "bg-ctp-sky-800/[0.05]" : ""}
                    ${isClickable ? "cursor-pointer hover:bg-ctp-mantle" : "cursor-default"}
                  `}
                >
                  <div className="shrink-0 mt-0.5">
                    {step.completed ? (
                      <div className="w-6 h-6 rounded-full bg-ctp-sky-800/15 flex items-center justify-center text-ctp-sky-800 transition-all group-hover:scale-110 border border-ctp-sky-800/20 shadow-sm">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    ) : isNextStep ? (
                      <div className="w-6 h-6 rounded-full border-2 border-ctp-sky-800 flex items-center justify-center bg-ctp-base group-hover:border-ctp-sky-300 transition-all shadow-[0_0_12px_rgba(32,159,181,0.15)]">
                        <div className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-ctp-surface1 bg-ctp-mantle flex items-center justify-center text-[10px] font-bold text-ctp-subtext0 transition-colors">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-3">
                      <p className={`text-sm font-semibold leading-relaxed transition-colors tracking-tight
                        ${step.completed ? "text-ctp-subtext0 line-through opacity-70" : "text-ctp-text"}
                        ${isNextStep ? "text-ctp-sky-800" : ""}
                        ${isUpcoming ? "text-ctp-subtext1 opacity-60" : "opacity-100"}
                      `}>
                        {step.task}
                      </p>
                      {isNextStep && (
                        <span className="px-1.5 py-0.5 rounded border border-ctp-sky-800/30 bg-ctp-sky-800/10 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    
                    {isNextStep && (
                      <p className="text-[10px] font-medium text-ctp-sky-800/60 mt-0.5 tracking-tight">
                        {index === 0 ? "Initial requirement to start the process." : "Follow instructions in the guide to complete this step."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {nextStep && !inGuidePage && !isModal && (
        <div className="px-6 mb-8 mt-4">
          <div 
            className="flex items-start gap-4 p-5 rounded-xl border bg-ctp-sky-10 border-ctp-sky-300/20 cursor-pointer hover:bg-ctp-sky-50 transition-all shadow-sm group"
            onClick={() => router.push(`/guides/${slug}`)}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:scale-105 transition-transform">
                <Scan size={20} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-ctp-text line-clamp-1 tracking-tight">{nextStep.task}</p>
              <p className="text-[10px] font-semibold text-ctp-sky-800 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ctp-sky-800" />
                {nextStepIndex === 0 ? "Begin here" : nextStepIndex === steps.length - 1 ? "Last step" : "Next step"}
              </p>
            </div>
            <ChevronRight size={20} className="text-ctp-subtext0 self-center group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {!inGuidePage && !isModal && (
        <div className="px-6 pb-6 pt-0">
          <button 
            onClick={() => router.push(`/guides/${slug}`)}
            className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
          >
            Continue Workflow
          </button>
        </div>
      )}

      {(inGuidePage || isModal || isBare) && !isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0 pb-8" : "p-8"} pt-4 mt-auto`}>
          <div className="space-y-4">
            <button 
              onClick={openAuthModal}
              className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
            >
              <UserPlus size={20} />
              Create Free Account
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-ctp-subtext0 uppercase tracking-wider opacity-80">
              <ShieldCheck size={12} className="text-ctp-sky-800" />
              <span>Secure Cloud Sync</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChecklistCard;

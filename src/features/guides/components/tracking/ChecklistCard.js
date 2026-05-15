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
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!initialSteps) return;

    const completedIndices = savedData?.completedTasks
      ? savedData.completedTasks.split(",").filter(s => s !== "").map(Number)
      : [];

    const nextSteps = initialSteps.map((step, index) => ({
      ...step,
      completed: completedIndices.includes(index),
    }));

    // Only update if steps actually changed
    setSteps(prev => {
      const isSame = JSON.stringify(prev) === JSON.stringify(nextSteps);
      return isSame ? prev : nextSteps;
    });
  }, [initialSteps, savedData, slug]);

  const saveMutation = useMutation({
    mutationFn: async (completedTaskIndices) => {
      const result = await updateProgressAction(slug, completedTaskIndices);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Progress Saved',
        message: 'Your checklist progress has been updated.'
      });
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
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

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const lastCompletedIndex = nextStepIndex === -1 
    ? (steps.length > 0 ? steps.length - 1 : -1) 
    : nextStepIndex - 1;

  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  const handleStepAction = (index) => {
    const isNext = index === nextStepIndex;
    const isLast = index === lastCompletedIndex;
    if (!isNext && !isLast) return;

    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const handleSaveProgress = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    saveMutation.mutate(completedTaskIndices);
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;
  const hasCompletedSteps = steps.some((s) => s.completed);

  const cardLabel = inGuidePage 
    ? (slug === "getting-started" ? "Your Journey" : "Requirements Tracker") 
    : "Your Progress";

  if (isLoadingProgress) {
    return (
      <div className={`flex items-center justify-center py-12 ${isModal || isBare ? "" : "bg-ctp-base rounded-[2.5rem] border border-ctp-surface0 soft-shadow"}`}>
        <Loader2 className="animate-spin text-ctp-sky-800" size={28} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-[2.5rem] border border-ctp-surface0 soft-shadow"
    }`}>
      
      {!isModal && !isBare && (
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] leading-none">
              {cardLabel}
            </h3>
            
            {!inGuidePage && (
              <button 
                onClick={() => router.push('/my-progress')}
                className="text-[11px] font-black text-ctp-sky-800 hover:opacity-80 flex items-center gap-1 uppercase tracking-widest transition-colors"
              >
                Dashboard <ChevronRight size={14} strokeWidth={3} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5 w-full">
              {!inGuidePage && (
                <div className="w-16 h-16 rounded-2xl bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface0 shadow-sm p-4">
                  <Image src={icon} alt="" width={40} height={40} className="w-full h-full object-contain" />
                </div>
              )}
              
              <div className="space-y-2 flex-1">
                {!isModal && !inGuidePage && (
                  <p className="text-[11px] text-ctp-subtext0 font-black uppercase tracking-widest">
                    Continue where you left off
                  </p>
                )}
                
                {(!inGuidePage || isModal) && (
                  <h4 className="font-black text-ctp-text leading-tight uppercase tracking-tight text-[22px]">
                    {slug === "getting-started" ? "Getting Started" : title}
                  </h4>
                )}
                
                {isLoggedIn ? (
                  <p className={`font-black text-ctp-sky-800 uppercase tracking-tight ${inGuidePage && !isModal ? "text-[16px]" : "text-[14px]"}`}>
                    {completedCount} of {totalSteps} steps completed
                  </p>
                ) : (
                  <p className="text-[14px] text-ctp-subtext1 font-bold uppercase tracking-tight opacity-80">
                    Follow each requirement step-by-step.
                  </p>
                )}
              </div>

              {!inGuidePage && isLoggedIn && (
                <button className="p-3 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-mantle rounded-xl border border-ctp-surface0 transition-all shrink-0 bg-ctp-base shadow-sm active:scale-95">
                  <Bookmark size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && slug !== "getting-started" && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-8"} mt-8 mb-2`}>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-ctp-mantle rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className="h-full transition-all duration-1000 ease-out bg-ctp-sky-800 shadow-[0_0_12px_rgba(45,151,186,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[14px] font-black shrink-0 tracking-widest text-ctp-sky-800">{progress}%</span>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-8"} mt-8`}>
          <div className="bg-ctp-sky-50/50 border border-ctp-sky-300/20 rounded-2xl p-6 flex items-center gap-5 group cursor-pointer hover:bg-ctp-sky-50 transition-all soft-shadow" onClick={openAuthModal}>
            <div className="w-12 h-12 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0 border border-ctp-sky-300/20 group-hover:scale-110 transition-transform">
              <Lock size={20} strokeWidth={3} />
            </div>
            <p className="text-[14px] font-black text-ctp-sky-800 leading-tight uppercase tracking-tight">
              Sign up to track <br /> your progress
            </p>
          </div>
        </div>
      )}

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
                  ${isNextStep ? "bg-ctp-sky-50/50 border-ctp-sky-300/20 soft-shadow" : "border-transparent"}
                  ${isClickable ? "cursor-pointer hover:bg-ctp-mantle" : "cursor-default"}
                  ${!isClickable && !step.completed ? "opacity-50" : ""}
                `}
              >
                <div className="shrink-0 mt-1">
                  {step.completed ? (
                    <div className="w-7 h-7 rounded-full bg-ctp-sky-800 flex items-center justify-center text-ctp-base shadow-lg shadow-ctp-sky-800/20">
                      <Check size={16} strokeWidth={4} />
                    </div>
                  ) : isNextStep ? (
                    <div className="w-7 h-7 rounded-full border-2 border-ctp-sky-800 flex items-center justify-center bg-ctp-base shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-ctp-sky-800 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-ctp-surface0 bg-ctp-base flex items-center justify-center text-[12px] font-black text-ctp-subtext0">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`text-[16px] font-bold leading-relaxed transition-colors tracking-tight
                    ${step.completed ? "text-ctp-subtext1 line-through" : "text-ctp-text group-hover:text-ctp-sky-800"}
                  `}>
                    {step.task}
                  </p>
                  {isNextStep && (
                    <p className="text-[12px] font-black text-ctp-sky-800 mt-1.5 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse" />
                      {index === 0 ? "Start journey" : index === steps.length - 1 ? "Final requirement" : "Next requirement"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {nextStep && !inGuidePage && !isModal && (
        <div className="px-8 mb-10 mt-4">
          <div 
            className="flex items-start gap-5 p-6 rounded-2xl border bg-ctp-sky-50/50 border-ctp-sky-300/20 cursor-pointer hover:bg-ctp-sky-50 transition-all soft-shadow group"
            onClick={() => router.push(`/guides/${slug}`)}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-surface0 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:scale-110 transition-transform">
                <Scan size={24} strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-black text-ctp-text line-clamp-1 uppercase tracking-tight">{nextStep.task}</p>
              <p className="text-[12px] font-black text-ctp-sky-800 mt-1.5 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ctp-sky-800" />
                {nextStepIndex === 0 ? "Begin here" : nextStepIndex === steps.length - 1 ? "Last step" : "Next step"}
              </p>
            </div>
            <ChevronRight size={22} className="text-ctp-subtext1 self-center group-hover:translate-x-1 transition-transform" strokeWidth={3} />
          </div>
        </div>
      )}

      {!inGuidePage && !isModal && (
        <div className="px-8 pb-8 pt-0">
          <button 
            onClick={() => router.push(`/guides/${slug}`)}
            className="w-full bg-ctp-sky-800 hover:opacity-90 text-ctp-base py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-xl shadow-ctp-sky-800/20"
          >
            Continue Workflow
          </button>
        </div>
      )}

      {(inGuidePage || isModal || isBare) && (
        <div className={`${(isModal || isBare) ? "px-0 pb-10" : "p-10"} pt-4 mt-auto`}>
        <div className="space-y-6">
          {progress === 100 && isLoggedIn ? (
            <div className="bg-ctp-sky-800/5 border border-ctp-sky-800/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 soft-shadow">
              <div className="w-16 h-16 rounded-full bg-ctp-sky-800 flex items-center justify-center text-ctp-base shadow-xl shadow-ctp-sky-800/20">
                <Check size={32} strokeWidth={4} />
              </div>
              <div className="space-y-2">
                <p className="text-[22px] font-black text-ctp-text uppercase tracking-tight">Requirement Complete!</p>
                <p className="text-[14px] text-ctp-subtext1 font-bold uppercase tracking-tight px-6 leading-relaxed opacity-80">
                  You&apos;ve successfully completed all requirements. Your progress is synced to the cloud.
                </p>
              </div>
              
              <div className="w-full pt-4">
                <button 
                  onClick={handleSaveProgress}
                  disabled={saveMutation.isPending}
                  className="w-full bg-ctp-sky-800 hover:opacity-90 text-ctp-base py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.95] shadow-xl shadow-ctp-sky-800/20"
                >
                  {saveMutation.isPending ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} strokeWidth={3} />}
                  {saveMutation.isPending ? "Syncing..." : "Update Journey"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-ctp-sky-800 hover:opacity-90 text-ctp-base py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-ctp-sky-800/20"
                  >
                    <UserPlus size={24} strokeWidth={3} />
                    Create Free Account
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] opacity-60">
                    <ShieldCheck size={14} className="text-ctp-sky-800" strokeWidth={3} />
                    <span>Secure Cloud Sync</span>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleSaveProgress}
                  disabled={saveMutation.isPending || !hasCompletedSteps}
                  className={`w-full py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl
                    ${hasCompletedSteps 
                      ? "bg-ctp-sky-800 hover:opacity-90 text-ctp-base shadow-ctp-sky-800/20" 
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

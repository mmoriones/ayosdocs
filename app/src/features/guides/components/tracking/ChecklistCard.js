'use client';

import { 
  Check, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Loader2,
  Scan,
  AlertTriangle,
} from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import { useWorkspace, useToast } from '@/context';
import { GuideIcon } from '@/lib/guideIcons';
import { updateProgressAction, toggleFavoriteAction } from '@/app/actions/user';
import axios from 'axios';
import { Skeleton, Button, Badge, BookmarkButton } from '@/components/ui';

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
  const { setActiveGuideSlug } = useWorkspace();
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState(initialSteps || []);
  const [isShaking, setIsShaking] = useState(false);
  const lastInteractionRef = useRef(0);

  const { data: savedData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['progress', slug],
    queryFn: async () => {
      if (!isLoggedIn || !isVerified || !slug) return null;
      const response = await axios.get(`/api/user/get-progress/${slug}`);
      return response.data;
    },
    enabled: isLoggedIn && isVerified && !!slug,
  });

  // Fetch comprehensive user data for favorites sync
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const fullProgress = userData?.savedProgress?.find(p => p.guideSlug === slug);
  const isFavorite = !!fullProgress?.isFavorite;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      if (!isVerified) {
        showToast({
          type: 'warning',
          title: 'Verification Required',
          message: 'Please verify your email to favorite guides.'
        });
        return;
      }
      const result = await toggleFavoriteAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
        message: data.message
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update favorite. Please try again.'
      });
    }
  });

  const handleFavorite = () => {
    favoriteMutation.mutate();
  };

  const saveMutation = useMutation({
    mutationFn: async (completedTaskIndices) => {
      const result = await updateProgressAction(slug, completedTaskIndices);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
    },
    onError: (error) => {
      console.error("Save error:", error.message);
    }
  });

  // State synchronization from server/props
  const [prevSlug, setPrevSlug] = useState(slug);

  // 1. Reset state if switching guides (Sync during render is okay for slug reset)
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setSteps(initialSteps || []);
  }

  // 2. Sync server data to local state ONLY if user is not currently active
  useEffect(() => {
    if (!savedData || saveMutation.isPending) return;
    
    const isUserInactive = Date.now() - lastInteractionRef.current > 2500;
    if (!isUserInactive) return;

    const completedIndices = savedData.completedTasks
      ? savedData.completedTasks.split(",").filter(s => s !== "").map(Number)
      : [];

    const nextStepsFromData = (initialSteps || []).map((step, index) => ({
      ...step,
      completed: completedIndices.includes(index),
    }));

    // Only update if current steps are actually different (Cloud Sync case)
    const currentLocalIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    if (savedData.completedTasks !== currentLocalIndices) {
      setTimeout(() => {
        setSteps(nextStepsFromData);
      }, 0);
    }
  }, [savedData?.completedTasks, slug]); // slug dependency ensures it runs on new guide

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  const handleStepAction = useCallback((index) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!isVerified) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    // Update interaction time to block incoming server syncs for 2.5s
    lastInteractionRef.current = Date.now();

    // Mark as the active dashboard workflow
    setActiveGuideSlug(slug);

    setSteps(prevSteps => 
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    );
  }, [isLoggedIn, isVerified, openAuthModal, slug, setActiveGuideSlug]);

  // Snappier Debounced Auto-save
  useEffect(() => {
    if (!isLoggedIn || !isVerified || !slug || !steps.length || isLoadingProgress) return;

    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    // Only sync if local state actually differs from last known server state
    if (savedData?.completedTasks === completedTaskIndices) return;

    const timeout = setTimeout(() => {
      saveMutation.mutate(completedTaskIndices);
    }, 600);

    // We don't clear the timeout here to ensure that even if the user navigates away, 
    // the mutation still has a chance to fire (as long as the JS environment persists).
    // This fixes the "My Docs not refreshing" issue where quick navigation canceled saves.
    return () => {};
  }, [steps, isLoggedIn, isVerified, slug, savedData?.completedTasks, saveMutation.mutate]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;

  const cardLabel = inGuidePage ? "Requirements Tracker" : "Your Progress";

  if (isLoadingProgress) {
    return <ChecklistCard.Skeleton isModal={isModal} isBare={isBare} inGuidePage={inGuidePage} />;
  }

  if (!inGuidePage && !isModal && !isBare) {
    return (
      <div className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm overflow-visible animate-in fade-in slide-in-from-right-2 duration-500 relative group">
        {/* Subtle Accent Background matching Stats Bar */}
        <div className="absolute inset-0 bg-ctp-sky-800/[0.02] pointer-events-none rounded-xl" />

        {/* Technical Header */}
        <div className="relative z-10 p-5 flex items-center justify-between gap-4 border-b border-ctp-surface1/50 bg-ctp-mantle/[0.2]">
          <div className="flex items-center gap-3.5 min-w-0">
             <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0">
                <GuideIcon slug={slug} agency={agency} className="w-5 h-5" strokeWidth={2} />
             </div>
             <div className="min-w-0">
                <h4 className="text-[13px] font-bold text-ctp-text tracking-tight truncate leading-tight uppercase">
                  {title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                   <Badge variant="sky" className="px-1 py-0 text-[7px]">{agency || "National"}</Badge>
                   <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">Live Tracker</span>
                </div>
             </div>
          </div>
          <div className="shrink-0">
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={handleFavorite}
              size="sm"
            />
          </div>
        </div>

        {/* Large Technical Progress Bar */}
        <div className="relative z-10 px-5 py-5 bg-ctp-base/40">
           <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 rounded-md bg-ctp-sky-800/[0.06] border border-ctp-sky-800/10 shadow-sm shrink-0 min-w-[38px] text-center">
                 <span className="text-[10px] font-bold text-ctp-sky-800">{progressPercent}%</span>
              </div>
              <div className="flex-1 h-3 bg-ctp-mantle/50 rounded-full border border-ctp-surface1 overflow-hidden relative shadow-inner">
                 <div 
                   className="h-full transition-all duration-1000 ease-out relative bg-ctp-sky-800 shadow-[0_0_12px_var(--sky-800)]"
                   style={{ width: `${progressPercent}%` }}
                 />
              </div>
           </div>
        </div>
        {/* Instrumentation Grid */}
        <div className="relative z-10 px-5 py-4 grid grid-cols-2 gap-y-4 gap-x-6 border-t border-ctp-surface1/30">
           <div className="space-y-1">
              <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-70">Monitor Status</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse shadow-[0_0_6px_rgba(166,227,161,0.4)]" />
                 <span className="text-[10px] font-bold text-ctp-text uppercase tracking-tight">Active</span>
              </div>
           </div>
           <div className="space-y-1">
              <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-70">Task Verification</span>
              <p className="text-[10px] font-bold text-ctp-text uppercase tracking-tight">{completedCount} / {totalSteps}</p>
           </div>
           <div className="space-y-1">
              <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-70">Cloud Backup</span>
              <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-3.5 h-3.5 text-ctp-sky-800" strokeWidth={2.5} />
                 <span className="text-[10px] font-bold text-ctp-text uppercase tracking-tight">Synced</span>
              </div>
           </div>
           <div className="space-y-1">
              <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-70">Priority Level</span>
              <div className="flex items-center gap-1.5">
                 <span className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-tight">Normal</span>
              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="relative z-10 px-5 pb-5 pt-1">
          <button 
            onClick={() => router.push(`/guides/${slug}`)}
            className="w-full h-10 bg-ctp-sky-800 hover:bg-ctp-sky-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-ctp-sky-800/10 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group/btn"
          >
            Resume Roadmap
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col relative overflow-visible transition-all duration-300 ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm"
    }`}>
      
      {!isBare && (
        <div className={`${isModal ? "p-4" : "p-5 lg:p-6"} bg-ctp-mantle/[0.2] border-b border-ctp-surface1/50 rounded-t-xl`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-[0.15em] leading-none">
                {cardLabel}
              </h3>
              {isLoggedIn && (
                <div className="flex items-center gap-1.5">
                  {!isVerified ? (
                    <Badge variant="yellow" icon={AlertTriangle} className="text-[8px] px-1 py-0">Pending</Badge>
                  ) : saveMutation.isPending ? (
                    <Badge variant="sky" icon={Loader2} className="text-[8px] px-1 py-0 animate-spin">Syncing</Badge>
                  ) : (
                    <Badge variant="green" icon={ShieldCheck} className="text-[8px] px-1 py-0">Verified</Badge>
                  )}
                </div>
              )}
            </div>
            
            {!inGuidePage && (
              <button 
                onClick={() => router.push('/my-docs')}
                className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest hover:text-ctp-sky-300 transition-colors flex items-center gap-1"
              >
                Workspace
                <ChevronRight size={10} strokeWidth={4} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 w-full min-w-0">
              {!inGuidePage && (
                <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center shrink-0 text-ctp-sky-800 shadow-sm">
                  <GuideIcon slug={slug} agency={agency} className="w-5 h-5" strokeWidth={1.5} />
                </div>
              )}
              
              <div className="space-y-0.5 flex-1 min-w-0">
                {(!inGuidePage || isModal) && (
                  <h4 className="font-bold text-ctp-text leading-tight tracking-tight text-base truncate">
                    {title}
                  </h4>
                )}
                
                <div className="flex items-center gap-2">
                   <p className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest leading-none">
                     {isLoggedIn ? `${completedCount} of ${totalSteps} verified` : "Manual Tracking"}
                   </p>
                   <div className="w-1 h-1 rounded-full bg-ctp-surface1" />
                   <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">
                     {progressPercent === 100 ? 'Finalized' : 'In Progress'}
                   </span>
                </div>
              </div>

              {!inGuidePage && isLoggedIn && (
                <BookmarkButton
                  isFavorite={isFavorite}
                  onClick={handleFavorite}
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Technical Progress Bar */}
      {slug && (
        <div className={`${(isModal || isBare) ? "px-0 pb-3" : "px-5 py-4"} border-b border-ctp-surface1/30 bg-ctp-base/40`}>
           <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 rounded-md bg-ctp-sky-800/[0.06] border border-ctp-sky-800/10 shadow-sm shrink-0 min-w-[38px] text-center">
                 <span className="text-[10px] font-bold text-ctp-sky-800">{progressPercent}%</span>
              </div>
              <div className="flex-1 h-2 bg-ctp-mantle/50 rounded-full border border-ctp-surface1 overflow-hidden relative shadow-inner">
                 <div 
                   className="h-full transition-all duration-1000 ease-out relative bg-ctp-sky-800 shadow-[0_0_10px_var(--sky-800)]"
                   style={{ width: `${progressPercent}%` }}
                 />
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        {status !== 'loading' && isLoggedIn && !isVerified && (
          <div className={`${(isModal || isBare) ? "px-0" : "px-5 lg:px-6"} mt-3 ${isShaking ? 'animate-shake' : ''}`}>
            <div className="bg-ctp-yellow/[0.04] border border-ctp-yellow/20 rounded-lg p-2.5 flex items-center gap-3 transition-all shadow-sm">
              <AlertTriangle size={14} className="text-ctp-yellow shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-ctp-text uppercase tracking-tight">Sync Restricted</p>
                <p className="text-[8px] text-ctp-subtext1 font-medium mt-0.5 leading-tight">Verify email to save progress.</p>
              </div>
            </div>
          </div>
        )}

        {(inGuidePage || isModal || isBare) && (
          <div className={`
            ${(isModal || isBare) ? "px-0 py-2.5" : "px-5 lg:px-6 py-5"} 
            ${(inGuidePage && !isBare) ? "lg:max-h-[520px] overflow-y-auto custom-scrollbar" : ""}
          `}>
            <div className="space-y-0.5">
              {steps.map((step, index) => {
                const isNextStep = index === nextStepIndex;
                const isClickable = true;
                const isUpcoming = !step.completed && !isNextStep;

                return (
                  <div 
                    key={index}
                    onClick={() => handleStepAction(index)}
                    className={`flex items-start gap-3.5 px-3 py-2 rounded-lg transition-all duration-200 group
                      ${step.completed ? "bg-ctp-sky-800/[0.03]" : ""}
                      ${isNextStep ? "bg-ctp-sky-800/[0.03]" : ""}
                      ${isClickable ? "cursor-pointer hover:bg-ctp-mantle/60" : "cursor-default"}
                    `}
                  >
                    <div className="shrink-0 mt-0.5">
                      {step.completed ? (
                        <div className="w-4 h-4 rounded-full bg-ctp-sky-800/[0.08] flex items-center justify-center text-ctp-sky-800 transition-all group-hover:scale-110 border border-ctp-sky-800/20 shadow-sm">
                          <Check size={8} strokeWidth={4} />
                        </div>
                      ) : isNextStep ? (
                        <div className="w-4 h-4 rounded-full border-2 border-ctp-sky-800 flex items-center justify-center bg-ctp-base group-hover:border-ctp-sky-300 transition-all shadow-[0_0_8px_var(--sky-800)]">
                          <div className="w-1 h-1 rounded-full bg-ctp-sky-800 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-ctp-surface1 bg-ctp-mantle flex items-center justify-center text-[8px] font-bold text-ctp-subtext1 transition-colors group-hover:border-ctp-surface2 group-hover:text-ctp-text">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-[11px] font-bold leading-tight transition-colors tracking-tight
                          ${step.completed ? "text-ctp-subtext1 line-through opacity-50 font-medium" : "text-ctp-text"}
                          ${isNextStep ? "text-ctp-sky-800" : ""}
                          ${isUpcoming ? "text-ctp-subtext1 opacity-60 font-medium" : ""}
                        `}>
                          {step.task}
                        </p>
                        {isNextStep && (
                          <span className="px-1 py-0 rounded bg-ctp-sky-800/10 text-[7px] font-bold text-ctp-sky-800 uppercase tracking-widest shrink-0 border border-ctp-sky-800/20">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {nextStep && !inGuidePage && !isModal && (
          <div className="px-5 lg:px-6 mb-6 mt-4">
            <div 
              className="flex items-start gap-3.5 p-3.5 rounded-lg border border-ctp-surface1 bg-ctp-mantle/30 cursor-pointer hover:border-ctp-sky-800/20 transition-all shadow-sm group shadow-inner"
              onClick={() => router.push(`/guides/${slug}`)}
            >
              <div className="shrink-0">
                <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-mantle transition-colors">
                  <Scan size={16} strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-ctp-text line-clamp-1 tracking-tight">{nextStep.task}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1 h-1 rounded-full bg-ctp-sky-800 animate-pulse" />
                   <p className="text-[8px] font-bold text-ctp-sky-800 uppercase tracking-[0.15em]">Next Requirement</p>
                </div>
              </div>
              <ArrowRight size={12} className="text-ctp-surface2 self-center group-hover:translate-x-0.5 group-hover:text-ctp-sky-800 transition-all" strokeWidth={3} />
            </div>
          </div>
        )}

        {!inGuidePage && !isModal && slug && (
          <div className="px-5 lg:px-6 pb-6 pt-2 mt-auto">
            <Button 
              onClick={() => router.push(`/guides/${slug}`)}
              className="w-full text-[10px] uppercase tracking-widest h-10 shadow-lg shadow-ctp-sky-800/10"
            >
              Resume Roadmap
            </Button>
          </div>
        )}

        {(inGuidePage || isModal || isBare) && !isLoggedIn && (
          <div className={`${(isModal || isBare) ? "px-0 pb-8" : "p-6"} pt-4 mt-auto`}>
            <div className="space-y-4">
              <Button 
                onClick={openAuthModal}
                leftIcon={<UserPlus size={14} strokeWidth={2.5} />}
                className="w-full text-[10px] uppercase tracking-widest shadow-lg shadow-ctp-sky-800/10"
              >
                Setup Tracking
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">
                <ShieldCheck size={12} className="text-ctp-green" />
                <span>Identity Sync Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ChecklistCard.Skeleton = function ChecklistCardSkeleton({ isModal, isBare, inGuidePage }) {
  if (!inGuidePage && !isModal && !isBare) {
    return (
      <div className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm overflow-hidden animate-pulse">
        {/* Technical Header Skeleton */}
        <div className="p-5 flex items-center justify-between gap-4 border-b border-ctp-surface1/50 bg-ctp-mantle/[0.1]">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="w-3/4 h-3.5 rounded" />
              <div className="flex gap-2">
                <Skeleton className="w-10 h-2.5 rounded" />
                <Skeleton className="w-16 h-2.5 rounded opacity-60" />
              </div>
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="px-5 py-5 bg-ctp-base/40">
           <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-4 rounded-md shrink-0" />
              <Skeleton className="flex-1 h-3 rounded-full" />
           </div>
        </div>

        {/* Instrumentation Grid Skeleton */}
        <div className="px-5 py-4 grid grid-cols-2 gap-y-6 gap-x-6 border-t border-ctp-surface1/30">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="space-y-2">
               <Skeleton className="w-12 h-2 opacity-60" />
               <Skeleton className="w-16 h-3" />
             </div>
           ))}
        </div>

        {/* Action Bar Skeleton */}
        <div className="px-5 pb-5 pt-1">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col overflow-hidden ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-2xl border border-ctp-surface1 shadow-sm"
    }`}>
      <div className={`${isModal ? "p-0" : "p-5 lg:p-6"} space-y-6 pb-0`}>
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-2.5" />
          {!inGuidePage && <Skeleton className="w-20 h-2.5" />}
        </div>
        
        <div className="flex items-start gap-4">
          {!inGuidePage && <Skeleton className="w-11 h-11 rounded-lg shrink-0" />}
          <div className="space-y-2 flex-1">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-1/2 h-2.5" />
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-6 mt-6">
        <Skeleton className="w-full h-1.5 rounded-full" />
      </div>

      <div className="p-5 lg:p-6 space-y-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 px-3">
            <Skeleton className="w-4 h-4 rounded-md shrink-0 opacity-40" />
            <Skeleton className="w-full h-3.5" />
          </div>
        ))}
      </div>

      {!inGuidePage && (
        <div className="px-5 lg:px-6 pb-6 mt-auto">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ChecklistCard;

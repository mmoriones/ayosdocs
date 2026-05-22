'use client';

import { 
  Check, 
  Lock, 
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
import { Skeleton, Button, Badge, ProgressBar, BookmarkButton } from '@/components/ui';

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
    if (!isLoggedIn || !isVerified || !slug || !steps.length) return;

    const completedTaskIndices = steps
      .map((s, i) => (s.completed ? i : null))
      .filter((i) => i !== null)
      .join(",");

    // Only sync if local state actually differs from last known server state
    if (savedData?.completedTasks === completedTaskIndices) return;

    const timeout = setTimeout(() => {
      saveMutation.mutate(completedTaskIndices);
    }, 600);

    return () => clearTimeout(timeout);
  }, [steps, isLoggedIn, isVerified, slug, savedData?.completedTasks, saveMutation.mutate]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;

  const cardLabel = inGuidePage ? "Requirements Tracker" : "Your Progress";

  if (isLoadingProgress || status === 'loading') {
    return <ChecklistCard.Skeleton isModal={isModal} isBare={isBare} inGuidePage={inGuidePage} />;
  }

  return (
    <div className={`flex flex-col relative overflow-visible transition-all duration-300 ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-2xl border border-ctp-surface1 shadow-sm"
    }`}>
      
      {!isBare && (
        <div className={`${isModal ? "p-0" : "p-5 lg:p-6"} pb-0`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest leading-none">
                {cardLabel}
              </h3>
              {isLoggedIn && (
                <div className="flex items-center gap-1.5">
                  {!isVerified ? (
                    <Badge variant="yellow" icon={AlertTriangle}>Unverified</Badge>
                  ) : saveMutation.isPending ? (
                    <Badge variant="sky" icon={Loader2}>Syncing</Badge>
                  ) : (
                    <Badge variant="green" icon={ShieldCheck}>Synced</Badge>
                  )}
                </div>
              )}
            </div>
            
            {!inGuidePage && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => router.push('/my-docs')}
                rightIcon={<ChevronRight size={12} strokeWidth={3} />}
                className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest px-0 py-0 h-auto"
              >
                Go to Workspace
              </Button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 w-full min-w-0">
              {!inGuidePage && (
                <div className="w-11 h-11 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 shadow-inner">
                  <GuideIcon slug={slug} agency={agency} className="w-6 h-6 text-ctp-sky-800" strokeWidth={1.5} />
                </div>
              )}
              
              <div className="space-y-1 flex-1 min-w-0">
                {(!inGuidePage || isModal) && (
                  <h4 className="font-bold text-ctp-text leading-tight tracking-tight text-lg truncate">
                    {title}
                  </h4>
                )}
                
                <p className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest leading-none">
                  {isLoggedIn ? `${completedCount} of ${totalSteps} tasks verified` : "Requirement Roadmap"}
                </p>
              </div>

              {!inGuidePage && isLoggedIn && (
                <BookmarkButton
                  isFavorite={isFavorite}
                  onClick={handleFavorite}
                  tooltipProps={{ contentClassName: 'z-[150]' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && slug && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-5 lg:px-6"} mt-5 mb-2`}>
          <ProgressBar
            value={progressPercent}
            size="sm"
            color={progressPercent === 100 ? 'green' : 'sky'}
          />
        </div>
      )}

      {status !== 'loading' && isLoggedIn && !isVerified && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-5 lg:px-6"} mt-5 ${isShaking ? 'animate-shake' : ''}`}>
          <div className="bg-ctp-yellow/5 border border-ctp-yellow/20 rounded-lg p-4 flex items-center gap-4 transition-all shadow-sm">
            <AlertTriangle size={18} className="text-ctp-yellow shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-ctp-text uppercase tracking-tight">Sync Restricted</p>
              <p className="text-[10px] text-ctp-subtext1 font-medium mt-0.5 leading-tight">Verify email to save your progress.</p>
            </div>
          </div>
        </div>
      )}

      {status !== 'loading' && !isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0" : "px-5 lg:px-6"} mt-5`}>
          <div 
            className="bg-ctp-sky-800/5 border border-ctp-sky-800/10 rounded-lg p-4 flex items-center justify-between group cursor-pointer hover:bg-ctp-sky-800/10 transition-all shadow-sm"
            onClick={openAuthModal}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0 border border-ctp-sky-800/10">
                <Lock size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-ctp-text uppercase tracking-tight">Cloud Save Disabled</p>
                <p className="text-[10px] text-ctp-subtext1 font-medium mt-0.5">Sign in to track procedures.</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-ctp-sky-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      )}

      {(inGuidePage || isModal || isBare) && (
        <div className={`
          ${(isModal || isBare) ? "px-0 py-4" : "px-5 lg:px-6 py-6"} 
          ${(inGuidePage && !isBare) ? "lg:max-h-[520px] overflow-y-auto custom-scrollbar" : ""}
        `}>
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isNextStep = index === nextStepIndex;
              const isClickable = true; // All items now clickable
              const isUpcoming = !step.completed && !isNextStep;

              return (
                <div 
                  key={index}
                  onClick={() => handleStepAction(index)}
                  className={`flex items-start gap-4 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${step.completed ? "bg-ctp-mantle/50" : ""}
                    ${isNextStep ? "bg-ctp-sky-800/5" : ""}
                    ${isClickable ? "cursor-pointer hover:bg-ctp-mantle" : "cursor-default"}
                  `}
                >
                  <div className="shrink-0 mt-0.5">
                    {step.completed ? (
                      <div className="w-5 h-5 rounded-full bg-ctp-green/10 flex items-center justify-center text-ctp-green transition-all group-hover:scale-110 border border-ctp-green/20 shadow-sm">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    ) : isNextStep ? (
                      <div className="w-5 h-5 rounded-full border-2 border-ctp-sky-800 flex items-center justify-center bg-ctp-base group-hover:border-ctp-sky-300 transition-all shadow-[0_0_8px_rgba(4,165,229,0.1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-ctp-sky-800 animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-ctp-surface1 bg-ctp-mantle flex items-center justify-center text-[9px] font-bold text-ctp-subtext1 transition-colors group-hover:border-ctp-surface2 group-hover:text-ctp-text">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 pt-0.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className={`text-xs font-bold leading-relaxed transition-colors tracking-tight
                        ${step.completed ? "text-ctp-subtext1 line-through opacity-60" : "text-ctp-text"}
                        ${isNextStep ? "text-ctp-sky-800" : ""}
                        ${isUpcoming ? "text-ctp-subtext1 opacity-60 font-medium" : ""}
                      `}>
                        {step.task}
                      </p>
                      {isNextStep && (
                        <span className="px-1.5 py-0.5 rounded bg-ctp-sky-800/10 text-[8px] font-bold text-ctp-sky-800 uppercase tracking-widest shrink-0 border border-ctp-sky-800/20">
                          Active
                        </span>
                      )}
                    </div>
                    
                    {isNextStep && (
                      <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-tight mt-0.5 opacity-60">
                        {index === 0 ? "Initial requirement" : "Instructional milestone"}
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
        <div className="px-5 lg:px-6 mb-8 mt-2">
          <div 
            className="flex items-start gap-4 p-4 rounded-xl border border-ctp-surface1 bg-ctp-mantle/30 cursor-pointer hover:bg-ctp-mantle hover:border-ctp-sky-800/30 transition-all shadow-sm group shadow-inner"
            onClick={() => router.push(`/guides/${slug}`)}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:scale-105 transition-transform">
                <Scan size={18} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ctp-text line-clamp-1 tracking-tight">{nextStep.task}</p>
              <p className="text-[9px] font-bold text-ctp-sky-800 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ctp-sky-800" />
                {nextStepIndex === 0 ? "Initial Step" : "Next Milestone"}
              </p>
            </div>
            <ChevronRight size={14} className="text-ctp-subtext1 self-center group-hover:translate-x-1 group-hover:text-ctp-sky-800 transition-all" />
          </div>
        </div>
      )}

      {!inGuidePage && !isModal && slug && (
        <div className="px-5 lg:px-6 pb-6 pt-0 mt-auto">
          <Button 
            onClick={() => router.push(`/guides/${slug}`)}
            className="w-full text-xs uppercase tracking-widest"
          >
            Continue Roadmap
          </Button>
        </div>
      )}

      {(inGuidePage || isModal || isBare) && !isLoggedIn && (
        <div className={`${(isModal || isBare) ? "px-0 pb-8" : "p-6"} pt-4 mt-auto`}>
          <div className="space-y-4">
            <Button 
              onClick={openAuthModal}
              leftIcon={<UserPlus size={14} strokeWidth={2.5} />}
              className="w-full text-xs uppercase tracking-widest shadow-md shadow-ctp-sky-800/10"
            >
              Setup Tracking
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">
              <ShieldCheck size={12} className="text-ctp-sky-800" />
              <span>Identity Sync Verified</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

ChecklistCard.Skeleton = function ChecklistCardSkeleton({ isModal, isBare, inGuidePage }) {
  return (
    <div className={`flex flex-col overflow-hidden ${
      (isModal || isBare) ? "" : "bg-ctp-base rounded-2xl border border-ctp-surface1 shadow-sm"
    }`}>
      <div className={`${isModal ? "p-0" : "p-5 lg:p-6"} space-y-6 pb-0`}>
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-3" />
          {!inGuidePage && <Skeleton className="w-20 h-3" />}
        </div>
        
        <div className="flex items-start gap-4">
          {!inGuidePage && <Skeleton className="w-11 h-11 rounded-lg shrink-0" />}
          <div className="space-y-2 flex-1">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-6 mt-6">
        <Skeleton className="w-full h-1 rounded-full" />
      </div>

      <div className="p-5 lg:p-6 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 px-3">
            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
            <Skeleton className="w-full h-4" />
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

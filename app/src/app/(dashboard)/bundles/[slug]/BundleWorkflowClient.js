'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {  
  ChevronLeft,
  Share2,
  Check,
  Lock,
  ChevronRight,
  Loader2,
  ShieldAlert,
  Play
} from 'lucide-react';
import { GuideIcon } from '@/lib/guideIcons';
import { Badge, Button, ProgressBar, Skeleton, TimelineStep } from '@/components/ui';
import { startBundleAction, stopBundleAction, resendVerificationAction } from '@/app/actions/user';
import { useToast } from '@/context';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import ConfirmModal from '@/components/ConfirmModal';

/**
 * BundleWorkflowClient Component
 * Redesigned timeline-based workflow for a life event bundle.
 */
export default function BundleWorkflowClient({ bundle, allGuides, initialIsTracked, savedProgress = [] }) {
  const { data: session, status: authStatus } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = authStatus === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Fetch comprehensive user data
  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const [isTracked, setIsTracked] = useState(initialIsTracked);

  // Helper to check if a specific guide is tracked and its progress
  const getGuideProgress = (slug) => {
    const progress = userData?.savedProgress?.find(p => p.guideSlug === slug);
    if (!progress) return { tracked: false, completed: false, percentage: 0 };

    const guide = allGuides.find(g => g.slug === slug);
    const totalTasks = guide?.checklist?.length || 0;
    const completedTasks = progress.completedTasks ? progress.completedTasks.split(',').filter(Boolean).length : 0;
    
    return {
      tracked: true,
      completed: totalTasks > 0 && completedTasks === totalTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    let completedGuides = 0;
    let totalMinCost = 0;
    let totalMaxCost = 0;
    let completedMinCost = 0;
    let completedMaxCost = 0;
    let totalMinDays = 0;
    let totalMaxDays = 0;
    let completedMinDays = 0;
    let completedMaxDays = 0;

    const parseCost = (range) => {
      if (!range || range === 'Free') return [0, 0];
      if (range.includes('Under ₱500')) return [0, 500];
      if (range.includes('₱500–₱2000')) return [500, 2000];
      if (range.includes('₱2000+')) return [2000, 5000];
      return [0, 0];
    };

    const parseTime = (time) => {
      if (!time || time === 'Same Day') return [0, 1];
      if (time === '1-3 Days') return [1, 3];
      if (time === '3-7 Days') return [3, 7];
      if (time === '1 Week+') return [7, 14];
      return [0, 0];
    };

    bundle.flow.forEach(stage => {
      stage.guides.forEach(slug => {
        const guide = allGuides.find(g => g.slug === slug);
        const progress = getGuideProgress(slug);
        
        const [minC, maxC] = parseCost(guide?.costRange);
        const [minD, maxD] = parseTime(guide?.estimatedTime);

        totalMinCost += minC;
        totalMaxCost += maxC;
        totalMinDays += minD;
        totalMaxDays += maxD;

        if (progress.completed) {
          completedGuides++;
          completedMinCost += minC;
          completedMaxCost += maxC;
          completedMinDays += minD;
          completedMaxDays += maxD;
        }
      });
    });

    return {
      completedGuides,
      cost: {
        total: `₱${totalMinCost}-${totalMaxCost}`,
        remaining: `₱${totalMinCost - completedMinCost}-${totalMaxCost - completedMaxCost}`,
      },
      time: {
        total: `${totalMinDays}-${totalMaxDays} days`,
        remaining: `${totalMinDays - completedMinDays}-${totalMaxDays - completedMaxDays} days`,
      }
    };
  }, [bundle, allGuides, userData]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const result = await resendVerificationAction();
      if (result.success) {
        showToast({ type: 'success', title: 'Verification Sent', message: result.message });
      } else {
        showToast({ type: 'error', title: 'Error', message: result.message });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to resend verification email.' });
    } finally {
      setIsResending(false);
    }
  };

  const handleStopTracking = async () => {
    setIsLoading(true);
    try {
      const res = await stopBundleAction(bundle.id);
      if (res.success) {
        setIsTracked(false);
        queryClient.invalidateQueries({ queryKey: ['user-data'] });
        showToast({ type: 'success', title: 'Bundle Stopped', message: 'This bundle is no longer being tracked.' });
      } else {
        showToast({ type: 'error', title: 'Error', message: res.message });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTracking = async () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!isVerified) {
      showToast({ type: 'warning', title: 'Verification Required', message: 'Please verify your email to track bundles.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await startBundleAction(bundle.id);
      if (res.success) {
        setIsTracked(true);
        queryClient.invalidateQueries({ queryKey: ['user-data'] });
        showToast({ type: 'success', title: 'Bundle Started', message: 'This bundle has been added to your dashboard.' });
        router.refresh();
      } else {
        showToast({ type: 'error', title: 'Error', message: res.message });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stage completion and active stage
  const stageStats = useMemo(() => {
    return bundle.flow.map(stage => {
      const stageGuides = stage.guides.map(slug => getGuideProgress(slug));
      const allCompleted = stageGuides.every(g => g.completed);
      const anyTracked = stageGuides.some(g => g.tracked);
      
      return {
        ...stage,
        completed: allCompleted,
        anyTracked,
        guidesData: stage.guides.map(slug => {
          const guide = allGuides.find(g => g.slug === slug);
          return {
            ...guide,
            slug: slug,
            title: guide?.title || slug.replace(/-/g, ' '),
            shortTitle: guide?.shortTitle,
            progress: getGuideProgress(slug)
          };
        })
      };
    });
  }, [bundle.flow, userData, allGuides]);

  // Find the first incomplete stage
  const activeStage = isTracked ? (stageStats.find(s => !s.completed)?.step || bundle.flow.length) : 0;
  
  const totalGuides = bundle.flow.reduce((acc, stage) => acc + stage.guides.length, 0);
  const overallPercentage = totalGuides > 0 ? Math.round((analytics.completedGuides / totalGuides) * 100) : 0;

  const isDataLoading = isLoggedIn && isLoadingUserData;

  return (
    <div className="min-h-screen bg-ios-gradient font-sans pb-24 text-ctp-text">
      {/* HEADER */}
      <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-white/20">
        <Link 
          href="/bundles"
          className="w-10 h-10 flex items-center justify-center bg-ctp-mantle rounded-full shadow-sm border border-ctp-surface1 hover:bg-ctp-base transition-colors"
        >
          <ChevronLeft size={20} className="text-ctp-text" />
        </Link>
        <div className="flex-1 px-4 min-w-0">
          <h1 className="text-base font-bold tracking-tight text-ctp-text truncate">{bundle.title}</h1>
          <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">{bundle.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={isTracked ? () => setIsConfirmOpen(true) : handleStartTracking}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              isTracked 
                ? 'bg-ctp-surface0 text-ctp-red border border-ctp-red/20' 
                : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
            }`}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : isTracked ? 'Stop' : 'Start'}
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-ctp-mantle rounded-full shadow-sm border border-ctp-surface1 hover:bg-ctp-base transition-colors">
            <Share2 size={18} className="text-ctp-text" />
          </button>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-6">
        
        {/* PROGRESS SECTION */}
        {isTracked && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-ctp-subtext1">Overall Progress</span>
              <span className="text-sm font-bold text-ctp-text">{overallPercentage}%</span>
            </div>
            <ProgressBar value={overallPercentage} color="yellow" size="lg" className="h-2.5" />
            
            {/* ANALYTICS BANNER */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-ctp-mantle rounded-2xl p-3 border border-ctp-surface1 text-center shadow-sm">
                <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1 opacity-60">Est. Cost</p>
                <p className="text-xs font-black text-ctp-text">{analytics.cost.total}</p>
              </div>
              <div className="bg-ctp-mantle rounded-2xl p-3 border border-ctp-surface1 text-center shadow-sm">
                <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1 opacity-60">Time Goal</p>
                <p className="text-xs font-black text-ctp-text">{analytics.time.total}</p>
              </div>
              <div className="bg-ctp-mantle rounded-2xl p-3 border border-ctp-surface1 text-center shadow-sm">
                <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1 opacity-60">Remaining</p>
                <p className="text-xs font-black text-ctp-text">{totalGuides - analytics.completedGuides} Guides</p>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION ALERT */}
        {isLoggedIn && !isVerified && (
          <div className="mb-8 p-4 bg-ctp-yellow/5 border border-ctp-yellow/20 rounded-2xl flex items-center gap-4">
            <ShieldAlert size={20} className="text-ctp-yellow" />
            <div className="flex-1">
              <p className="text-xs font-bold text-ctp-text">Verification Required</p>
              <p className="text-[10px] text-ctp-subtext1">Syncing progress requires a verified email.</p>
            </div>
            <button 
              onClick={handleResendVerification}
              disabled={isResending}
              className="px-3 py-1.5 bg-ctp-yellow/10 text-ctp-yellow rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-ctp-yellow/20"
            >
              {isResending ? 'Sending...' : 'Verify'}
            </button>
          </div>
        )}

        {/* TIMELINE */}
        <div className="relative pl-0 sm:pl-4">
          <div className="space-y-0">
            {stageStats.map((stage, idx) => {
              const isCompleted = stage.completed;
              // If tracked, allow simultaneous processing of all stages
              const isCurrent = isTracked;
              const isActionable = !isTracked && stage.step === 1;
              const isLocked = !isTracked && stage.step > 1;
              const isLast = idx === stageStats.length - 1;
              
              const statusLabel = isCompleted ? 'Completed' : (isCurrent || isActionable) ? 'In Progress' : isLocked ? 'Locked' : 'Available';
              const statusVariant = isCompleted ? 'green' : (isCurrent || isActionable) ? 'sky' : 'gray';

              return (
                <TimelineStep
                  key={idx}
                  indicator={stage.step}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent || isActionable}
                  isLocked={isLocked}
                  isLast={isLast}
                >
                  {/* STAGE HEADER */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className={`text-[17px] font-black leading-tight ${isCompleted ? 'text-ctp-subtext0 line-through' : 'text-ctp-text'}`}>
                        {stage.step}. {stage.label}
                      </h2>
                      <Badge variant={statusVariant} className="text-[10px] uppercase tracking-widest py-0.5">
                        {isLocked && <Lock size={10} className="mr-1" />}
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-ctp-subtext0 leading-relaxed">
                      {stage.description || `Step ${stage.step} of your ${bundle.title}.`}
                    </p>
                  </div>

                  {/* GUIDES LIST */}
                  <div className="space-y-4">
                    {stage.guidesData.map((guide, gIdx) => (
                      <StageGuideCard 
                        key={gIdx} 
                        guide={guide} 
                        isLocked={isLocked} 
                        isTracked={isTracked}
                        onStart={handleStartTracking}
                      />
                    ))}
                  </div>

                  {!isTracked && stage.step === 1 && (
                    <div className="mt-8">
                      <Button 
                        onClick={handleStartTracking}
                        isLoading={isLoading}
                        className="w-full h-12 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white text-[15px] font-black shadow-lg shadow-brand-blue/20 active:scale-95 transition-all"
                      >
                        Start This Workflow
                      </Button>
                    </div>
                  )}
                </TimelineStep>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStopTracking}
        title="Stop tracking bundle?"
        message="Are you sure you want to stop tracking this life event bundle? This will remove the bundle from your dashboard, but your individual guide progress will be saved."
        confirmText="Stop Tracking"
        variant="danger"
      />
    </div>
  );
}

const StageGuideCard = ({ guide, isLocked, isTracked, onStart }) => {
  const isCompleted = guide.progress?.completed;
  const displayTitle = guide.shortTitle || guide.title;

  const CardContent = (
    <>
      <div className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
        <GuideIcon slug={guide.slug} agency={guide.agency} size={24} className="object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-ctp-text truncate">{displayTitle}</h4>
        <p className="text-[10px] text-ctp-subtext0 font-medium line-clamp-1">
          {guide.description?.replace(/#{1,6}\s/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1') || 'No description available.'}
        </p>
      </div>

      <div className="shrink-0">
        {isLocked ? (
          <Lock size={14} className="text-ctp-subtext1 opacity-50" />
        ) : isCompleted ? (
          <div className="w-5 h-5 rounded-full bg-ctp-green flex items-center justify-center shadow-sm">
            <Check size={12} className="text-white" strokeWidth={4} />
          </div>
        ) : (
          <ChevronRight size={16} className="text-ctp-subtext1 group-hover:text-brand-blue transition-colors" />
        )}
      </div>
    </>
  );

  const containerClasses = `bg-ctp-mantle border border-ctp-surface1 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 group ${
    isLocked ? 'opacity-50 grayscale select-none pointer-events-none' : 'hover:shadow-md hover:border-brand-blue/30 active:scale-[0.98]'
  }`;

  if (isLocked) {
    return (
      <div className={containerClasses}>
        {CardContent}
      </div>
    );
  }

  if (!isTracked) {
    return (
      <button onClick={onStart} className={`${containerClasses} w-full text-left`}>
        {CardContent}
      </button>
    );
  }

  return (
    <Link href={`/guides/${guide.slug}`} className={containerClasses}>
      {CardContent}
    </Link>
  );
};


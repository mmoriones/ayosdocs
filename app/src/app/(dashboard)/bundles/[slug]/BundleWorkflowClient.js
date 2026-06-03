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
import { bundleStyles, bundleImages } from '@/lib/assetStyles';
import { useToast } from '@/context';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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

  const theme = bundleStyles[bundle.id] || bundleStyles['foundational-docs'];
  const imagePath = bundleImages[bundle.id] || bundleImages['foundational-docs'];

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

  const startText = isLoggedIn ? 'Start This Workflow' : 'Login to Start Tracking';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ 
        title: `${bundle.title} | AyosDocs`, 
        text: `Check out this life event bundle: ${bundle.title}`, 
        url: window.location.href 
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'success', title: 'Link Copied', message: 'URL copied to clipboard.' });
    }
  };

  return (
    <div className="min-h-screen bg-ios-gradient font-sans pb-32 selection:bg-[#0038A8]/10 text-[#1C1C1E]">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/40">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/bundles"
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-all"
          >
            <ChevronLeft size={22} className="text-[#1C1C1E]" strokeWidth={2.5} />
          </Link>
          <div className="flex-1 px-4 min-w-0 text-center">
             <h2 className="text-[14px] font-bold text-[#1C1C1E] truncate px-4">{bundle.title.split(' / ')[0]}</h2>
          </div>
          <div className="flex items-center gap-2">
            {isTracked && (
               <button 
                onClick={() => setIsConfirmOpen(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-50 text-red-500 rounded-full text-[11px] font-bold uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Stop'}
              </button>
            )}
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 active:scale-90 transition-all hover:bg-gray-50"
            >
              <Share2 size={18} className="text-[#1C1C1E]" />
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-10 pb-12 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <div 
            className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-[32px] flex items-center justify-center relative overflow-hidden mb-8 shadow-inner border border-white/40"
            style={{ background: theme.gradient || theme.bg }}
          >
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <Image 
                src={imagePath} 
                alt={bundle.title}
                fill
                className="object-contain drop-shadow-[-10px_12px_16px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
          <Badge variant="sky" className="mb-4 text-[10px] uppercase tracking-[0.15em] font-black py-1 px-3 bg-[#0038A8]/5 text-[#0038A8] border-[#0038A8]/10 rounded-full">
            {bundle.category}
          </Badge>
          <h1 className="text-[32px] lg:text-[42px] font-black text-[#1C1C1E] tracking-tight leading-[1.1] mb-4">
            {bundle.title}
          </h1>
          <p className="text-[16px] lg:text-[17px] font-medium text-gray-500 leading-relaxed max-w-[500px] mx-auto">
            {bundle.description}
          </p>

          {!isTracked && (
            <div className="mt-10 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Button 
                onClick={handleStartTracking}
                isLoading={isLoading}
                className="w-full max-w-[320px] h-14 rounded-2xl bg-[#0038A8] hover:bg-[#0038A8]/90 text-white text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.25)] active:scale-95 transition-all"
              >
                {startText}
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Free</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{totalGuides} Guides</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{analytics.time.total}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[650px] mx-auto px-6">
        
        {/* PROGRESS SECTION */}
        {isTracked && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Overall Progress</span>
              <span className="text-sm font-black text-[#1C1C1E]">{overallPercentage}%</span>
            </div>
            <ProgressBar value={overallPercentage} color="blue" size="lg" className="h-3 rounded-full" />
            
            {/* ANALYTICS BANNER */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-4 border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Est. Cost</p>
                <p className="text-[15px] font-black text-[#1C1C1E]">{analytics.cost.total}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-4 border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Time Goal</p>
                <p className="text-[15px] font-black text-[#1C1C1E]">{analytics.time.total}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-4 border border-white/60 text-center shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Remaining</p>
                <p className="text-[15px] font-black text-[#1C1C1E]">{totalGuides - analytics.completedGuides} <span className="text-[11px] text-gray-400">Guides</span></p>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION ALERT */}
        {isLoggedIn && !isVerified && (
          <div className="mb-12 p-5 bg-orange-50/50 backdrop-blur-md border border-orange-100 rounded-[28px] flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <ShieldAlert size={24} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#1C1C1E]">Verification Required</p>
              <p className="text-[13px] text-gray-500 font-medium">Syncing progress requires a verified email.</p>
            </div>
            <button 
              onClick={handleResendVerification}
              disabled={isResending}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-[12px] uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all"
            >
              {isResending ? 'Sending...' : 'Verify'}
            </button>
          </div>
        )}

        {/* TIMELINE */}
        <div className="relative">
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
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className={`text-[19px] font-black tracking-tight ${isCompleted ? 'text-gray-400 line-through' : 'text-[#1C1C1E]'}`}>
                        {stage.label}
                      </h2>
                      {!(isActionable && !isTracked) && (
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                          isCompleted ? 'bg-green-50 text-green-600 border-green-100' : 
                          (isCurrent || isActionable) ? 'bg-[#0038A8]/5 text-[#0038A8] border-[#0038A8]/10' : 
                          'bg-gray-50 text-gray-400 border-gray-100'
                        }`}>
                          {isLocked && <Lock size={10} strokeWidth={3} />}
                          {statusLabel}
                        </div>
                      )}
                    </div>
                    <p className="text-[15px] font-medium text-gray-500 leading-relaxed">
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
                        className="w-full h-14 rounded-2xl bg-[#0038A8] hover:bg-[#0038A8]/90 text-white text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.2)] active:scale-95 transition-all"
                      >
                        {startText}
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
      <div className="w-12 h-12 rounded-[14px] bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
        <GuideIcon slug={guide.slug} agency={guide.agency} size={28} className="relative z-10" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-[#1C1C1E] truncate group-hover:text-[#0038A8] transition-colors">{displayTitle}</h4>
        <p className="text-[12px] text-gray-400 font-medium truncate mt-0.5">
          {guide.description?.replace(/#{1,6}\s/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1') || 'No description available.'}
        </p>
      </div>

      <div className="shrink-0">
        {isLocked ? (
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
            <Lock size={14} className="text-gray-300" strokeWidth={3} />
          </div>
        ) : isCompleted ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm shadow-green-500/20 animate-in zoom-in-50 duration-500">
            <Check size={16} className="text-white" strokeWidth={4} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#0038A8]/10 group-hover:text-[#0038A8] transition-all">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
        )}
      </div>
    </>
  );

  const containerClasses = `bg-white/60 backdrop-blur-md border border-white/60 rounded-[22px] p-4 flex items-center gap-4 transition-all duration-300 group ${
    isLocked ? 'opacity-50 grayscale select-none pointer-events-none' : 'hover:shadow-md hover:border-[#0038A8]/20 active:scale-[0.98]'
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

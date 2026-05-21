'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  AlertCircle,
  PlayCircle,
  ChevronRight,
  Info,
  PauseCircle,
  Loader2,
  ShieldAlert,
  Lock,
  Send,
  CheckCircle
} from 'lucide-react';
import { getBundleIcon } from '@/lib/bundleIcons';
import GuideCard from '@/features/guides/components/GuideCard';
import { startBundleAction, stopBundleAction, resendVerificationAction, toggleFavoriteAction } from '@/app/actions/user';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';

/**
 * BundleWorkflowClient Component
 * Visualizes a sequential roadmap for a requirement bundle.
 */
export default function BundleWorkflowClient({ bundle, allGuides, initialIsTracked, savedProgress = [] }) {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const queryClient = useQueryClient();

  // Fetch comprehensive user data
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (slug) => {
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

  const handleFavoriteGuide = (slug) => {
    favoriteMutation.mutate(slug);
  };

  const [isTracked, setIsTracked] = useState(initialIsTracked);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const result = await resendVerificationAction();
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Verification Sent',
          message: result.message
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: result.message
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to resend verification email.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleToggleTracking = async () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!isVerified) {
      showToast({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your email to track requirement bundles.'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isTracked) {
        const res = await stopBundleAction(bundle.id);
        if (res.success) {
          setIsTracked(false);
          showToast({ type: 'success', title: 'Workflow Stopped', message: 'This bundle is no longer being tracked.' });
        } else {
          showToast({ type: 'error', title: 'Error', message: res.message });
        }
      } else {
        const res = await startBundleAction(bundle.id);
        if (res.success) {
          setIsTracked(true);
          showToast({ type: 'success', title: 'Workflow Started', message: 'Workflow started and added to your dashboard.' });
          router.refresh(); // Refresh to update server-side data if needed
        } else {
          showToast({ type: 'error', title: 'Error', message: res.message });
        }
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);

  // Helper to check if a specific guide is tracked and its progress
  const getGuideProgress = (slug) => {
    const progress = savedProgress.find(p => p.guideSlug === slug);
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

    bundle.flow.forEach(step => {
      step.guides.forEach(slug => {
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

    const overallPercentage = Math.round((completedGuides / totalGuides) * 100);

    return {
      completedGuides,
      overallPercentage,
      cost: {
        total: `₱${totalMinCost}-${totalMaxCost}`,
        remaining: `₱${totalMinCost - completedMinCost}-${totalMaxCost - completedMaxCost}`,
        percentage: totalMaxCost > 0 ? Math.round((completedMaxCost / totalMaxCost) * 100) : 0
      },
      time: {
        total: `${totalMinDays}-${totalMaxDays} days`,
        remaining: `${totalMinDays - completedMinDays}-${totalMaxDays - completedMaxDays} days`,
        percentage: totalMaxDays > 0 ? Math.round((completedMaxDays / totalMaxDays) * 100) : 0
      }
    };
  }, [bundle, allGuides, savedProgress]);

  // Calculate stage completion and active stage
  const stageStats = useMemo(() => {
    return bundle.flow.map(stage => {
      const stageGuides = stage.guides.map(slug => getGuideProgress(slug));
      const allCompleted = stageGuides.every(g => g.completed);
      const anyTracked = stageGuides.some(g => g.tracked);
      
      return {
        ...stage,
        completed: allCompleted,
        anyTracked
      };
    });
  }, [bundle.flow, savedProgress]);

  // Find the first incomplete stage
  const activeStage = stageStats.find(s => !s.completed)?.step || bundle.flow.length;

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-24">
      {/* NAVIGATION & HEADER */}
      <div className="bg-ctp-base/80 border-b border-ctp-surface1 sticky top-0 z-50 backdrop-blur-md h-16 flex items-center">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0 shadow-inner">
              {getBundleIcon(bundle.id, { size: 20, className: "text-ctp-sky-800" })}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ctp-text truncate tracking-tight">{bundle.title}</h2>
              <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest block leading-none">{bundle.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Global Progress</span>
              <span className="text-xs font-bold text-ctp-text">{isTracked ? (stageStats.every(s => s.completed) ? 'Completed' : 'In Progress') : 'Not Active'}</span>
            </div>
            <button 
              onClick={handleToggleTracking}
              disabled={isLoading}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2 ${
                isTracked 
                  ? 'bg-ctp-mantle text-ctp-text border border-ctp-surface1 hover:bg-ctp-base' 
                  : 'bg-ctp-sky-800 text-white hover:bg-ctp-sky-800/90'
              }`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isTracked ? (
                <>
                  <PauseCircle size={14} />
                  Stop Tracking
                </>
              ) : (
                <>
                  <PlayCircle size={14} />
                  Start Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        
        {isLoggedIn && !isVerified && (
          <div className="mb-10 animate-shake">
            <div className="bg-ctp-yellow/5 border border-ctp-yellow/20 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-yellow/20 flex items-center justify-center text-ctp-yellow shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div className="space-y-0.5 text-center md:text-left">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight">Email Verification Required</h3>
                  <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">
                    You can view this roadmap, but syncing progress requires a verified email.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleResendVerification}
                disabled={isResending}
                className="px-5 py-2 bg-ctp-yellow/10 text-ctp-yellow rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-ctp-yellow/20 transition-all shadow-sm shrink-0 flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Link'
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT CONTENT: WORKFLOW TIMELINE */}
          <div className="flex-1 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shadow-inner">
                  {getBundleIcon(bundle.id, { size: 24, className: "text-ctp-sky-800" })}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest px-2 py-0.5 bg-ctp-sky-800/5 rounded border border-ctp-sky-800/20">
                      {bundle.category}
                    </span>
                    <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-80">
                      Roadmap View
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-ctp-text tracking-tight leading-none">
                    {bundle.title}
                  </h1>
                </div>
              </div>
              <p className="text-sm text-ctp-subtext1 leading-relaxed max-w-2xl font-medium">
                {bundle.description}
              </p>
            </header>

            <div className="relative">
              {/* VERTICAL LINE */}
              <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-ctp-surface1/50" />

              <div className="space-y-16">
                {/* Analytics Summary Banner */}
                {isTracked && (
                   <div className="relative ml-20 bg-ctp-mantle border border-ctp-surface1 rounded-2xl p-6 mb-12 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Resource Forecast</h4>
                        <p className="text-sm font-bold text-ctp-text">Estimated to complete this workflow</p>
                      </div>
                      <div className="flex gap-10">
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1">Total Cost</p>
                          <p className="text-lg font-bold text-ctp-text leading-none">{analytics.cost.total}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1">Time Investment</p>
                          <p className="text-lg font-bold text-ctp-text leading-none">{analytics.time.total}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1">Guides Left</p>
                          <p className="text-lg font-bold text-ctp-text leading-none">{totalGuides - analytics.completedGuides}</p>
                        </div>
                      </div>
                   </div>
                )}
                {stageStats.map((step, stepIdx) => {
                  const isLocked = step.step > activeStage && !isTracked;
                  const isCurrent = step.step === activeStage && isTracked;
                  
                  return (
                    <div key={stepIdx} className={`relative pl-20 transition-all duration-500 ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                      {/* STEP INDICATOR */}
                      <div className={`absolute left-0 top-0 w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-500 z-10 shadow-sm ${
                        step.completed 
                          ? 'bg-ctp-green border-ctp-green text-white scale-95' 
                          : step.step <= activeStage
                            ? 'bg-ctp-sky-800 border-ctp-sky-800 text-white scale-100 shadow-lg shadow-ctp-sky-800/20' 
                            : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1'
                      }`}>
                        {step.completed ? <CheckCircle size={20} strokeWidth={3} /> : <span className="text-lg font-bold">{step.step}</span>}
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h2 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-70">Stage {step.step}</h2>
                            {step.completed && (
                              <span className="px-2 py-0.5 bg-ctp-green/10 text-ctp-green border border-ctp-green/20 rounded text-[9px] font-bold uppercase tracking-widest">Complete</span>
                            )}
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-ctp-sky-800/10 text-ctp-sky-800 border border-ctp-sky-800/20 rounded text-[9px] font-bold uppercase tracking-widest animate-pulse">Current Focus</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-ctp-text tracking-tight">{step.label}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {step.guides.map((guideSlug) => {
                            const guide = allGuides.find(g => g.slug === guideSlug);
                            const guideProgress = getGuideProgress(guideSlug);
                            const fullProgress = userData?.savedProgress?.find(p => p.guideSlug === guideSlug);
                            
                            return (
                              <GuideCard 
                                key={guideSlug}
                                guide={guide || { slug: guideSlug, title: guideSlug.replace(/-/g, ' ') }}
                                progress={{ ...guideProgress, isFavorite: fullProgress?.isFavorite }}
                                showAgency={true}
                                showBookmark={true}
                                showFooter={true}
                                onFavorite={() => handleFavoriteGuide(guideSlug)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: BUNDLE STATS & ADVICE */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="space-y-6 sticky top-24">
              
              {!isLoggedIn && (
                <div className="bg-ctp-sky-800 text-white rounded-xl p-5 space-y-4 shadow-lg shadow-ctp-sky-800/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Lock size={18} strokeWidth={2.5} />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Cloud Sync</h4>
                  </div>
                  <p className="text-xs font-medium leading-relaxed relative z-10 opacity-90">
                    Sign in to track this roadmap and save your progress across all devices.
                  </p>
                  <button 
                    onClick={openAuthModal}
                    className="w-full py-2 bg-white text-ctp-sky-800 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-sm relative z-10"
                  >
                    Authenticate
                  </button>
                </div>
              )}

              <div className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
                  <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Workflow Insights</h3>
                </div>
                <div className="divide-y divide-ctp-surface1/50">
                  <div className="p-4 space-y-3 hover:bg-ctp-mantle/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-ctp-green" />
                        <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-widest">Documents</span>
                      </div>
                      <span className="text-xs font-bold text-ctp-text">{analytics.completedGuides} / {totalGuides}</span>
                    </div>
                    <div className="h-1 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1/30">
                      <div className="h-full bg-ctp-green transition-all duration-1000" style={{ width: `${analytics.overallPercentage}%` }} />
                    </div>
                  </div>

                  <div className="p-4 space-y-3 hover:bg-ctp-mantle/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-ctp-sky-800" />
                        <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-widest">Est. Duration</span>
                      </div>
                      <span className="text-xs font-bold text-ctp-text">{analytics.time.total}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-70">
                      <span>Remaining</span>
                      <span>{analytics.time.remaining}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 hover:bg-ctp-mantle/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign size={14} className="text-ctp-yellow" />
                        <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-widest">Est. Cost</span>
                      </div>
                      <span className="text-xs font-bold text-ctp-text">{analytics.cost.total}</span>
                    </div>
                    <div className="h-1 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1/30">
                      <div className="h-full bg-ctp-yellow transition-all duration-1000" style={{ width: `${analytics.cost.percentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-70">
                      <span>Spent</span>
                      <span>{analytics.cost.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-ctp-mantle border border-ctp-surface1 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center gap-3 text-ctp-sky-800">
                  <Info size={16} />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Roadmap Tip</h4>
                </div>
                <p className="text-xs text-ctp-subtext1 leading-relaxed font-medium">
                  Focus on <strong className="text-ctp-text">Stage 1</strong> items first. These foundational documents are often required as prerequisites for subsequent stages.
                </p>
              </div>

              <button 
                onClick={handleToggleTracking}
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  isTracked 
                    ? 'bg-ctp-mantle text-ctp-text border border-ctp-surface1 hover:bg-ctp-base' 
                    : 'bg-ctp-sky-800 text-white hover:bg-ctp-sky-800/90 shadow-lg shadow-ctp-sky-800/10'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isTracked ? (
                  'Disable Roadmap'
                ) : (
                  'Activate Workflow'
                )}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

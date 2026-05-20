'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
import { startBundleAction, stopBundleAction, resendVerificationAction } from '@/app/actions/user';
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
      <div className="bg-ctp-base/80 border-b border-ctp-surface1 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/bundles" className="flex items-center gap-2 text-ctp-subtext1 hover:text-ctp-sky transition-colors group">
            <ArrowLeft size={16} />
            <span className="text-sm font-medium hidden sm:inline">Back to Bundles</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-semibold text-ctp-subtext0 uppercase tracking-wider">Global Progress</span>
              <span className="text-xs font-medium text-ctp-text">{isTracked ? (stageStats.every(s => s.completed) ? 'Completed' : 'In Progress') : 'Not Started'}</span>
            </div>
            <button 
              onClick={handleToggleTracking}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-2 ${
                isTracked 
                  ? 'bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1' 
                  : 'bg-ctp-sky text-ctp-base hover:bg-ctp-sky/90'
              }`}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isTracked ? (
                <>
                  <PauseCircle size={16} />
                  Stop Tracking
                </>
              ) : (
                <>
                  <PlayCircle size={16} />
                  Start Workflow
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        
        {isLoggedIn && !isVerified && (
          <div className="mb-12 animate-shake">
            <div className="bg-ctp-yellow-800/10 border border-ctp-yellow-800/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-ctp-base border border-ctp-yellow-800/20 flex items-center justify-center text-ctp-yellow-800 shrink-0 shadow-sm">
                  <ShieldAlert size={28} />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-ctp-yellow-800 tracking-tight">Tracking Restricted</h3>
                  <p className="text-sm text-ctp-yellow-800/80 font-medium leading-relaxed">
                    You can view this roadmap, but syncing progress to your dashboard requires a verified email.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleResendVerification}
                disabled={isResending}
                className="px-6 py-2.5 bg-ctp-yellow-800 text-ctp-base rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification'
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT CONTENT: WORKFLOW TIMELINE */}
          <div className="flex-1 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shadow-sm">
                  {getBundleIcon(bundle.id)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold text-ctp-sky uppercase tracking-wider px-2 py-0.5 bg-ctp-sky/10 rounded-md border border-ctp-sky/20">
                      {bundle.category}
                    </span>
                    <span className="text-[10px] font-semibold text-ctp-subtext0 uppercase tracking-wider">
                      Roadmap
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-ctp-text tracking-tight">
                    {bundle.title}
                  </h1>
                </div>
              </div>
              <p className="text-lg text-ctp-subtext1 leading-relaxed max-w-2xl">
                {bundle.description}
              </p>
            </header>

            <div className="relative">
              {/* VERTICAL LINE */}
              <div className="absolute left-8 top-10 bottom-10 w-px bg-ctp-surface1" />

              <div className="space-y-20">
                {stageStats.map((step, stepIdx) => {
                  const isLocked = step.step > activeStage && !isTracked;
                  const isCurrent = step.step === activeStage && isTracked;
                  
                  return (
                    <div key={stepIdx} className={`relative pl-24 group transition-opacity duration-500 ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                      {/* STEP INDICATOR */}
                      <div className={`absolute left-0 top-0 w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-500 z-10 shadow-sm ${
                        step.completed 
                          ? 'bg-ctp-green border-ctp-green text-ctp-base scale-100' 
                          : step.step <= activeStage
                            ? 'bg-ctp-sky border-ctp-sky text-ctp-base scale-105 shadow-md shadow-ctp-sky/10' 
                            : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1'
                      }`}>
                        {step.completed ? <CheckCircle2 size={24} /> : <span className="text-xl font-bold">{step.step}</span>}
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-[10px] font-bold text-ctp-sky uppercase tracking-wider">Stage {step.step}</h2>
                            {step.completed && (
                              <span className="px-2 py-0.5 bg-ctp-green/10 text-ctp-green border border-ctp-green/20 rounded-md text-[8px] font-bold uppercase tracking-wider">Complete</span>
                            )}
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-ctp-sky/10 text-ctp-sky border border-ctp-sky/20 rounded-md text-[8px] font-bold uppercase tracking-wider animate-pulse">Current Focus</span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-ctp-text tracking-tight">{step.label}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {step.guides.map((guideSlug) => {
                            const guide = allGuides.find(g => g.slug === guideSlug);
                            const progress = getGuideProgress(guideSlug);
                            
                            return (
                              <GuideCard 
                                key={guideSlug}
                                guide={guide || { slug: guideSlug, title: guideSlug.replace(/-/g, ' ') }}
                                progress={progress}
                                showAgency={true}
                                showBookmark={true}
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
          <aside className="w-full lg:w-96 shrink-0 space-y-8">
            <div className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 shadow-sm space-y-8 sticky top-24">
              
              {!isLoggedIn && (
                <div className="bg-ctp-sky-800 text-ctp-base rounded-xl p-5 space-y-4 shadow-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-ctp-base/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Lock size={20} />
                    <h4 className="text-xs font-bold uppercase tracking-tight">Sync Progress</h4>
                  </div>
                  <p className="text-[11px] font-semibold leading-relaxed relative z-10 opacity-90">
                    Sign in to track this bundle and save your progress across devices.
                  </p>
                  <button 
                    onClick={openAuthModal}
                    className="w-full py-2.5 bg-ctp-base text-ctp-sky-800 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-ctp-base/90 transition-all shadow-sm relative z-10"
                  >
                    Get Started
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ctp-text uppercase tracking-wider">Workflow Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-ctp-mantle rounded-xl border border-ctp-surface1">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-ctp-green" />
                      <span className="text-xs font-semibold text-ctp-subtext1">Total Tasks</span>
                    </div>
                    <span className="text-sm font-bold text-ctp-text">{totalGuides}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-ctp-mantle rounded-xl border border-ctp-surface1">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-ctp-sky" />
                      <span className="text-xs font-semibold text-ctp-subtext1">Est. Duration</span>
                    </div>
                    <span className="text-sm font-bold text-ctp-text">~2-4 Weeks</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-ctp-mantle rounded-xl border border-ctp-surface1">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className="text-ctp-yellow" />
                      <span className="text-xs font-semibold text-ctp-subtext1">Complexity</span>
                    </div>
                    <span className="text-sm font-bold text-ctp-text">Moderate</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-ctp-sky/5 rounded-xl border border-ctp-sky/10 space-y-3">
                <div className="flex items-center gap-3 text-ctp-sky">
                  <Info size={16} />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Pro Tip</h4>
                </div>
                <p className="text-xs text-ctp-subtext1 leading-relaxed">
                  Start with <strong className="text-ctp-text">Stage 1</strong>. These are foundational documents that you will likely need to present when applying for the items in later stages.
                </p>
              </div>

              <button 
                onClick={handleToggleTracking}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all ${
                  isTracked 
                    ? 'bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1' 
                    : 'bg-ctp-sky text-ctp-base hover:bg-ctp-sky/90 shadow-ctp-sky/10'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin mx-auto" />
                ) : isTracked ? (
                  'Stop Tracking This Goal'
                ) : (
                  'Add to My Docs'
                )}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

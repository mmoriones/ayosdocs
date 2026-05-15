'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Loader2
} from 'lucide-react';
import { getGuideIcon } from '@/lib/guideIcons';
import GuideCard from '@/features/guides/components/GuideCard';
import { startBundleAction, stopBundleAction } from '@/app/actions/user';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

/**
 * BundleWorkflowClient Component
 * Visualizes a sequential roadmap for a requirement bundle.
 */
export default function BundleWorkflowClient({ bundle, allGuides, initialIsTracked, savedProgress = [] }) {
  const [isTracked, setIsTracked] = useState(initialIsTracked);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleToggleTracking = async () => {
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
          showToast({ type: 'success', title: 'Workflow Started', message: 'Workflow started and all guides added to your dashboard.' });
          // Optional: router.refresh() to get latest savedProgress if needed, 
          // but for now we'll rely on local state or next navigation
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
      <div className="bg-ctp-mantle border-b border-ctp-surface0 sticky top-0 z-50 backdrop-blur-md bg-ctp-mantle/80">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/bundles" className="flex items-center gap-3 text-ctp-subtext1 hover:text-ctp-sky-800 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface0 flex items-center justify-center group-hover:border-ctp-sky-800/30 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Back to Bundles</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-widest">Global Progress</span>
              <span className="text-xs font-bold text-ctp-text">{isTracked ? (stageStats.every(s => s.completed) ? 'Completed' : 'In Progress') : 'Not Started'}</span>
            </div>
            <button 
              onClick={handleToggleTracking}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                isTracked 
                  ? 'bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1 shadow-none' 
                  : 'bg-ctp-sky-800 text-ctp-base shadow-ctp-sky-800/20'
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
                  Start This Workflow
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT CONTENT: WORKFLOW TIMELINE */}
          <div className="flex-1 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-ctp-mantle flex items-center justify-center text-4xl shadow-inner border border-ctp-surface0">
                  {bundle.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-ctp-sky-800 uppercase tracking-widest px-2.5 py-0.5 bg-ctp-sky-800/10 rounded-full border border-ctp-sky-800/20">
                      {bundle.category}
                    </span>
                    <span className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-widest">
                      Roadmap
                    </span>
                  </div>
                  <h1 className="text-[32px] md:text-[40px] font-black text-ctp-text uppercase tracking-tight leading-none">
                    {bundle.title}
                  </h1>
                </div>
              </div>
              <p className="text-[18px] text-ctp-subtext1 font-medium leading-relaxed max-w-2xl">
                {bundle.description}
              </p>
            </header>

            <div className="relative">
              {/* VERTICAL LINE */}
              <div className="absolute left-8 top-10 bottom-10 w-1 bg-ctp-surface0 rounded-full" />

              <div className="space-y-20">
                {stageStats.map((step, stepIdx) => {
                  const isLocked = step.step > activeStage && !isTracked;
                  const isCurrent = step.step === activeStage && isTracked;
                  
                  return (
                    <div key={stepIdx} className={`relative pl-24 group transition-opacity duration-500 ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                      {/* STEP INDICATOR */}
                      <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 z-10 shadow-xl ${
                        step.completed 
                          ? 'bg-ctp-green border-ctp-green text-ctp-base scale-100' 
                          : step.step <= activeStage
                            ? 'bg-ctp-sky-800 border-ctp-sky-800 text-ctp-base scale-110 shadow-ctp-sky-800/20' 
                            : 'bg-ctp-base border-ctp-surface0 text-ctp-subtext1'
                      }`}>
                        {step.completed ? <CheckCircle2 size={24} /> : <span className="text-xl font-black">{step.step}</span>}
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-[11px] font-black text-ctp-sky-800 uppercase tracking-[0.3em]">Stage {step.step}</h2>
                            {step.completed && (
                              <span className="px-2 py-0.5 bg-ctp-green/10 text-ctp-green border border-ctp-green/20 rounded-md text-[8px] font-black uppercase tracking-widest">Complete</span>
                            )}
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-ctp-sky-800/10 text-ctp-sky-800 border border-ctp-sky-800/20 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse">Current Focus</span>
                            )}
                          </div>
                          <h3 className="text-2xl font-black text-ctp-text uppercase tracking-tight">{step.label}</h3>
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
            <div className="bg-ctp-mantle rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm space-y-8 sticky top-32">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-ctp-text uppercase tracking-widest">Workflow Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-ctp-base rounded-2xl border border-ctp-surface0">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-ctp-green" />
                      <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-tight">Total Tasks</span>
                    </div>
                    <span className="text-sm font-black text-ctp-text">{totalGuides}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ctp-base rounded-2xl border border-ctp-surface0">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-ctp-sky-800" />
                      <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-tight">Est. Duration</span>
                    </div>
                    <span className="text-sm font-black text-ctp-text">~2-4 Weeks</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-ctp-base rounded-2xl border border-ctp-surface0">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={18} className="text-ctp-yellow" />
                      <span className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-tight">Complexity</span>
                    </div>
                    <span className="text-sm font-black text-ctp-text">Moderate</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-ctp-sky-800/5 rounded-3xl border border-ctp-sky-800/10 space-y-4">
                <div className="flex items-center gap-3 text-ctp-sky-800">
                  <Info size={18} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Pro Tip</h4>
                </div>
                <p className="text-[12px] text-ctp-subtext1 leading-relaxed font-medium">
                  Start with <strong className="text-ctp-text uppercase">Stage 1</strong>. These are foundational documents that you will likely need to present when applying for the items in later stages.
                </p>
              </div>

              <button 
                onClick={handleToggleTracking}
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl active:scale-95 transition-all ${
                  isTracked 
                    ? 'bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1' 
                    : 'bg-ctp-sky-800 text-ctp-base shadow-ctp-sky-800/20'
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

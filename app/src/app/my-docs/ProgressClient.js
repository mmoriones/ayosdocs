'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Loader2, 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  List,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { bundles } from "@/data/bundles";

import SummaryStats from '@/features/guides/components/tracking/SummaryStats';
import BundleCard from '@/features/guides/components/tracking/BundleCard';
import GuideRowCard from '@/features/guides/components/tracking/GuideRowCard';
import DashboardSidebar from '@/features/guides/components/tracking/DashboardSidebar';
import { useToast } from '@/context/ToastContext';
import ConfirmModal from '@/components/ConfirmModal';
import { deleteProgressAction } from '@/app/actions/user';
import axios from 'axios';

/**
 * ProgressClient Component
 */
export default function ProgressClient({ allGuides, isRestricted }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently updated');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: userData = { savedProgress: [] }, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: !isRestricted,
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
      if (isRestricted) throw new Error("Verification required");
      const result = await deleteProgressAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: 'Guide Removed',
        message: 'The guide has been removed from your tracked list.'
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message === "Verification required" 
          ? "Please verify your email to perform this action."
          : (error.message || 'Failed to remove guide. Please try again.')
      });
    }
  });

  const handleDeleteGuide = (slug) => {
    if (isRestricted) {
      showToast({
        type: 'warning',
        title: 'Verification Required',
        message: 'Please verify your email to manage your guides.'
      });
      return;
    }
    setSelectedSlug(slug);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSlug) {
      deleteMutation.mutate(selectedSlug);
    }
  };

  const processedGuides = useMemo(() => {
    return userData.savedProgress
      .map((item) => {
        const guide = allGuides.find(g => g.slug === item.guideSlug);
        if (!guide) return null;

        const completedIndices = item.completedTasks
          ? item.completedTasks.split(',').map(Number)
          : [];
        
        const steps = (guide.checklist || []).map((task, idx) => ({
          task,
          completed: completedIndices.includes(idx)
        }));

        return {
          guide,
          slug: item.guideSlug,
          steps,
          progress: {
            completedCount: completedIndices.length,
            totalCount: steps.length,
            isFavorite: false
          }
        };
      })
      .filter(Boolean);
  }, [userData, allGuides]);

  const stats = useMemo(() => {
    const total = processedGuides.length;
    const completed = processedGuides.filter(g => g.progress.completedCount === g.progress.totalCount).length;
    const inProgress = total - completed;
    const activeBundles = userData.trackedBundles?.length || 0;
    
    return {
      total,
      completed,
      inProgress,
      favorites: 0,
      activeBundles
    };
  }, [processedGuides, userData]);

  const bundleProgress = useMemo(() => {
    const trackedIds = userData.trackedBundles?.map(b => b.bundleId) || [];

    return bundles
      .filter(bundle => trackedIds.includes(bundle.id))
      .map(bundle => {
        const allBundleGuides = bundle.flow.flatMap(f => f.guides);
        const relatedGuides = processedGuides.filter(pg => 
          allBundleGuides.includes(pg.guide.slug)
        );

        return {
          bundle,
          completed: relatedGuides.filter(g => g.progress.completedCount === g.progress.totalCount).length,
          total: allBundleGuides.length
        };
      })
      .filter(item => {
        if (searchQuery && !item.bundle.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        const isCompleted = item.completed === item.total && item.total > 0;
        if (activeTab === 'In Progress') return !isCompleted;
        if (activeTab === 'Completed') return isCompleted;
        if (activeTab === 'Favorites') return false; // Bundles don't have favorites yet
        
        return true;
      });
  }, [userData, processedGuides, searchQuery, activeTab]);

  const filteredGuides = useMemo(() => {
    let result = processedGuides;

    if (searchQuery) {
      result = result.filter(g => 
        g.guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === 'In Progress') {
      result = result.filter(g => g.progress.completedCount < g.progress.totalCount);
    } else if (activeTab === 'Completed') {
      result = result.filter(g => g.progress.completedCount === g.progress.totalCount);
    } else if (activeTab === 'Favorites') {
      result = result.filter(g => g.progress.isFavorite);
    }

    return result;
  }, [processedGuides, searchQuery, activeTab]);

  const displayedGuides = useMemo(() => {
    if (activeTab === 'All' && !searchQuery) {
      return filteredGuides.slice(0, visibleCount);
    }
    return filteredGuides;
  }, [filteredGuides, activeTab, searchQuery, visibleCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ctp-base">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-ctp-sky-800" size={40} />
          <p className="text-ctp-subtext1 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-[85vh] bg-ctp-base flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* BACKGROUND DECORATION */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ctp-sky-800/5 rounded-full blur-3xl -z-10 animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ctp-mauve/5 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000" />

        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-6 relative">
            <div className="flex justify-center relative">
              <div className="w-24 h-24 rounded-3xl bg-ctp-yellow-800/10 border border-ctp-yellow-800/20 flex items-center justify-center text-ctp-yellow-800 shadow-xl shadow-ctp-yellow-800/5 animate-shake relative z-10">
                <ShieldAlert size={48} strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 bg-ctp-yellow-800/10 rounded-3xl blur-2xl animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-ctp-text tracking-tight uppercase">Feature Locked</h2>
              <p className="text-ctp-subtext1 font-semibold leading-relaxed text-lg max-w-md mx-auto">
                Your personal government documentation dashboard is waiting. Just one more step to unlock it.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
             {[
               { icon: List, title: "Progress Sync", desc: "Save across devices" },
               { icon: ArrowRight, title: "Life Bundles", desc: "Goal-based tracking" },
               { icon: Loader2, title: "Auto Updates", desc: "Real-time guide info" }
             ].map((item, i) => (
               <div key={i} className="p-6 bg-ctp-mantle border border-ctp-surface1 rounded-2xl space-y-3 text-left hover:border-ctp-sky-800/30 transition-all group">
                 <div className="w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1 shadow-sm group-hover:scale-110 transition-transform">
                   <item.icon size={20} />
                 </div>
                 <div className="space-y-1">
                   <h4 className="font-bold text-sm text-ctp-text">{item.title}</h4>
                   <p className="text-[10px] font-medium text-ctp-subtext1 uppercase tracking-wider">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>

          <div className="bg-ctp-mantle p-8 rounded-3xl border border-ctp-surface1 space-y-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert size={120} />
             </div>
             
             <div className="space-y-2 relative z-10">
                <p className="text-xs font-bold text-ctp-yellow-800 uppercase tracking-[0.3em]">Next Step</p>
                <h3 className="text-xl font-bold text-ctp-text">Check your inbox for a verification link</h3>
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed max-w-sm mx-auto">
                  We sent a link to your email. Click it to instantly unlock your dashboard and start tracking your progress.
                </p>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
                <button 
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto px-8 py-4 bg-ctp-sky-800 text-ctp-base rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 shadow-xl shadow-ctp-sky-800/20 active:scale-95 transition-all"
                >
                  Back to Home
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 bg-ctp-base border border-ctp-surface1 text-ctp-text rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-ctp-mantle active:scale-95 transition-all"
                >
                  Resend Link
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-12">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-ctp-sky-800">
              <ArrowRight size={18} className="-rotate-45" />
              <span className="text-xs font-bold uppercase tracking-widest">My Workspace</span>
            </div>
            <h1 className="text-4xl font-bold text-ctp-text tracking-tight">My Docs</h1>
            <p className="text-ctp-subtext1 text-lg max-w-xl font-medium">Track your government journey, check milestones, and complete goals.</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-12">
            <SummaryStats stats={stats} />

            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex bg-ctp-mantle p-1 rounded-xl border border-ctp-surface1 shadow-sm overflow-x-auto no-scrollbar">
                  {['All', 'In Progress', 'Completed', 'Favorites'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-ctp-sky-800 text-ctp-base shadow-sm' 
                          : 'text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface0'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-ctp-mantle border border-ctp-surface1 rounded-xl px-5 py-2.5 pr-10 text-xs font-bold uppercase tracking-wider text-ctp-subtext1 focus:ring-4 focus:ring-ctp-sky-800/10 transition-all cursor-pointer shadow-sm"
                    >
                      <option>Recently updated</option>
                      <option>Alphabetical</option>
                      <option>Progress %</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                  <button className="p-2.5 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-ctp-subtext0 hover:text-ctp-text shadow-sm transition-all active:scale-90">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ctp-subtext1 transition-colors group-focus-within:text-ctp-sky-800" />
                <input 
                  type="text"
                  placeholder="Search your tracked guides and goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-base shadow-sm focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-ctp-text placeholder:text-ctp-subtext0 font-medium"
                />
              </div>
            </div>

            <section className="space-y-8">
              <div className="flex items-end justify-between border-b border-ctp-surface1 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-ctp-text tracking-tight">Active Goal Bundles</h2>
                  <p className="text-xs text-ctp-subtext0 font-semibold uppercase tracking-wider mt-1">Multi-requirement tracking at scale.</p>
                </div>
                <button 
                  onClick={() => router.push('/bundles')}
                  className="group flex items-center gap-2 text-ctp-sky-800 font-bold text-xs uppercase tracking-wider hover:text-ctp-sky-300 transition-colors mb-1"
                >
                  View Library <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {bundleProgress.map((item) => (
                  <BundleCard 
                    key={item.bundle.id} 
                    bundle={item.bundle} 
                    progress={item} 
                  />
                ))}

                <button 
                  onClick={() => router.push('/bundles')}
                  className="w-full py-8 bg-ctp-mantle border-2 border-dashed border-ctp-surface1 rounded-xl text-ctp-subtext0 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 hover:bg-ctp-sky-800/5 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={24} className="text-ctp-subtext0 group-hover:text-ctp-sky-800" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Explore life event bundles</span>
                </button>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-end justify-between border-b border-ctp-surface1 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-ctp-text tracking-tight">Tracked Procedures</h2>
                  <p className="text-xs text-ctp-subtext0 font-semibold uppercase tracking-wider mt-1">Individual documentation requirements.</p>
                </div>
                <Link href="/guides" className="group flex items-center gap-2 text-ctp-sky-800 font-bold text-xs uppercase tracking-wider hover:text-ctp-sky-300 transition-colors mb-1">
                  Knowledge Base <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {displayedGuides.length > 0 ? (
                  displayedGuides.map((item) => (
                    <GuideRowCard 
                      key={item.guide.slug} 
                      guide={item.guide} 
                      progress={item.progress} 
                      steps={item.steps}
                      onDelete={() => handleDeleteGuide(item.slug)}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-ctp-mantle rounded-xl border border-dashed border-ctp-surface1">
                    <div className="w-14 h-14 bg-ctp-base rounded-xl flex items-center justify-center mx-auto mb-6 border border-ctp-surface1 shadow-inner">
                       <List size={28} className="text-ctp-subtext0" />
                    </div>
                    <h3 className="text-lg font-bold text-ctp-text tracking-tight">No guides found</h3>
                    <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try adjusting your filters or section.</p>
                    <Link href="/guides" className="mt-8 inline-block px-8 py-3 bg-ctp-sky-800 text-ctp-base rounded-xl font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all">Explore all guides</Link>
                  </div>
                )}
                
                {filteredGuides.length > displayedGuides.length && (
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="w-full py-4 text-xs font-bold text-ctp-sky-800 hover:text-ctp-sky-300 uppercase tracking-wider transition-colors border-2 border-dashed border-ctp-surface1 rounded-xl bg-ctp-mantle/50 hover:bg-ctp-mantle active:scale-[0.99]"
                  >
                    Load more items
                  </button>
                )}
              </div>
            </section>

          </div>

          <DashboardSidebar />

        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Stop tracking?"
        message="Are you sure you want to remove this guide? Your progress for this guide will be permanently deleted."
        confirmText="Remove Guide"
        variant="danger"
      />
    </div>
  );
}

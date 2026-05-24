'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  List,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { bundles } from "@/data/bundles";

import { SummaryStats, BundleCard, GuideRowCard, DashboardSidebar } from '@/features/guides/components/tracking';
import { SearchInput, SortDropdown, Skeleton, Card } from '@/components/ui';
import { useToast } from '@/context';
import ConfirmModal from '@/components/ConfirmModal';
import { deleteProgressAction, toggleFavoriteAction } from '@/app/actions/user';
import axios from 'axios';
import { useSession } from 'next-auth/react';

/**
 * ProgressClient Component
 */
export default function ProgressClient({ allGuides, isRestricted }) {
  const router = useRouter();
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently updated');

  const sortOptions = [
    { label: 'Recently updated', value: 'Recently updated' },
    { label: 'Alphabetical', value: 'Alphabetical' },
    { label: 'Progress %', value: 'Progress %' }
  ];

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

  const favoriteMutation = useMutation({
    mutationFn: async (slug) => {
      if (isRestricted) throw new Error("Verification required");
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
        message: error.message === "Verification required" 
          ? "Please verify your email to favorite guides."
          : (error.message || 'Failed to update favorite. Please try again.')
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

  const handleFavoriteGuide = (slug) => {
    favoriteMutation.mutate(slug);
  };

  const confirmDelete = () => {
    if (selectedSlug) {
      deleteMutation.mutate(selectedSlug);
    }
  };

  const processedGuides = useMemo(() => {
    const progressData = userData?.savedProgress || [];
    
    // De-duplicate by guideSlug, keeping the most recently updated one
    const uniqueProgress = [...progressData]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .filter((item, index, self) => 
        index === self.findIndex((t) => t.guideSlug === item.guideSlug)
      );
    
    let result = uniqueProgress
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

        const completedCount = completedIndices.length;
        const totalCount = steps.length;
        const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        return {
          guide,
          slug: item.guideSlug,
          steps,
          updatedAt: item.updatedAt || new Date().toISOString(),
          progress: {
            completedCount,
            totalCount,
            isFavorite: !!item.isFavorite,
            percent
          }
        };
      })
      .filter(Boolean);

    // Sorting logic
    if (sortBy === 'Recently updated') {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.guide.title.localeCompare(b.guide.title));
    } else if (sortBy === 'Progress %') {
      result.sort((a, b) => b.progress.percent - a.progress.percent);
    }

    return result;
  }, [userData, allGuides, sortBy]);

  const stats = useMemo(() => {
    const total = processedGuides.length;
    const completed = processedGuides.filter(g => g.progress.completedCount === g.progress.totalCount).length;
    const inProgress = total - completed;
    const activeBundles = userData.trackedBundles?.length || 0;
    const favorites = processedGuides.filter(g => g.progress.isFavorite).length;
    
    // Aggregate Analytics for Active Bundles
    let totalMinCost = 0;
    let totalMaxCost = 0;
    let totalMinDays = 0;
    let totalMaxDays = 0;

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

    const trackedBundleIds = userData.trackedBundles?.map(b => b.bundleId) || [];
    bundles.filter(b => trackedBundleIds.includes(b.id)).forEach(bundle => {
      bundle.flow.forEach(step => {
        step.guides.forEach(slug => {
          const guide = allGuides.find(g => g.slug === slug);
          const progress = processedGuides.find(pg => pg.slug === slug);
          
          if (!progress?.progress?.completedCount || progress.progress.completedCount < progress.progress.totalCount) {
             const [minC, maxC] = parseCost(guide?.costRange);
             const [minD, maxD] = parseTime(guide?.estimatedTime);
             totalMinCost += minC;
             totalMaxCost += maxC;
             totalMinDays += minD;
             totalMaxDays += maxD;
          }
        });
      });
    });

    return {
      total,
      completed,
      inProgress,
      favorites,
      activeBundles,
      aggregateRemaining: {
        cost: `₱${totalMinCost}-${totalMaxCost}`,
        time: `${totalMinDays}-${totalMaxDays} days`
      }
    };
  }, [processedGuides, userData, allGuides]);

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

        return true;
      });
  }, [userData, processedGuides, searchQuery]);

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

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <div className="px-6 lg:px-10 py-8 border-b border-ctp-surface1 bg-ctp-mantle/50 mb-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ctp-text">Workspace</h1>
            <p className="text-xs text-ctp-subtext1 font-medium">Manage your active workflows and tracked government procedures.</p>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/guides')}
                className="px-5 py-2 bg-ctp-sky-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-ctp-sky-800/90 transition-all flex items-center gap-2 shadow-sm shadow-ctp-sky-800/20 active:scale-95"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>New Tracker</span>
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0 space-y-12">
            {isLoading && !isRestricted ? (
              <>
                <SummaryStats.Skeleton />
                <div className="bg-ctp-mantle border border-ctp-surface1 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-32 h-3" />
                      </div>
                      <Skeleton className="w-48 h-6" />
                      <Skeleton className="w-64 h-3" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 flex-1 max-w-xl">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="w-16 h-2" />
                          <Skeleton className="w-24 h-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <SummaryStats stats={stats} />
                
                {stats.activeBundles > 0 && (
                  <div className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
                    <div className="absolute inset-0 bg-ctp-sky-800/[0.01] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-ctp-sky-800/10 text-ctp-sky-800 flex items-center justify-center shadow-inner">
                            <BarChart3 size={16} strokeWidth={2.5} />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ctp-sky-800">Workflow Analytics</h3>
                        </div>
                        <p className="text-xl font-bold tracking-tight text-ctp-text leading-tight">Milestone Forecast</p>
                        <p className="text-xs text-ctp-subtext1 font-medium max-w-xs leading-relaxed">Aggregated resource estimates for your {stats.activeBundles} active life event bundles.</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 flex-1 max-w-xl">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-ctp-subtext1">Est. Total Cost</span>
                          <p className="text-2xl font-bold tracking-tighter text-ctp-text">{stats.aggregateRemaining.cost}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-ctp-subtext1">Est. Time Left</span>
                          <p className="text-2xl font-bold tracking-tighter text-ctp-text">{stats.aggregateRemaining.time}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-ctp-subtext1">Overall Progress</span>
                          <p className="text-2xl font-bold tracking-tighter text-ctp-sky-800">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Global Utilities Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ctp-mantle/50 p-4 rounded-xl border border-ctp-surface1 border-dashed">
              <div className="flex-1 max-w-xl">
                <SearchInput 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your workspace..."
                  className="bg-ctp-base h-10 shadow-sm"
                />
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest hidden md:block">Sort By:</span>
                <SortDropdown 
                  value={sortBy} 
                  onChange={setSortBy} 
                  options={sortOptions} 
                  className="h-10"
                />
              </div>
            </div>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Goal Bundles</h2>
                  <span className="px-2 py-0.5 rounded-md bg-ctp-sky-800/5 text-ctp-sky-800 text-[10px] font-bold border border-ctp-sky-800/10">
                    {bundleProgress.length}
                  </span>
                </div>
                <button 
                  onClick={() => router.push('/bundles')}
                  className="text-[10px] text-ctp-sky-800 font-bold uppercase tracking-widest hover:text-ctp-sky-300 transition-colors"
                >
                  Browse Roadmaps
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {isLoading && !isRestricted ? (
                  Array.from({ length: 1 }).map((_, i) => (
                    <BundleCard.Skeleton key={i} />
                  ))
                ) : bundleProgress.length > 0 ? (
                  bundleProgress.map((item) => (
                    <BundleCard 
                      key={item.bundle.id} 
                      bundle={item.bundle} 
                      progress={item} 
                    />
                  ))
                ) : !searchQuery && (
                  <button 
                    onClick={() => router.push('/bundles')}
                    className="w-full py-10 bg-ctp-mantle border border-dashed border-ctp-surface1 rounded-2xl text-ctp-subtext1 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 hover:bg-ctp-sky-800/5 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <Plus size={24} className="text-ctp-subtext1 group-hover:text-ctp-sky-800" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-widest">Start a new roadmap</span>
                      <p className="text-[10px] opacity-60 font-medium">Bundled requirements for marriage, business, and more.</p>
                    </div>
                  </button>
                )}
              </div>
            </section>

            <div className="space-y-8 pb-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-ctp-surface1">
                  <div className="flex items-center gap-8 overflow-x-auto no-scrollbar -mb-px">
                    {['All', 'In Progress', 'Completed', 'Favorites'].map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3.5 px-1 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                            isActive
                              ? 'border-ctp-sky-800 text-ctp-sky-800'
                              : 'border-transparent text-ctp-subtext1 hover:text-ctp-text hover:border-ctp-surface1'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  <Link href="/guides" className="text-[10px] text-ctp-sky-800 font-bold uppercase tracking-widest hover:text-ctp-sky-300 transition-colors pb-3.5 px-2">
                    Knowledge Base
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Tracked Procedures</h2>
                  <span className="px-2 py-0.5 rounded-md bg-ctp-sky-800/5 text-ctp-sky-800 text-[10px] font-bold border border-ctp-sky-800/10">
                    {filteredGuides.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {isLoading && !isRestricted ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <GuideRowCard.Skeleton key={i} />
                  ))
                ) : displayedGuides.length > 0 ? (
                  displayedGuides.map((item) => (
                    <GuideRowCard 
                      key={item.guide.slug} 
                      guide={item.guide} 
                      progress={item.progress} 
                      steps={item.steps}
                      onDelete={() => handleDeleteGuide(item.slug)}
                      onFavorite={() => handleFavoriteGuide(item.slug)}
                    />
                  ))
                ) : (
                  <Card background="mantle" className="text-center py-20 border-dashed">
                    <div className="w-14 h-14 bg-ctp-base rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ctp-surface1 shadow-inner">
                       <List size={28} className="text-ctp-subtext1" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base font-bold text-ctp-text uppercase tracking-widest">No tracker activity</h3>
                    <p className="text-xs text-ctp-subtext1 font-medium mt-1">Pick a guide to start tracking your requirements.</p>
                    <Link href="/guides" className="mt-8 inline-block px-8 py-2.5 bg-ctp-sky-800 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-sm shadow-ctp-sky-800/20 active:scale-95 transition-all">Explore all guides</Link>
                  </Card>
                )}
                
                {filteredGuides.length > displayedGuides.length && (
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="w-full py-5 text-[10px] font-bold text-ctp-sky-800 hover:text-ctp-sky-300 uppercase tracking-widest transition-colors border border-dashed border-ctp-surface1 rounded-2xl bg-ctp-mantle/50 hover:bg-ctp-mantle active:scale-[0.99] mt-4"
                  >
                    Load more activity
                  </button>
                )}
              </div>
            </div>

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

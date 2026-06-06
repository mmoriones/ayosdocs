'use client';

import { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  Heart,
  Check,
  Search,
  LayoutGrid,
  CheckCircle2,
  Bookmark,
  BarChart3,
  Trash2,
  MoreVertical,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { bundles } from "@/data/bundles";
import { bundleStyles, bundleImages } from '@/lib/assetStyles';
import { Skeleton, Card, Button, ProgressBar, DropdownMenu, DropdownMenuItem, SearchBar } from '@/components/ui';
import { useToast } from '@/context';
import ConfirmModal from '@/components/ConfirmModal';
import { deleteProgressAction, toggleFavoriteAction, stopBundleAction } from '@/app/actions/user';
import { GuideIcon, getIconName } from '@/lib/guideIcons';
import { getIconTheme } from '@/lib/assetStyles';

const GoalsStats = ({ stats }) => {
  return (
    <div className="bg-gradient-to-t from-[#00205B] to-[#0038A8] rounded-[32px] p-8 shadow-xl shadow-[#0038A8]/20 relative overflow-hidden text-white group h-[220px] flex flex-col justify-between border border-white/10">
      {/* Abstract background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/15 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-inner">
            <Package className="text-brand-gold" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[12px] font-black text-white/60 uppercase tracking-[0.15em]">Investment Forecast</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Remaining</span>
            <p className="text-[28px] font-black tracking-tight leading-none">{stats.aggregateRemaining.cost}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Goal Timeframe</span>
            <p className="text-[28px] font-black tracking-tight leading-none">{stats.aggregateRemaining.time}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black text-brand-gold uppercase tracking-widest">
          {stats.activeBundles} {stats.activeBundles === 1 ? 'Bundle' : 'Bundles'} Tracked
        </div>
        <ChevronRight size={16} className="text-white/40" />
      </div>
    </div>
  );
};

const SummaryStats = ({ stats }) => {
  const percentage = Math.round((stats.completed / (stats.total || 1)) * 100) || 0;

  return (
    <div className="bg-gradient-to-t from-[#16888D] to-brand-teal rounded-[32px] p-8 shadow-xl shadow-brand-teal/20 relative overflow-hidden text-white group h-[220px] flex flex-col justify-between border border-white/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[12px] font-black text-white/60 uppercase tracking-[0.15em]">Overall Progress</span>
            <h3 className="text-[44px] font-black tracking-tight leading-none">{percentage}%</h3>
          </div>
          <div className="w-14 h-14 rounded-[22px] bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-inner">
            <BarChart3 className="text-white" size={26} strokeWidth={2.5} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Active</span>
            <p className="text-xl font-black">{stats.inProgress}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Done</span>
            <p className="text-xl font-black">{stats.completed}</p>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Saved</span>
            <p className="text-xl font-black">{stats.favorites}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SummaryStats.Skeleton = function SummaryStatsSkeleton() {
  return (
    <div className="w-full h-[220px] bg-gray-100 rounded-[32px] animate-pulse border border-gray-200" />
  );
};

const BundleCard = ({ bundle, progress, onDelete }) => {
  const router = useRouter();
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;
  const theme = bundleStyles[bundle.id] || bundleStyles['foundational-docs'];
  const imagePath = bundleImages[bundle.id] || bundleImages['foundational-docs'];

  return (
    <Card
      onClick={() => router.push(`/bundles/${bundle.id}`)}
      interactive
      noPadding
      style={{ background: theme.gradient }}
      className="p-5 flex flex-col border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
    >
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-[18px] flex items-center justify-center shrink-0 bg-white/40 backdrop-blur-sm border border-white/50 relative overflow-hidden shadow-inner">
          <div className="relative w-9 h-9">
            <Image
              src={imagePath}
              alt={bundle.title}
              fill
              className="object-contain drop-shadow-lg"
              sizes="36px"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-[#1C1C1E] text-[15px] leading-tight truncate group-hover:text-[#0038A8] transition-colors">
                {bundle.title}
              </h3>
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
                {bundle.category}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              {onDelete && (
                <DropdownMenu
                  trigger={
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-full bg-white/50 border border-white/40 text-gray-400 hover:text-red-500 hover:bg-white/80 transition-all flex items-center justify-center active:scale-90"
                    >
                      <MoreVertical size={12} />
                    </button>
                  }
                  align="right"
                >
                  <DropdownMenuItem onClick={() => onDelete(bundle.id)} variant="danger" icon={Trash2}>
                    Stop Tracking
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0038A8] transition-colors" strokeWidth={2.5} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar value={percentage} size="sm" color={percentage === 100 ? 'green' : 'sky'} />
            </div>
            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
              {progress.completed}/{progress.total}
            </span>
            <span className="text-[11px] font-bold text-[#0038A8]">{percentage}%</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-gray-400/80">
            <span>{bundle.flow.length} steps</span>
            <span className="text-gray-300">·</span>
            <span>{progress.total} guides</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[28px] p-5 border border-white/60 shadow-sm flex flex-col">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-16 h-16 rounded-[18px] shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Skeleton className="flex-1 h-1.5 rounded-full" />
              <Skeleton className="w-10 h-3 rounded-md" />
              <Skeleton className="w-8 h-3 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-12 h-3 rounded-md" />
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-12 h-3 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProgressClient({ allGuides, isRestricted }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('In Progress');
  const [scrollIndex, setScrollIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setScrollIndex(index);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ type: null, id: null });

  const { data: userData = { savedProgress: [] }, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: !isRestricted,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const stopBundleMutation = useMutation({
    mutationFn: async (bundleId) => {
      const result = await stopBundleAction(bundleId);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({ type: 'success', title: 'Bundle Stopped', message: 'You have stopped tracking this bundle.' });
    }
  });

  const deleteProgressMutation = useMutation({
    mutationFn: async (slug) => {
      const result = await deleteProgressAction(slug);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({ type: 'success', title: 'Progress Removed', message: 'Guide progress has been removed.' });
    }
  });

  const favoriteMutation = useMutation({
    mutationFn: async (slug) => {
      const result = await toggleFavoriteAction(slug);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
        message: data.message
      });
    }
  });

  const handleFavoriteGuide = (slug) => {
    favoriteMutation.mutate(slug);
  };

  const processedGuides = useMemo(() => {
    const progressData = userData?.savedProgress || [];
    const uniqueProgress = [...progressData]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.guideSlug === item.guideSlug)
      );

    return uniqueProgress
      .map((item) => {
        const guide = allGuides.find(g => g.slug === item.guideSlug);
        if (!guide) return null;

        const completedIndices = item.completedTasks ? item.completedTasks.split(',').map(Number) : [];
        const totalCount = guide.checklist?.length || 0;
        const percent = totalCount > 0 ? (completedIndices.length / totalCount) * 100 : 0;

        return {
          guide,
          slug: item.guideSlug,
          completedTasks: item.completedTasks,
          updatedAt: item.updatedAt || new Date().toISOString(),
          isFavorite: !!item.isFavorite,
          percent
        };
      })
      .filter(Boolean);
  }, [userData, allGuides]);

  const stats = useMemo(() => {
    const total = processedGuides.length;
    const completed = processedGuides.filter(g => g.percent === 100).length;
    const inProgress = total - completed;
    const favorites = processedGuides.filter(g => g.isFavorite).length;
    const activeBundles = userData.trackedBundles?.length || 0;

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

          if (!progress || progress.percent < 100) {
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
          allBundleGuides.includes(pg.slug)
        );

        return {
          bundle,
          completed: relatedGuides.filter(g => g.percent === 100).length,
          total: allBundleGuides.length
        };
      });
  }, [userData, processedGuides]);

  const filteredGuides = useMemo(() => {
    let result = processedGuides;
    if (searchQuery) {
      result = result.filter(g => g.guide.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeTab === 'In Progress') {
      result = result.filter(g => g.percent < 100);
    } else if (activeTab === 'Completed') {
      result = result.filter(g => g.percent === 100);
    } else if (activeTab === 'Favorites') {
      result = result.filter(g => g.isFavorite);
    }
    return result;
  }, [processedGuides, searchQuery, activeTab]);

  const handleConfirmAction = () => {
    if (confirmConfig.type === 'bundle') {
      stopBundleMutation.mutate(confirmConfig.id);
    } else if (confirmConfig.type === 'guide') {
      deleteProgressMutation.mutate(confirmConfig.id);
    }
    setIsConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-ios-gradient pb-32 animate-in fade-in duration-700 selection:bg-[#0038A8]/10">
      {/* Native App Header */}
      <section className="px-6 pt-12 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-[36px] font-black tracking-tight text-[#1C1C1E] leading-tight">
          My Docs
        </h1>
      </section>

      <div className="max-w-md mx-auto">
        {/* Horizontal Scroll Analytics Carousel - Full Width (No Peeking) */}
        <section 
          ref={carouselRef}
          onScroll={handleScroll}
          className="mb-4 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide pb-4"
        >
          {isLoading ? (
            <div className="min-w-full snap-center px-6">
              <SummaryStats.Skeleton />
            </div>
          ) : (
            <>
              <div className="min-w-full snap-center px-6">
                <GoalsStats stats={stats} />
              </div>
              <div className="min-w-full snap-center px-6">
                <SummaryStats stats={stats} />
              </div>
            </>
          )}
        </section>

        {/* Carousel Dot Indicators */}
        <div className="flex justify-center items-center gap-1.5 mb-8">
          {[0, 1].map((idx) => (
            <div 
              key={idx} 
              className={`transition-all duration-300 rounded-full ${
                scrollIndex === idx ? 'w-4 h-1.5 bg-brand-blue' : 'w-1.5 h-1.5 bg-gray-300'
              }`} 
            />
          ))}
        </div>

        {/* Goal Bundles List */}
        {!isLoading && stats.activeBundles > 0 && (
          <section className="mb-10 space-y-4 px-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[20px] font-black text-[#1C1C1E] tracking-tight">Active Goals</h3>
              <Link href="/bundles" className="text-[13px] font-bold text-[#0038A8]">View All</Link>
            </div>
            <div className="space-y-3">
              {bundleProgress.map((item) => (
                <BundleCard
                  key={item.bundle.id}
                  bundle={item.bundle}
                  progress={item}
                  onDelete={(id) => {
                    setConfirmConfig({ type: 'bundle', id });
                    setIsConfirmOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State for Bundles */}
        {!isLoading && stats.activeBundles === 0 && (
          <section className="mb-10 px-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-sm text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/50">
                <Package size={24} className="text-gray-300" />
              </div>
              <h4 className="text-[15px] font-bold text-[#1C1C1E]">No bundles tracked yet</h4>
              <p className="text-[13px] font-medium text-gray-400 mt-1.5 max-w-[240px] mx-auto">
                Start tracking a life event bundle to see your milestone forecast and progress here.
              </p>
              <Link
                href="/bundles"
                className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-bold text-[#0038A8] active:opacity-60 transition-opacity"
              >
                Browse Bundles <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </section>
        )}

        {/* Tab System */}
        <section className="mb-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {['In Progress', 'Completed', 'Favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[#0038A8] text-white shadow-[0_8px_20px_rgba(0,56,168,0.15)]'
                    : 'text-gray-500 hover:bg-white/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Content List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[19px] font-bold text-[#1C1C1E]">{activeTab}</h3>
             <button
               onClick={() => router.push('/guides')}
               className="text-[13px] font-bold text-[#0038A8] active:opacity-60 transition-opacity"
             >
               See All
             </button>
          </div>

           {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-32 rounded-3xl" />)}
              </div>
           ) : filteredGuides.length > 0 ? (
             <div className={activeTab === 'Completed' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'space-y-4'}>
                {filteredGuides.map((item) => {
                  if (activeTab === 'Completed') {
                    return (
                      <CompletedGridCard
                        key={item.slug}
                        guide={item.guide}
                        onClick={() => router.push(`/guides/${item.slug}`)}
                        onDelete={() => {
                          setConfirmConfig({ type: 'guide', id: item.slug });
                          setIsConfirmOpen(true);
                        }}
                      />
                    );
                  }
                  if (activeTab === 'Favorites') {
                    return (
                      <FavoriteRowCard
                        key={item.slug}
                        guide={item.guide}
                        onClick={() => router.push(`/guides/${item.slug}`)}
                        isFavorite={item.isFavorite}
                        onToggleFavorite={() => handleFavoriteGuide(item.slug)}
                      />
                    );
                  }
                  return (
                    <InProgressCard
                      key={item.slug}
                      guide={item.guide}
                      percent={item.percent}
                      completedTasks={item.completedTasks}
                      onClick={() => router.push(`/guides/${item.slug}`)}
                      onDelete={() => {
                        setConfirmConfig({ type: 'guide', id: item.slug });
                        setIsConfirmOpen(true);
                      }}
                    />
                  );
                })}
             </div>
          ) : (
            <div className="py-16 text-center bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-in fade-in zoom-in-95 duration-500">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/50">
                <Search size={20} className="text-gray-300" />
              </div>
              <h4 className="text-[15px] font-bold text-[#1C1C1E]">No documents here yet</h4>
              <p className="text-[13px] font-medium text-gray-400 mt-1 max-w-[220px] mx-auto">
                Start a guide to begin tracking your progress.
              </p>
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmConfig.type === 'bundle' ? 'Stop tracking bundle?' : 'Remove guide progress?'}
        message={confirmConfig.type === 'bundle'
          ? 'Are you sure you want to stop tracking this life event bundle? This will remove the bundle from your dashboard, but your individual guide progress will be saved.'
          : 'This will remove all progress for this guide. You can start tracking again at any time.'}
        confirmText={confirmConfig.type === 'bundle' ? 'Stop Tracking' : 'Remove Progress'}
        variant="danger"
      />
    </div>
  );
}

function InProgressCard({ guide, percent, completedTasks, onClick, onDelete }) {
  const percentage = Math.round(percent) || 0;
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);

  const completedIndices = completedTasks ? completedTasks.split(',').map(Number) : [];
  const nextStepIndex = guide.checklist?.findIndex((_, idx) => !completedIndices.includes(idx));
  const nextStep = nextStepIndex !== -1 ? guide.checklist[nextStepIndex] : { title: 'Ready to verify' };

  return (
    <Card
      interactive
      onClick={onClick}
      style={{ background: theme.gradient }}
      className="w-full flex items-center justify-between group px-5 py-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[28px] relative"
      noPadding
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={48} className="object-contain drop-shadow-md" />
        </div>
        <div className="text-left flex-1 min-w-0 pr-4">
          <h4 className="font-bold text-[#1C1C1E] text-[17px] leading-tight line-clamp-1 mb-1.5">{guide.shortTitle || guide.title}</h4>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#0038A8] uppercase tracking-widest leading-none">Next Step</span>
            <p className="text-[13px] font-medium text-gray-500 line-clamp-1">{nextStep.title}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onDelete && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              trigger={
                <button className="click-ripple w-8 h-8 rounded-full bg-gray-50 border border-gray-100 text-gray-300 hover:text-[#1C1C1E] hover:border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center active:scale-90">
                  <MoreVertical size={14} />
                </button>
              }
              align="right"
            >
              <DropdownMenuItem onClick={onDelete} variant="danger" icon={Trash2}>
                Remove Progress
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        )}
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="white/80" strokeWidth="5" fill="transparent" />
              <circle
                cx="28" cy="28" r="24"
                stroke={theme.ring} strokeWidth="5" fill="transparent"
                strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - percentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[12px] font-black text-[#1C1C1E]">{percentage}%</span>
        </div>
        {percentage >= 80 ? (
           <div className="bg-[#0038A8] text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-md shadow-[#0038A8]/20 group-hover:translate-x-1 transition-transform">Resume</div>
        ) : (
          <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0038A8] transition-colors" strokeWidth={3} />
        )}
      </div>
    </Card>
  );
}

function CompletedGridCard({ guide, onClick, onDelete }) {
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Card
      interactive onClick={onClick} style={{ background: theme.gradient }}
      className="flex flex-col items-center justify-center text-center p-5 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] aspect-square rounded-[28px] relative"
      noPadding
    >
      {onDelete && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 z-10">
          <DropdownMenu
            trigger={
              <button className="click-ripple w-7 h-7 rounded-full bg-white/40 border border-white/40 text-gray-300 hover:text-[#1C1C1E] hover:bg-white/80 transition-all flex items-center justify-center active:scale-90 backdrop-blur-sm">
                <MoreVertical size={12} />
              </button>
            }
            align="right"
          >
            <DropdownMenuItem onClick={onDelete} variant="danger" icon={Trash2}>
              Remove Progress
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      )}
      <div className="relative mb-3">
        <div className="w-14 h-14 flex items-center justify-center">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={40} className="object-contain drop-shadow-sm" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFCC00] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
          <Check size={10} strokeWidth={4} className="text-white" />
        </div>
      </div>
      <div className="space-y-0.5">
        <h5 className="font-bold text-[#1C1C1E] text-[13px] leading-tight line-clamp-2 px-1">{guide.shortTitle || guide.title}</h5>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight opacity-70">{date}</span>
      </div>
    </Card>
  );
}

function FavoriteRowCard({ guide, onClick, isFavorite, onToggleFavorite }) {
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);
  const agency = Array.isArray(guide.agency) ? guide.agency[0] : guide.agency;

  return (
    <Card
      interactive onClick={onClick} style={{ background: theme.gradient }}
      className="w-full flex items-center justify-between group px-5 py-4 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-2xl"
      noPadding
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={32} className="object-contain drop-shadow-sm" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <h4 className="font-bold text-[#1C1C1E] text-[15px] leading-tight truncate">{guide.shortTitle || guide.title}</h4>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate block">{agency}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="transition-all active:scale-75 outline-none"
        >
          <Heart
            size={18}
            fill={isFavorite ? "#FFCC00" : "none"}
            className={isFavorite ? "text-[#FFCC00]" : "text-gray-200 hover:text-gray-300"}
          />
        </button>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#0038A8] transition-colors" strokeWidth={3} />
      </div>
    </Card>
  );
}

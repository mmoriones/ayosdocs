'use client';

import { useState, useMemo } from 'react';
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

const SummaryStats = ({ stats }) => {
  const statItems = [
    { label: 'Active', value: stats.inProgress || 0, icon: LayoutGrid, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/10' },
    { label: 'Done', value: stats.completed || 0, icon: CheckCircle2, color: 'text-[#34C759]', bg: 'bg-[#34C759]/10' },
    { label: 'Saved', value: stats.favorites || 0, icon: Bookmark, color: 'text-[#AF52DE]', bg: 'bg-[#AF52DE]/10', fill: true }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-white/70 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-2 shadow-inner`}>
            <item.icon size={22} strokeWidth={3} className={item.fill ? 'fill-current' : ''} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-[#1C1C1E] leading-none mb-1">{item.value}</span>
            <h4 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.label}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

SummaryStats.Skeleton = function SummaryStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm flex flex-col items-center justify-center">
          <Skeleton className="w-10 h-10 rounded-xl mb-2" />
          <Skeleton className="w-12 h-6 rounded-lg mb-1" />
          <Skeleton className="w-16 h-2.5 rounded-md" />
        </div>
      ))}
    </div>
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
      {/* Header */}
      <section className="px-6 pt-6 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-[34px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
          My Docs
        </h1>
        <p className="text-[17px] font-medium text-gray-500 mt-1">
          Track your government document progress across all your processes.
        </p>
      </section>

      {/* Search Bar */}
      <SearchBar placeholder="Search your documents..." allGuides={allGuides} />

      <div className="max-w-md mx-auto px-6">
        {/* Summary Stats */}
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isLoading ? <SummaryStats.Skeleton /> : <SummaryStats stats={stats} />}
        </section>

        {/* Bundle Analytics & Goals */}
        {!isLoading && (
          stats.activeBundles > 0 ? (
            <section className="mb-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white/70 backdrop-blur-md rounded-[28px] p-6 border border-white/50 shadow-sm">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#0038A8]/10 text-[#0038A8] flex items-center justify-center shadow-inner">
                      <BarChart3 size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#1C1C1E] opacity-60">Milestone Forecast</h3>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Remaining Cost</span>
                      <p className="text-lg font-black text-[#1C1C1E]">{stats.aggregateRemaining.cost}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Goal Timeframe</span>
                      <p className="text-lg font-black text-[#1C1C1E]">{stats.aggregateRemaining.time}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[19px] font-bold text-[#1C1C1E]">Goal Bundles</h3>
                  <Link href="/bundles" className="text-[13px] font-bold text-[#0038A8]">Browse More</Link>
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
              </div>
            </section>
          ) : (
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white/60 backdrop-blur-xl rounded-[28px] p-8 border border-white/60 shadow-sm text-center">
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
          )
        )}

        {/* Tab System */}
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

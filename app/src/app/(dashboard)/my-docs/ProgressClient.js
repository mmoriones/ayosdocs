'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
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
  MoreHorizontal,
  Package,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { bundles } from "@/data/bundles";
import { bundleStyles, bundleImages } from '@/lib/assetStyles';
import { Skeleton, Card, Button, ProgressBar, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, SearchBar, Input } from '@/components/ui';
import { useToast } from '@/context';
import ConfirmModal from '@/components/ConfirmModal';
import { deleteProgressAction, toggleFavoriteAction, stopBundleAction } from '@/app/actions/user';
import { GuideIcon, getIconName } from '@/lib/guideIcons';
import { getIconTheme } from '@/lib/assetStyles';

const GoalsStats = ({ stats }) => {
  return (
    <div className="bg-gradient-to-t from-[#0038A8] to-[#4D74C2] rounded-[32px] p-8 shadow-xl shadow-[#0038A8]/20 relative overflow-hidden text-white group h-[220px] flex flex-col justify-between border border-white/10">
      {/* Abstract background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/15 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-inner">
            <Package className="text-brand-gold" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[12px] font-black text-white/60 uppercase tracking-[0.15em]">Milestone Forecast</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Remaining</span>
            <p className="text-[20px] font-black tracking-tight leading-none">{stats.aggregateRemaining.cost}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Goal Timeframe</span>
            <p className="text-[20px] font-black tracking-tight leading-none">{stats.aggregateRemaining.time}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center">
        <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black text-brand-gold uppercase tracking-widest">
          {stats.activeBundles} {stats.activeBundles === 1 ? 'Bundle' : 'Bundles'} Tracked
        </div>
      </div>
    </div>
  );
};

const SummaryStats = ({ stats }) => {
  const percentage = Math.round((stats.completed / (stats.total || 1)) * 100) || 0;

  return (
    <div className="bg-gradient-to-t from-[#20A9AF] to-[#63C3C7] rounded-[32px] p-8 shadow-xl shadow-brand-teal/20 relative overflow-hidden text-white group h-[220px] flex flex-col justify-between border border-white/10">
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
      className="p-6 flex flex-col border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[32px] group relative"
      overflow="visible"
    >
      {onDelete && (
        <div className="absolute top-4 right-4 z-30" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu
            trigger={
              <button
                className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center active:scale-90 shadow-sm"
              >
                <MoreHorizontal size={16} strokeWidth={2.5} />
              </button>
            }
            align="right"
          >
            <DropdownMenuItem onClick={() => onDelete(bundle.id)} variant="danger" icon={Trash2}>
              Stop Tracking
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      )}
      <div className="flex gap-5 items-center">
        <div className="w-20 h-20 rounded-[24px] flex items-center justify-center shrink-0 bg-white/40 backdrop-blur-sm border border-white/50 relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
          <div className="relative w-12 h-12">
            <Image
              src={imagePath}
              alt={bundle.title}
              fill
              className="object-contain drop-shadow-lg group-hover:rotate-3 transition-transform"
              sizes="48px"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pr-8">
              <span className="text-[11px] font-bold text-[#0038A8]/60 uppercase tracking-widest block mb-0.5">
                {bundle.category}
              </span>
              <h3 className="font-bold text-[#1C1C1E] text-[17px] leading-tight truncate group-hover:text-[#0038A8] transition-colors">
                {bundle.title}
              </h3>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar value={percentage} size="sm" color={percentage === 100 ? 'green' : 'sky'} />
            </div>
            <span className="text-[12px] font-black text-[#0038A8]">{percentage}%</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-gray-400/80">
            <div className="flex items-center gap-1 bg-white/40 px-2 py-0.5 rounded-md border border-white/40">
               <span>{progress.completed}/{progress.total} Guides</span>
            </div>
            <span className="text-gray-300">·</span>
            <span>{bundle.flow.length} milestones</span>
          </div>
        </div>
      </div>
      
      {/* Native-like chevron indicator */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-all">
        <ChevronRight size={18} strokeWidth={3} />
      </div>
    </Card>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 border border-white/60 shadow-sm flex flex-col">
      <div className="flex gap-5 items-center">
        <Skeleton className="w-20 h-20 rounded-[24px] shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-5 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="w-full h-2 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-3 rounded-md" />
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-16 h-3 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProgressClient({ allGuides, isRestricted }) {
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  const [activeTab, setActiveTab] = useState('In Progress');
  const [scrollIndex, setScrollIndex] = useState(0);
  const carouselRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // Global search results from all guides
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allGuides.filter(guide =>
      guide.title.toLowerCase().includes(q) ||
      guide.shortTitle?.toLowerCase().includes(q) ||
      guide.description?.toLowerCase().includes(q) ||
      guide.agency?.toLowerCase().includes(q) ||
      guide.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, allGuides]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      if (range.includes('P1H')) return [100, 500];
      if (range.includes('P5H')) return [500, 2000];
      if (range.includes('P2K')) return [2000, 5000];
      return [0, 0];
    };

    const parseTime = (time) => {
      if (!time) return [0, 0];
      const toDays = (s) => {
        const num = parseInt(s, 10);
        if (s.includes('W')) return num * 7;
        return num;
      };
      const parts = time.split('-');
      if (parts.length === 1) return [0, toDays(parts[0])];
      return [toDays(parts[0]), toDays(parts[1])];
    };

    const trackedBundleIds = userData.trackedBundles?.map(b => b.bundleId) || [];
    const countedSlugs = new Set();
    bundles.filter(b => trackedBundleIds.includes(b.id)).forEach(bundle => {
      bundle.flow.forEach(step => {
        step.guides.forEach(slug => {
          if (countedSlugs.has(slug)) return;
          countedSlugs.add(slug);

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
      result = result.filter(g => g.percent > 0 && g.percent < 100);
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
      {/* High-Fidelity Discovery Header */}
      <header className="px-6 pt-12 pb-8 max-w-[1600px] mx-auto lg:px-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-[34px] lg:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-none">
            My Dashboard
          </h1>
          <p className="text-[15px] lg:text-[17px] font-medium text-gray-500 mt-2">
            Track your government requirements and application progress.
          </p>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Analytics Section */}
        {!isLoading && (stats.activeBundles > 0 || stats.total > 0) && (
          <>
            {/* Mobile: Horizontal Scroll Analytics Carousel */}
            <div className="lg:hidden -mx-6">
              <section 
                ref={carouselRef}
                onScroll={handleScroll}
                className="mb-4 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide pb-4"
              >
                {stats.activeBundles > 0 && (
                  <div className="min-w-full snap-center px-6">
                    <GoalsStats stats={stats} />
                  </div>
                )}
                {stats.total > 0 && (
                  <div className="min-w-full snap-center px-6">
                    <SummaryStats stats={stats} />
                  </div>
                )}
              </section>

              {/* Carousel Dot Indicators - Only show if both are present */}
              {stats.activeBundles > 0 && stats.total > 0 && (
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
              )}
            </div>

            {/* Desktop: Grid */}
            <div className={`hidden lg:grid gap-6 mb-8 ${stats.activeBundles > 0 && stats.total > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {stats.activeBundles > 0 && <GoalsStats stats={stats} />}
              {stats.total > 0 && <SummaryStats stats={stats} />}
            </div>
          </>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="mb-8">
             <div className="lg:hidden">
               <SummaryStats.Skeleton />
             </div>
             <div className="hidden lg:grid grid-cols-2 gap-6">
               <SummaryStats.Skeleton />
               <SummaryStats.Skeleton />
             </div>
          </div>
        )}

        {/* Search Bar */}
        <section className="mb-10">
          <div ref={searchContainerRef} className="relative group">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search your tracked documents or find new guides..."
              leftIcon={Search}
              rightContent={searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-90 transition-all"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              ) : null}
              className="h-16 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-white/60 focus:border-[#0038A8]/20 transition-all rounded-[24px]"
            />

            {/* Global Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/40 shadow-lg overflow-hidden">
                  {globalSearchResults.length > 0 ? (
                    <div className="py-2 max-h-[400px] overflow-y-auto">
                      <div className="px-5 py-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Results</span>
                      </div>
                      {globalSearchResults.map((guide) => (
                        <button
                          key={guide.slug}
                          onClick={() => {
                            router.push(`/guides/${guide.slug}`);
                            setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-4 px-5 py-3 text-left active:scale-[0.98] transition-transform hover:bg-black/[0.02]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-white/50 flex items-center justify-center shrink-0">
                            <GuideIcon slug={guide.slug} agency={guide.agency} size={22} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[14px] font-bold text-[#1C1C1E] leading-tight truncate">
                              {guide.shortTitle || guide.title}
                            </h5>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5 truncate">
                              {guide.agency}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 shrink-0" strokeWidth={3} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                        <Search size={20} />
                      </div>
                      <h5 className="text-[14px] font-bold text-[#1C1C1E]">No guides found</h5>
                      <p className="text-[12px] font-medium text-gray-400 mt-1 max-w-[200px]">
                        Try a different search term.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Goal Bundles List */}
        {!isLoading && (
          <section className="mb-12 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[19px] font-bold text-[#1C1C1E]">Active Goals</h3>
              <Link href="/bundles" className="text-[13px] font-bold text-[#0038A8] active:opacity-60 transition-opacity">
                See All
              </Link>
            </div>
            
            {stats.activeBundles > 0 ? (
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
            ) : (
              <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-sm text-center">
                <div className="w-14 h-14 bg-[var(--orange)]/15 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-[var(--orange)]/10">
                  <Package size={24} className="text-[var(--orange)]" />
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
            )}
          </section>
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
                        onDelete={() => {
                          setConfirmConfig({ type: 'guide', id: item.slug });
                          setIsConfirmOpen(true);
                        }}
                      />
                    );
                  }
                  return (
                    <InProgressCard
                      key={item.slug}
                      guide={item.guide}
                      percent={item.percent}
                      completedTasks={item.completedTasks}
                      updatedAt={item.updatedAt}
                      isFavorite={item.isFavorite}
                      onToggleFavorite={() => handleFavoriteGuide(item.slug)}
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
            <div className="py-16 text-center bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="w-14 h-14 bg-[var(--teal)]/15 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-[var(--teal)]/10">
                <Search size={24} className="text-[var(--teal)]" />
              </div>
              <h4 className="text-[15px] font-bold text-[#1C1C1E]">No documents here yet</h4>
              <p className="text-[13px] font-medium text-gray-400 mt-1 max-w-[220px] mx-auto">
                Start a guide to begin tracking your progress.
              </p>
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-bold text-[#0038A8] active:opacity-60 transition-opacity"
              >
                Explore Guides <ChevronRight size={14} strokeWidth={3} />
              </Link>
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

function InProgressCard({ guide, percent, completedTasks, onClick, onDelete, onToggleFavorite, isFavorite, updatedAt }) {
  const percentage = Math.round(percent) || 0;
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);

  const completedIndices = completedTasks ? completedTasks.split(',').map(Number) : [];
  const nextStepIndex = guide.checklist?.findIndex((_, idx) => !completedIndices.includes(idx));
  const nextStep = nextStepIndex !== -1 ? guide.checklist[nextStepIndex] : { title: 'Ready to verify' };

  const timeAgo = (date) => {
    if (!date) return null;
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card
      interactive
      onClick={onClick}
      style={{ background: theme.gradient }}
      className="w-full flex items-center justify-between group px-5 py-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[28px] relative"
      noPadding
      overflow="visible"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={48} className="object-contain drop-shadow-md" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-bold text-[#0038A8] uppercase tracking-widest leading-none">
               {Array.isArray(guide.agency) ? guide.agency[0] : guide.agency}
             </span>
             {updatedAt && (
               <>
                 <span className="w-1 h-1 rounded-full bg-gray-300" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                   {timeAgo(updatedAt)}
                 </span>
               </>
             )}
          </div>
          <h4 className="font-bold text-[#1C1C1E] text-[17px] leading-tight line-clamp-1 mb-2">{guide.shortTitle || guide.title}</h4>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Next Milestone</span>
            <p className="text-[13px] font-medium text-gray-600 line-clamp-1">{nextStep.title}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="white" strokeOpacity="0.5" strokeWidth="5" fill="transparent" />
              <circle
                cx="28" cy="28" r="24"
                stroke={theme.ring} strokeWidth="5" fill="transparent"
                strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - percentage / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-[12px] font-black text-[#1C1C1E]">{percentage}%</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          {onDelete && (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                trigger={
                  <button className="w-7 h-7 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center active:scale-90 shadow-sm">
                    <MoreHorizontal size={14} strokeWidth={2.5} />
                  </button>
                }
                align="right"
              >
                <DropdownMenuItem onClick={onToggleFavorite} icon={Heart} className={isFavorite ? "text-[#FFD700]" : ""}>
                  {isFavorite ? 'Unsave' : 'Favorite'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} variant="danger" icon={Trash2}>
                  Remove Progress
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
          )}
          {percentage >= 80 ? (
             <div className="bg-[#0038A8] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md shadow-[#0038A8]/20 transition-transform">Resume</div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-gray-400 group-hover:text-[#0038A8] transition-all">
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          )}
        </div>
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
      className="flex flex-col items-center justify-center text-center p-5 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] aspect-square rounded-[32px] relative group"
      noPadding
      overflow="visible"
    >
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/40 border border-white/40 text-gray-400 hover:text-[#FF3B30] hover:bg-white/80 transition-all flex items-center justify-center active:scale-90 backdrop-blur-sm shadow-sm"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
      <div className="relative mb-3 group-hover:scale-110 transition-transform duration-500">
        <div className="w-16 h-16 flex items-center justify-center">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={48} className="object-contain drop-shadow-md" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34C759] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
          <Check size={12} strokeWidth={4} className="text-white" />
        </div>
      </div>
      <div className="space-y-0.5">
        <h5 className="font-bold text-[#1C1C1E] text-[14px] leading-tight line-clamp-2 px-1">{guide.shortTitle || guide.title}</h5>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight opacity-70">Done {date}</span>
      </div>
    </Card>
  );
}

function FavoriteRowCard({ guide, onClick, isFavorite, onToggleFavorite, onDelete }) {
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);
  const agency = Array.isArray(guide.agency) ? guide.agency[0] : guide.agency;

  return (
    <Card
      interactive onClick={onClick} style={{ background: theme.gradient }}
      className="w-full flex items-center justify-between group px-5 py-5 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[28px] relative"
      noPadding
      overflow="visible"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-inner">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={36} className="object-contain drop-shadow-sm" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <h4 className="font-bold text-[#1C1C1E] text-[16px] leading-tight truncate">{guide.shortTitle || guide.title}</h4>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate block mt-1">{agency}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        {onDelete && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              trigger={
                <button className="w-7 h-7 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center active:scale-90 shadow-sm">
                  <MoreHorizontal size={14} strokeWidth={2.5} />
                </button>
              }
              align="right"
            >
              <DropdownMenuItem onClick={onToggleFavorite} icon={Heart} className={isFavorite ? "text-[#FFD700]" : ""}>
                {isFavorite ? 'Unsave' : 'Favorite'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} variant="danger" icon={Trash2}>
                Remove Progress
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-gray-400 group-hover:text-[#0038A8] transition-all">
          <ChevronRight size={18} strokeWidth={3} />
        </div>
      </div>
    </Card>
  );
}

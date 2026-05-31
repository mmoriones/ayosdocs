'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bell,
  ChevronRight,
  Heart,
  Check,
  Search,
  LayoutGrid,
  CheckCircle2,
  Bookmark,
  BarChart3,
  Calendar,
  Zap,
  ListChecks,
  Clock,
  Layers,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { bundles } from "@/data/bundles";
import { Skeleton, Card, Input, Button, ProgressBar, DropdownMenu, DropdownMenuItem, SortDropdown } from '@/components/ui';
import { useToast } from '@/context';
import ConfirmModal from '@/components/ConfirmModal';
import { deleteProgressAction, toggleFavoriteAction, stopBundleAction } from '@/app/actions/user';
import { GuideIcon, getIconName } from '@/lib/guideIcons';
import { getIconTheme } from '@/lib/assetStyles';
import { getBundleIcon } from '@/lib/bundleIcons';

// --- Inlined from features/guides/components/tracking ---

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

const DashboardSidebar = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  const monthOptions = [
    { label: 'May 2026', value: 'May 2026' },
    { label: 'April 2026', value: 'April 2026' }
  ];

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      
      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Reminders</h3>
          <Button 
            variant="link"
            onClick={() => router.push('/coming-soon')}
            className="text-ui-tiny uppercase tracking-widest"
          >
            View all
          </Button>
        </div>
        
        <div className="divide-y divide-ctp-surface1/50">
          <div className="p-4 hover:bg-ctp-mantle/30 transition-colors group cursor-pointer flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all shrink-0">
              <Calendar size={14} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-ctp-text tracking-tight">Passport Appointment</h4>
              <p className="text-ui-micro text-ctp-subtext1 mt-1 font-medium leading-tight">No appointment set yet.</p>
            </div>
          </div>

          <div className="p-4 hover:bg-ctp-mantle/30 transition-colors group cursor-pointer flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-ctp-peach/10 border border-ctp-peach/20 flex items-center justify-center text-ctp-peach shrink-0">
              <Clock size={14} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-ctp-text tracking-tight uppercase">Driver&apos;s License</h4>
              <p className="text-ui-tiny text-ctp-peach font-bold mt-1 uppercase tracking-tight animate-pulse">Expires in 28 days</p>
            </div>
          </div>
        </div>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Next Best Steps</h3>
        </div>
        
        <div className="p-1.5 space-y-0.5">
          {[
            { title: 'Schedule DFA appointment', sub: 'Passport Appointment', icon: Calendar },
            { title: 'Register online account', sub: 'SSS Registration', icon: Zap },
            { title: 'Check requirements', sub: 'PhilHealth ID', icon: ListChecks },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-ctp-mantle transition-all cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-ctp-sky-800/5 border border-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-inner">
                <step.icon size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-ctp-text truncate tracking-tight">{step.title}</h4>
                <p className="text-ui-tiny text-ctp-subtext1 mt-0.5 truncate font-bold uppercase tracking-widest opacity-60">{step.sub}</p>
              </div>
              <ChevronRight size={12} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-0.5" />
            </div>
          ))}
        </div>
        
        <Button 
          variant="link"
          onClick={() => router.push('/coming-soon')}
          className="w-full rounded-none border-t border-ctp-surface1 text-ui-tiny uppercase tracking-widest py-3"
        >
          View recommendations
        </Button>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Activity</h3>
          <SortDropdown 
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={monthOptions}
            label=""
          />
        </div>

        <div className="p-4 space-y-4">
          {[
            { label: 'Guides started', value: '5', icon: ListChecks },
            { label: 'Steps completed', value: '18', icon: CheckCircle2 },
            { label: 'Guides finished', value: '2', icon: CheckCircle2, color: 'text-ctp-mauve' },
            { label: 'Time spent', value: '2.8h', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center ${item.color || 'text-ctp-subtext1'} shadow-inner`}>
                  <item.icon size={12} strokeWidth={2.5} />
                </div>
                <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-ctp-text tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>

        <Button 
          variant="link"
          onClick={() => router.push('/coming-soon')}
          className="w-full rounded-none border-t border-ctp-surface1 text-ui-tiny uppercase tracking-widest py-3"
        >
          View detailed log
        </Button>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden group">
        <div className="p-4 border-b border-ctp-surface1 flex items-center gap-2">
          <Zap size={14} className="text-ctp-sky-800" />
          <h3 className="text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Workspace Tip</h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-ui-micro font-medium leading-relaxed text-ctp-subtext1">
            Keep your momentum! Small daily checks lead to stress-free government applications.
          </p>
          <Button 
            variant="secondary"
            onClick={() => router.push('/guides')}
            className="w-full text-ui-micro uppercase tracking-widest shadow-lg shadow-ctp-sky-800/5"
          >
            Explore more guides
          </Button>
        </div>
      </Card>

    </aside>
  );
};

const BundleCard = ({ bundle, progress, onDelete }) => {
  const router = useRouter();
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <Card 
      onClick={() => router.push(`/bundles/${bundle.id}`)}
      background="mantle"
      interactive
      noPadding
      className="p-5 flex flex-col h-full overflow-hidden"
    >
      <div className="flex gap-5 items-start relative z-10">
        <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center group-hover:scale-105 transition-transform border border-ctp-surface1 shrink-0 shadow-inner">
          {getBundleIcon(bundle.id, { size: 20, className: "text-ctp-sky-800" })}
        </div>
        
        <div className="flex-1 min-w-0 space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-ui-tiny font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${
                  percentage === 100 
                    ? 'bg-ctp-green/[0.07] text-ctp-green border-ctp-green/20' 
                    : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
                }`}>
                  {percentage === 100 ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={12} className="text-ctp-subtext0" />
                  {bundle.flow.length} Stages
                </span>
              </div>
              <h3 className="text-base font-bold text-ctp-text truncate tracking-tight group-hover:text-ctp-sky-800 transition-colors leading-tight">{bundle.title}</h3>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {onDelete && (
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button 
                        className="click-ripple w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text hover:border-ctp-surface2 transition-all flex items-center justify-center active:scale-90"
                      >
                        <MoreVertical size={14} />
                      </button>
                    }
                    align="right"
                  >
                    <DropdownMenuItem
                      onClick={() => onDelete(bundle.id)}
                      variant="danger"
                      icon={Trash2}
                    >
                      Stop Tracking
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              )}
              <div className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-0.5">
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-ui-micro font-bold uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-80">{progress.completed} of {progress.total} guides</span>
              <span className="text-ctp-sky-800">{percentage}%</span>
            </div>
            <ProgressBar
              value={percentage}
              size="sm"
              color={percentage === 100 ? 'green' : 'sky'}
            />
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
            {bundle.flow.slice(0, 3).map((step, idx) => {
              const isCurrent = idx === 0 && percentage < 100;
              return (
                <div key={idx} className="flex items-center gap-1.5 opacity-80">
                   <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-ctp-sky-800 animate-pulse' : 'bg-ctp-surface1'}`} />
                   <span className={`text-ui-tiny font-bold uppercase tracking-tight ${isCurrent ? 'text-ctp-text' : 'text-ctp-subtext1'}`}>{step.label}</span>
                </div>
              );
            })}
            {bundle.flow.length > 3 && (
              <span className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-widest">+{bundle.flow.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm flex flex-col h-full space-y-4">
      <div className="flex gap-5 items-start">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <Skeleton className="w-16 h-3.5 rounded-md" />
                <Skeleton className="w-16 h-3" />
              </div>
              <Skeleton className="w-3/4 h-5" />
            </div>
            <Skeleton className="w-4 h-4 rounded-md shrink-0" />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between">
               <Skeleton className="w-24 h-2.5" />
               <Skeleton className="w-8 h-2.5" />
             </div>
             <Skeleton className="w-full h-1.5 rounded-full" />
          </div>
          <div className="flex gap-3 pt-1">
            <Skeleton className="w-16 h-2.5" />
            <Skeleton className="w-16 h-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ProgressClient Component
 */
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
    }
    setIsConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-ios-gradient font-sans pb-24 text-ctp-text">
      {/* HEADER */}
      <div className="max-w-[800px] mx-auto px-6 py-8 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-[#1C1C1E]">My Docs</h1>
        <button className="w-11 h-11 flex items-center justify-center bg-white/50 backdrop-blur-lg rounded-full shadow-sm border border-white/40 hover:bg-white/80 transition-colors relative">
          <Bell size={22} className="text-[#1C1C1E]" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#007AFF] border-2 border-white rounded-full"></span>
        </button>
      </div>

      <div className="max-w-[600px] mx-auto px-6">
        {/* SUMMARY STATS */}
        <section className="mb-10">
          {isLoading ? <SummaryStats.Skeleton /> : <SummaryStats stats={stats} />}
        </section>

        {/* BUNDLE ANALYTICS & GOALS */}
        {!isLoading && stats.activeBundles > 0 && (
          <section className="mb-10 space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-[28px] p-6 border border-white/50 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center shadow-inner">
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
                <h3 className="text-lg font-bold text-[#1C1C1E]">Goal Bundles</h3>
                <Link href="/bundles" className="text-[13px] font-bold text-[#007AFF]">Browse More</Link>
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
        )}

        {/* TAB SYSTEM */}
        <section className="mb-8">
          <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {['In Progress', 'Completed', 'Favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-[#007AFF] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-white/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* CONTENT LIST */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-bold text-[#1C1C1E]">{activeTab}</h3>
             <button className="text-[13px] font-bold text-[#007AFF]">See All</button>
          </div>

          {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-32 rounded-3xl" />)}
             </div>
          ) : filteredGuides.length > 0 ? (
            <div className={activeTab === 'Completed' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'space-y-4'}>
               {filteredGuides.map((item) => {
                 if (activeTab === 'Completed') {
                   return <CompletedGridCard key={item.slug} guide={item.guide} onClick={() => router.push(`/guides/${item.slug}`)} />;
                 }
                 if (activeTab === 'Favorites') {
                   return <FavoriteRowCard key={item.slug} guide={item.guide} onClick={() => router.push(`/guides/${item.slug}`)} />;
                 }
                 return (
                   <InProgressCard 
                     key={item.slug} 
                     guide={item.guide} 
                     percent={item.percent}
                     completedTasks={item.completedTasks}
                     onClick={() => router.push(`/guides/${item.slug}`)} 
                   />
                 );
               })}
            </div>
          ) : (
            <div className="py-20 text-center bg-white/20 rounded-[32px] border border-white/30 border-dashed">
               <p className="text-gray-400 font-bold">No documents here yet.</p>
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title="Stop tracking bundle?"
        message="Are you sure you want to stop tracking this life event bundle? This will remove the bundle from your dashboard, but your individual guide progress will be saved."
        confirmText="Stop Tracking"
        variant="danger"
      />
    </div>
  );
}

/**
 * Local Components for My Docs
 */

function InProgressCard({ guide, percent, completedTasks, onClick }) {
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
      className="w-full flex items-center justify-between group px-5 py-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[28px]"
      noPadding
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={48} className="object-contain drop-shadow-md" />
        </div>
        <div className="text-left flex-1 min-w-0 pr-4">
          <h4 className="font-bold text-[#1C1C1E] text-[17px] leading-tight line-clamp-1 mb-1.5">{guide.shortTitle || guide.title}</h4>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-widest leading-none">Next Step</span>
            <p className="text-[13px] font-medium text-gray-500 line-clamp-1">{nextStep.title}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="white/80" strokeWidth="5" fill="transparent" />
              <circle 
                cx="32" cy="32" r="28" 
                stroke={theme.ring} strokeWidth="5" fill="transparent" 
                strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - percentage / 100)} 
                strokeLinecap="round" 
              />
            </svg>
            <span className="absolute text-[13px] font-black text-[#1C1C1E]">{percentage}%</span>
        </div>
        {percentage >= 80 ? (
           <div className="ml-2 bg-[#007AFF] text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-md shadow-[#007AFF]/20 group-hover:translate-x-1 transition-transform">Resume</div>
        ) : (
          <ChevronRight size={18} className="text-gray-300 group-hover:text-[#007AFF] transition-colors ml-2" strokeWidth={3} />
        )}
      </div>
    </Card>
  );
}

function CompletedGridCard({ guide, onClick }) {
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Card 
      interactive onClick={onClick} style={{ background: theme.gradient }}
      className="flex flex-col items-center justify-center text-center p-5 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] aspect-square rounded-[28px]"
      noPadding
    >
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

function FavoriteRowCard({ guide, onClick }) {
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
        <Heart size={18} fill="#FFCC00" className="text-[#FFCC00]" />
        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#007AFF] transition-colors" strokeWidth={3} />
      </div>
    </Card>
  );
}

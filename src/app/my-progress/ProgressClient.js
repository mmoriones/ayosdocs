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
  ArrowRight
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
export default function ProgressClient({ allGuides }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently updated');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: userData = { savedProgress: [] }, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
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
        message: error.message || 'Failed to remove guide. Please try again.'
      });
    }
  });

  const handleDeleteGuide = (slug) => {
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
    
    return {
      total,
      completed,
      inProgress,
      favorites: 0,
      expiring: 0 
    };
  }, [processedGuides]);

  const bundleProgress = useMemo(() => {
    return bundles.map(bundle => {
      const relatedGuides = processedGuides.filter(pg => 
        bundle.guides.includes(pg.guide.slug)
      );
      
      return {
        bundle,
        completed: relatedGuides.filter(g => g.progress.completedCount === g.progress.totalCount).length,
        total: bundle.guides.length
      };
    });
  }, [processedGuides]);

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

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-ctp-sky-800">
              <ArrowRight size={20} className="-rotate-45" />
              <span className="text-[14px] font-black uppercase tracking-[0.3em]">Dashboard</span>
            </div>
            <h1 className="text-[40px] font-black text-ctp-text tracking-tight uppercase leading-none">My Progress</h1>
            <p className="text-ctp-subtext1 text-[18px] font-medium max-w-xl">Track your government journey, check milestones, and complete goals.</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-ctp-mantle border border-ctp-sky-800/30 text-ctp-sky-800 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:border-ctp-sky-800 transition-all active:scale-95">
            <Plus size={20} strokeWidth={3} />
            New Requirement Bundle
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-14">
          <div className="flex-1 space-y-16">
            <SummaryStats stats={stats} />

            <div className="space-y-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex bg-ctp-mantle p-1.5 rounded-2xl border border-ctp-surface0 shadow-sm overflow-x-auto no-scrollbar">
                  {['All', 'In Progress', 'Completed', 'Favorites'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20' 
                          : 'text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface0'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-ctp-mantle border border-ctp-surface0 rounded-2xl px-6 py-3.5 pr-12 text-[11px] font-black uppercase tracking-widest text-ctp-subtext1 focus:ring-4 focus:ring-ctp-sky-800/10 transition-all cursor-pointer shadow-sm"
                    >
                      <option>Recently updated</option>
                      <option>Alphabetical</option>
                      <option>Progress %</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                  <button className="p-3.5 bg-ctp-mantle border border-ctp-surface0 rounded-2xl text-ctp-subtext0 hover:text-ctp-text shadow-sm transition-all active:scale-90">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-ctp-subtext1 transition-colors group-focus-within:text-ctp-sky-800" />
                <input 
                  type="text"
                  placeholder="Search your tracked guides and goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-ctp-mantle border border-ctp-surface0 rounded-[2rem] text-[18px] shadow-sm focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-ctp-text placeholder:text-ctp-subtext0 font-medium"
                />
              </div>
            </div>

            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-ctp-surface0 pb-6">
                <div>
                  <h2 className="text-[24px] font-black text-ctp-text uppercase tracking-tight">Active Goal Bundles</h2>
                  <p className="text-[10px] text-ctp-subtext0 font-black uppercase tracking-[0.2em] mt-3">Multi-requirement tracking at scale.</p>
                </div>
                <button 
                  onClick={() => router.push('/coming-soon')}
                  className="group flex items-center gap-2 text-ctp-sky-800 font-black text-[11px] uppercase tracking-widest hover:text-ctp-sky-300 transition-colors mb-1"
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
                  onClick={() => router.push('/coming-soon')}
                  className="w-full py-10 bg-ctp-mantle border-2 border-dashed border-ctp-surface0 rounded-[2.5rem] text-ctp-subtext0 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 hover:bg-ctp-sky-800/5 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-ctp-base border border-ctp-surface0 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={28} className="text-ctp-subtext0 group-hover:text-ctp-sky-800" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-[0.2em]">Explore life event bundles</span>
                </button>
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-ctp-surface0 pb-6">
                <div>
                  <h2 className="text-[24px] font-black text-ctp-text uppercase tracking-tight">Tracked Procedures</h2>
                  <p className="text-[10px] text-ctp-subtext0 font-black uppercase tracking-[0.2em] mt-3">Individual documentation requirements.</p>
                </div>
                <Link href="/guides" className="group flex items-center gap-2 text-ctp-sky-800 font-black text-[11px] uppercase tracking-widest hover:text-ctp-sky-300 transition-colors mb-1">
                  Knowledge Base <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((item) => (
                    <GuideRowCard 
                      key={item.guide.slug} 
                      guide={item.guide} 
                      progress={item.progress} 
                      steps={item.steps}
                      onDelete={() => handleDeleteGuide(item.slug)}
                    />
                  ))
                ) : (
                  <div className="text-center py-24 bg-ctp-mantle rounded-[3rem] border-2 border-dashed border-ctp-surface0">
                    <div className="w-16 h-16 bg-ctp-base rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ctp-surface0 shadow-inner">
                       <List size={32} className="text-ctp-subtext0" />
                    </div>
                    <h3 className="text-xl font-black text-ctp-text uppercase tracking-tight">No guides found</h3>
                    <p className="text-ctp-subtext1 font-medium mt-2">Try adjusting your filters or section.</p>
                    <Link href="/guides" className="mt-8 inline-block px-8 py-4 bg-ctp-sky-800 text-ctp-base rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Explore all guides</Link>
                  </div>
                )}
                
                {filteredGuides.length > 0 && (
                  <button className="w-full py-6 text-[11px] font-black text-ctp-subtext0 hover:text-ctp-subtext1 uppercase tracking-[0.3em] transition-colors">
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

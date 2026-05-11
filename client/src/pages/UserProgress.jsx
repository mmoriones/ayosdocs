import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Loader2, 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { guidesMap } from "../utils/loadGuides";
import { bundles } from "../data/bundles";

import SummaryStats from '../features/guides/components/tracking/SummaryStats';
import BundleCard from '../features/guides/components/tracking/BundleCard';
import GuideRowCard from '../features/guides/components/tracking/GuideRowCard';
import DashboardSidebar from '../features/guides/components/tracking/DashboardSidebar';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

/**
 * UserProgress Page Component (v1.0 Revamp)
 * A personal government process dashboard for tracking goals and guides.
 */
const UserProgress = () => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently updated');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "My Progress | AyosDocs";
    window.scrollTo(0, 0);
  }, []);

  // Fetch user data from backend
  const { data: userData = { savedProgress: [] }, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.token) return { savedProgress: [] };

      const response = await fetch(`${API_URL}/api/user/get-data`, {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch progress');
      return await response.json();
    },
    enabled: !!localStorage.getItem("user"),
  });

  // Delete Progress Mutation
  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`${API_URL}/api/user/delete/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      if (!response.ok) throw new Error('Failed to delete progress');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: 'Guide Removed',
        message: 'The guide has been removed from your tracked list.'
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove guide. Please try again.'
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

  // Transform raw progress into enriched objects
  const processedGuides = useMemo(() => {
    return userData.savedProgress
      .map((item) => {
        const guide = guidesMap[item.guideSlug];
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
            isFavorite: false // Future implementation
          }
        };
      })
      .filter(Boolean);
  }, [userData]);

  // Derive stats for the top cards
  const stats = useMemo(() => {
    const total = processedGuides.length;
    const completed = processedGuides.filter(g => g.progress.completedCount === g.progress.totalCount).length;
    const inProgress = total - completed;
    
    return {
      total,
      completed,
      inProgress,
      favorites: 9, // Mock for visual parity
      expiring: 2   // Mock for visual parity
    };
  }, [processedGuides]);

  // Calculate bundle-level progress
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

  // Filter guides based on search and active tab
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-teal-600" size={40} />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Progress</h1>
            <p className="text-gray-500 text-sm md:text-base font-medium">Track your guides, check your progress, and complete your goals.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-teal-600/30 text-teal-700 rounded-full font-bold text-xs shadow-sm hover:shadow-md hover:border-teal-600 transition-all active:scale-95">
            <Plus size={16} />
            Create new bundle
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Dashboard - Left Column */}
          <div className="flex-1 space-y-12">
            
            {/* Stats Overview */}
            <SummaryStats stats={stats} />

            {/* Content Tabs & Filters */}
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto custom-scrollbar">
                  {['All', 'In Progress', 'Completed', 'Favorites'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-teal-50 text-teal-600' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
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
                      className="appearance-none bg-white border border-gray-100 rounded-2xl px-5 py-2.5 pr-10 text-[11px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 shadow-sm cursor-pointer"
                    >
                      <option>Recently updated</option>
                      <option>A - Z</option>
                      <option>Progress %</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 shadow-sm transition-all">
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-teal-500" />
                <input 
                  type="text"
                  placeholder="Search your guides and bundles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Life Event Bundles Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">My Bundles (Life Event Trackers)</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Track multiple requirements at once.</p>
                </div>
                <button 
                  onClick={() => navigate('/coming-soon')}
                  className="text-[11px] font-bold text-teal-600 hover:underline uppercase tracking-widest"
                >
                  View all bundles
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {bundleProgress.map((item) => (
                  <BundleCard 
                    key={item.bundle.id} 
                    bundle={item.bundle} 
                    progress={item} 
                  />
                ))}

                <button 
                  onClick={() => navigate('/coming-soon')}
                  className="w-full py-6 bg-white border border-dashed border-gray-200 rounded-3xl text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50/30 transition-all flex items-center justify-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-teal-200 transition-colors">
                    <Plus size={18} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Explore more bundles</span>
                </button>
              </div>
            </section>

            {/* Individual Guides Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Your Guides</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">All the guides you're tracking.</p>
                </div>
                <Link to="/guides" className="text-[11px] font-bold text-teal-600 hover:underline uppercase tracking-widest">View all guides</Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No guides found in this section.</p>
                    <Link to="/guides" className="text-teal-600 font-bold text-xs mt-4 inline-block hover:underline uppercase tracking-widest">Explore Knowledge Base</Link>
                  </div>
                )}
                
                {filteredGuides.length > 0 && (
                  <button className="w-full py-4 text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
                    Load more guides
                  </button>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar Area - Right Column */}
          <DashboardSidebar />

        </div>
      </div>

      {/* Confirm Modal for Deletion */}
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
};

export default UserProgress;

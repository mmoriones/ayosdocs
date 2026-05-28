'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  Search, 
  ArrowRight, 
  Bookmark, 
  Clock, 
  DollarSign, 
  BarChart3, 
  LayoutGrid, 
  List, 
  ChevronDown,
  TrendingUp,
  X,
  FileText,
  Building2,
  Filter
} from 'lucide-react';
import GuideCard from '@/features/guides/components/GuideCard';
import { Card, DashboardPageHeader, Button, SearchInput, SortDropdown, FilterPill, Banner, Tooltip, SelectionPill } from '@/components/ui';
import { toggleFavoriteAction } from '@/app/actions/user';
import { useToast } from '@/context';
import { useAuthUI } from '@/components/Providers';

/**
 * GuidesClient Component
 * Client-side component for the All Guides page with interactive filtering.
 */
export default function GuidesClient({ initialGuides }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [sortBy, setSortBy] = useState('Most Popular');
  const [searchQuery, setSearchQuery] = useState('');

  const sortOptions = [
    { label: 'Most Popular', value: 'Most Popular' },
    { label: 'Recently Updated', value: 'Recently Updated' }
  ];
  const [viewMode, setViewMode] = useState('grid'); // Default to grid for hydration consistency
  const [showTip, setShowTip] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All Durations');
  const [selectedCost, setSelectedCost] = useState('All Costs');
  const [selectedAgency, setSelectedAgency] = useState('All Agencies');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const [expandedFilters, setExpandedFilters] = useState({
    agency: false,
    estimatedTime: false,
    costRange: false
  });

  // Fetch comprehensive user data
  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (slug) => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      if (!isVerified) {
        showToast({
          type: 'warning',
          title: 'Verification Required',
          message: 'Please verify your email to favorite guides.'
        });
        return;
      }
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
        message: error.message || 'Failed to update favorite. Please try again.'
      });
    }
  });

  const handleFavoriteGuide = (slug) => {
    favoriteMutation.mutate(slug);
  };

  // Load viewMode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('guidesViewMode');
    if (savedMode && (savedMode === 'grid' || savedMode === 'list')) {
      setTimeout(() => setViewMode(savedMode), 0);
    }
  }, []);

  // Save viewMode to localStorage when it changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('guidesViewMode', mode);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    // Only reset if it's not already 6
    setTimeout(() => {
      setVisibleCount(prev => prev !== 6 ? 6 : prev);
    }, 0);
  }, [searchQuery, selectedCategory, selectedAgency, selectedTime, selectedCost, sortBy]);

  const categories = useMemo(() => ['All', ...new Set(initialGuides.map(g => g.category).filter(Boolean))], [initialGuides]);
  const agencies = useMemo(() => {
    const rawAgencies = initialGuides.flatMap(g => {
      if (!g.agency) return [];
      if (Array.isArray(g.agency)) return g.agency;
      return g.agency.split(',').map(s => s.trim());
    });
    return [...new Set(rawAgencies)].filter(Boolean);
  }, [initialGuides]);

  const agencyOptions = useMemo(() => ['All Agencies', ...agencies.sort()], [agencies]);

  // Search Relevance Mapping
  const agencyMap = {
    'DFA': 'Department of Foreign Affairs',
    'PSA': 'Philippine Statistics Authority',
    'NBI': 'National Bureau of Investigation',
    'SSS': 'Social Security System',
    'LTO': 'Land Transportation Office',
    'BIR': 'Bureau of Internal Revenue',
    'TIN': 'Taxpayer Identification Number',
    'PRC': 'Professional Regulation Commission',
    'DTI': 'Department of Trade and Industry',
    'DOLE': 'Department of Labor and Employment',
    'OWWA': 'Overseas Workers Welfare Administration',
    'PAG-IBIG': 'Home Development Mutual Fund',
    'PhilHealth': 'Philippine Health Insurance Corporation',
    'GSIS': 'Government Service Insurance System',
    'BOI': 'Board of Investments',
    'SEC': 'Securities and Exchange Commission'
  };

  const filteredGuides = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const result = initialGuides.filter(guide => {
      const guideAgencies = Array.isArray(guide.agency) 
        ? guide.agency 
        : (guide.agency ? guide.agency.split(',').map(s => s.trim()) : []);
      
      // Expand agencies with their full names for better search matching
      const expandedAgencies = guideAgencies.flatMap(a => [a, agencyMap[a] || '']);
      const guideAgencyStr = expandedAgencies.join(' ').toLowerCase();

      const matchesSearch = !query || 
        guide.title.toLowerCase().includes(query) ||
        (guide.description && guide.description.toLowerCase().includes(query)) ||
        guideAgencyStr.includes(query) ||
        (guide.category && guide.category.toLowerCase().includes(query)) ||
        (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (guide.aliases && guide.aliases.some(alias => alias.toLowerCase().includes(query)));

      const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
      const matchesAgency = selectedAgency === 'All Agencies' || guideAgencies.includes(selectedAgency);
      const matchesTime = 
        selectedTime === 'All Durations' || 
        guide.estimatedTime === selectedTime;
      const matchesCost = 
        selectedCost === 'All Costs' || 
        guide.costRange === selectedCost;

      return matchesSearch && matchesCategory && matchesAgency && matchesTime && matchesCost;
    });

    if (sortBy === 'Recently Updated') {
      result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else {
      // Default / Most Popular - placeholder logic (could be improved with actual analytics)
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialGuides, searchQuery, selectedCategory, selectedAgency, selectedTime, selectedCost, sortBy]);

  const clearSearch = () => setSearchQuery('');

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedTime('All Durations');
    setSelectedCost('All Costs');
    setSelectedAgency('All Agencies');
    setSearchQuery('');
    setVisibleCount(6);
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 6);

  return (
    <div className="min-h-screen bg-ctp-base font-sans flex flex-col transition-colors duration-300">
      <DashboardPageHeader 
        icon={FileText}
        title="Guide Library"
        description="Find step-by-step procedures for Philippine government requirements."
        isCentered={true}
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 w-full">
        {/* BORDERLESS COMMAND CENTER */}
        <div className="mb-20 space-y-12">
          <div className="flex flex-col items-center gap-10">
            {/* Centered Search Bar */}
            <div className="w-full max-w-2xl group">
              <div className="bg-ctp-mantle soft-shadow rounded-3xl transition-all duration-300 group-focus-within:soft-shadow-lg border border-transparent group-focus-within:border-ctp-sky-800/10">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for documents, processes, or agencies..."
                  className="!border-none !shadow-none !bg-transparent !py-4 !px-8"
                />
              </div>
            </div>
            
            {/* Centered Controls Row */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              <SortDropdown 
                value={sortBy} 
                onChange={setSortBy} 
                options={sortOptions} 
                className="!border-none !bg-transparent !shadow-none font-black text-xs uppercase tracking-widest hover:text-ctp-sky-800 transition-colors"
              />
              
              <div className="flex items-center gap-2">
                <Tooltip content="Grid View">
                  <button onClick={() => handleViewModeChange('grid')} className={`click-ripple p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'text-ctp-sky-800 scale-110' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <LayoutGrid size={22} />
                  </button>
                </Tooltip>
                <Tooltip content="List View">
                  <button onClick={() => handleViewModeChange('list')} className={`click-ripple p-2 rounded-xl transition-all ${viewMode === 'list' ? 'text-ctp-sky-800 scale-110' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <List size={22} />
                  </button>
                </Tooltip>
              </div>

              <button
                onClick={() => setExpandedFilters(prev => ({ 
                  agency: !prev.agency, 
                  estimatedTime: !prev.estimatedTime, 
                  costRange: !prev.costRange 
                }))}
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all py-2 px-4 rounded-xl ${
                  Object.values(expandedFilters).every(v => v) 
                    ? 'text-ctp-sky-800 bg-ctp-sky-800/5' 
                    : 'text-ctp-subtext1 hover:text-ctp-text'
                }`}
              >
                <Filter size={16} />
                {Object.values(expandedFilters).every(v => v) ? 'Hide Filters' : 'Advanced Filters'}
              </button>
            </div>
          </div>

          {/* Centered Categories Row */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-6 bg-ctp-mantle/50 rounded-full border border-ctp-surface1/30">
              {categories.map((cat) => (
                <SelectionPill
                  key={cat}
                  selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="!py-2 !px-6 !text-[10px] !rounded-full"
                >
                  {cat}
                </SelectionPill>
              ))}
            </div>
          </div>

          {/* Expandable Filter Panel - Borderless & Integrated */}
          {Object.values(expandedFilters).every(v => v) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-12 px-6 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-ctp-surface1/30">
              {/* Agency Filter */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-ctp-subtext1 uppercase tracking-[0.25em] block mb-6 text-center">Agency</label>
                <SidebarDropdown value={selectedAgency} onChange={setSelectedAgency} options={agencyOptions} />
              </div>

              {/* Time Filter */}
              <div className="space-y-6 text-center">
                <label className="text-[10px] font-black text-ctp-subtext1 uppercase tracking-[0.25em] block mb-6">Processing Time</label>
                <div className="flex flex-wrap justify-center gap-4">
                  {['All Durations', 'Same Day', '1-3 Days', '3-7 Days', '1 Week+'].map((time) => (
                    <label key={time} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="time" 
                          checked={selectedTime === time}
                          onChange={() => setSelectedTime(time)}
                          className="peer appearance-none w-5 h-5 rounded-full border border-ctp-surface1 bg-ctp-base checked:bg-ctp-sky-800 transition-all cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-bold uppercase tracking-widest">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cost Filter */}
              <div className="space-y-6 text-center">
                <label className="text-[10px] font-black text-ctp-subtext1 uppercase tracking-[0.25em] block mb-6">Estimated Cost</label>
                <div className="flex flex-wrap justify-center gap-4">
                  {['All Costs', 'Free', 'Under ₱500', '₱500–₱2,000', '₱2,000+'].map((cost) => (
                    <label key={cost} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="cost" 
                          checked={selectedCost === cost}
                          onChange={() => setSelectedCost(cost)}
                          className="peer appearance-none w-5 h-5 rounded-full border border-ctp-surface1 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer" 
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-bold uppercase tracking-widest">{cost}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GUIDES GRID */}
        <div className="flex-1 min-w-0">
            {showTip && (
              <Banner variant="sky" icon={Bookmark} title="Tip" onClose={() => setShowTip(false)} className="mb-8">
                Bookmark guides you need and track your progress in My Docs.
              </Banner>
            )}

            {filteredGuides.length > 0 ? (
              <div className={`grid gap-x-8 gap-y-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {isLoggedIn && isLoadingUserData ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <GuideCard.Skeleton key={i} viewMode={viewMode} />
                  ))
                ) : filteredGuides.slice(0, visibleCount).map((guide, index) => {
                  const progress = userData?.savedProgress?.find(p => p.guideSlug === guide.slug);
                  const isSpotlight = viewMode === 'grid' && index === 0 && searchQuery === '' && selectedCategory === 'All' && selectedAgency === 'All Agencies';
                  
                  return (
                    <GuideCard 
                      key={guide.slug} 
                      guide={guide} 
                      progress={progress}
                      viewMode={viewMode} 
                      showAgency={true}
                      showBookmark={true}
                      isSpotlight={isSpotlight}
                      onFavorite={() => handleFavoriteGuide(guide.slug)}
                      className={isSpotlight ? 'md:col-span-2' : ''}
                    />
                  );
                })}
              </div>
            ) : (

              <div className="text-center py-20 bg-ctp-mantle/50 rounded-xl border border-dashed border-ctp-surface1 shadow-sm">
                <div className="w-16 h-16 bg-ctp-base/50 border border-ctp-surface1 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Search size={28} className="text-ctp-subtext1" />
                </div>
                <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">No guides found</h3>
                <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try adjusting your filters or search terms.</p>
                <Button 
                  onClick={resetFilters} 
                  className="mt-8 uppercase text-xs tracking-widest"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {filteredGuides.length > visibleCount && (
              <div className="mt-20 flex flex-col items-center gap-8 pb-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-ctp-sky-800 shadow-sm shadow-ctp-sky-800/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-ctp-surface1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-ctp-surface1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-ctp-surface1" />
                </div>
                <Button 
                  variant="link"
                  onClick={handleLoadMore}
                  className="text-xs font-black uppercase tracking-[0.3em] text-ctp-subtext1 hover:text-ctp-sky-800 transition-all"
                >
                  Discover More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

const SidebarDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`hover-lift click-ripple w-full flex items-center justify-between gap-3 bg-ctp-base border rounded-lg px-3 py-2.5 text-xs font-bold text-ctp-text transition-all ${
          isOpen ? 'border-ctp-sky-800 ring-2 ring-ctp-sky-800/10' : 'border-ctp-surface1 hover:border-ctp-sky-800 shadow-sm'
        }`}
      >
        <span className="truncate uppercase tracking-widest">{value}</span>
        <ChevronDown size={14} className={`text-ctp-subtext1 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-ctp-base border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top">
          <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  value === option 
                    ? 'bg-ctp-sky-800 text-white shadow-sm' 
                    : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



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
import { Card, PageHeader, Button, SearchInput, SortDropdown, FilterPill, Banner } from '@/components/ui';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');

  const sortOptions = [
    { label: 'Most Popular', value: 'Most Popular' },
    { label: 'Alphabetical', value: 'Alphabetical' },
    { label: 'Recently Updated', value: 'Recently Updated' }
  ];
  const [viewMode, setViewMode] = useState('grid'); // Default to grid for hydration consistency
  const [showTip, setShowTip] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulties, setSelectedDifficulties] = useState(['All Levels']);
  const [selectedTime, setSelectedTime] = useState('All Durations');
  const [selectedCost, setSelectedCost] = useState('All Costs');
  const [selectedAgency, setSelectedAgency] = useState('All Agencies');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const [expandedFilters, setExpandedFilters] = useState({
    difficulty: true,
    estimatedTime: true,
    costRange: true,
    agency: true
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
  }, [searchQuery, selectedCategory, selectedAgency, selectedDifficulties, selectedTime, selectedCost, sortBy]);

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
      const matchesDifficulty = 
        selectedDifficulties.includes('All Levels') || 
        selectedDifficulties.includes(guide.difficulty);
      const matchesTime = 
        selectedTime === 'All Durations' || 
        guide.estimatedTime === selectedTime;
      const matchesCost = 
        selectedCost === 'All Costs' || 
        guide.costRange === selectedCost;

      return matchesSearch && matchesCategory && matchesAgency && matchesDifficulty && matchesTime && matchesCost;
    });

    if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Recently Updated') {
      result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else if (sortBy === 'Most Popular') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialGuides, searchQuery, selectedCategory, selectedAgency, selectedDifficulties, selectedTime, selectedCost, sortBy]);

  const clearSearch = () => setSearchQuery('');

  const handleDifficultyChange = (level) => {
    if (level === 'All Levels') {
      setSelectedDifficulties(['All Levels']);
      return;
    }

    setSelectedDifficulties(prev => {
      const current = prev.includes('All Levels') ? [] : prev;
      const newDifficulties = current.includes(level)
        ? current.filter(d => d !== level)
        : [...current, level];
      return newDifficulties.length === 0 ? ['All Levels'] : newDifficulties;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulties(['All Levels']);
    setSelectedTime('All Durations');
    setSelectedCost('All Costs');
    setSelectedAgency('All Agencies');
    setSearchQuery('');
    setVisibleCount(6);
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 6);

  return (
    <div className="min-h-screen bg-ctp-base font-sans flex flex-col transition-colors duration-300">
      <PageHeader 
        icon={FileText}
        title="Knowledge Base"
        description="Step-by-step procedures for Philippine government requirements."
        actions={
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-4 text-ui-detail font-semibold text-ctp-subtext0 uppercase tracking-ui-caps border-r border-ctp-surface1 pr-6">
              <span className="flex items-center gap-2">
                <FileText size={14} className="text-ctp-sky-800" />
                {initialGuides.length} Guides
              </span>
              <span className="flex items-center gap-2">
                <Building2 size={14} className="text-ctp-mauve" />
                {agencies.length} Agencies
              </span>
            </div>

            <div className="flex items-center gap-2 bg-ctp-base/50 backdrop-blur-sm px-4 py-2 rounded-full border border-ctp-surface1 shadow-sm">
              <TrendingUp size={14} className="text-ctp-sky-800" />
              <span className="text-ui-micro text-ctp-subtext0 font-semibold uppercase tracking-ui-caps">
                Trending:
              </span>
              <span className="text-ui-micro text-ctp-text font-medium">
                Passport, NBI, SSS
              </span>
            </div>
          </div>
        }
      />

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[64px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
            <Filter size={14} className="text-ctp-subtext1" />
            <span className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Categories</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-ui-tiny font-bold uppercase tracking-ui-tight transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-sm'
                  : 'bg-ctp-mantle/50 text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800/30 hover:text-ctp-sky-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-40 space-y-6">
              <div className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                  <h2 className="text-xs font-bold text-ctp-subtext0 uppercase tracking-ui-caps">Filters</h2>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs text-ctp-sky-800 font-bold uppercase tracking-ui-caps px-1 py-1 h-auto"
                  >
                    Clear
                  </Button>
                </div>

                {/* Agency Filter */}
                <div className="space-y-3">
                  <button onClick={() => toggleFilterSection('agency')} className="flex items-center justify-between w-full group">
                    <label className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps cursor-pointer group-hover:text-ctp-text">Agency</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.agency ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.agency && (
                    <SidebarDropdown value={selectedAgency} onChange={setSelectedAgency} options={agencyOptions} />
                  )}
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-3">
                  <button onClick={() => toggleFilterSection('difficulty')} className="flex items-center justify-between w-full group">
                    <label className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps cursor-pointer group-hover:text-ctp-text">Difficulty</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.difficulty ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.difficulty && (
                    <div className="space-y-2.5 pl-1">
                      {['All Levels', 'Easy', 'Moderate', 'Complex'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedDifficulties.includes(level)}
                              onChange={() => handleDifficultyChange(level)}
                              className="peer appearance-none w-4 h-4 rounded border border-ctp-surface1 bg-ctp-base checked:bg-ctp-sky-800 checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-semibold">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Processing Time Filter */}
                <div className="space-y-3">
                  <button onClick={() => toggleFilterSection('estimatedTime')} className="flex items-center justify-between w-full group">
                    <label className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps cursor-pointer group-hover:text-ctp-text">Time</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.estimatedTime ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.estimatedTime && (
                    <div className="space-y-3 pl-1">
                      {['All Durations', 'Same Day', '1-3 Days', '3-7 Days', '1 Week+'].map((time) => (
                        <label key={time} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="time" 
                              checked={selectedTime === time}
                              onChange={() => setSelectedTime(time)}
                              className="peer appearance-none w-4 h-4 rounded-full border border-ctp-surface1 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-medium">{time}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Range Filter */}
                <div className="space-y-3 border-t border-ctp-surface1 pt-4">
                  <button onClick={() => toggleFilterSection('costRange')} className="flex items-center justify-between w-full group">
                    <label className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps cursor-pointer group-hover:text-ctp-text">Cost Range</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.costRange ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.costRange && (
                    <div className="space-y-3 pl-1">
                      {['All Costs', 'Free', 'Under ₱500', '₱500–₱2,000', '₱2,000+'].map((cost) => (
                        <label key={cost} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="cost" 
                              checked={selectedCost === cost}
                              onChange={() => setSelectedCost(cost)}
                              className="peer appearance-none w-4 h-4 rounded-full border border-ctp-surface1 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-medium">{cost}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
              <div className="flex-1 max-w-2xl relative">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for documents, processes, or agencies..."
                />
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs font-bold text-ctp-subtext1 uppercase tracking-widest bg-ctp-base px-2 py-1 rounded border border-ctp-surface1">
                      {filteredGuides.length} {filteredGuides.length === 1 ? 'result' : 'results'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <SortDropdown 
                  value={sortBy} 
                  onChange={setSortBy} 
                  options={sortOptions} 
                />
                <div className="flex items-center bg-ctp-mantle/50 border border-ctp-surface1 p-1 rounded-lg shadow-sm">
                  <button onClick={() => handleViewModeChange('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-ctp-base text-ctp-sky-800 shadow-sm border border-ctp-surface1' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => handleViewModeChange('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-ctp-base text-ctp-sky-800 shadow-sm border border-ctp-surface1' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(selectedCategory !== 'All' || selectedAgency !== 'All Agencies' || !selectedDifficulties.includes('All Levels') || selectedTime !== 'All Durations' || selectedCost !== 'All Costs') && (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-ctp-subtext1 uppercase tracking-widest mr-2">Active Filters:</span>
                {selectedCategory !== 'All' && (
                   <FilterPill label={selectedCategory} onClear={() => setSelectedCategory('All')} />
                )}
                {selectedAgency !== 'All Agencies' && (
                   <FilterPill label={selectedAgency} onClear={() => setSelectedAgency('All Agencies')} />
                )}
                {!selectedDifficulties.includes('All Levels') && selectedDifficulties.map(d => (
                   <FilterPill key={d} label={d} onClear={() => handleDifficultyChange(d)} />
                ))}
                {selectedTime !== 'All Durations' && (
                   <FilterPill label={selectedTime} onClear={() => setSelectedTime('All Durations')} />
                )}
                {selectedCost !== 'All Costs' && (
                   <FilterPill label={selectedCost} onClear={() => setSelectedCost('All Costs')} />
                )}
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs font-bold text-ctp-orange uppercase tracking-widest hover:underline px-2 py-0 h-auto hover:bg-ctp-orange/10"
                >
                  Clear All
                </Button>
              </div>
            )}

            {showTip && (
              <Banner variant="sky" icon={Bookmark} title="Tip" onClose={() => setShowTip(false)} className="mb-8">
                Bookmark guides you need and track your progress in My Docs.
              </Banner>
            )}

            {filteredGuides.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {isLoggedIn && isLoadingUserData ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <GuideCard.Skeleton key={i} viewMode={viewMode} />
                  ))
                ) : filteredGuides.slice(0, visibleCount).map((guide) => {
                  const progress = userData?.savedProgress?.find(p => p.guideSlug === guide.slug);
                  return (
                    <GuideCard 
                      key={guide.slug} 
                      guide={guide} 
                      progress={progress}
                      viewMode={viewMode} 
                      showAgency={true}
                      showBookmark={true}
                      onFavorite={() => handleFavoriteGuide(guide.slug)}
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
              <div className="mt-12 text-center pb-12">
                <Button 
                  variant="secondary"
                  onClick={handleLoadMore}
                  rightIcon={<ChevronDown size={14} />}
                  className="text-xs text-ctp-subtext1 uppercase tracking-widest hover:text-ctp-text shadow-sm"
                >
                  Load more guides
                </Button>
              </div>
            )}
          </main>
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
        className={`w-full flex items-center justify-between gap-3 bg-ctp-base border rounded-lg px-3 py-2.5 text-xs font-bold text-ctp-text transition-all active:scale-[0.98] ${
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



'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
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
  Star,
  FileText,
  Building2,
  Filter
} from 'lucide-react';
import { getGuideIcon } from '@/lib/guideIcons';
import GuideCard from '@/features/guides/components/GuideCard';
import Banner from '@/components/ui/Banner';
import Adsense from '@/components/Adsense';
import Image from 'next/image';

/**
 * GuidesClient Component
 * Client-side component for the All Guides page with interactive filtering.
 */
export default function GuidesClient({ initialGuides }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');
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

  // Load viewMode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('guidesViewMode');
    if (savedMode && (savedMode === 'grid' || savedMode === 'list')) {
      setViewMode(savedMode);
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
    setVisibleCount(prev => prev !== 6 ? 6 : prev);
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

  const filteredGuides = useMemo(() => {
    const result = initialGuides.filter(guide => {
      const guideAgencies = Array.isArray(guide.agency) 
        ? guide.agency 
        : (guide.agency ? guide.agency.split(',').map(s => s.trim()) : []);
      const guideAgencyStr = guideAgencies.join(' ');

      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.description && guide.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guideAgencyStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.category && guide.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (guide.aliases && guide.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())));

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
      {/* HEADER SECTION */}
      <div className="bg-ctp-mantle border-b border-ctp-surface0">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 flex-1">
            <div className="p-4 rounded-2xl bg-ctp-sky-800/10 shrink-0 border border-ctp-sky-800/20">
              <FileText className="text-ctp-sky-800" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-ctp-text tracking-tight uppercase">
                Knowledge Base
              </h1>
              <p className="text-ctp-subtext1 text-sm font-medium mt-1">
                Step-by-step procedures for Philippine government requirements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 shrink-0">
            <div className="hidden xl:flex items-center gap-4 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] border-r border-ctp-surface0 pr-6">
              <span className="flex items-center gap-2">
                <FileText size={14} className="text-ctp-sky-800" />
                {initialGuides.length} Guides
              </span>
              <span className="flex items-center gap-2">
                <Building2 size={14} className="text-ctp-mauve" />
                {agencies.length} Agencies
              </span>
            </div>

            <div className="flex items-center gap-2 bg-ctp-base/50 backdrop-blur-sm px-4 py-2 rounded-full border border-ctp-surface0 shadow-sm">
              <TrendingUp size={14} className="text-ctp-sky-800" />
              <span className="text-[11px] text-ctp-subtext0 font-black uppercase tracking-widest">
                Trending:
              </span>
              <span className="text-[11px] text-ctp-text font-bold">
                Passport, NBI, SSS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface0 sticky top-[73px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface0 shrink-0">
            <Filter size={14} className="text-ctp-subtext1" />
            <span className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-widest">Quick Filter</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-ctp-sky-800 text-ctp-base border-ctp-sky-800 shadow-lg shadow-ctp-sky-800/20'
                  : 'bg-ctp-mantle text-ctp-subtext0 border-ctp-surface0 hover:border-ctp-sky-800 hover:text-ctp-sky-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-40 space-y-8">
              <div className="bg-ctp-mantle rounded-[2rem] p-6 border border-ctp-surface0 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-ctp-text uppercase tracking-widest">Filters</h2>
                  <button 
                    onClick={resetFilters}
                    className="text-[10px] text-ctp-sky-800 font-black uppercase tracking-widest hover:text-ctp-sky-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Agency Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('agency')} className="flex items-center justify-between w-full group">
                    <label className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Government Agency</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.agency ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.agency && (
                    <SidebarDropdown value={selectedAgency} onChange={setSelectedAgency} options={agencyOptions} />
                  )}
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('difficulty')} className="flex items-center justify-between w-full group">
                    <label className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Difficulty</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.difficulty ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.difficulty && (
                    <div className="space-y-3 pl-1">
                      {['All Levels', 'Easy', 'Moderate', 'Complex'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedDifficulties.includes(level)}
                              onChange={() => handleDifficultyChange(level)}
                              className="peer appearance-none w-5 h-5 rounded-lg border border-ctp-surface0 bg-ctp-base checked:bg-ctp-sky-800 checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <X className="absolute w-3 h-3 text-ctp-base opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-bold uppercase tracking-tight">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('costRange')} className="flex items-center justify-between w-full group">
                    <label className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Cost Range</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.costRange ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.costRange && (
                    <div className="space-y-3 pl-1">
                      {['All Costs', 'Free', 'Under ₱500', '₱500–₱2000', '₱2000+'].map((cost) => (
                        <label key={cost} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="cost" 
                              checked={selectedCost === cost}
                              onChange={() => setSelectedCost(cost)}
                              className="peer appearance-none w-5 h-5 rounded-full border border-ctp-surface0 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-bold uppercase tracking-tight">{cost}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-ctp-mantle rounded-[2rem] p-6 border border-ctp-surface0 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-ctp-sky-800" />
                  <h3 className="text-sm font-black text-ctp-text uppercase tracking-widest">Trending</h3>
                </div>
                <div className="space-y-5">
                  {initialGuides.slice(0, 3).map((guide, index) => (
                    <Link key={guide.slug} href={`/guides/${guide.slug}`} className="flex items-start gap-3 group">
                      <span className="text-xs font-black text-ctp-surface1 group-hover:text-ctp-sky-800 transition-colors mt-0.5">{index + 1}</span>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors line-clamp-2 leading-snug uppercase">{guide.title}</p>
                        <p className="text-[9px] text-ctp-subtext0 mt-1 uppercase font-black tracking-widest">4.8k views</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Adsense variant="sidebar" />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ctp-subtext1" />
                <input
                  type="text"
                  placeholder="Search for documents, processes, or agencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 rounded-2xl border border-ctp-surface0 bg-ctp-mantle text-[18px] text-ctp-text placeholder:text-ctp-subtext1 focus:outline-none focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 shadow-sm transition-all font-medium"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext1 hover:text-ctp-text transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                <div className="flex items-center bg-ctp-mantle border border-ctp-surface0 p-1.5 rounded-xl shadow-sm">
                  <button onClick={() => handleViewModeChange('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => handleViewModeChange('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {showTip && (
              <Banner variant="sky" icon={Bookmark} title="Tip" onClose={() => setShowTip(false)} className="mb-8">
                Bookmark guides you need and track your progress in My Docs.
              </Banner>
            )}

            {filteredGuides.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredGuides.slice(0, visibleCount).map((guide) => (
                  <GuideCard 
                    key={guide.slug} 
                    guide={guide} 
                    viewMode={viewMode} 
                    showAgency={true}
                    showBookmark={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-ctp-mantle rounded-[3rem] border-2 border-dashed border-ctp-surface0">
                <div className="w-16 h-16 bg-ctp-surface0 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-ctp-subtext1" />
                </div>
                <h3 className="text-xl font-bold text-ctp-text uppercase">No guides found</h3>
                <p className="text-ctp-subtext1 font-medium mt-2">Try adjusting your filters or search keywords.</p>
                <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-ctp-sky-800 text-ctp-base rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Clear all</button>
              </div>
            )}

            {filteredGuides.length > visibleCount && (
              <div className="mt-16 text-center pb-12">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-4 bg-ctp-mantle border border-ctp-surface0 rounded-2xl font-black text-xs text-ctp-text uppercase tracking-widest hover:border-ctp-sky-800 hover:text-ctp-sky-800 transition-all flex items-center gap-3 mx-auto shadow-sm active:scale-95"
                >
                  Load more guides
                  <ChevronDown size={16} />
                </button>
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
        className={`w-full flex items-center justify-between gap-3 bg-ctp-base border rounded-xl px-4 py-3 text-[12px] font-bold text-ctp-text transition-all active:scale-[0.98] ${
          isOpen ? 'border-ctp-sky-800 ring-4 ring-ctp-sky-800/10' : 'border-ctp-surface0 hover:border-ctp-sky-800 shadow-sm'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`text-ctp-subtext1 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-ctp-mantle border border-ctp-surface0 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top">
          <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar space-y-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all ${
                  value === option 
                    ? 'bg-ctp-sky-800 text-ctp-base shadow-md shadow-ctp-sky-800/20' 
                    : 'text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text'
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

const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const options = [
    { label: 'Most Popular', value: 'Most Popular' },
    { label: 'Alphabetical', value: 'Alphabetical' },
    { label: 'Recently Updated', value: 'Recently Updated' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-ctp-mantle border rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-ctp-text transition-all shadow-sm active:scale-95 ${
          isOpen ? 'border-ctp-sky-800 ring-4 ring-ctp-sky-800/10' : 'border-ctp-surface0 hover:border-ctp-sky-800'
        }`}
      >
        <span className="text-ctp-subtext1">Sort:</span>
        {sortBy}
        <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-ctp-base/95 backdrop-blur-xl border border-ctp-surface0 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
          <div className="p-1.5 space-y-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  sortBy === option.value 
                    ? 'bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20' 
                    : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

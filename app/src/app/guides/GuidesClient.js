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
import GuideCard from '@/features/guides/components/GuideCard';
import Banner from '@/components/ui/Banner';
import PageHeader from '@/components/ui/PageHeader';
import SearchInput from '@/components/ui/SearchInput';
import Adsense from '@/components/Adsense';

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
      <PageHeader 
        icon={FileText}
        title="Knowledge Base"
        description="Step-by-step procedures for Philippine government requirements."
        actions={
          <>
            <div className="hidden xl:flex items-center gap-4 text-xs font-semibold text-ctp-subtext0 uppercase tracking-wider border-r border-ctp-surface1 pr-6">
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
              <span className="text-[11px] text-ctp-subtext0 font-semibold uppercase tracking-wider">
                Trending:
              </span>
              <span className="text-[11px] text-ctp-text font-medium">
                Passport, NBI, SSS
              </span>
            </div>
          </>
        }
      />

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[64px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
            <Filter size={12} className="text-ctp-subtext1" />
            <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Filter by category</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-sm'
                  : 'bg-ctp-mantle text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800 hover:text-ctp-sky-800'
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
              <div className="bg-ctp-mantle rounded-2xl p-6 border border-ctp-surface1 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-ctp-surface1 pb-4">
                  <h2 className="text-[10px] font-bold text-ctp-text uppercase tracking-widest">Advanced Filters</h2>
                  <button 
                    onClick={resetFilters}
                    className="text-[10px] text-ctp-sky-800 font-bold uppercase tracking-widest hover:underline transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Agency Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('agency')} className="flex items-center justify-between w-full group">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Government Agency</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.agency ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.agency && (
                    <SidebarDropdown value={selectedAgency} onChange={setSelectedAgency} options={agencyOptions} />
                  )}
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('difficulty')} className="flex items-center justify-between w-full group">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Difficulty</label>
                    <ChevronDown size={14} className={`text-ctp-subtext1 transition-transform duration-300 ${expandedFilters.difficulty ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.difficulty && (
                    <div className="space-y-2.5 pl-0.5">
                      {['All Levels', 'Easy', 'Moderate', 'Complex'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedDifficulties.includes(level)}
                              onChange={() => handleDifficultyChange(level)}
                              className="peer appearance-none w-4 h-4 rounded-md border border-ctp-surface1 bg-ctp-mantle checked:bg-ctp-sky-800 checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <X className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-semibold">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Filter */}
                <div className="space-y-4">
                  <button onClick={() => toggleFilterSection('costRange')} className="flex items-center justify-between w-full group">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest cursor-pointer group-hover:text-ctp-text">Cost Range</label>
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
                              className="peer appearance-none w-5 h-5 rounded-full border border-ctp-surface1 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors font-medium">{cost}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm space-y-5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-ctp-sky-800" />
                  <h3 className="text-[10px] font-bold text-ctp-text uppercase tracking-widest">Trending Guides</h3>
                </div>
                <div className="space-y-4">
                  {initialGuides.slice(0, 3).map((guide, index) => (
                    <Link key={guide.slug} href={`/guides/${guide.slug}`} className="flex items-start gap-3 group">
                      <span className="text-[10px] font-bold text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-colors mt-0.5">0{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors line-clamp-2 leading-tight tracking-tight">{guide.title}</p>
                        <p className="text-[9px] text-ctp-subtext1 mt-1 uppercase font-bold tracking-widest">4.8k interactions</p>
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
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
              <div className="flex-1 max-w-2xl">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for documents, processes, or agencies..."
                />
              </div>

              <div className="flex items-center gap-3">
                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                <div className="flex items-center bg-ctp-mantle border border-ctp-surface1 p-1 rounded-lg shadow-sm">
                  <button onClick={() => handleViewModeChange('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-ctp-base text-ctp-sky-800 shadow-sm border border-ctp-surface1' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => handleViewModeChange('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-ctp-base text-ctp-sky-800 shadow-sm border border-ctp-surface1' : 'text-ctp-subtext1 hover:text-ctp-text'}`}>
                    <List size={16} />
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
              <div className="text-center py-20 bg-ctp-mantle rounded-xl border border-dashed border-ctp-surface1 shadow-sm">
                <div className="w-14 h-14 bg-ctp-base/50 border border-ctp-surface1 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Search size={24} className="text-ctp-subtext1" />
                </div>
                <h3 className="text-lg font-bold text-ctp-text tracking-tight">No guides found</h3>
                <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters} className="mt-8 px-6 py-2 bg-ctp-sky-800 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-all">Clear Filters</button>
              </div>
            )}

            {filteredGuides.length > visibleCount && (
              <div className="mt-12 text-center pb-12">
                <button 
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 bg-ctp-base border border-ctp-surface1 rounded-lg font-bold text-[10px] text-ctp-subtext1 uppercase tracking-widest hover:text-ctp-text hover:border-ctp-sky-800 transition-all flex items-center gap-2 mx-auto shadow-sm active:scale-95"
                >
                  Load more guides
                  <ChevronDown size={14} />
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
        className={`w-full flex items-center justify-between gap-3 bg-ctp-base border rounded-lg px-3 py-2 text-[10px] font-bold text-ctp-text transition-all active:scale-[0.98] ${
          isOpen ? 'border-ctp-sky-800 ring-2 ring-ctp-sky-800/10' : 'border-ctp-surface1 hover:border-ctp-sky-800 shadow-sm'
        }`}
      >
        <span className="truncate uppercase tracking-widest">{value}</span>
        <ChevronDown size={12} className={`text-ctp-subtext1 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-ctp-base border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top">
          <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
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
        className={`flex items-center gap-3 bg-ctp-mantle border rounded-lg px-4 py-2 text-[10px] font-bold text-ctp-text transition-all shadow-sm active:scale-95 ${
          isOpen ? 'border-ctp-sky-800 ring-2 ring-ctp-sky-800/10' : 'border-ctp-surface1 hover:border-ctp-sky-800'
        }`}
      >
        <span className="text-ctp-subtext1 font-bold uppercase tracking-widest">Sort:</span>
        <span className="uppercase tracking-widest">{sortBy}</span>
        <ChevronDown size={12} className={`text-ctp-subtext1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
          <div className="p-1 space-y-0.5">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  sortBy === option.value 
                    ? 'bg-ctp-sky-800 text-white shadow-sm' 
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

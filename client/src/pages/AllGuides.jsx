import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  RefreshCw,
  TrendingUp,
  ChevronRight,
  History,
  Grid,
  X,
  Star,
  FileText,
  Building2,
  Calendar
} from 'lucide-react';
import personImg from '../assets/person.webp';
import { guidesMap } from '../utils/loadGuides';
import { getGuideIcon } from '../utils/guideIcons';

/**
 * AllGuides Page Component
 * Displays a comprehensive list of guides with independent column scrolling.
 */
const AllGuides = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  
  // State for collapsible filter sections
  const [expandedFilters, setExpandedFilters] = useState({
    difficulty: true,
    estimatedTime: true,
    costRange: true
  });

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    document.title = "All Guides | AyosDocs";
  }, []);

  const allGuides = useMemo(() => {
    return Object.values(guidesMap).sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const filteredGuides = allGuides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guide.description && guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Categories and Agencies extracted from all guides
  const categories = useMemo(() => [...new Set(allGuides.map(g => g.category).filter(Boolean))], [allGuides]);
  const agencies = useMemo(() => [...new Set(allGuides.map(g => g.agency).filter(Boolean))], [allGuides]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* HEADER SECTION - ULTRA COMPACT KNOWLEDGE BASE */}
        <div className="bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Icon + Title Area */}
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 rounded-xl bg-teal-100 shrink-0">
                <FileText className="text-teal-600" size={20} />
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Knowledge Base
                </h1>
                <p className="text-gray-500 text-xs font-medium">
                  Philippine government requirements and step-by-step procedures.
                </p>
              </div>
            </div>

            {/* Right: Inline Stats, Holiday & Trending Utilities */}
            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              {/* Subtle Stats */}
              <div className="hidden xl:flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 pr-6">
                <span className="flex items-center gap-1.5">
                  <FileText size={12} className="text-teal-500/50" />
                  {allGuides.length} Guides
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-teal-500/50" />
                  {agencies.length} Agencies
                </span>
              </div>

              {/* Roadmap Utility: Holiday Status (Sync placeholder) */}
              <div className="hidden sm:flex items-center gap-2 bg-orange-50/50 px-3 py-1.5 rounded-full border border-orange-100 shadow-xs group cursor-help transition-all hover:bg-orange-50">
                <Calendar size={10} className="text-orange-600" />
                <span className="text-[10px] text-orange-700 font-bold uppercase tracking-tighter">
                  Regular Hours
                </span>
                <div className="w-1 h-1 rounded-full bg-orange-400" />
              </div>

              {/* Roadmap Utility: Trending Ticker */}
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-teal-100/50 shadow-xs">
                <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 uppercase tracking-tighter">
                  <TrendingUp size={10} />
                  Trending:
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Passport, NBI, SSS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          
          {/* THREE COLUMN GRID WITH INDEPENDENT SCROLLS */}
          <div className="grid grid-cols-12 gap-8 md:gap-4 h-[720px] mt-6">
            
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className="hidden lg:block lg:col-span-2 h-full overflow-y-auto py-2 pr-4 custom-scrollbar">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight">Filters</h2>
                  <button className="text-xs text-teal-600 font-bold hover:text-teal-700 transition-colors">Clear all</button>
                </div>

                {/* Category Filter */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-gray-900 pl-0.5">Category</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-xs font-medium cursor-pointer">
                      <option>All Categories</option>
                      {categories.map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Agency Filter */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-gray-900 pl-0.5">Agency</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-xs font-medium cursor-pointer">
                      <option>All Agencies</option>
                      {agencies.map(agency => (
                        <option key={agency}>{agency}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFilterSection('difficulty')}
                    className="flex items-center justify-between w-full"
                  >
                    <label className="text-xs font-bold text-gray-900 pl-0.5 cursor-pointer">Difficulty</label>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${expandedFilters.difficulty ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilters.difficulty && (
                    <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200 pl-0.5">
                      {['All Levels', 'Easy', 'Moderate', 'Complex'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              defaultChecked={level === 'All Levels'} 
                              className="peer appearance-none w-4.5 h-4.5 rounded border border-slate-300 checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer" 
                            />
                            <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-xs text-slate-600 group-hover:text-gray-900 transition-colors font-semibold">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Estimated Time */}
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFilterSection('estimatedTime')}
                    className="flex items-center justify-between w-full"
                  >
                    <label className="text-xs font-bold text-gray-900 pl-0.5 cursor-pointer">Estimated Time</label>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${expandedFilters.estimatedTime ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedFilters.estimatedTime && (
                    <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200 pl-0.5">
                      {['All Durations', 'Same Day', '1-3 Days', '3-7 Days', '1 Week+'].map((time) => (
                        <label key={time} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="time" 
                              defaultChecked={time === 'All Durations'} 
                              className="peer appearance-none w-4.5 h-4.5 rounded-full border border-slate-300 checked:border-teal-600 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-teal-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-slate-600 group-hover:text-gray-900 transition-colors font-semibold">{time}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Range */}
                <div className="space-y-3">
                  <button 
                    onClick={() => toggleFilterSection('costRange')}
                    className="flex items-center justify-between w-full"
                  >
                    <label className="text-xs font-bold text-gray-900 pl-0.5 cursor-pointer">Cost Range</label>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${expandedFilters.costRange ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedFilters.costRange && (
                    <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200 pl-0.5">
                      {['All Costs', 'Free', 'Under ₱500', '₱500 - ₱2,000', 'Over ₱2,000'].map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="radio" 
                              name="cost" 
                              defaultChecked={range === 'All Costs'} 
                              className="peer appearance-none w-4.5 h-4.5 rounded-full border border-slate-300 checked:border-teal-600 transition-all cursor-pointer" 
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-teal-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-xs text-slate-600 group-hover:text-gray-900 transition-colors font-semibold">{range}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-4">
                  <button className="w-full bg-[#009688] text-white py-3 rounded-full font-bold shadow-sm hover:bg-[#00796b] transition-all text-xs active:scale-95">
                    Apply Filters
                  </button>
                  <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                    Showing {filteredGuides.length} {filteredGuides.length <= 1 ? "guide" : "guides"}
                  </p>
                </div>
              </div>
            </aside>


            {/* MAIN CONTENT AREA - GUIDE GRID */}
            <main className="col-span-12 lg:col-span-8 h-full overflow-y-auto py-2 px-2 custom-scrollbar">
              
              {/* CONTROL BAR - Combined Search, Sort, and View */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                
                {/* Search Bar - Relocated here */}
                <div className="flex-1 relative max-w-2xl">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search for documents, processes, or agencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Sorting */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap">Sort:</span>
                    <div className="relative">
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/10 transition-all cursor-pointer shadow-sm"
                      >
                        <option>Most Popular</option>
                        <option>Alphabetical</option>
                        <option>Recently Updated</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                      <LayoutGrid size={16} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex items-start gap-3 mb-8">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mt-0.5 flex-shrink-0">
                  <Bookmark size={14} />
                </div>
                <p className="text-sm text-teal-800 leading-relaxed flex-1">
                  <span className="font-bold">Tip:</span> Bookmark guides you need and track your progress in My Progress.
                </p>
                <button className="text-teal-400 hover:text-teal-600">
                  <X size={16} />
                </button>
              </div>

              {filteredGuides.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredGuides.map((guide) => (
                    <GuideCard key={guide.slug} guide={guide} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500">No guides found matching your search.</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-teal-600 font-medium hover:underline">Clear search</button>
                </div>
              )}


              <div className="mt-8 text-center pb-6">
                <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-xs text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all flex items-center gap-2 mx-auto shadow-xs active:scale-95">
                  Load more guides
                  <ChevronDown size={14} />
                </button>
              </div>
            </main>

            {/* RIGHT SIDEBAR - CATEGORIES & TRENDING */}
            <aside className="hidden lg:block lg:col-span-2 h-full overflow-y-auto py-2 pl-4 custom-scrollbar">
              <div className="space-y-10">
                <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-gray-900">Popular</h3>
                    <Link to="#" className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-tight">View all</Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Identification', count: 25, icon: <Grid size={16} />, color: 'bg-blue-50 text-blue-600' },
                      { name: 'Travel', count: 18, icon: <RefreshCw size={16} />, color: 'bg-teal-50 text-teal-600' },
                      { name: 'Employment', count: 16, icon: <Bookmark size={16} />, color: 'bg-orange-50 text-orange-600' },
                    ].map((cat) => (
                      <Link key={cat.name} to="#" className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            {cat.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-1">{cat.name}</p>
                            <p className="text-[10px] text-gray-400">{cat.count} guides</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-teal-600" />
                      <h3 className="text-sm font-bold text-gray-900">Trending</h3>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {allGuides.slice(0, 5).map((guide, index) => (
                      <Link key={guide.slug} to={`/guides/${guide.slug}`} className="flex items-start gap-3 group">
                        <span className="text-sm font-bold text-gray-200 group-hover:text-teal-600 transition-colors mt-0.5">{index + 1}</span>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">{guide.title}</p>
                          <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">4.8k views</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <History size={16} className="text-teal-600" />
                    <h3 className="text-sm font-bold text-gray-900">Recent</h3>
                  </div>
                  <div className="space-y-5 pb-6">
                    {allGuides.slice(0, 5).map((guide) => (
                      <Link key={guide.slug} to={`/guides/${guide.slug}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors flex-shrink-0">
                          <img src={getGuideIcon(guide.slug)} alt="" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">{guide.title}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5 font-bold uppercase tracking-tighter">May 8</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>

          {/* COMMUNITY INSIGHTS SECTION - HIGH DENSITY COMPACT */}
          <section className="mt-8 pb-12">
            <div className="grid grid-cols-12 gap-5">
              
              {/* Community Insights (Left) */}
              <div className="col-span-12 lg:col-span-9 flex flex-col h-full">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden flex-1 relative group">
                  
                  {/* Internal Header - Tighter padding */}
                  <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 leading-none">Community Insights</h2>
                      <p className="text-gray-400 text-[10px] mt-1.5">Real experiences from the community (anonymous)</p>
                    </div>
                    <Link to="#" className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1 uppercase tracking-wider">
                      View all offices
                      <ArrowRight size={12} />
                    </Link>
                  </div>

                  {/* Insights Content Row - No dividers, more space between items */}
                  <div className="flex flex-col md:flex-row items-stretch px-2 pb-5 flex-1 relative">
                    {[
                      { name: 'DFA Manila Aseana', rating: 4.3, reviews: 182, waitTime: '2-3 hrs', peak: 'Peak hours: 10AM - 1PM', icon: getGuideIcon('passport-appointment') },
                      { name: 'PSA Quezon City Main Office', rating: 4.5, reviews: 156, waitTime: '1-2 hrs', peak: 'Most users report smooth processing this week.', icon: getGuideIcon('psa-birth-certificate'), tip: true },
                      { name: 'LTO East Avenue District Office', rating: 4.1, reviews: 98, waitTime: '2-4 hrs', peak: 'Peak hours: 11AM - 2PM', icon: getGuideIcon('nbi-clearance') },
                    ].map((office, i) => (
                      <div key={i} className="flex-1 px-4 py-4 flex flex-col justify-between transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center p-2 shrink-0">
                              <img src={office.icon} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[12px] font-bold text-gray-800 truncate leading-tight">{office.name}</h4>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-yellow-400 text-[10px]">★</span>
                                <span className="text-[10px] font-bold text-gray-700">{office.rating}</span>
                                <span className="text-[10px] text-gray-400">({office.reviews})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-gray-400">Average waiting time today</p>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">
                                {office.waitTime}
                              </span>
                            </div>
                            <p className={`text-[10px] ${office.tip ? 'text-teal-600 font-medium' : 'text-gray-500'} leading-snug line-clamp-2`}>
                              {office.peak}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Carousel Arrow as seen in wireframe */}
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all z-10 opacity-0 group-hover:opacity-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Share Your Experience (Right) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col h-full">
                <div className="bg-[#f8fbfb] rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group border border-gray-100/50 shadow-sm">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-teal-700 leading-tight mb-2">Share Your Experience</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed max-w-[170px]">
                      Help others by sharing your experience at a government office.
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 flex justify-end">
                    <button className="px-5 py-2.5 bg-white text-teal-600 border border-teal-600/30 rounded-xl font-bold text-[11px] shadow-sm hover:shadow-md hover:border-teal-600 transition-all flex items-center justify-center gap-1.5 active:scale-95">
                      <Star size={14} className="text-teal-500 fill-teal-500/10" />
                      Rate an Office
                    </button>
                  </div>

                  {/* Character Illustration - Left of the button as per wireframe */}
                  <div className="absolute -bottom-2 -left-4 w-36 h-36 pointer-events-none opacity-90 transition-transform group-hover:scale-105 duration-500">
                    <img src="/src/assets/person2.webp" alt="" className="w-full h-full object-contain object-bottom" />
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


/**
 * GuideCard Component
 */
const GuideCard = ({ guide }) => {
  return (
    <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all relative overflow-hidden flex flex-col h-full">
      <button className="absolute top-6 right-6 p-2 text-gray-300 hover:text-teal-600 transition-colors bg-white rounded-full shadow-sm z-10">
        <Bookmark size={20} />
      </button>

      <div className="mb-6 w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center p-3 group-hover:bg-teal-50 transition-colors">
        <img 
          src={getGuideIcon(guide.slug)} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors leading-tight mb-3">
          {guide.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
          {guide.description || "Step-by-step requirements and procedures for this government process."}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-teal-500" />
            {guide.estimatedTime || "1-3 days"}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={12} className="text-teal-500" />
            {guide.costRange || "Free"}
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 size={12} className="text-teal-500" />
            {guide.difficulty || "Easy"}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-[10px] text-gray-400 font-medium">Updated {guide.lastUpdated || "May 8, 2026"}</span>
        <Link 
          to={`/guides/${guide.slug}`}
          className="text-teal-600 font-bold text-xs flex items-center gap-1.5 hover:gap-2.5 transition-all"
        >
          View guide
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default AllGuides;

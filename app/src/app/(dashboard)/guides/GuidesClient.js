'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Search,
  ChevronRight,
  ChevronDown,
  Heart,
  Star,
  Flame,
  LayoutGrid,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Button, Card, Badge, Input } from '@/components/ui';
import { GuideIcon } from '@/lib/guideIcons';
import { getIconTheme, THEMES } from '@/lib/assetStyles';

/**
 * SelectionPill Component
 * High-fidelity pill for category filtering.
 */
const SelectionPill = ({ selected, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap border transition-all active:scale-95 flex items-center gap-2 ${
        selected
          ? 'bg-[#0038A8] text-white border-[#0038A8] shadow-[0_8px_20px_rgba(0,56,168,0.15)]'
          : 'bg-white/80 backdrop-blur-md text-gray-500 border-white/60 hover:border-[#0038A8]/30 hover:text-[#0038A8] shadow-sm'
      } ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * High-fidelity Guides Library with Category Discovery.
 */
const MAX_QUERY_LENGTH = 100;

export default function GuidesClient({ initialGuides }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(3);

  const sanitize = (val) => val.replace(/[<>]/g, '').slice(0, MAX_QUERY_LENGTH);
  const isOverLimit = searchQuery.length >= MAX_QUERY_LENGTH;

  const categories = useMemo(() => {
    return ['All', ...new Set(initialGuides.map(g => g.category).filter(Boolean))];
  }, [initialGuides]);

  // Featured / Trending Guides
  const featuredSlugs = ['passport-appointment', 'nbi-clearance', 'psa-birth-certificate', 'drivers-license'];
  
  const featuredGuides = useMemo(() => {
    let matched = initialGuides.filter(g => featuredSlugs.includes(g.slug));
    
    // Maintain the order defined in featuredSlugs
    matched.sort((a, b) => featuredSlugs.indexOf(a.slug) - featuredSlugs.indexOf(b.slug));

    if (matched.length < 4) {
      const remaining = initialGuides.filter(g => !featuredSlugs.includes(g.slug)).slice(0, 4 - matched.length);
      matched = [...matched, ...remaining];
    }
    
    return matched.slice(0, 4);
  }, [initialGuides]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = initialGuides.filter(guide => {
      const matchesSearch = !query || 
        guide.title.toLowerCase().includes(query) ||
        guide.shortTitle?.toLowerCase().includes(query) ||
        guide.description?.toLowerCase().includes(query) ||
        guide.agency?.toLowerCase().includes(query) ||
        guide.tags?.some(t => t.toLowerCase().includes(query));

      const matchesCategory = activeCategory === 'All' || guide.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    const groups = {};
    filtered.forEach(guide => {
      const cat = guide.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(guide);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [initialGuides, searchQuery, activeCategory]);

  const isResultsView = searchQuery || activeCategory !== 'All';

  const handleLoadMoreCategories = () => {
    setVisibleCategoriesCount(prev => prev + 3);
  };

  return (
    <div className="min-h-screen bg-ios-gradient pb-32 animate-in fade-in duration-700 selection:bg-[#0038A8]/10">
      {/* High-Fidelity Discovery Header */}
      <header className="px-6 pt-12 pb-8 max-w-[1600px] mx-auto lg:px-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-[34px] lg:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-none">
            Guides Library
          </h1>
          <p className="text-[15px] lg:text-[17px] font-medium text-gray-500 mt-2">
            Browse our library of government procedures.
          </p>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Search & Category Command Center */}
        <section className="px-6 lg:px-10 space-y-6">
          <div className="relative group">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(sanitize(e.target.value))}
              placeholder="Search for a guide or agency..."
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
              maxLength={MAX_QUERY_LENGTH}
              className="h-16 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-white/60 focus:border-[#0038A8]/20 transition-all rounded-[24px]"
            />
            {isOverLimit && (
              <p className="text-[10px] font-bold text-[#FF3B30] mt-1.5 ml-1 animate-in fade-in duration-200">
                Maximum {MAX_QUERY_LENGTH} characters
              </p>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
            {categories.map((cat) => (
              <SelectionPill
                key={cat}
                selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' && <LayoutGrid size={14} strokeWidth={2.5} />}
                {cat}
              </SelectionPill>
            ))}
          </div>
        </section>

        {/* Trending Section (Discovery View) */}
        {!isResultsView && (
          <section className="px-6 lg:px-10 space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] lg:text-[24px] font-bold text-[#1C1C1E] tracking-tight flex items-center gap-2">
                  <Flame size={20} className="text-[#FF9500]" fill="currentColor" />
                  Trending Now
                </h2>
                <p className="text-[13px] font-medium text-gray-400">Most requested by the community</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredGuides.map((guide) => (
                <FeaturedGuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {/* Results View Header */}
        {isResultsView && (
          <section className="px-6 lg:px-10 flex justify-between items-center border-b border-gray-100/50 pb-4 mx-6 lg:mx-10 !px-0">
            <p className="text-[14px] font-bold text-[#1C1C1E]">
              {filteredGroups.reduce((acc, [_, g]) => acc + g.length, 0)} <span className="text-gray-400 font-medium">results found</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-gray-400">Sort:</span>
              <button className="flex items-center gap-1 text-[13px] font-bold text-[#0038A8] bg-[#0038A8]/5 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                Relevance <ChevronDown size={14} strokeWidth={3} />
              </button>
            </div>
          </section>
        )}

        {/* Categories Grouped List (Discovery) or Results List */}
        <section className="px-6 lg:px-10 space-y-12 pt-2">
          {!isResultsView ? (
            <>
              {filteredGroups.slice(0, visibleCategoriesCount).map(([category, guides]) => (
                <div key={category} className="space-y-5">
                  <div className="flex justify-between items-end px-2">
                    <h3 className="text-[18px] lg:text-[22px] font-bold text-[#1C1C1E] tracking-tight">{category}</h3>
                    <span className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">{guides.length} Guides</span>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    {guides.slice(0, 4).map((guide, idx) => (
                      <GuideListRow 
                        key={guide.slug} 
                        guide={guide} 
                        isLast={idx === Math.min(guides.length, 4) - 1} 
                      />
                    ))}
                    {guides.length > 4 && (
                      <button 
                        onClick={() => setActiveCategory(category)}
                        className="w-full py-4 text-[13px] font-bold text-[#0038A8] hover:bg-white/40 transition-colors border-t border-gray-100/50"
                      >
                        View all {category} guides
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {visibleCategoriesCount < filteredGroups.length && (
                <div className="mt-16 flex flex-col items-center pb-24">
                  <Button 
                    variant="ghost"
                    size="md"
                    onClick={handleLoadMoreCategories}
                    rightIcon={<ChevronDown size={14} strokeWidth={3} className="opacity-50" />}
                    className="bg-white/40 backdrop-blur-md border border-white/60 !text-[12px] !font-bold text-gray-500 uppercase tracking-[0.15em] hover:bg-white/80 hover:text-[#0038A8] hover:border-[#0038A8]/20 h-auto py-3.5 px-10 shadow-sm transition-all"
                  >
                    Discover More Categories
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {filteredGroups.flatMap(([_, g]) => g).map((guide) => (
                <SearchResultCard key={guide.slug} guide={guide} />
              ))}
            </div>
          )}

          {filteredGroups.length === 0 && (
            <div className="flex flex-col items-center text-center py-32 animate-in fade-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#0038A8]/20 mb-8 shadow-inner">
                 <Search size={40} strokeWidth={1.5} />
               </div>
               <h3 className="text-[22px] font-bold text-[#1C1C1E]">No guides found</h3>
               <p className="text-[16px] font-medium text-gray-400 mt-2 max-w-[280px]">
                 We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try adjusting your filters.
               </p>
               <Button 
                variant="ghost" 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="mt-8 text-[#0038A8] font-bold"
               >
                 Clear all filters
               </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FeaturedGuideCard({ guide }) {
  const router = useRouter();
  const theme = getIconTheme(guide.slug, guide.agency);
  
  return (
    <Card 
      interactive
      noPadding
      onClick={() => router.push(`/guides/${guide.slug}`)}
      style={{ background: theme.gradient }}
      className="p-5 text-left !border-white/60 flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group"
    >
      <div className="mb-6 relative z-10">
        <GuideIcon 
          slug={guide.slug} 
          agency={guide.agency} 
          size={40} 
          className="drop-shadow-[-4px_6px_10px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      
      <div className="space-y-1 mt-auto relative z-10">
        <h4 className="font-bold text-[#1C1C1E] text-[15px] leading-tight line-clamp-2">
          {guide.shortTitle || guide.title}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight truncate">
            {guide.agency}
          </span>
          <div className="bg-white/40 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/40">
            <Star size={10} className="text-[#8B6E00]" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-700">
        <GuideIcon slug={guide.slug} agency={guide.agency} size={64} />
      </div>
    </Card>
  );
}

function SearchResultCard({ guide }) {
  const router = useRouter();
  const { status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = getIconTheme(guide.slug, guide.agency);
  const isLoggedIn = status === 'authenticated';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      interactive 
      noPadding 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className="!rounded-[28px] border-white/60 relative overflow-hidden group/card bg-white shadow-[0_8px_24px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all"
    >
      <div className="p-6 flex items-center gap-5 relative z-10">
        <div 
          className="w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 shadow-sm border border-white/50 relative overflow-hidden"
          style={{ background: theme.gradient }}
        >
          <GuideIcon slug={guide.slug} agency={guide.agency} size={36} className="relative z-10 drop-shadow-md" />
          <div className="absolute inset-0 bg-white/10 opacity-50" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h4 className="text-[17px] font-bold text-[#1C1C1E] leading-tight truncate">
                {guide.shortTitle || guide.title}
              </h4>
              <p className="text-[12px] font-medium text-gray-400 mt-0.5 truncate uppercase tracking-tight">
                {guide.agency}
              </p>
            </div>
            {isLoggedIn && (
              <button 
                onClick={handleFavoriteClick}
                className={`transition-all active:scale-75 outline-none shrink-0 mt-1
                  ${isFavorite ? 'text-[#FFD700]' : 'text-gray-200 hover:text-gray-300'}
                `}
              >
                <Heart size={22} strokeWidth={2.5} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
               <span className="text-[10px] font-black text-[#1C1C1E] uppercase">{guide.difficulty || 'Moderate'}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="text-[11px] font-bold text-[#0038A8]">{guide.estimatedTime || '1-3D'}</span>
               <div className="w-1 h-1 rounded-full bg-gray-200" />
               <span className="text-[11px] font-black text-[#FF9500] uppercase tracking-tighter">{guide.costRange || 'Free'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function GuideListRow({ guide, isLast }) {
  const router = useRouter();
  const theme = getIconTheme(guide.slug, guide.agency);

  return (
    <button
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className={`w-full flex items-center justify-between p-5 active:bg-black/[0.03] transition-all group ${
        !isLast ? 'border-b border-gray-100/40' : ''
      }`}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0 text-left">
        <div 
          className="w-14 h-14 rounded-[18px] flex items-center justify-center border border-white/50 shadow-sm shrink-0 relative overflow-hidden"
          style={{ background: theme.gradient }}
        >
           <GuideIcon slug={guide.slug} agency={guide.agency} size={30} className="relative z-10 drop-shadow-sm" />
           <div className="absolute inset-0 bg-white/20 opacity-30" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[16px] font-bold text-[#1C1C1E] truncate group-active:text-[#0038A8] transition-colors">
            {guide.shortTitle || guide.title}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{guide.agency}</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[11px] font-black text-[#FF9500] uppercase tracking-tight">{guide.costRange || 'Free'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-gray-300 hidden sm:inline-block">{guide.estimatedTime || '1-3D'}</span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-active:bg-[#0038A8]/10 group-active:text-[#0038A8] transition-all">
          <ChevronRight size={18} strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

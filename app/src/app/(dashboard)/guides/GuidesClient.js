'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Bell, 
  Search,
  ChevronRight,
  ChevronDown,
  Heart,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { Button, Card, Badge, Input } from '@/components/ui';
import { GuideIcon } from '@/lib/guideIcons';

// --- Inlined from components/ui/SelectionPill.js ---
const SelectionPill = ({ selected, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap border transition-all active:scale-95 ${
        selected
          ? 'bg-[#0038A8] text-white border-[#0038A8] shadow-[0_4px_12px_rgba(0,56,168,0.2)]'
          : 'bg-white text-gray-400 border-gray-100 hover:border-[#0038A8]/30 hover:text-[#0038A8] shadow-sm'
      } ${className}`}
    >
      {children}
    </button>
  );
};
// --- End of SelectionPill ---

/**
 * High-fidelity Guides Library with Category Discovery.
 */
export default function GuidesClient({ initialGuides }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(3);

  const categories = useMemo(() => {
    return ['All', ...new Set(initialGuides.map(g => g.category).filter(Boolean))];
  }, [initialGuides]);

  // Featured / Most Requested Guides
  const featuredSlugs = ['passport-appointment', 'national-id', 'psa-birth-certificate', 'drivers-license'];
  
  const featuredGuides = useMemo(() => {
    let matched = initialGuides.filter(g => featuredSlugs.includes(g.slug));
    
    // Maintain the order defined in featuredSlugs
    matched.sort((a, b) => featuredSlugs.indexOf(a.slug) - featuredSlugs.indexOf(b.slug));

    if (matched.length < 4) {
      const remaining = initialGuides.filter(g => !featuredSlugs.includes(g.slug)).slice(0, 4 - matched.length);
      matched = [...matched, ...remaining];
    }
    
    const colors = [
      { bg: 'bg-[#E0EFFF]', border: 'border-[#B8D8FF]' },
      { bg: 'bg-[#E4F9F2]', border: 'border-[#C1F2E8]' },
      { bg: 'bg-[#F3E8FF]', border: 'border-[#E0CCFF]' },
      { bg: 'bg-[#FFF4E0]', border: 'border-[#FFE4B8]' },
    ];
    
    return matched.slice(0, 4).map((g, i) => ({ ...g, theme: colors[i] }));
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
    <div className="min-h-screen bg-ios-gradient pb-32 animate-in fade-in duration-700">
      {/* High-Fidelity Discovery Header */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-center max-w-[1600px] mx-auto">
        <h1 className="text-[34px] font-black text-[#1C1C1E] tracking-tight">All Guides</h1>
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform">
            <Bell size={24} className="text-[#1C1C1E]" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Search & Category Command Center */}
        <section className="px-6 space-y-6">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            leftIcon={Search}
            className="h-16 shadow-[0_8px_32px_rgba(0,56,168,0.04)]"
          />

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
            {categories.map((cat) => (
              <SelectionPill
                key={cat}
                selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </SelectionPill>
            ))}
          </div>
        </section>

        {/* Most Requested (only show if discovery view) */}
        {!isResultsView && (
          <section className="px-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[20px] font-black text-[#1C1C1E] tracking-tight">Most Requested</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {featuredGuides.map((guide) => (
                <FeaturedGuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {/* Results View Header */}
        {isResultsView && (
          <section className="px-6 flex justify-between items-center">
            <p className="text-[14px] font-medium text-gray-400">
              {filteredGroups.reduce((acc, [_, g]) => acc + g.length, 0)} results found
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-medium text-gray-400 pr-1">Sort:</span>
              <button className="flex items-center gap-1 text-[14px] font-bold text-[#1C1C1E]">
                Relevance <ChevronDown size={16} />
              </button>
            </div>
          </section>
        )}

        {/* Categories Grouped List (Discovery) or Results List */}
        <section className="px-6 space-y-10 pt-4">
          {!isResultsView ? (
            <>
              {filteredGroups.slice(0, visibleCategoriesCount).map(([category, guides]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-[18px] font-black text-[#1C1C1E] tracking-tight">{category}</h3>
                  
                  <div className="bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/40 shadow-sm">
                    {guides.slice(0, 3).map((guide, idx) => (
                      <GuideListRow 
                        key={guide.slug} 
                        guide={guide} 
                        isLast={idx === Math.min(guides.length, 3) - 1} 
                      />
                    ))}
                  </div>
                </div>
              ))}

              {visibleCategoriesCount < filteredGroups.length && (
                <div className="mt-4 flex flex-col items-center pb-20">
                  <Button 
                    variant="ghost"
                    onClick={handleLoadMoreCategories}
                    className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0038A8] transition-all"
                  >
                    Discover More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {filteredGroups.flatMap(([_, g]) => g).map((guide) => (
                <SearchResultCard key={guide.slug} guide={guide} />
              ))}
            </div>
          )}

          {filteredGroups.length === 0 && (
            <div className="flex flex-col items-center text-center py-20 animate-in fade-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
                 <Search size={32} />
               </div>
               <h3 className="text-[20px] font-black text-[#1C1C1E]">No guides found</h3>
               <p className="text-[15px] font-medium text-gray-400 mt-2 max-w-[240px]">
                 Try adjusting your search or category filters.
               </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FeaturedGuideCard({ guide }) {
  const router = useRouter();
  const shortTitle = guide.shortTitle || guide.title;
  const suffix = guide.title.split(' ').pop();

  return (
    <button 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className={`${guide.theme.bg} ${guide.theme.border} border-[1.5px] rounded-[32px] p-5 pt-6 text-left flex flex-col items-start gap-4 relative overflow-hidden active:scale-[0.97] transition-all group shadow-sm`}
    >
      <div className="relative w-20 h-20 -mt-2 -ml-2 drop-shadow-lg transition-transform group-hover:scale-110 duration-500">
         <GuideIcon slug={guide.slug} agency={guide.agency} size={60} />
      </div>
      
      <div className="space-y-2 relative z-10 w-full">
        <h4 className="text-[15px] font-black text-[#1C1C1E] leading-tight line-clamp-2">
          {shortTitle}
          {suffix !== shortTitle && <span className="block opacity-60 font-medium text-[13px]">{suffix}</span>}
        </h4>
        <div className="inline-flex items-center gap-1 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-2.5 py-1">
           <span className="text-[10px] font-black text-[#8B6E00] uppercase tracking-wider">Essential</span>
           <Star size={10} className="text-[#8B6E00]" fill="currentColor" />
        </div>
      </div>
    </button>
  );
}

function SearchResultCard({ guide }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      interactive 
      noPadding 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className="!rounded-[24px] border-white relative overflow-hidden group/card"
    >
      {/* Watermark Icon */}
      <div className="absolute -right-4 -top-4 opacity-[0.12] pointer-events-none rotate-12 transition-all duration-700 ease-out group-hover/card:scale-110 group-hover/card:rotate-6">
        <GuideIcon slug={guide.slug} agency={guide.agency} size={100} />
      </div>

      <div className="p-6 flex flex-col justify-center min-h-[120px] relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-[18px] font-black text-[#1C1C1E] leading-tight truncate mb-1">
              {guide.shortTitle || guide.title}
            </h4>
            <p className="text-[13px] font-medium text-gray-400 truncate mb-3">
              {guide.agency}
            </p>
            <Badge variant="sky" rounded className="px-3 py-0.5">
              Difficulty: {guide.difficulty || 'Moderate'}
            </Badge>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
               <p className="text-[14px] font-black text-[#1C1C1E] leading-none mb-0.5 uppercase">
                 {guide.estimatedTime || '1-3D'}
               </p>
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                 Estimated Time
               </p>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[14px] font-black text-[#FFB800] tracking-widest leading-none uppercase">
                 {guide.costRange || 'Free'}
               </span>
               <button 
                onClick={handleFavoriteClick}
                className={`transition-all active:scale-75 outline-none
                  ${isFavorite ? 'text-[#FFD700]' : 'text-gray-300'}
                `}
               >
                  <Heart size={26} strokeWidth={2.5} fill={isFavorite ? "currentColor" : "none"} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function GuideListRow({ guide, isLast }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className={`w-full flex items-center justify-between p-4 active:bg-gray-50/50 transition-colors group ${
        !isLast ? 'border-b border-gray-100/50' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center border border-white/20 shadow-sm shrink-0">
           <GuideIcon slug={guide.slug} agency={guide.agency} size={32} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[15px] font-black text-[#1C1C1E] truncate pr-2">{guide.shortTitle || guide.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[12px] font-bold text-gray-400 uppercase">{guide.estimatedTime || '1-3D'}</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[11px] font-black text-[#FF9500] tracking-widest uppercase">{guide.costRange || 'Free'}</span>
          </div>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-active:text-[#0038A8] transition-all ml-2 shrink-0" strokeWidth={2.5} />
    </button>
  );
}

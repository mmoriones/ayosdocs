'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Sparkles,
  Layers,
  ChevronDown,
  X,
  Filter,
  CheckCircle2
} from 'lucide-react';
import Banner from '@/components/ui/Banner';

/**
 * BundlesClient Component
 * Discovery page for Requirement Bundles.
 */
export default function BundlesClient({ initialBundles }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');

  const categories = useMemo(() => 
    ['All', ...new Set(initialBundles.map(b => b.category))], 
    [initialBundles]
  );

  const filteredBundles = useMemo(() => {
    let result = initialBundles.filter(bundle => {
      const matchesSearch = 
        bundle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || bundle.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialBundles, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-ctp-base font-sans transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="bg-ctp-mantle border-b border-ctp-surface0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-ctp-sky-800/5 to-transparent pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ctp-sky-800/10 border border-ctp-sky-800/20 text-ctp-sky-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Goal-Oriented Workflows</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-[40px] md:text-[64px] font-black text-ctp-text leading-[0.9] uppercase tracking-tight">
                Requirement <span className="text-ctp-sky-800">Bundles</span>
              </h1>
              <p className="text-lg md:text-xl text-ctp-subtext1 font-medium max-w-xl leading-relaxed">
                Stop guessing which documents you need. We&apos;ve grouped everything by life goal so you can focus on what matters.
              </p>
            </div>

            <div className="relative max-w-2xl group">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-ctp-subtext1 group-focus-within:text-ctp-sky-800 transition-colors" />
              <input
                type="text"
                placeholder="What are you trying to accomplish? (e.g., Marriage, First Job, OFW)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-14 py-6 rounded-[2rem] border border-ctp-surface0 bg-ctp-base text-lg text-ctp-text placeholder:text-ctp-subtext1 focus:outline-none focus:ring-8 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 shadow-2xl transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-ctp-subtext1 hover:text-ctp-text transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-[73px] z-40 bg-ctp-base/80 backdrop-blur-md border-b border-ctp-surface0">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pr-6 border-r border-ctp-surface0 shrink-0">
              <Filter size={16} className="text-ctp-subtext1" />
              <span className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-widest">Category</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-ctp-sky-800 text-ctp-base border-ctp-sky-800 shadow-lg shadow-ctp-sky-800/20'
                    : 'bg-ctp-mantle text-ctp-subtext0 border-ctp-surface0 hover:border-ctp-sky-800 hover:text-ctp-sky-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="text-[11px] font-black text-ctp-subtext1 uppercase tracking-widest">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[11px] font-black text-ctp-text uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option>Recommended</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* BUNDLES GRID */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-16">
        {filteredBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredBundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
            
            {/* Create Custom Bundle CTA */}
            <button 
              onClick={() => window.location.href = '/coming-soon'}
              className="group bg-ctp-base rounded-[2.5rem] p-10 border-2 border-dashed border-ctp-surface0 hover:border-ctp-sky-800/30 hover:bg-ctp-sky-800/5 transition-all flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-ctp-mantle border border-ctp-surface0 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Layers size={32} className="text-ctp-subtext0 group-hover:text-ctp-sky-800" />
              </div>
              <div>
                <h3 className="text-xl font-black text-ctp-text uppercase tracking-tight mb-2">Create Custom Workflow</h3>
                <p className="text-sm text-ctp-subtext1 font-medium max-w-[200px] mx-auto leading-relaxed">
                  Mix and match documents to build your own personal roadmap.
                </p>
              </div>
              <div className="px-6 py-2 bg-ctp-mantle border border-ctp-surface0 rounded-full text-[10px] font-black uppercase tracking-widest text-ctp-subtext0 group-hover:text-ctp-sky-800 group-hover:border-ctp-sky-800/20 transition-colors">
                Coming Soon
              </div>
            </button>
          </div>
        ) : (
          <div className="text-center py-32 bg-ctp-mantle rounded-[3rem] border-2 border-dashed border-ctp-surface0">
            <div className="w-20 h-20 bg-ctp-surface0 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Layers size={40} className="text-ctp-subtext1" />
            </div>
            <h3 className="text-2xl font-black text-ctp-text uppercase">No bundles matched your search</h3>
            <p className="text-ctp-subtext1 font-medium mt-4 max-w-md mx-auto">
              We&apos;re constantly adding new workflows. Try a broader search or browse by category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-10 px-10 py-4 bg-ctp-sky-800 text-ctp-base rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const BundleCard = ({ bundle }) => {
  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);

  return (
    <Link 
      href={`/bundles/${bundle.id}`}
      className="group bg-ctp-mantle rounded-[2.5rem] p-10 border border-ctp-surface0 shadow-sm hover:shadow-2xl hover:border-ctp-sky-800/30 transition-all flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="w-12 h-12 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center shadow-lg">
          <ArrowRight size={20} strokeWidth={3} />
        </div>
      </div>

      <div className="w-20 h-20 rounded-2xl bg-ctp-base flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-ctp-surface0">
        {bundle.icon}
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-ctp-sky-800 uppercase tracking-widest px-3 py-1 bg-ctp-sky-800/10 rounded-full border border-ctp-sky-800/20">
              {bundle.category}
            </span>
            <span className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-widest">
              {bundle.flow.length} Stages
            </span>
          </div>
          <h3 className="text-2xl font-black text-ctp-text group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight leading-none">
            {bundle.title}
          </h3>
          <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed line-clamp-2">
            {bundle.description}
          </p>
        </div>

        <div className="pt-8 border-t border-ctp-surface0/50 space-y-4">
          <p className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">Includes {totalGuides} documents:</p>
          <div className="flex flex-wrap gap-2">
            {bundle.flow.flatMap(s => s.guides).slice(0, 4).map((guide, idx) => (
              <span key={idx} className="text-[9px] font-bold text-ctp-text bg-ctp-base px-2 py-1 rounded-md border border-ctp-surface0 uppercase">
                {guide.replace(/-/g, ' ')}
              </span>
            ))}
            {totalGuides > 4 && (
              <span className="text-[9px] font-bold text-ctp-subtext1 px-2 py-1 uppercase">
                +{totalGuides - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-ctp-surface0 border-2 border-ctp-mantle flex items-center justify-center">
              <CheckCircle2 size={14} className="text-ctp-sky-800" />
            </div>
          ))}
        </div>
        <span className="text-[11px] font-black text-ctp-sky-800 uppercase tracking-widest group-hover:underline underline-offset-4">
          View Roadmap
        </span>
      </div>
    </Link>
  );
};

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
  const [sortBy, setSortBy] = useState('Default');

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
      {/* HEADER SECTION */}
      <div className="bg-ctp-mantle border-b border-ctp-surface0">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 flex-1">
            <div className="p-4 rounded-2xl bg-ctp-sky-800/10 shrink-0 border border-ctp-sky-800/20">
              <Layers className="text-ctp-sky-800" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ctp-text tracking-tight uppercase">
                Requirement Bundles
              </h1>
              <p className="text-ctp-subtext1 text-sm font-medium mt-1">
                Goal-oriented document groups for life events and business needs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="bg-ctp-base/50 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-ctp-surface1 shadow-sm flex items-center gap-3">
              <Sparkles size={14} className="text-ctp-sky-800" />
              <span className="text-[11px] font-bold text-ctp-subtext0 uppercase tracking-[0.2em]">Ready-to-use workflows</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[73px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
            <Filter size={14} className="text-ctp-subtext1" />
            <span className="text-xs font-semibold text-ctp-subtext0 uppercase tracking-wider">Quick Filter</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-ctp-sky-800 text-ctp-base border-ctp-sky-800 shadow-lg shadow-ctp-sky-800/20'
                  : 'bg-ctp-mantle text-ctp-subtext0 border-ctp-surface1 hover:border-ctp-sky-800 hover:text-ctp-sky-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 w-full">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ctp-subtext1" />
              <input
                type="text"
                placeholder="Search for bundles (e.g., Marriage, First Job, Business)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-3.5 rounded-xl border border-ctp-surface1 bg-ctp-mantle text-lg text-ctp-text placeholder:text-ctp-subtext1 focus:outline-none focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 shadow-sm transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext1 hover:text-ctp-text transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-bold text-ctp-subtext1 uppercase tracking-widest">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-ctp-mantle border border-ctp-surface1 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-ctp-text focus:outline-none cursor-pointer hover:border-ctp-sky-800 transition-all shadow-sm"
              >
                <option>Default</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>

          {/* BUNDLES GRID */}
          {filteredBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredBundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
            
            {/* Create Custom Bundle CTA */}
            <button 
              onClick={() => window.location.href = '/coming-soon'}
              className="group bg-ctp-base rounded-2xl p-10 border-2 border-dashed border-ctp-surface1 hover:border-ctp-sky-800/30 hover:bg-ctp-sky-800/5 transition-all flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Layers size={32} className="text-ctp-subtext0 group-hover:text-ctp-sky-800" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ctp-text tracking-tight mb-2">Create Custom Workflow</h3>
                <p className="text-sm text-ctp-subtext1 max-w-[200px] mx-auto leading-relaxed">
                  Mix and match documents to build your own personal roadmap.
                </p>
              </div>
              <div className="px-6 py-2 bg-ctp-mantle border border-ctp-surface1 rounded-full text-[10px] font-bold uppercase tracking-wider text-ctp-subtext0 group-hover:text-ctp-sky-800 group-hover:border-ctp-sky-800/20 transition-colors">
                Coming Soon
              </div>
            </button>
          </div>
        ) : (
          <div className="text-center py-32 bg-ctp-mantle rounded-2xl border border-dashed border-ctp-surface1">
            <div className="w-20 h-20 bg-ctp-surface1/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Layers size={40} className="text-ctp-subtext1" />
            </div>
            <h3 className="text-2xl font-bold text-ctp-text">No bundles matched your search</h3>
            <p className="text-ctp-subtext1 mt-4 max-w-md mx-auto">
              We&apos;re constantly adding new workflows. Try a broader search or browse by category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-10 px-10 py-4 bg-ctp-sky-800 text-ctp-base rounded-2xl font-bold uppercase tracking-wider shadow-xl active:scale-95 transition-all"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

const BundleCard = ({ bundle }) => {
  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);

  return (
    <Link 
      href={`/bundles/${bundle.id}`}
      className="group bg-ctp-mantle rounded-2xl p-10 border border-ctp-surface1 shadow-sm hover:shadow-xl hover:border-ctp-sky-800/30 transition-all flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="w-12 h-12 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center shadow-lg">
          <ArrowRight size={20} strokeWidth={2} />
        </div>
      </div>

      <div className="w-20 h-20 rounded-2xl bg-ctp-base flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-ctp-surface1">
        {bundle.icon}
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-wider px-3 py-1 bg-ctp-sky-800/10 rounded-full border border-ctp-sky-800/20">
              {bundle.category}
            </span>
            <span className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-wider">
              {bundle.flow.length} Stages
            </span>
          </div>
          <h3 className="text-2xl font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight leading-tight">
            {bundle.title}
          </h3>
          <p className="text-sm text-ctp-subtext1 leading-relaxed line-clamp-2">
            {bundle.description}
          </p>
        </div>

        <div className="pt-8 border-t border-ctp-surface1 space-y-4">
          <p className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-wider">Includes {totalGuides} documents:</p>
          <div className="flex flex-wrap gap-2">
            {bundle.flow.flatMap(s => s.guides).slice(0, 4).map((guide, idx) => (
              <span key={idx} className="text-[10px] font-semibold text-ctp-text bg-ctp-base px-2.5 py-1 rounded-md border border-ctp-surface1">
                {guide.replace(/-/g, ' ')}
              </span>
            ))}
            {totalGuides > 4 && (
              <span className="text-[10px] font-semibold text-ctp-subtext1 px-2 py-1">
                +{totalGuides - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-ctp-surface1 border-2 border-ctp-mantle flex items-center justify-center">
              <CheckCircle2 size={14} className="text-ctp-sky-800" />
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-ctp-sky-800 uppercase tracking-wider group-hover:underline underline-offset-4">
          View Roadmap
        </span>
      </div>
    </Link>
  );
};

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
  CheckCircle2,
  Plus
} from 'lucide-react';
import Banner from '@/components/ui/Banner';
import PageHeader from '@/components/ui/PageHeader';
import SearchInput from '@/components/ui/SearchInput';
import { getBundleIcon } from '@/lib/bundleIcons';

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
      <PageHeader 
        icon={Layers}
        title="Requirement Bundles"
        description="Goal-oriented document groups for life events and business needs."
        actions={
          <div className="bg-ctp-base/50 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <Sparkles size={14} className="text-ctp-sky-800" />
            <span className="text-[11px] font-bold text-ctp-subtext0 uppercase tracking-[0.2em]">Ready-to-use workflows</span>
          </div>
        }
      />

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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for bundles (e.g., Marriage, First Job, Business)..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 bg-ctp-mantle border border-ctp-surface1 rounded-xl px-4 py-2 shadow-sm">
                <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Sort:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold uppercase tracking-widest text-ctp-text focus:outline-none cursor-pointer hover:text-ctp-sky-800 transition-all"
                >
                  <option>Default</option>
                  <option>Alphabetical</option>
                </select>
              </div>

              <button 
                onClick={() => window.location.href = '/coming-soon'}
                className="flex items-center gap-2 px-5 py-3 bg-ctp-sky-800 text-ctp-base rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-ctp-sky-800/20 hover:bg-ctp-sky-800/90 active:scale-95 transition-all group"
              >
                <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                <span>Custom Workflow</span>
              </button>
            </div>
          </div>

          {/* BUNDLES GRID */}
          {filteredBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
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
      className="group bg-ctp-mantle rounded-xl p-6 border border-ctp-surface1 shadow-sm hover:shadow-lg hover:border-ctp-sky-800/30 transition-all flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="w-10 h-10 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center shadow-lg">
          <ArrowRight size={16} strokeWidth={2.5} />
        </div>
      </div>

      <div className="w-14 h-14 rounded-xl bg-ctp-base flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-ctp-surface1">
        {getBundleIcon(bundle.id, { size: 24, className: "text-ctp-sky-800" })}
      </div>

      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-wider px-2 py-0.5 bg-ctp-sky-800/10 rounded-md border border-ctp-sky-800/20">
              {bundle.category}
            </span>
            <span className="text-[9px] font-bold text-ctp-subtext0 uppercase tracking-wider">
              {bundle.flow.length} Stages
            </span>
          </div>
          <h3 className="text-lg font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight leading-snug">
            {bundle.title}
          </h3>
          <p className="text-xs text-ctp-subtext1 leading-relaxed line-clamp-2">
            {bundle.description}
          </p>
        </div>

        <div className="pt-4 border-t border-ctp-surface1/50 space-y-3">
          <p className="text-[9px] font-bold text-ctp-subtext0 uppercase tracking-wider">Includes {totalGuides} documents:</p>
          <div className="flex flex-wrap gap-1.5">
            {bundle.flow.flatMap(s => s.guides).slice(0, 3).map((guide, idx) => (
              <span key={idx} className="text-[9px] font-semibold text-ctp-text bg-ctp-base px-2 py-0.5 rounded border border-ctp-surface1 truncate max-w-[100px]">
                {guide.replace(/-/g, ' ')}
              </span>
            ))}
            {totalGuides > 3 && (
              <span className="text-[9px] font-semibold text-ctp-subtext1 px-1 py-0.5">
                +{totalGuides - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-ctp-surface1 border-2 border-ctp-mantle flex items-center justify-center">
              <CheckCircle2 size={10} className="text-ctp-sky-800" />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-wider group-hover:underline underline-offset-4">
          View Roadmap
        </span>
      </div>
    </Link>
  );
};

'use client';

import { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  Calendar,
  Filter,
  History,
  Info,
  LayoutGrid,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/components/ui';
import { GuideIcon } from '@/lib/guideIcons';

/**
 * SelectionPill Component
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
 * UpdatesClient Component
 */
export default function UpdatesClient({ initialUpdates }) {
  const [filter, setFilter] = useState('All');

  const filteredUpdates = initialUpdates.filter(update => {
    if (filter === 'All') return true;
    return update.category === filter;
  });

  const categories = ['All', ...new Set(initialUpdates.map(u => u.category))];

  return (
    <div className="min-h-screen bg-ios-gradient pb-32 font-sans selection:bg-[#0038A8]/10">
      {/* HIGH-FIDELITY HEADER */}
      <header className="px-6 pt-12 pb-8 max-w-[1600px] mx-auto lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[34px] lg:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-none">
              Recent Updates
            </h1>
            <p className="text-[15px] lg:text-[17px] font-medium text-gray-500 mt-2">
              Stay informed about latest changes in government procedures.
            </p>
          </div>
          <div className="hidden md:flex bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 shadow-sm items-center gap-3">
             <History size={16} className="text-[#0038A8]" strokeWidth={2.5} />
             <span className="text-[11px] font-black text-[#1C1C1E] uppercase tracking-[0.15em]">Real-time Tracker</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-10">
        <Banner variant="sky" icon={Info} title="Verified Information">
          We strive to keep our guides current by tracking official government announcements and community-reported changes.
        </Banner>

        <div className="flex flex-col gap-10">
          {/* CATEGORY FILTERS - MOBILE SCROLL, DESKTOP GRID/FLEX */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Filter size={14} strokeWidth={2.5} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em]">Filter by category</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              {categories.map((cat) => (
                <SelectionPill
                  key={cat}
                  selected={filter === cat}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'All' && <LayoutGrid size={14} strokeWidth={2.5} />}
                  {cat}
                </SelectionPill>
              ))}
            </div>
          </section>

          <main className="space-y-6">
            {filteredUpdates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {filteredUpdates.map((update) => (
                  <UpdateCard key={update.slug} update={update} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[32px] border border-dashed border-white/60 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 mb-6 shadow-inner">
                  <Bell size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1C1C1E] tracking-tight">No updates found</h3>
                <p className="text-[15px] font-medium text-gray-400 mt-2 max-w-[280px]">
                  Try selecting a different category to see recent changes.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function UpdateCard({ update }) {
  return (
    <Link 
      href={`/guides/${update.slug}`}
      className="group bg-white/70 backdrop-blur-xl border border-white/60 rounded-[28px] p-5 lg:p-6 flex items-center gap-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 shadow-sm relative overflow-hidden"
    >
      <div className="w-16 h-16 rounded-[22px] bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
        <GuideIcon slug={update.slug} size={32} className="relative z-10" />
        <div className="absolute inset-0 bg-black/[0.02]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
           <span className="text-[9px] font-black text-[#0038A8] bg-[#0038A8]/5 px-1.5 py-0.5 rounded-full border border-[#0038A8]/10 uppercase tracking-widest">Updated</span>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{update.category}</span>
        </div>
        <h3 className="text-[17px] font-bold text-[#1C1C1E] group-hover:text-[#0038A8] transition-colors tracking-tight leading-tight truncate">
          {update.shortTitle || update.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-2 text-gray-400">
          <Calendar size={12} strokeWidth={2.5} />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            {new Date(update.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-active:bg-[#0038A8]/10 group-active:text-[#0038A8] transition-all">
        <ChevronRight size={20} strokeWidth={3} />
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#0038A8]/5 rounded-full blur-3xl group-hover:bg-[#0038A8]/10 transition-colors duration-700 hidden lg:block"></div>
    </Link>
  );
}


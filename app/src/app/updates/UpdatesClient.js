'use client';

import { useState } from 'react';
import { 
  Bell, 
  ArrowRight, 
  Calendar,
  Clock,
  Filter,
  History,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader, Banner } from '@/components/ui';
import { GuideIcon } from '@/lib/guideIcons';

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
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={Bell}
        title="Recent Updates"
        description="Chronological feed of changes to government requirements and guides."
        actions={
          <div className="bg-ctp-mantle/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
             <History size={14} className="text-ctp-sky-800" />
             <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Real-time Tracker</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <Banner variant="sky" icon={Info} title="Trust & Accuracy">
          We monitor government agency announcements daily to ensure our guides remain the most accurate resource for Filipinos.
        </Banner>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-ctp-subtext1">
                <Filter size={14} />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Filter by category</h3>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-left transition-all border ${
                      filter === cat
                        ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-md'
                        : 'bg-ctp-mantle/50 text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800/30 hover:text-ctp-sky-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 space-y-4 shadow-sm">
               <h4 className="text-[10px] font-bold text-ctp-text uppercase tracking-[0.2em]">Update Policy</h4>
               <p className="text-[11px] text-ctp-subtext1 leading-relaxed font-medium">
                 Guides are timestamped whenever a major requirement, fee, or procedure change is verified.
               </p>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            {filteredUpdates.length > 0 ? (
              <div className="space-y-4">
                {filteredUpdates.map((update, index) => (
                  <Link 
                    key={update.slug}
                    href={`/guides/${update.slug}`}
                    className="group bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-ctp-sky-800/30 hover:bg-ctp-mantle transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-xl bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        <GuideIcon slug={update.slug} className="w-7 h-7 text-ctp-sky-800" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-ctp-sky-800 bg-ctp-sky-800/[0.07] px-1.5 py-0.5 rounded border border-ctp-sky-800/20 uppercase tracking-widest">Updated</span>
                           <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">{update.category}</span>
                        </div>
                        <h3 className="text-lg font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight leading-none">{update.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="flex flex-col items-end">
                         <div className="flex items-center gap-2 text-ctp-subtext1">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {new Date(update.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                         </div>
                         <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest mt-1 opacity-60">Verified Change</p>
                      </div>
                      <ArrowRight size={20} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-ctp-mantle/50 rounded-2xl border border-dashed border-ctp-surface1">
                <Bell size={40} className="text-ctp-subtext1 mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold text-ctp-text uppercase tracking-widest">No updates in this category</h3>
                <p className="text-sm text-ctp-subtext1 mt-2">Try selecting a different category or clearing the filter.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

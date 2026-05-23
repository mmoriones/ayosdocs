'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GuideIcon } from '@/lib/guideIcons';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Widget displaying a list of recently added or modified guides.
 */
const RecentlyUpdated = ({ className = "" }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeDot, setActiveCategory] = useState(0); // Using index for dot
  
  const { data: latestUpdates = [], isLoading } = useQuery({
    queryKey: ['recently-updated'],
    queryFn: async () => {
      const response = await axios.get('/api/guides/recently-updated');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Handle scroll to update dots
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const index = Math.round((scrollLeft / (scrollWidth - clientWidth)) * (latestUpdates.length - 1)) || 0;
    setActiveCategory(Math.min(index, latestUpdates.length - 1));
  };

  if (isLoading) {
    return (
      <div className={`flex overflow-x-auto pb-6 gap-3 scrollbar-hide ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-none w-[260px] bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-4 shadow-sm flex flex-col gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0 opacity-40" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="w-3/4 h-2.5 opacity-40" />
                <Skeleton className="w-1/2 h-1.5 opacity-20" />
              </div>
            </div>
            <div className="h-10 w-full bg-ctp-base/30 rounded-lg mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-1 gap-3 scrollbar-hide snap-x snap-mandatory"
      >
        {latestUpdates.length > 0 ? (
          latestUpdates.map((item, index) => (
            <div 
              key={item.slug}
              onClick={() => router.push(`/guides/${item.slug}`)}
              className="flex-none w-[280px] snap-start group bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-5 hover:border-ctp-sky-800/30 hover:bg-ctp-mantle transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col gap-4 min-h-[140px]"
            >
              <div className="flex items-start justify-between min-w-0">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors shadow-inner">
                    <GuideIcon slug={item.slug} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60 truncate mt-1">
                      {item.agency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ctp-surface1/50 mt-auto">
                <div className="flex items-center gap-2.5">
                  <span className="text-[8px] font-bold text-ctp-sky-800 bg-ctp-sky-800/[0.05] px-2 py-0.5 rounded border border-ctp-sky-800/10 uppercase tracking-[0.1em]">
                    {item.type || 'Updated'}
                  </span>
                  <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.1em] opacity-40">
                    {new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <ChevronRight size={14} strokeWidth={3} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all opacity-50" />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full bg-ctp-mantle/50 border border-dashed border-ctp-surface1 rounded-xl p-8 text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 shadow-inner">
                <GuideIcon slug="none" className="w-5 h-5 opacity-40" />
             </div>
             <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">No recent updates</p>
          </div>
        )}
      </div>

      {/* Scroll Indicator Dots */}
      {latestUpdates.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 px-2">
          {latestUpdates.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                activeDot === i ? 'w-4 bg-ctp-sky-800' : 'w-1 bg-ctp-surface1'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyUpdated;

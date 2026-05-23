'use client';

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
  
  const { data: latestUpdates = [], isLoading } = useQuery({
    queryKey: ['recently-updated'],
    queryFn: async () => {
      const response = await axios.get('/api/guides/recently-updated');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className={`w-full flex flex-col ${className}`}>
        <div className="flex-1 bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col p-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3.5">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0 opacity-40" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-2.5 opacity-40" />
                <Skeleton className="w-1/2 h-1.5 opacity-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-1 bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {latestUpdates.length > 0 ? (
          latestUpdates.map((item, index) => (
            <div 
              key={item.slug}
              onClick={() => router.push(`/guides/${item.slug}`)}
              className={`
                group flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-ctp-mantle/70 flex-1
                ${index !== latestUpdates.length - 1 ? 'border-b border-ctp-surface1/50' : ''}
              `}
            >
              <div className="w-7 h-7 rounded-lg bg-ctp-base flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors shadow-inner">
                <GuideIcon slug={item.slug} className="w-3.5 h-3.5 text-ctp-sky-800" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[11px] font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[7px] font-bold text-ctp-sky-800 bg-ctp-sky-800/[0.05] px-1.5 py-0.5 rounded border border-ctp-sky-800/10 uppercase tracking-[0.1em]">
                    {item.type || 'Updated'}
                  </span>
                  <span className="text-[7px] font-bold text-ctp-subtext1 uppercase tracking-[0.1em] opacity-40">
                    {new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <ChevronRight size={12} strokeWidth={3} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all opacity-50" />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[9px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em]">
            No activity found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

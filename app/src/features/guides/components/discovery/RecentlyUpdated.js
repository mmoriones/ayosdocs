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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={`w-full flex flex-col ${className}`}>
        <div className="flex-1 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-3" />
                <Skeleton className="w-1/2 h-2" />
              </div>
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-1 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {latestUpdates.length > 0 ? (
          latestUpdates.map((item, index) => (
            <div 
              key={item.slug}
              onClick={() => router.push(`/guides/${item.slug}`)}
              className={`
                group flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
                ${index !== latestUpdates.length - 1 ? 'border-b border-ctp-surface1' : ''}
              `}
            >
              <div className="w-9 h-9 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors">
                <GuideIcon slug={item.slug} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-ctp-sky-800 bg-ctp-sky-800/5 px-1.5 py-0.5 rounded border border-ctp-sky-800/20 uppercase tracking-widest">
                    {item.type || 'Updated'}
                  </span>
                  <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">
                    {new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <ChevronRight size={14} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
            No recent updates found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

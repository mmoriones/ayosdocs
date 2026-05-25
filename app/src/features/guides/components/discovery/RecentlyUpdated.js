'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import { GuideIcon } from '@/lib/guideIcons';
import { Skeleton, HorizontalScrollContainer, Card } from '@/components/ui';

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
      <div className={`flex overflow-x-auto pb-6 gap-3 scrollbar-hide ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-none w-[280px] bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-5 shadow-sm flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0 opacity-40" />
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

  if (latestUpdates.length === 0) {
    return (
      <Card background="mantle" noPadding className={`w-full p-8 text-center flex flex-col items-center gap-4 border-dashed ${className}`}>
         <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 shadow-inner">
            <GuideIcon slug="none" className="w-5 h-5 opacity-40" />
         </div>
         <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">No recent updates</p>
      </Card>
    );
  }

  return (
    <HorizontalScrollContainer itemCount={latestUpdates.length} className={className}>
      {latestUpdates.map((item) => (
        <Card
          key={item.slug}
          onClick={() => router.push(`/guides/${item.slug}`)}
          interactive
          background="mantle"
          noPadding
          className="flex-none w-[280px] snap-start p-5 relative overflow-hidden flex flex-col gap-4 min-h-[140px]"
        >
          <div className="flex items-start justify-between min-w-0 relative z-10">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors shadow-inner">
                <GuideIcon slug={item.slug} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-ui-detail font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                  {item.title}
                </h4>
                <p className="text-ui-detail font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60 truncate mt-1">
                  {item.agency}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ctp-surface1/50 mt-auto relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="text-ui-micro font-bold text-ctp-sky-800 bg-ctp-sky-800/[0.05] px-2 py-0.5 rounded border border-ctp-sky-800/10 uppercase tracking-[0.1em]">
                {item.type || 'Updated'}
              </span>
              <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-tight opacity-40">
                {new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <ChevronRight size={14} strokeWidth={3} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all opacity-50" />
          </div>
        </Card>
      ))}
    </HorizontalScrollContainer>
  );
};

export default RecentlyUpdated;

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Star, ArrowRight } from 'lucide-react';
import { GuideIcon } from '@/lib/guideIcons';
import { Skeleton, HorizontalScrollContainer } from '@/components/ui';

/**
 * Revamped RecentExperiences component.
 * Displays a real-time feed of community reports with detailed metrics.
 */
const RecentExperiences = ({ className = "", limit = 3 }) => {
  const router = useRouter();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['latest-reports'],
    queryFn: async () => {
      const response = await axios.get('/api/offices/latest-reports');
      return response.data;
    },
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className={`flex overflow-x-auto pb-4 gap-3 scrollbar-hide ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex-none w-[260px] bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-4 shadow-sm flex flex-col gap-3 animate-pulse">
            <div className="flex items-start justify-between min-w-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0 opacity-40" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-2.5 opacity-40" />
                  <Skeleton className="w-1/2 h-1.5 opacity-20" />
                </div>
              </div>
              <Skeleton className="w-10 h-5 rounded shrink-0 opacity-40" />
            </div>
            <div className="h-10 w-full bg-ctp-base/30 rounded-lg mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={`w-full bg-ctp-mantle/50 border border-dashed border-ctp-surface1 rounded-xl p-8 text-center flex flex-col items-center gap-4 ${className}`}>
         <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">No reports yet</p>
      </div>
    );
  }

  const itemsCount = Math.min(reports.length, limit);

  return (
    <HorizontalScrollContainer itemCount={itemsCount} className={className}>
      {reports.slice(0, limit).map((report) => (
        <div
          key={report.id}
          onClick={() => router.push('/offices')}
          className="flex-none w-[280px] snap-start group bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-5 hover:border-ctp-sky-800/30 hover:bg-ctp-mantle transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col gap-4 min-h-[160px]"
        >
          <div className="flex items-start justify-between min-w-0">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center shrink-0 group-hover:bg-ctp-mantle transition-colors shadow-inner">
                <GuideIcon agency={report.agency} className="w-5 h-5 text-ctp-sky-800" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-ui-detail font-bold text-ctp-text leading-tight group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight truncate">
                  {report.officeName}
                </h4>
                <p className="text-ui-detail font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60 truncate mt-1">
                  {report.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-ctp-yellow/[0.05] border border-ctp-yellow/20 px-1.5 py-0.5 rounded-md h-5 shrink-0">
              <Star size={10} className="fill-ctp-yellow text-ctp-yellow" />
              <span className="text-ui-detail font-bold text-ctp-text leading-none">{report.rating}</span>
            </div>
          </div>

          {report.comment && (
            <p className="text-ui-micro text-ctp-subtext1 line-clamp-2 italic leading-relaxed opacity-90 group-hover:text-ctp-text transition-colors">
              &quot;{report.comment}&quot;
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-ctp-surface1/50 mt-auto">
            <div className="flex items-center gap-3">
              <span className={`text-ui-micro font-bold uppercase tracking-widest ${
                report.waitTime === '< 1 hr' ? 'text-ctp-green' : 'text-ctp-sky-800'
              }`}>
                {report.waitTime}
              </span>
              <div className="w-px h-2 bg-ctp-surface1" />
              <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps opacity-40">
                 {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-1 text-ctp-sky-800 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-ui-micro font-bold uppercase tracking-widest">Details</span>
               <ArrowRight size={10} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </HorizontalScrollContainer>
  );
};

export default RecentExperiences;
;

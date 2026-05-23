'use client';

import { Star, MessageSquare, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GuideIcon } from '@/lib/guideIcons';
import Skeleton from '@/components/ui/Skeleton';

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
      <div className={`grid grid-cols-1 gap-2 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-ctp-base border border-ctp-surface1 rounded-lg p-3 shadow-sm flex flex-col gap-2.5 animate-pulse">
            <div className="flex items-start justify-between min-w-0">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-2.5" />
                  <Skeleton className="w-1/2 h-1.5 opacity-60" />
                </div>
              </div>
              <Skeleton className="w-10 h-5 rounded shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-ctp-surface1/30">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-2.5" />
                <div className="w-px h-2 bg-ctp-surface1" />
                <Skeleton className="w-10 h-2" />
              </div>
              <Skeleton className="w-4 h-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={`w-full bg-ctp-mantle border border-dashed border-ctp-surface1 rounded-lg p-8 text-center flex flex-col items-center gap-4 ${className}`}>
         <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 shadow-inner">
            <MessageSquare size={18} strokeWidth={2.5} />
         </div>
         <div className="space-y-1">
            <p className="text-xs font-bold text-ctp-text uppercase tracking-widest">No reports yet</p>
            <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest leading-none">Be the first to share your experience.</p>
         </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-2 ${className}`}>
      {reports.slice(0, limit).map((report) => (
        <div
          key={report.id}
          onClick={() => router.push('/offices')}
          className="group bg-ctp-base border border-ctp-surface1 rounded-lg p-3 hover:border-ctp-sky-800/20 hover:bg-ctp-mantle/50 transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col gap-2.5"
        >
          <div className="flex items-start justify-between min-w-0">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0 group-hover:bg-ctp-base transition-colors shadow-sm">
                <GuideIcon agency={report.agency} className="w-4 h-4 text-ctp-sky-800" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-ctp-text leading-tight group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight truncate">
                  {report.officeName}
                </h4>
                <div className="flex items-center gap-1.5 text-ctp-subtext1">
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 truncate">
                    {report.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-ctp-yellow/[0.04] border border-ctp-yellow/20 px-1.5 py-0.5 rounded h-5 shrink-0">
              <Star size={10} className="fill-ctp-yellow text-ctp-yellow" />
              <span className="text-[10px] font-bold text-ctp-text leading-none">{report.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-ctp-surface1/30">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${
                  report.waitTime === '< 1 hr' ? 'text-ctp-green' : 'text-ctp-sky-800'
                }`}>
                  {report.waitTime}
                </span>
              </div>
              <div className="w-px h-2 bg-ctp-surface1" />
              <span className="text-[7px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">
                 {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <ArrowRight size={12} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentExperiences;

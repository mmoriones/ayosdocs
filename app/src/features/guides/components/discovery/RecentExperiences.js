'use client';

import { Star, MessageSquare, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GuideIcon } from '@/lib/guideIcons';

/**
 * Revamped RecentExperiences component.
 * Displays a real-time feed of community reports with detailed metrics.
 */
const RecentExperiences = ({ className = "" }) => {
  const router = useRouter();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['latest-reports'],
    queryFn: async () => {
      const response = await axios.get('/api/offices/latest-reports');
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className={`w-full bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm p-12 flex flex-col items-center justify-center gap-4 ${className}`}>
        <Loader2 className="animate-spin text-ctp-sky-800" size={24} />
        <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Loading community pulse...</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={`w-full bg-ctp-mantle border border-dashed border-ctp-surface1 rounded-xl p-10 text-center flex flex-col items-center gap-4 ${className}`}>
         <div className="w-12 h-12 rounded-full bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1">
            <MessageSquare size={20} />
         </div>
         <div className="space-y-1">
            <p className="text-sm font-bold text-ctp-text uppercase tracking-tight">No reports yet</p>
            <p className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest leading-none">Be the first to share your experience.</p>
         </div>
         <button 
           onClick={() => router.push('/rate')}
           className="mt-2 text-[10px] font-bold text-ctp-sky-800 hover:underline uppercase tracking-widest"
         >
           Submit a report
         </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {reports.map((report) => (
        <div
          key={report.id}
          onClick={() => router.push('/offices')}
          className="group bg-ctp-base border border-ctp-surface1 rounded-xl p-5 hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all cursor-pointer shadow-sm relative overflow-hidden"
        >
          {/* TOP SECTION: Agency & Rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <GuideIcon agency={report.agency} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ctp-text leading-tight group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight">
                  {report.officeName}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-ctp-subtext1">
                  <MapPin size={10} className="text-ctp-sky-800" />
                  <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[120px]">
                    {report.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
               <div className="flex items-center gap-1.5 bg-ctp-yellow/5 border border-ctp-yellow/20 px-2 py-0.5 rounded-md">
                 <Star size={12} className="fill-ctp-yellow text-ctp-yellow" />
                 <span className="text-xs font-bold text-ctp-text leading-none">{report.rating}</span>
               </div>
               <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-widest mt-1.5 opacity-60">
                 {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
               </span>
            </div>
          </div>

          {/* COMMENT SECTION */}
          {report.comment && (
            <div className="bg-ctp-mantle/50 border border-ctp-surface1/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-ctp-subtext1 font-medium italic line-clamp-2 leading-relaxed">
                &quot;{report.comment}&quot;
              </p>
            </div>
          )}

          {/* BOTTOM METRICS */}
          <div className="flex items-center justify-between pt-3 border-t border-ctp-surface1/50">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-60 mb-0.5">Wait Time</span>
                <span className={`text-[10px] font-bold uppercase tracking-tight ${
                  report.waitTime === '< 1 hr' ? 'text-ctp-green' : 'text-ctp-sky-800'
                }`}>
                  {report.waitTime}
                </span>
              </div>
            </div>

            <button className="flex items-center gap-1.5 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest group-hover:underline">
              Full Insights
              <ArrowRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentExperiences;

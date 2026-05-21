'use client';

import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';
import { Eye, ArrowRight } from 'lucide-react';

/**
 * Popular guides widget.
 * Supports 'default' grid and 'compact' list views.
 */
const TrendingWidget = ({ guide, stats, variant = 'default', onClick }) => {
  if (variant === 'compact') {
    return (
      <Link 
        href={`/guides/${guide.slug}`}
        onClick={onClick}
        className="flex items-center gap-4 p-3 rounded-xl border border-ctp-surface1 bg-ctp-base hover:bg-ctp-mantle transition-all group"
      >
        <div className="w-10 h-10 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0">
          <GuideIcon 
            slug={guide.slug} 
            agency={guide.agency} 
            className="w-5 h-5 text-ctp-sky-800" 
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors">
            {guide.shortTitle || guide.title}
          </h4>
          <p className="text-[10px] text-ctp-subtext0 uppercase tracking-widest font-bold opacity-70">
            {guide.agency}
          </p>
        </div>
        <ArrowRight size={14} className="text-ctp-subtext1 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <div className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 shadow-sm hover:shadow-md hover:border-ctp-surface2 transition-all duration-300 flex flex-col items-center text-center group h-full relative overflow-hidden">
      
      {/* Icon Container - Refined Squircle */}
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-ctp-surface1 bg-ctp-mantle"
      >
        <GuideIcon 
          slug={guide.slug} 
          agency={guide.agency} 
          className="w-8 h-8 text-ctp-sky-800 grayscale-[0.2] group-hover:grayscale-0 transition-all" 
          strokeWidth={1.5}
        />
      </div>
      
      {/* Content Section */}
      <div className="space-y-2 mb-6 flex-1">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-ctp-text tracking-tight leading-tight group-hover:text-ctp-sky-800 transition-colors">
            {guide.shortTitle || guide.title}
          </h3>
          {stats && (
            <div className="flex items-center justify-center gap-1.5 text-ctp-subtext0">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{stats.views} views</span>
              <Eye size={10} className="opacity-60" />
            </div>
          )}
        </div>
        
        <p className="text-sm text-ctp-subtext0 font-normal leading-relaxed line-clamp-2 px-1">
          {guide.description}
        </p>
      </div>

      {/* Action Button - Centered Pill */}
      <Link 
        href={`/guides/${guide.slug}`}
        onClick={onClick}
        className="px-6 py-2 bg-ctp-mantle text-ctp-text border border-ctp-surface1 rounded-lg font-semibold text-xs hover:bg-ctp-surface0 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn w-full sm:w-fit"
      >
        <span>Learn More</span>
        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
};

export default TrendingWidget;

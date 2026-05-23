'use client';

import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';
import { Eye, ArrowRight } from 'lucide-react';
import { Skeleton, BookmarkButton } from '@/components/ui';

/**
 * Popular guides widget.
 * Supports 'default' grid and 'compact' list views.
 */
const TrendingWidget = ({ guide, stats, progress, variant = 'default', onClick, onFavorite }) => {
  const isFavorite = progress?.isFavorite || false;

  if (variant === 'compact') {
    return (
      <div className="group relative flex items-center">
        <Link 
          href={`/guides/${guide.slug}`}
          onClick={onClick}
          className="flex-1 flex items-center gap-3.5 p-3 rounded-lg border border-ctp-surface1 bg-ctp-base hover:bg-ctp-mantle/50 hover:border-ctp-sky-800/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-ctp-base transition-colors">
            <GuideIcon 
              slug={guide.slug} 
              agency={guide.agency} 
              className="w-5 h-5 text-ctp-sky-800" 
              strokeWidth={1.5}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
              {guide.shortTitle || guide.title}
            </h4>
            <p className="text-[9px] text-ctp-subtext0 uppercase tracking-[0.1em] font-bold mt-0.5">
              {guide.agency}
            </p>
          </div>
          <ArrowRight size={14} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-1 transition-all" />
        </Link>
        
        {onFavorite && (
          <div className="absolute -right-2 -top-2 z-10 scale-90 opacity-0 group-hover:opacity-100 transition-all">
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={onFavorite}
              size="sm"
              variant="circle"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:shadow-md hover:border-ctp-sky-800/20 transition-all duration-300 flex flex-col items-center text-center group h-full relative overflow-hidden">
      
      {/* Icon Container - Refined Squircle */}
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-ctp-surface1 bg-ctp-mantle"
      >
        <GuideIcon 
          slug={guide.slug} 
          agency={guide.agency} 
          className="w-7 h-7 text-ctp-sky-800 transition-all" 
          strokeWidth={1.5}
        />
      </div>
      
      {/* Content Section */}
      <div className="space-y-2.5 mb-6 flex-1">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-ctp-text tracking-tight leading-tight group-hover:text-ctp-sky-800 transition-colors">
            {guide.shortTitle || guide.title}
          </h3>
          {stats && (
            <div className="flex items-center justify-center gap-1.5 text-ctp-subtext1">
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{stats.views} views</span>
              <Eye size={10} strokeWidth={2.5} className="opacity-60" />
            </div>
          )}
        </div>
        
        <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed line-clamp-2 px-2">
          {guide.description}
        </p>
      </div>

      {/* Action Button */}
      <Link 
        href={`/guides/${guide.slug}`}
        onClick={onClick}
        className="px-5 py-2 bg-ctp-mantle text-ctp-text border border-ctp-surface1 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-ctp-sky-800 hover:text-white hover:border-ctp-sky-800 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn w-full"
      >
        <span>Guide Details</span>
        <ArrowRight size={12} strokeWidth={3} className="transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
};

TrendingWidget.Skeleton = function TrendingWidgetSkeleton({ variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <div className="bg-ctp-base rounded-xl p-3 border border-ctp-surface1 flex items-center gap-4 w-full">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-3" />
          <Skeleton className="w-1/2 h-2" />
        </div>
        <Skeleton className="w-4 h-4 rounded-lg shrink-0 ml-2" />
      </div>
    );
  }

  return (
    <div className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 flex flex-col items-center text-center space-y-5 h-full w-full shadow-sm">
      <Skeleton className="w-16 h-16 rounded-xl" />
      <div className="space-y-2.5 w-full flex flex-col items-center">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-2.5 opacity-60" />
        <div className="w-full space-y-2 mt-2">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-4/5 h-3 mx-auto" />
        </div>
      </div>
      <Skeleton className="w-24 h-9 rounded-lg mt-auto" />
    </div>
  );
};

export default TrendingWidget;

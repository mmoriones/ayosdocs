'use client';

import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';
import { Eye, ArrowRight, ShieldCheck } from 'lucide-react';
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
          className="flex-1 flex items-center gap-3.5 p-3 rounded-lg border border-ctp-surface1 bg-ctp-base hover:bg-ctp-mantle/50 hover:border-ctp-sky-800/30 hover:shadow-md active:scale-[0.99] transition-all group"
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
          <div className="absolute -right-1 -top-1 z-10 opacity-0 group-hover:opacity-100 transition-all">
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={onFavorite}
              size="md"
              variant="bare"
              tooltipProps={{ position: 'left' }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => window.location.href = `/guides/${guide.slug}`}
      className="bg-ctp-base rounded-lg border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle hover:shadow-md active:scale-[0.99] transition-all duration-300 p-4 flex flex-col h-full group cursor-pointer relative"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-10 h-10 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-base transition-colors duration-300">
          <GuideIcon 
            slug={guide.slug} 
            agency={guide.agency} 
            className="w-6 h-6" 
            strokeWidth={1.5}
          />
        </div>
        
        {onFavorite && (
          <div className="opacity-0 group-hover:opacity-100 transition-all">
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={onFavorite}
              size="md"
              variant="bare"
              tooltipProps={{ position: 'left' }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ctp-text tracking-tight leading-snug group-hover:text-ctp-sky-800 transition-colors">
            {guide.shortTitle || guide.title}
          </h3>
          <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-[0.15em] opacity-60">
            {guide.agency}
          </p>
        </div>
        
        <p className="text-[11px] text-ctp-subtext1 font-medium leading-relaxed line-clamp-2">
          {guide.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-ctp-surface1/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1 text-ctp-subtext1">
              <Eye size={10} strokeWidth={2.5} />
              <span className="text-[8px] font-bold uppercase tracking-widest">{stats?.views || '1.2k'}</span>
           </div>
           <div className="w-px h-2 bg-ctp-surface1" />
           <div className="flex items-center gap-1 text-ctp-green">
              <ShieldCheck size={10} strokeWidth={2.5} />
              <span className="text-[8px] font-bold uppercase tracking-widest">98%</span>
           </div>
        </div>
        <ArrowRight size={14} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};

TrendingWidget.Skeleton = function TrendingWidgetSkeleton({ variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <div className="bg-ctp-base rounded-lg p-3 border border-ctp-surface1 flex items-center gap-3.5 w-full">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-2.5" />
          <Skeleton className="w-1/2 h-1.5 opacity-60" />
        </div>
        <Skeleton className="w-4 h-4 rounded-md shrink-0 ml-1" />
      </div>
    );
  }

  return (
    <div className="bg-ctp-base rounded-lg border border-ctp-surface1 p-4 flex flex-col h-full w-full shadow-sm space-y-6">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-8 h-8 rounded-lg opacity-40" />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-2 opacity-60" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="w-full h-2.5" />
          <Skeleton className="w-4/5 h-2.5" />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-ctp-surface1/30 flex justify-between items-center">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-2.5" />
          <Skeleton className="w-10 h-2.5" />
        </div>
        <Skeleton className="w-4 h-4 rounded-md" />
      </div>
    </div>
  );
};

export default TrendingWidget;

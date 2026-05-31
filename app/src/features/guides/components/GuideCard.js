'use client';

import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';
import { Skeleton, BookmarkButton, TrackingIndicator } from '@/components/ui';

/**
 * Unified GuideCard Component
 * Reusable across Home, Search, and Bundles.
 */
const GuideCard = ({ 
  guide, 
  progress, 
  viewMode = 'grid',
  showAgency = false,
  showMeta = true,
  showDescription = true,
  showBookmark = false,
  showFooter = true,
  isSpotlight = false,
  stats = null,
  onFavorite,
  className = ""
}) => {
  const router = useRouter();
  const isList = viewMode === 'list';
  const isFavorite = progress?.isFavorite || false;
  const isTracking = !!progress;
  
  // Styling based on high-density dashboard aesthetic
  const baseCardClass = `
    group bg-ctp-mantle rounded-3xl border border-ctp-surface1/50
    hover:soft-shadow-lg hover:-translate-y-1 transition-all duration-300
    active:scale-[0.98] active:translate-y-0 relative flex flex-col h-full shadow-sm
    ${isSpotlight ? 'md:flex-row md:items-center gap-8 p-10' : 'p-8'}
  `;

  const listCardClass = `
    group bg-ctp-mantle rounded-3xl p-6 border border-ctp-surface1/50
    hover:soft-shadow-lg hover:-translate-y-1 transition-all duration-300
    active:scale-[0.98] active:translate-y-0 relative flex items-center gap-6 shadow-sm
  `;

  const displayTitle = guide.shortTitle || guide.title;

  if (isList) {
    return (
      <Link href={`/guides/${guide.slug}`} className={`${listCardClass} ${className} overflow-hidden group/card`}>
        {/* GHOST WATERMARK ICON for List View */}
        <div className="absolute -right-6 -top-6 opacity-[0.02] pointer-events-none group-hover/card:scale-110 transition-transform duration-700">
          <GuideIcon slug={guide.slug} agency={guide.agency} size={120} strokeWidth={1} />
        </div>

        <div className="flex-1 min-w-0 py-0.5 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            {showAgency && (
              <span className="text-[10px] font-black text-ctp-sky-800 uppercase tracking-widest bg-ctp-sky-800/5 px-2 py-0.5 rounded-full border border-ctp-sky-800/20">
                {Array.isArray(guide.agency) ? guide.agency[0] : (guide.agency || "National")}
              </span>
            )}
            {isTracking && (
              <TrackingIndicator variant="guide" />
            )}
          </div>
          <h3 className="text-xl font-black text-ctp-text group-hover/card:text-ctp-sky-800 transition-colors leading-tight tracking-tighter truncate">
            {displayTitle}
          </h3>
        </div>

        {showMeta && (
          <div className="hidden md:flex items-center gap-8 shrink-0 border-l border-ctp-surface1/50 pl-8 h-12 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-0.5">Time</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-ctp-text">
                <Clock size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
                <span className="uppercase">{guide.estimatedTime || "1-3D"}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-0.5">Cost</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-ctp-text">
                <DollarSign size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
                <span className="uppercase">{guide.costRange || "Free"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0 ml-4 flex items-center gap-4 relative z-10">
          {showBookmark && (
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={(e) => {
                e.preventDefault();
                onFavorite?.();
              }}
              size="md"
            />
          )}
          <div className="w-10 h-10 rounded-full bg-ctp-base flex items-center justify-center border border-ctp-surface1 group-hover/card:bg-ctp-sky-800 group-hover/card:text-white transition-all duration-300">
            <ArrowRight size={18} className="group-hover/card:translate-x-0.5 transition-all" strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className={`${baseCardClass} cursor-pointer ${className} overflow-hidden group/card`}
    >
      {/* GHOST WATERMARK ICON */}
      <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none rotate-12 group-hover/card:rotate-6 group-hover/card:scale-110 transition-all duration-700 ease-out">
        <GuideIcon slug={guide.slug} agency={guide.agency} size={isSpotlight ? 180 : 130} strokeWidth={1} />
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        {showAgency && (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-ctp-sky-800/5 text-ctp-sky-800 text-[10px] font-black uppercase tracking-widest border border-ctp-sky-800/20">
            {Array.isArray(guide.agency) ? guide.agency[0] : (guide.agency || "National")}
          </div>
        )}
        
        <div className="flex items-center gap-3 ml-auto">
           {isTracking && (
             <TrackingIndicator variant="guide" />
           )}
           {showBookmark && (
             <BookmarkButton
               isFavorite={isFavorite}
               onClick={(e) => {
                 e.preventDefault();
                 onFavorite?.();
               }}
               size="md"
               tooltipProps={{ position: 'left' }}
             />
           )}
        </div>
      </div>

      <div className={`flex-1 relative z-10 ${isSpotlight ? 'md:pr-12' : ''}`}>
        <h3 className={`${isSpotlight ? 'text-3xl md:text-4xl' : 'text-2xl'} font-black text-ctp-text group-hover/card:text-ctp-sky-800 transition-colors leading-tight tracking-tighter mb-6`}>
          {displayTitle}
        </h3>

        {showMeta && (
          <div className={`flex flex-wrap items-center ${isSpotlight ? 'gap-x-12' : 'gap-x-8'} gap-y-4 mb-2`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1 opacity-70">Processing Time</span>
              <div className="flex items-center gap-2 text-sm font-bold text-ctp-text">
                <Clock size={16} className="text-ctp-sky-800 shrink-0" strokeWidth={2.5} />
                <span className="truncate uppercase">{guide.estimatedTime || "1-3D"}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1 opacity-70">Estimated Cost</span>
              <div className="flex items-center gap-2 text-sm font-bold text-ctp-text">
                <DollarSign size={16} className="text-ctp-sky-800 shrink-0" strokeWidth={2.5} />
                <span className="truncate uppercase">{guide.costRange || "Free"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showFooter && (
        <div className={`pt-8 border-t border-ctp-surface1/50 flex items-center justify-between mt-auto relative z-10 ${isSpotlight ? 'md:pt-0 md:border-t-0 md:border-l md:pl-12 md:flex-col md:justify-center md:items-end gap-6' : ''}`}>
          <span className="text-xs text-ctp-subtext1 font-bold uppercase tracking-widest opacity-60">
            {guide.lastUpdated ? new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Recently Updated"}
          </span>
          <div className={`${isSpotlight ? 'bg-ctp-sky-800 text-white px-8 py-4 rounded-full shadow-lg shadow-ctp-sky-800/20' : 'text-ctp-sky-800'} font-black text-xs uppercase tracking-widest flex items-center gap-3 group-hover/card:translate-x-1 transition-all`}>
            {isTracking ? 'Continue' : 'View Guide'}
            <ArrowRight size={16} strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
};

GuideCard.Skeleton = function GuideCardSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-ctp-mantle rounded-xl p-4 flex items-center gap-5 shadow-sm w-full">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-24 h-3" />
          </div>
          <Skeleton className="w-1/2 h-5" />
          <Skeleton className="w-3/4 h-3" />
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 pl-6 border-l border-ctp-surface1">
           <Skeleton className="w-20 h-4" />
           <Skeleton className="w-20 h-4" />
        </div>
        <Skeleton className="w-7 h-7 rounded-lg shrink-0 ml-2" />
      </div>
    );
  }

  return (
    <div className="bg-ctp-mantle rounded-xl p-4 flex flex-col h-full shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <Skeleton className="w-7 h-7 rounded-lg opacity-40" />
      </div>
      <div className="space-y-2.5 flex-1">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
      </div>
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="pt-4 border-t border-ctp-surface1/50 flex justify-between">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-12 h-3" />
      </div>
    </div>
  );
};

export default GuideCard;

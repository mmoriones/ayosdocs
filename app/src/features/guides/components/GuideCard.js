'use client';

import { Bookmark, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';
import Skeleton from '@/components/ui/Skeleton';

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
  stats = null,
  onFavorite,
  className = ""
}) => {
  const router = useRouter();
  const isList = viewMode === 'list';
  const isFavorite = progress?.isFavorite || false;
  
  // Styling based on high-density dashboard aesthetic
  const baseCardClass = `
    group bg-ctp-base rounded-xl border border-ctp-surface1
    hover:border-ctp-sky-800/30 hover:bg-ctp-mantle transition-all 
    relative overflow-hidden flex flex-col h-full shadow-sm
  `;

  const listCardClass = `
    group bg-ctp-base rounded-xl p-4 border border-ctp-surface1
    hover:border-ctp-sky-800/30 hover:bg-ctp-mantle transition-all 
    relative overflow-hidden flex items-center gap-5 shadow-sm
  `;

  if (isList) {
    return (
      <Link href={`/guides/${guide.slug}`} className={`${listCardClass} ${className}`}>
        <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:scale-105 transition-transform duration-300">
          <GuideIcon slug={guide.slug} agency={guide.agency} className="w-7 h-7 text-ctp-sky-800" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-3 mb-1">
            {showAgency && (
              <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest bg-ctp-sky-800/5 px-1.5 py-0.5 rounded border border-ctp-sky-800/20">
                {Array.isArray(guide.agency) ? guide.agency[0] : (guide.agency || "National")}
              </span>
            )}
            <span className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest opacity-80">
              Updated {guide.lastUpdated ? new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Recently"}
            </span>
          </div>
          <h3 className={`text-base font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight truncate ${!showDescription ? 'mb-0' : 'mb-0.5'}`}>
            {guide.shortTitle || guide.title}
          </h3>
          {showDescription && (
            <p className="text-xs text-ctp-subtext1 line-clamp-1 font-medium leading-relaxed opacity-90">
              {guide.description}
            </p>
          )}
        </div>

        {showMeta && (
          <div className="hidden md:flex items-center gap-4 shrink-0 border-l border-ctp-surface1 pl-6 h-10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
              <Clock size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
              <span>{guide.estimatedTime || "1-3 days"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
              <DollarSign size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
              <span>{guide.costRange || "Free"}</span>
            </div>
          </div>
        )}

        <div className="shrink-0 ml-2 flex items-center gap-3">
          {showBookmark && (
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onFavorite?.();
              }}
              className={`p-2 transition-all rounded-lg active:scale-95 relative z-10 ${
                isFavorite ? 'text-ctp-sky-800' : 'text-ctp-subtext1 hover:text-ctp-sky-800'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
          <ArrowRight size={16} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" strokeWidth={2.5} />
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className={`${baseCardClass} p-5 cursor-pointer ${className}`}
    >
      {showBookmark && (
        <button 
          className={`absolute top-4 right-4 p-1.5 transition-all rounded-lg z-10 active:scale-95 ${
            isFavorite ? 'text-ctp-sky-800' : 'text-ctp-subtext1 hover:text-ctp-sky-800'
          }`} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite?.();
          }}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Bookmark size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      <div className="mb-4 w-10 h-10 rounded-lg bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 group-hover:scale-105 transition-transform duration-300 shrink-0">
        <GuideIcon slug={guide.slug} agency={guide.agency} className="w-6 h-6 text-ctp-sky-800" strokeWidth={1.5} />
      </div>

      <div className="flex-1">
        {showAgency && (
          <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-ctp-sky-800/5 text-ctp-sky-800 text-[9px] font-bold uppercase tracking-widest mb-2.5 border border-ctp-sky-800/20">
            {Array.isArray(guide.agency) ? guide.agency[0] : (guide.agency || "National")}
          </div>
        )}
        <h3 className={`text-base font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight ${showDescription ? 'mb-1.5' : 'mb-0'}`}>
          {guide.shortTitle || guide.title}
        </h3>
        {showDescription && (
          <p className="text-xs text-ctp-subtext1 line-clamp-2 mb-4 font-medium leading-relaxed opacity-90">
            {guide.description}
          </p>
        )}

        {showMeta && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <Clock size={14} className="text-ctp-sky-800 shrink-0" strokeWidth={2.5} />
              <span className="truncate">{guide.estimatedTime || "1-3 days"}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <DollarSign size={14} className="text-ctp-sky-800 shrink-0" strokeWidth={2.5} />
              <span className="truncate">{guide.costRange || "Free"}</span>
            </div>
          </div>
        )}
      </div>

      {showFooter && (
        <div className="pt-4 border-t border-ctp-surface1/50 flex items-center justify-between mt-auto">
          <span className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest">
            {guide.lastUpdated ? new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Updated Recently"}
          </span>
          <div className="text-ctp-sky-800 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1">
            Open
            <ArrowRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

GuideCard.Skeleton = function GuideCardSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-ctp-base rounded-xl p-4 border border-ctp-surface1 flex items-center gap-5 shadow-sm w-full">
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
        <Skeleton className="w-8 h-8 rounded-lg shrink-0 ml-2" />
      </div>
    );
  }

  return (
    <div className="bg-ctp-base rounded-xl border border-ctp-surface1 p-5 flex flex-col h-full shadow-sm space-y-4">
      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
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

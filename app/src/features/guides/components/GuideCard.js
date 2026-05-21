'use client';

import { Bookmark, Clock, DollarSign, Eye, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuideIcon } from '@/lib/guideIcons';

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
  className = ""
}) => {
  const router = useRouter();
  const isList = viewMode === 'list';
  
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
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all rounded-lg active:scale-95 relative z-10"
              title="Bookmark"
            >
              <Bookmark size={18} />
            </button>
          )}
          <ArrowRight size={16} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" strokeWidth={2.5} />
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/guides/${guide.slug}`}
      className={`${baseCardClass} p-5 ${className}`}
    >
      {showBookmark && (
        <button className="absolute top-4 right-4 p-1.5 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all rounded-lg z-10 active:scale-95" onClick={(e) => e.preventDefault()}>
          <Bookmark size={16} />
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
    </Link>
  );
};

export default GuideCard;

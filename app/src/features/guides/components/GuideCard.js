'use client';

import { Bookmark, ChevronRight, Clock, DollarSign, BarChart3, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGuideIcon } from '@/lib/guideIcons';

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
  const iconSrc = getGuideIcon(guide.slug, guide.agency);
  
  // Styling based on minimalist aesthetic
  const baseCardClass = `
    group bg-ctp-mantle rounded-2xl border border-ctp-surface1
    hover:border-ctp-surface2 hover:shadow-md transition-all 
    relative overflow-hidden flex flex-col h-full
  `;

  const listCardClass = `
    group bg-ctp-mantle rounded-xl p-5 border border-ctp-surface1
    hover:border-ctp-surface2 hover:shadow-sm transition-all 
    relative overflow-hidden flex items-center gap-6
  `;

  if (isList) {
    return (
      <Link href={`/guides/${guide.slug}`} className={`${listCardClass} ${className}`}>
        <div className="w-14 h-14 rounded-lg bg-ctp-base flex items-center justify-center p-2.5 group-hover:bg-ctp-sky-800/5 transition-colors border border-ctp-surface1 shrink-0">
          <Image src={iconSrc} alt={guide.title} width={36} height={36} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-3 mb-1.5">
            {showAgency && (
              <span className="text-[10px] font-bold text-ctp-green uppercase tracking-wider bg-ctp-green/10 px-2 py-0.5 rounded-md border border-ctp-green/20">
                {Array.isArray(guide.agency) ? guide.agency.join(', ') : (guide.agency || "Official")}
              </span>
            )}
            <span className="text-[10px] text-ctp-subtext1 font-semibold uppercase tracking-wider opacity-70">
              Updated {guide.lastUpdated || "May 8, 2026"}
            </span>
          </div>
          <h3 className={`text-lg font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-snug tracking-tight truncate ${!showDescription ? 'mb-0' : ''}`}>
            {guide.shortTitle || guide.title}
          </h3>
          {showDescription && (
            <p className="text-sm text-ctp-subtext1 line-clamp-1 font-medium leading-relaxed">
              {guide.description || "Step-by-step requirements and procedures."}
            </p>
          )}
        </div>

        {showMeta && (
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0 border-l border-ctp-surface1 pl-6 h-12 justify-center">
            <div className="flex items-center gap-4 text-[11px] font-bold text-ctp-subtext1 uppercase tracking-wider">
              {stats && (
                <div className="flex items-center gap-1 text-ctp-mauve">
                  <span>{stats.views}</span>
                  <Eye size={12} />
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-ctp-subtext0" />
                <span>{guide.estimatedTime || "1-3 days"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-ctp-subtext0" />
                <span>{guide.costRange || "Free"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0 ml-4 flex items-center gap-3">
          {showBookmark && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2.5 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all bg-ctp-base rounded-lg border border-ctp-surface1 shadow-sm active:scale-95 relative z-10"
            >
              <Bookmark size={18} />
            </button>
          )}
          <div className="w-9 h-9 rounded-lg bg-ctp-sky-800 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all">
            <ArrowRight size={18} strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/guides/${guide.slug}`}
      className={`${baseCardClass} p-6 ${className}`}
    >
      {showBookmark && (
        <button className="absolute top-5 right-5 p-2 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all bg-ctp-base rounded-lg shadow-sm z-10 active:scale-95 border border-ctp-surface1" onClick={(e) => e.preventDefault()}>
          <Bookmark size={18} />
        </button>
      )}

      {progress?.tracked && (
        <div className="absolute top-0 right-0 p-2">
          <div className={`px-2 py-0.5 rounded-bl-lg rounded-tr-lg text-[10px] font-bold uppercase tracking-wider ${
            progress.completed ? 'bg-ctp-green text-white' : 'bg-ctp-sky-800/10 text-ctp-sky-800 border border-ctp-sky-800/20'
          }`}>
            {progress.completed ? 'Done' : `${progress.percentage}%`}
          </div>
        </div>
      )}

      <div className="mb-5 w-12 h-12 rounded-lg bg-ctp-base flex items-center justify-center p-2.5 group-hover:bg-ctp-sky-800/5 transition-colors border border-ctp-surface1">
        <Image src={iconSrc} alt={guide.title} width={36} height={36} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1">
        {showAgency && (
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-ctp-green/10 text-ctp-green text-[10px] font-bold uppercase tracking-wider mb-3 border border-ctp-green/20">
            {Array.isArray(guide.agency) ? guide.agency.join(', ') : (guide.agency || "Official")}
          </div>
        )}
        <h3 className={`text-lg font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight ${showDescription ? 'mb-2' : 'mb-0'}`}>
          {guide.shortTitle || guide.title}
        </h3>
        {showDescription && (
          <p className="text-sm text-ctp-subtext1 line-clamp-2 mb-5 font-medium leading-relaxed">
            {guide.description || "Step-by-step requirements and procedures."}
          </p>
        )}

        {showMeta && (
          <div className="space-y-2.5 mb-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-ctp-subtext1 uppercase tracking-wider">
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock size={12} className="text-ctp-subtext0 shrink-0" />
                <span className="truncate">{guide.estimatedTime || "1-3 days"}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <DollarSign size={12} className="text-ctp-subtext0 shrink-0" />
                <span className="truncate">{guide.costRange || "Free"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showFooter && (
        <div className="pt-5 border-t border-ctp-surface1/50 flex items-center justify-between mt-auto">
          <span className="text-[10px] text-ctp-subtext1 font-semibold uppercase tracking-wider">
            Updated {guide.lastUpdated || "May 8, 2026"}
          </span>
          <div className="group/link text-ctp-sky-800 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all">
            View guide
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/link:translate-x-0.5" />
          </div>
        </div>
      )}
    </Link>

  );
};

export default GuideCard;

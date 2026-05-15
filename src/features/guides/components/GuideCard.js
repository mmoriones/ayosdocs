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
  
  // Styling based on bundle workflow aesthetic
  const baseCardClass = `
    group bg-ctp-mantle rounded-[2rem] border border-ctp-surface0 
    shadow-sm hover:shadow-xl hover:border-ctp-sky-800/30 
    transition-all relative overflow-hidden flex flex-col h-full
  `;

  const listCardClass = `
    group bg-ctp-mantle rounded-[1.5rem] p-5 border border-ctp-surface0 
    shadow-sm hover:shadow-xl hover:border-ctp-sky-800/30 
    transition-all relative overflow-hidden flex items-center gap-6
  `;

  if (isList) {
    return (
      <Link href={`/guides/${guide.slug}`} className={`${listCardClass} ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-ctp-base flex items-center justify-center p-3 group-hover:bg-ctp-sky-800/10 transition-colors shadow-inner border border-ctp-surface0 shrink-0">
          <Image src={iconSrc} alt={guide.title} width={40} height={40} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-3 mb-1">
            {showAgency && (
              <span className="text-[8px] font-black text-ctp-green uppercase tracking-[0.2em] bg-ctp-green/10 px-2 py-0.5 rounded-full border border-ctp-green/20">
                {Array.isArray(guide.agency) ? guide.agency.join(', ') : (guide.agency || "Official")}
              </span>
            )}
            <span className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest opacity-60">
              Updated {guide.lastUpdated || "May 8, 2026"}
            </span>
          </div>
          <h3 className={`text-[18px] font-black text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight uppercase tracking-tight truncate ${!showDescription ? 'mb-0' : ''}`}>
            {guide.shortTitle || guide.title}
          </h3>
          {showDescription && (
            <p className="text-[12px] text-ctp-subtext1 line-clamp-1 font-medium leading-relaxed opacity-80">
              {guide.description || "Step-by-step requirements and procedures."}
            </p>
          )}
        </div>

        {showMeta && (
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0 border-l border-ctp-surface0 pl-6 h-12 justify-center">
            <div className="flex items-center gap-4 text-[9px] font-black text-ctp-subtext0 uppercase tracking-widest">
              {stats && (
                <div className="flex items-center gap-1 text-ctp-mauve">
                  <span>{stats.views}</span>
                  <Eye size={12} />
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-ctp-sky-800" />
                <span>{guide.estimatedTime || "1-3 days"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-ctp-sky-800" />
                <span>{guide.costRange || "Free"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-ctp-subtext0 uppercase tracking-widest">
              <BarChart3 size={12} className="text-ctp-sky-800" />
              <span>{guide.difficulty || "Easy"}</span>
            </div>
          </div>
        )}

        <div className="shrink-0 ml-4 flex items-center gap-4">
          {showBookmark && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-3 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all bg-ctp-base rounded-xl border border-ctp-surface0 shadow-sm active:scale-90 relative z-10"
            >
              <Bookmark size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-ctp-sky-800 text-ctp-base flex items-center justify-center shadow-lg shadow-ctp-sky-800/20 active:scale-95 transition-all">
            <ArrowRight size={18} strokeWidth={3} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/guides/${guide.slug}`}
      className={`${baseCardClass} p-7 ${className}`}
    >
      {showBookmark && (
        <button className="absolute top-6 right-6 p-2.5 text-ctp-subtext1 hover:text-ctp-sky-800 transition-all bg-ctp-base rounded-full shadow-sm z-10 active:scale-90 border border-ctp-surface0" onClick={(e) => e.preventDefault()}>
          <Bookmark size={18} />
        </button>
      )}

      {progress?.tracked && (
        <div className="absolute top-0 right-0 p-2">
          <div className={`px-2 py-1 rounded-bl-xl rounded-tr-xl text-[8px] font-black uppercase tracking-widest ${
            progress.completed ? 'bg-ctp-green text-ctp-base' : 'bg-ctp-sky-800/10 text-ctp-sky-800 border border-ctp-sky-800/20'
          }`}>
            {progress.completed ? 'Done' : `${progress.percentage}%`}
          </div>
        </div>
      )}

      <div className="mb-6 w-14 h-14 rounded-[1rem] bg-ctp-base flex items-center justify-center p-3 group-hover:bg-ctp-sky-800/10 transition-colors shadow-inner border border-ctp-surface0">
        <Image src={iconSrc} alt={guide.title} width={40} height={40} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1">
        {showAgency && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-ctp-green/10 text-ctp-green text-[8px] font-black uppercase tracking-[0.2em] mb-3 border border-ctp-green/20">
            {Array.isArray(guide.agency) ? guide.agency.join(', ') : (guide.agency || "Official")}
          </div>
        )}
        <h3 className={`text-[18px] font-black text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight uppercase tracking-tight ${showDescription ? 'mb-3' : 'mb-0'}`}>
          {guide.shortTitle || guide.title}
        </h3>
        {showDescription && (
          <p className="text-[13px] text-ctp-subtext1 line-clamp-2 mb-6 font-medium leading-relaxed">
            {guide.description || "Step-by-step requirements and procedures."}
          </p>
        )}

        {showMeta && (
          <div className="space-y-3 mb-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-black text-ctp-subtext0 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock size={12} className="text-ctp-sky-800 shrink-0" />
                <span className="truncate">{guide.estimatedTime || "1-3 days"}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <DollarSign size={12} className="text-ctp-sky-800 shrink-0" />
                <span className="truncate">{guide.costRange || "Free"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-ctp-subtext0 uppercase tracking-widest">
              <BarChart3 size={12} className="text-ctp-sky-800 shrink-0" />
              <span>{guide.difficulty || "Easy"}</span>
            </div>
          </div>
        )}

        {!showFooter && stats && (
          <div className="mt-auto pt-4 flex items-center gap-1.5 text-ctp-subtext1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{stats.views}</span>
            <Eye size={12} className="opacity-50" />
          </div>
        )}
      </div>

      {showFooter && (
        <div className="pt-6 border-t border-ctp-surface0/50 flex items-center justify-between mt-auto">
          <span className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest">
            Updated {guide.lastUpdated || "May 8, 2026"}
          </span>
          <div className="group/link text-ctp-sky-800 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all">
            View guide
            <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover/link:translate-x-1" />
          </div>
        </div>
      )}
    </Link>
  );
};

export default GuideCard;

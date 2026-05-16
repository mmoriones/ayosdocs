'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getGuideIcon } from '@/lib/guideIcons';
import { Eye, ArrowRight } from 'lucide-react';

/**
 * TrendingWidget Component
 * A centered, highly visual widget for featuring popular guides on the home page.
 */
const TrendingWidget = ({ guide, stats, color = 'sky' }) => {
  const iconSrc = getGuideIcon(guide.slug, guide.agency);
  
  return (
    <div className="bg-ctp-base rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm hover:shadow-2xl hover:border-ctp-surface1 transition-all duration-500 flex flex-col items-center text-center group h-full relative overflow-hidden">
      {/* Dynamic Hover Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: `var(--${color})` }}
      />
      
      {/* Icon Container - Refined Squircle */}
      <div 
        className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm border border-ctp-surface0/50"
        style={{ backgroundColor: `var(--${color}-bg, color-mix(in srgb, var(--${color}), transparent 90%))` }}
      >
        <div className="w-10 h-10 relative">
          <Image 
            src={iconSrc} 
            alt={guide.title} 
            fill 
            className="object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all" 
          />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="space-y-3 mb-8 flex-1">
        <div className="space-y-1">
          <h3 className="text-[18px] font-black text-ctp-text uppercase tracking-tight leading-tight group-hover:text-ctp-sky-800 transition-colors">
            {guide.shortTitle || guide.title}
          </h3>
          {stats && (
            <div className="flex items-center justify-center gap-1.5 text-ctp-subtext1">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{stats.views}</span>
              <Eye size={10} className="opacity-40" />
            </div>
          )}
        </div>
        
        <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed line-clamp-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {guide.description}
        </p>
      </div>

      {/* Action Button - Centered Pill */}
      <Link 
        href={`/guides/${guide.slug}`}
        className="px-8 py-3.5 bg-ctp-sky-800 text-ctp-base rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-ctp-sky-700 transition-all active:scale-95 shadow-lg shadow-ctp-sky-800/20 flex items-center justify-center gap-2 group/btn w-fit"
      >
        <span>Learn More</span>
        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
};

export default TrendingWidget;

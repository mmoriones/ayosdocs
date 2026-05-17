'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getGuideIcon } from '@/lib/guideIcons';
import { Eye, ArrowRight } from 'lucide-react';

/**
 * TrendingWidget Component
 * A centered, highly visual widget for featuring popular guides on the home page.
 */
const TrendingWidget = ({ guide, stats }) => {
  const iconSrc = getGuideIcon(guide.slug, guide.agency);
  
  return (
    <div className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 shadow-sm hover:shadow-md hover:border-ctp-surface2 transition-all duration-300 flex flex-col items-center text-center group h-full relative overflow-hidden">
      
      {/* Icon Container - Refined Squircle */}
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-ctp-surface1 bg-ctp-mantle"
      >
        <div className="w-8 h-8 relative">
          <Image 
            src={iconSrc} 
            alt={guide.title} 
            fill 
            className="object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all" 
          />
        </div>
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
        className="px-6 py-2 bg-ctp-mantle text-ctp-text border border-ctp-surface1 rounded-lg font-semibold text-xs hover:bg-ctp-surface0 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn w-full sm:w-fit"
      >
        <span>Learn More</span>
        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
};

export default TrendingWidget;

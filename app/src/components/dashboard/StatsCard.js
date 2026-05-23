'use client';

import { Lock } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

/**
 * High-density metric item for unified stats bars.
 * 
 * @param {Object} props
 * @param {string} props.label - Metric name
 * @param {string} props.value - Numeric or text value
 * @param {import('lucide-react').LucideIcon} props.icon - Icon component
 * @param {Object} [props.trend] - Trend data { value: string, isUp: boolean }
 * @param {boolean} [props.isLocked] - Whether the stat is hidden
 */
export default function StatsCard({ label, value, icon: Icon, trend, isLocked = false }) {
  return (
    <div className="flex items-center gap-4 py-1 group">
      {/* Icon Container - Refined Squircle with light tint */}
      <div className="w-11 h-11 rounded-xl bg-ctp-sky-800/[0.06] flex items-center justify-center text-ctp-sky-800 border border-ctp-sky-800/10 group-hover:bg-ctp-sky-800/[0.12] transition-all duration-300 shadow-sm shrink-0">
        <Icon size={20} strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-xl font-bold tracking-tight leading-none ${isLocked ? 'text-ctp-subtext1' : 'text-ctp-text'}`}>
            {isLocked ? '—' : value}
          </p>
          {trend && !isLocked && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              trend.isUp 
                ? 'bg-ctp-green/[0.08] text-ctp-green border-ctp-green/20' 
                : 'bg-ctp-yellow/[0.08] text-ctp-yellow border-ctp-yellow/20'
            } uppercase tracking-tighter`}>
              {trend.value}
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.15em] mt-1 truncate">
          {label}
        </p>
      </div>

      {isLocked && (
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-ctp-mantle border border-ctp-surface1 rounded text-ctp-subtext1 opacity-60">
          <Lock size={10} strokeWidth={3} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Locked</span>
        </div>
      )}
    </div>
  );
}

StatsCard.Skeleton = function StatsCardSkeleton() {
  return (
    <div className="flex items-center gap-4 py-1">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-12 h-5" />
        <Skeleton className="w-20 h-2.5" />
      </div>
    </div>
  );
};

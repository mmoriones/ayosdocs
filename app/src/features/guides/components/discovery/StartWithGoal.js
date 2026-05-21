'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bundles } from '@/data/bundles';
import { getBundleIcon } from '@/lib/bundleIcons';

/**
 * StartWithGoal Component
 * Displays a list of top life-event goals.
 */
const StartWithGoal = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {bundles.slice(0, 3).map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => router.push(`/bundles/${bundle.id}`)}
          className="
            group p-5 rounded-xl 
            bg-ctp-base border border-ctp-surface1 shadow-sm
            hover:shadow-md hover:border-ctp-surface2 transition-all duration-300 cursor-pointer 
            flex flex-col gap-4 h-full
          "
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 border border-ctp-surface1">
              {getBundleIcon(bundle.id, { size: 20, className: "text-ctp-sky-800" })}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight truncate">
                {bundle.title}
              </h3>
              <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest truncate">
                {bundle.category}
              </p>
            </div>
          </div>

          <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed flex-1 line-clamp-2">
            {bundle.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-ctp-surface1">
            <span className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest">View Bundle</span>
            <ArrowRight size={14} className="text-ctp-subtext1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartWithGoal;

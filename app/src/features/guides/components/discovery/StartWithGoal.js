'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bundles } from '@/data/bundles';
import { getBundleIcon } from '@/lib/bundleIcons';
import { Badge } from '@/components/ui';

/**
 * StartWithGoal Component
 * Displays a list of top life-event goals.
 */
const StartWithGoal = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4">
      {bundles.slice(0, 3).map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => router.push(`/bundles/${bundle.id}`)}
          className="
            group px-5 py-4 rounded-lg 
            bg-ctp-base border border-ctp-surface1 shadow-sm
            hover:border-ctp-sky-800/20 hover:bg-ctp-mantle/50 transition-all duration-300 cursor-pointer 
            flex flex-col sm:flex-row sm:items-center gap-6
          "
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shrink-0 group-hover:bg-ctp-base transition-colors duration-300">
              {getBundleIcon(bundle.id, { size: 18, className: "text-ctp-sky-800" })}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-[13px] font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight truncate uppercase">
                  {bundle.title}
                </h3>
                <Badge variant="sky" className="px-1 py-0 text-[7px]">{bundle.category}</Badge>
              </div>
              <p className="text-[11px] text-ctp-subtext1 font-medium truncate opacity-80">
                {bundle.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 shrink-0 sm:border-l sm:border-ctp-surface1/50 sm:pl-8 h-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">Roadmap Steps</span>
              <span className="text-[11px] font-bold text-ctp-text">{bundle.flow.length} STAGES</span>
            </div>
            <ArrowRight size={14} className="text-ctp-surface2 group-hover:text-ctp-sky-800 group-hover:translate-x-1 transition-all" strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartWithGoal;

'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bundles } from '@/data/bundles';

/**
 * StartWithGoal Component
 * Displays a list of top life-event goals.
 */
const StartWithGoal = () => {
  const router = useRouter();

  return (
    <div className="w-full space-y-4">
      {bundles.slice(0, 3).map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => router.push(`/bundles/${bundle.id}`)}
          className="
            group p-6 rounded-xl 
            bg-ctp-base border border-ctp-surface1 shadow-sm
            hover:shadow-md hover:border-ctp-surface2 transition-all duration-300 cursor-pointer 
            flex flex-col md:flex-row items-center gap-6
          "
        >
          <div className="w-14 h-14 rounded-xl bg-ctp-mantle flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform duration-300 border border-ctp-surface1">
            {bundle.icon}
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-semibold text-ctp-sky-800 uppercase tracking-wider">Life Event Workflow</span>
              <span className="text-[10px] text-ctp-surface1">•</span>
              <span className="text-[10px] font-semibold text-ctp-subtext0 uppercase tracking-wider">{bundle.category}</span>
            </div>
            <h3 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight mb-1">
              {bundle.title}
            </h3>
            <p className="text-sm text-ctp-subtext0 font-normal leading-relaxed">
              {bundle.description}
            </p>
          </div>

          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-ctp-mantle flex items-center justify-center text-ctp-sky-800 group-hover:bg-ctp-sky-800 group-hover:text-ctp-base transition-all border border-ctp-surface1">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartWithGoal;

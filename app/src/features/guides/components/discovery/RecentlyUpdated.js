'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GuideIcon } from '@/lib/guideIcons';

const updates = [
  {
    id: 1,
    title: 'PSA Birth Certificate',
    type: 'Updated',
    date: 'May 8',
    slug: 'psa-birth-certificate'
  },
  {
    id: 2,
    title: 'NBI Clearance (New)',
    type: 'New guide',
    date: 'May 7',
    slug: 'nbi-clearance'
  },
  {
    id: 3,
    title: 'Philippine National ID',
    type: 'Updated',
    date: 'May 6',
    slug: 'national-id'
  },
  {
    id: 4,
    title: 'SSS Registration',
    type: 'Updated',
    date: 'May 5',
    slug: 'sss-registration'
  }
];

/**
 * Widget displaying a list of recently added or modified guides.
 * Designed for sidebar or secondary column placement.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional container styling
 */
const RecentlyUpdated = ({ className = "" }) => {
  const router = useRouter();

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-1 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {updates.map((update, index) => (
          <div 
            key={update.id}
            onClick={() => router.push(`/guides/${update.slug}`)}
            className={`
              group flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
              ${index !== updates.length - 1 ? 'border-b border-ctp-surface1' : ''}
            `}
          >
            <div className="w-9 h-9 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors">
              <GuideIcon slug={update.slug} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {update.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-ctp-sky-800 bg-ctp-sky-800/5 px-1.5 py-0.5 rounded border border-ctp-sky-800/20 uppercase tracking-widest">
                  {update.type}
                </span>
                <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">
                  {update.date}
                </span>
              </div>
            </div>

            <ChevronRight size={14} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

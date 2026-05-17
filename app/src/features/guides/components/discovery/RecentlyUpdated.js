'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getGuideIcon } from '@/lib/guideIcons';
import Image from 'next/image';

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
            <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0 border border-ctp-surface1">
              <Image 
                src={getGuideIcon(update.slug)} 
                alt={update.title}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {update.title}
              </h3>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-[10px] font-semibold text-ctp-sky-800 bg-ctp-sky-800/10 px-2 py-0.5 rounded-md uppercase tracking-wider border border-ctp-sky-800/20">
                  {update.type}
                </span>
                <span className="text-xs text-ctp-subtext0">•</span>
                <span className="text-[11px] font-medium text-ctp-subtext0 uppercase tracking-wider">
                  {update.date}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-sky-800 transition-all transform group-hover:translate-x-1">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

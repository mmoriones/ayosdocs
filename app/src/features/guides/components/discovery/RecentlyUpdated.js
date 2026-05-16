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
      <div className="flex-1 bg-ctp-base border border-ctp-surface0 rounded-[2.5rem] soft-shadow overflow-hidden flex flex-col">
        {updates.map((update, index) => (
          <div 
            key={update.id}
            onClick={() => router.push(`/guides/${update.slug}`)}
            className={`
              group flex items-center gap-6 p-6 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
              ${index !== updates.length - 1 ? 'border-b border-ctp-surface0/50' : ''}
            `}
          >
            <div className="w-14 h-14 rounded-2xl bg-ctp-mantle flex items-center justify-center p-3 group-hover:scale-110 transition-transform shrink-0 border border-ctp-surface0 shadow-sm">
              <Image 
                src={getGuideIcon(update.slug)} 
                alt={update.title}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-[18px] font-black text-ctp-text truncate group-hover:text-ctp-green transition-colors leading-tight tracking-tight uppercase">
                {update.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] font-black text-ctp-green bg-ctp-green/10 px-3 py-1 rounded-full uppercase tracking-widest border border-ctp-green/20 shadow-sm">
                  {update.type}
                </span>
                <span className="text-[12px] text-ctp-overlay1 font-black">•</span>
                <span className="text-[12px] font-bold text-ctp-subtext1 uppercase tracking-widest">
                  {update.date}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-ctp-surface2 group-hover:text-ctp-green transition-all transform group-hover:translate-x-1">
              <ChevronRight size={20} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

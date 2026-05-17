'use client';

import { Star, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getGuideIcon } from '@/lib/guideIcons';
import Image from 'next/image';

const experiences = [
  { 
    name: 'DFA Manila Aseana', 
    rating: 4.3, 
    reviews: 182, 
    waitTime: '2-3 hrs', 
    slug: 'passport-appointment'
  },
  { 
    name: 'PSA Quezon City Main Office', 
    rating: 4.5, 
    reviews: 156, 
    waitTime: '1-2 hrs', 
    slug: 'psa-birth-certificate'
  },
  { 
    name: 'LTO East Avenue District Office', 
    rating: 4.1, 
    reviews: 98, 
    waitTime: '2-4 hrs', 
    slug: 'nbi-clearance'
  },
  {
    name: 'BIR Quezon City RR 7B',
    rating: 3.9,
    reviews: 74,
    waitTime: '3-5 hrs',
    slug: 'nbi-clearance'
  }
];

const RecentExperiences = ({ className = "" }) => {
  const router = useRouter();

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-1 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {experiences.map((office, i) => (
          <div
            key={i}
            onClick={() => router.push('/offices')}
            className={`
              group flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
              ${i !== experiences.length - 1 ? 'border-b border-ctp-surface1' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0 border border-ctp-surface1">
              <Image src={getGuideIcon(office.slug)} alt={office.name} width={32} height={32} className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-ctp-yellow/10 border border-ctp-yellow/20">
                  <Star size={10} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-[11px] font-semibold text-ctp-yellow tracking-wider">{office.rating}</span>
                </div>
                <span className="text-xs text-ctp-subtext0">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-ctp-subtext0 uppercase tracking-wider">Wait:</span>
                  <span className="text-[12px] font-semibold text-ctp-sky-800 tracking-tight">
                    {office.waitTime}
                  </span>
                </div>
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

export default RecentExperiences;

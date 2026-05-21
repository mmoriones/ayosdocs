'use client';

import { Star, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GuideIcon } from '@/lib/guideIcons';

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

/**
 * Widget displaying community-reported ratings and wait times for offices.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional container styling
 */
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
            <div className="w-9 h-9 rounded-lg bg-ctp-mantle flex items-center justify-center shrink-0 border border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-colors">
              <GuideIcon slug={office.slug} className="w-5 h-5 text-ctp-sky-800" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-[11px] font-bold text-ctp-text tracking-tight">{office.rating}</span>
                </div>
                <span className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest">• Wait: {office.waitTime}</span>
              </div>
            </div>

            <ChevronRight size={14} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperiences;

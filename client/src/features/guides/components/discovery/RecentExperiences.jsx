import { ArrowRight, Star, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

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
 * RecentExperiences Component
 * Displays top community office insights in a list format for the home page.
 */
const RecentExperiences = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* LIST CONTAINER */}
      <div className="flex-1 bg-ctp-base border border-ctp-surface0 rounded-[2.5rem] soft-shadow overflow-hidden flex flex-col">
        {experiences.map((office, i) => (
          <div
            key={i}
            onClick={() => navigate('/offices')}
            className={`
              group flex items-center gap-6 p-6 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
              ${i !== experiences.length - 1 ? 'border-b border-ctp-surface0/50' : ''}
            `}
          >
            {/* ICON */}
            <div className="w-14 h-14 rounded-2xl bg-ctp-mantle flex items-center justify-center p-3 group-hover:scale-110 transition-transform shrink-0 border border-ctp-surface0 shadow-sm">
              <img src={getGuideIcon(office.slug)} alt="" className="w-full h-full object-contain" />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[18px] font-black text-ctp-text truncate group-hover:text-ctp-sapphire transition-colors leading-tight tracking-tight uppercase">
                {office.name}
              </h3>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-ctp-yellow/10 border border-ctp-yellow/20">
                  <Star size={12} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-[12px] font-black text-ctp-yellow tracking-widest">{office.rating}</span>
                </div>
                <span className="text-[12px] text-ctp-surface2">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-ctp-sky uppercase tracking-widest opacity-80">Wait:</span>
                  <span className="text-[14px] font-black text-ctp-sky uppercase tracking-tight">
                    {office.waitTime}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="shrink-0 text-ctp-surface2 group-hover:text-ctp-sapphire transition-all transform group-hover:translate-x-1">
              <ChevronRight size={20} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperiences;
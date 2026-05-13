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
      <div className="flex-1 bg-ctp-mantle border border-ctp-surface0 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
        {experiences.map((office, i) => (
          <div
            key={i}
            onClick={() => navigate('/offices')}
            className={`
              group flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-ctp-mantle flex-1
              ${i !== experiences.length - 1 ? 'border-b border-ctp-surface0' : ''}
            `}
          >
            {/* ICON */}
            <div className="w-12 h-12 rounded-2xl bg-ctp-base flex items-center justify-center p-2.5 group-hover:bg-ctp-mantle transition-colors shrink-0">
              <img src={getGuideIcon(office.slug)} alt="" className="w-full h-full object-contain" />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[18px] font-bold text-ctp-text truncate group-hover:text-ctp-green transition-colors leading-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-[14px] font-bold text-ctp-subtext0">{office.rating}</span>
                </div>
                <span className="text-[14px] text-ctp-surface2">•</span>
                <span className="text-[14px] font-bold text-ctp-green uppercase tracking-tight">
                  {office.waitTime}
                </span>
              </div>
            </div>

            {/* ACTION */}
            <div className="shrink-0 text-ctp-surface2 group-hover:text-ctp-green transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperiences;
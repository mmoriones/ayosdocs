import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

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
  const navigate = useNavigate();

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* LIST CONTAINER */}
      <div className="flex-1 bg-ctp-mantle border border-ctp-surface0 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
        {updates.map((update, index) => (
          <div 
            key={update.id}
            onClick={() => navigate(`/guides/${update.slug}`)}
            className={`
              group flex items-center gap-4 p-5 cursor-pointer transition-colors hover:bg-ctp-surface0 flex-1
              ${index !== updates.length - 1 ? 'border-b border-ctp-surface0' : ''}
            `}
          >
            {/* ICON */}
            <div className="w-12 h-12 rounded-2xl bg-ctp-base flex items-center justify-center p-2.5 group-hover:bg-ctp-surface0 transition-colors shrink-0">
              <img 
                src={getGuideIcon(update.slug)} 
                alt="" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[18px] font-bold text-ctp-text truncate group-hover:text-ctp-green transition-colors leading-tight">
                {update.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[14px] font-bold text-ctp-green uppercase tracking-wider">
                  {update.type}
                </span>
                <span className="text-[14px] text-ctp-surface2">•</span>
                <span className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-tight">
                  {update.date}
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

export default RecentlyUpdated;
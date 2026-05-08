import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

const updates = [
  {
    id: 1,
    title: 'PSA Birth Certificate Online Requests',
    type: 'New guide',
    date: 'Apr 6, 2026',
    description: 'Step-by-step process for requesting PSA Birth Certificate online.',
    slug: 'psa-birth-certificate'
  },
  {
    id: 2,
    title: 'Pag-IBIG MP2 Registration',
    type: 'Updated',
    date: 'Apr 5, 2026',
    description: 'Updated requirements and instructions for MP2 registration.',
    slug: 'pag-ibig-mp2'
  },
  {
    id: 3,
    title: 'OWWA Membership Guide',
    type: 'New guide',
    date: 'Apr 4, 2026',
    description: 'Learn how to apply and renew your OWWA membership.',
    slug: 'owwa-membership'
  }
];

const RecentlyUpdated = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-slate-900">
            New & Updated Guides
          </h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            New
          </span>
        </div>
        
        <button 
          onClick={() => navigate('/guides')}
          className="text-[13px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          View all updates <ChevronRight size={14} />
        </button>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
        {updates.map((update, index) => (
          <div 
            key={update.id}
            onClick={() => navigate(`/guides/${update.slug}`)}
            className={`group flex items-center gap-5 p-6 cursor-pointer transition-colors hover:bg-slate-50/50
              ${index !== updates.length - 1 ? 'border-b border-slate-50' : ''}
            `}
          >
            {/* THUMBNAIL */}
            <div className="shrink-0 w-24 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={getGuideIcon(update.slug)} 
                alt="" 
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                {update.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold text-slate-400">
                  {update.type}
                </span>
                <span className="text-[11px] text-slate-300">•</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {update.date}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1 line-clamp-1">
                {update.description}
              </p>
            </div>

            {/* ACTION */}
            <div className="shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

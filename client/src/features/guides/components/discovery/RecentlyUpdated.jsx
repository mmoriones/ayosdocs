import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

const updates = [
  {
    id: 1,
    title: 'PSA Birth Certificate',
    type: 'Updated',
    date: 'May 8, 2026',
    description: 'Updated guide for online and walk-in applications.',
    slug: 'psa-birth-certificate'
  },
  {
    id: 2,
    title: 'NBI Clearance (New Applicant)',
    type: 'New guide',
    date: 'May 7, 2026',
    description: 'Learn how to register and book your appointment online.',
    slug: 'nbi-clearance'
  },
  {
    id: 3,
    title: 'Philippine National ID',
    type: 'Updated',
    date: 'May 6, 2026',
    description: 'A complete guide on how to register for your PhilSys ID.',
    slug: 'national-id'
  }
];

const RecentlyUpdated = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-none">New & Updated</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Stay informed with the latest guide updates and additions.</p>
        </div>
        
        <button 
          onClick={() => navigate('/guides')}
          className="group flex items-center gap-1 text-teal-700 font-bold hover:text-teal-800 transition-colors text-[11px] uppercase tracking-wider whitespace-nowrap"
        >
          <span>View all updates</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {updates.map((update, index) => (
          <div 
            key={update.id}
            onClick={() => navigate(`/guides/${update.slug}`)}
            className={`group flex items-center gap-5 p-6 cursor-pointer transition-colors hover:bg-gray-50/50
              ${index !== updates.length - 1 ? 'border-b border-gray-50' : ''}
            `}
          >
            {/* THUMBNAIL */}
            <div className="shrink-0 w-24 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                src={getGuideIcon(update.slug)} 
                alt="" 
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-teal-700 transition-colors leading-tight">
                {update.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-teal-600/70 uppercase tracking-wider">
                  {update.type}
                </span>
                <span className="text-[10px] text-gray-300">•</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {update.date}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-1 leading-relaxed">
                {update.description}
              </p>
            </div>

            {/* ACTION */}
            <div className="shrink-0 text-gray-300 group-hover:text-gray-400 transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdated;

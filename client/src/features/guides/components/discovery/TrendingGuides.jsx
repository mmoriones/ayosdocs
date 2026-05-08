import {
  TrendingUp,
  ArrowRight
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

const guides = [
  {
    id: 1,
    name: 'NBI Clearance',
    description: 'Learn how to apply for your NBI Clearance online.',
    slug: 'nbi-clearance',
    bg: 'bg-blue-50',
    color: 'text-blue-600'
  },
  {
    id: 2,
    name: 'Passport Appointment',
    description: 'Book your passport appointment in easy steps.',
    slug: 'passport-appointment',
    bg: 'bg-red-50',
    color: 'text-red-600'
  },
  {
    id: 3,
    name: 'PSA Birth Certificate',
    description: 'How to get original copy of your PSA Birth Certificate.',
    slug: 'psa-birth-certificate',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600'
  },
  {
    id: 4,
    name: 'Philippine National ID',
    description: 'Guide to get your National ID in a few simple steps.',
    slug: 'national-id',
    bg: 'bg-purple-50',
    color: 'text-purple-600'
  },
  {
    id: 5,
    name: 'SSS Registration',
    description: 'Register for SSS and get your membership number.',
    slug: 'sss-registration',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600'
  },
  {
    id: 6,
    name: 'PhilHealth ID',
    description: 'How to create and print your PhilHealth ID online.',
    slug: 'philhealth-application',
    bg: 'bg-amber-50',
    color: 'text-amber-600'
  },
];

const TrendingGuides = () => {
  const navigate = useNavigate();

  const handleSelection = (slug) => {
    navigate(`/guides/${slug}`);
  };

  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp size={24} strokeWidth={2.5} />
            <h2 className="text-2xl font-bold text-slate-900">
              Popular Guides
            </h2>
          </div>
          <p className="text-slate-500 mt-1 font-medium">
            Quick access to our most requested guides.
          </p>
        </div>

        <button 
          onClick={() => navigate('/guides')}
          className="group flex items-center gap-1.5 text-teal-700 font-bold hover:text-teal-800 transition-colors"
        >
          <span>View all guides</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => {
          const icon = getGuideIcon(guide.slug);

          return (
            <div
              key={guide.id}
              onClick={() => handleSelection(guide.slug)}
              className="group relative flex flex-col p-6 rounded-[32px] 
              bg-white border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
              hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5
              transition-all duration-300 cursor-pointer overflow-hidden h-full"
            >
              
              {/* ICON CONTAINER */}
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-2xl ${guide.bg} transition-transform duration-300 group-hover:scale-110`}>
                  {icon ? (
                    <img 
                      src={icon} 
                      alt={guide.name} 
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-lg">
                      <TrendingUp className="text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* TEXT CONTENT */}
              <div className="flex-1 text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {guide.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {guide.description}
                </p>
              </div>

              {/* ACTION LINK */}
              <div className="mt-auto flex justify-center">
                <div className="flex items-center gap-1.5 text-teal-600 font-bold text-[13px] group-hover:gap-2 transition-all">
                  <span>View guide</span>
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </div>

              {/* SUBTLE CARD HOVER ACCENT */}
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingGuides;

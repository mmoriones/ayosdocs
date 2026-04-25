import {
  FileText,
  BookOpen,
  ShieldCheck,
  CreditCard,
  UserCircle,
  ReceiptText,
  ChevronRight
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const guides = [
  {
    id: 1,
    name: 'NBI Clearance',
    slug: 'nbi-clearance',
    icon: FileText,
    bg: 'bg-blue-50',
    color: 'text-blue-600'
  },
  {
    id: 2,
    name: 'Passport Appointment',
    slug: 'passport-appointment',
    icon: BookOpen,
    bg: 'bg-red-50',
    color: 'text-red-600'
  },
  {
    id: 3,
    name: 'SSS Registration',
    slug: 'sss-registration',
    icon: ShieldCheck,
    bg: 'bg-indigo-50',
    color: 'text-indigo-600'
  },
  {
    id: 4,
    name: 'UMID Card',
    slug: 'umid-application',
    icon: CreditCard,
    bg: 'bg-purple-50',
    color: 'text-purple-600'
  },
  {
    id: 5,
    name: 'PhilHealth ID',
    slug: 'philhealth-application',
    icon: UserCircle,
    bg: 'bg-yellow-50',
    color: 'text-yellow-600'
  },
  {
    id: 6,
    name: 'Digital TIN ID',
    slug: 'digital-tin',
    icon: ReceiptText,
    bg: 'bg-green-50',
    color: 'text-green-600'
  },
];

const TrendingGuides = ({ onSelectGuide }) => {
  const navigate = useNavigate();

  const handleSelection = (slug) => {
    navigate(`/guides/${slug}`);
    onSelectGuide(slug);
  };

  return (
    <div className="transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Popular Guides
        </h2>

        <button className="text-sm text-teal-600 hover:underline flex items-center gap-1">
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {guides.map((guide) => {
          const Icon = guide.icon;

          return (
            <div
              key={guide.id}
              onClick={() => handleSelection(guide.slug)}
              className="group flex items-center justify-between p-4 rounded-2xl 
              bg-white border border-gray-100 shadow-sm 
              hover:shadow-md hover:-translate-y-0.5 
              transition-all duration-200 cursor-pointer"
            >
              {/* LEFT CONTENT */}
              <div className="flex items-center gap-4">
                
                {/* ICON */}
                <div className={`p-3 rounded-xl ${guide.bg}`}>
                  <Icon className={`w-5 h-5 ${guide.color}`} />
                </div>

                {/* TEXT */}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {guide.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Requirements & process
                  </p>
                </div>
              </div>

              {/* ARROW */}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingGuides;

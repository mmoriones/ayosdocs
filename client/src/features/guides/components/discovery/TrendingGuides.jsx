import {
  TrendingUp,
  ArrowRight,
  Clock,
  DollarSign,
  BarChart3,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';
import { guidesMap } from '../../../../utils/loadGuides';

// Selected popular guides to display on home
const popularSlugs = [
  'passport-appointment',
  'nbi-clearance',
  'sss-registration',
  'psa-birth-certificate',
  'national-id',
  'philhealth-application'
];

const TrendingGuides = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll();
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleSelection = (slug) => {
    navigate(`/guides/${slug}`);
  };

  const trendingGuides = popularSlugs
    .map(slug => guidesMap[slug])
    .filter(Boolean);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative group/section">
      
      {/* HEADER */}
      <div className="flex justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-none">Popular Guides</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Quick access to our most requested guides.</p>
        </div>

        <button 
          onClick={() => navigate('/guides')}
          className="group flex items-center gap-1 text-teal-700 font-bold hover:text-teal-800 transition-colors text-[11px] uppercase tracking-wider whitespace-nowrap"
        >
          <span>View all guides</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className="relative">
        {/* LEFT SCROLL BUTTON */}
        <button 
          onClick={scrollLeft}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all z-20 opacity-0 group-hover/section:opacity-100 hidden md:flex ${!showLeftScroll ? 'pointer-events-none !opacity-0' : ''}`}
        >
          <ChevronLeft size={20} />
        </button>

        <div 
          ref={scrollRef}
          className="
            flex overflow-x-auto pb-6 -mx-6 px-8 
            md:mx-0 md:px-0
            gap-5 md:gap-6 
            snap-x snap-mandatory
            scrollbar-hide
          "
        >
          {trendingGuides.map((guide) => {
            const icon = getGuideIcon(guide.slug);

            return (
              <div
                key={guide.slug}
                onClick={() => handleSelection(guide.slug)}
                className="
                  flex-shrink-0 w-[280px] md:w-[320px] snap-start
                  group relative flex flex-col p-6 rounded-3xl 
                  bg-white border border-gray-100 shadow-sm
                  hover:shadow-xl hover:border-teal-100
                  transition-all duration-300 cursor-pointer overflow-hidden
                "
              >
                
                {/* TOP ROW: ICON & INFO */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center p-3 group-hover:bg-teal-50 transition-colors shrink-0">
                    {icon ? (
                      <img 
                        src={icon} 
                        alt={guide.title} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <TrendingUp className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate leading-tight">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1 leading-relaxed">
                      {guide.description || "Step-by-step requirements and procedures."}
                    </p>
                  </div>
                </div>

                {/* METADATA */}
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-teal-500" />
                    {guide.estimatedTime || "1-3 days"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={12} className="text-teal-500" />
                    {guide.costRange || "Free"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={12} className="text-teal-500" />
                    {guide.difficulty || "Easy"}
                  </div>
                </div>

                {/* BOTTOM ROW: ACTION */}
                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold text-[11px] uppercase tracking-wider group-hover:gap-2.5 transition-all">
                    <span>View guide</span>
                    <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SCROLL BUTTON */}
        <button 
          onClick={scrollRight}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all z-20 opacity-0 group-hover/section:opacity-100 hidden md:flex ${!showRightScroll ? 'pointer-events-none !opacity-0' : ''}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TrendingGuides;

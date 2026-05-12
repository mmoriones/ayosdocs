import { MessageSquare, ArrowRight, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

const offices = [
  { 
    name: 'DFA Manila Aseana', 
    rating: 4.3, 
    reviews: 182, 
    waitTime: '2-3 hrs', 
    peak: 'Peak hours: 10AM - 1PM', 
    icon: getGuideIcon('passport-appointment') 
  },
  { 
    name: 'PSA Quezon City Main Office', 
    rating: 4.5, 
    reviews: 156, 
    waitTime: '1-2 hrs', 
    peak: 'Most users report smooth processing this week.', 
    icon: getGuideIcon('psa-birth-certificate'), 
    tip: true 
  },
  { 
    name: 'LTO East Avenue District Office', 
    rating: 4.1, 
    reviews: 98, 
    waitTime: '2-4 hrs', 
    peak: 'Peak hours: 11AM - 2PM', 
    icon: getGuideIcon('nbi-clearance') 
  },
];

/**
 * RecentExperiences Component
 * Displays recent community feedback and office insights on the home page.
 */
const RecentExperiences = () => {
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
          <h2 className="text-lg font-bold text-gray-900 leading-none">Recent Office Experiences</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Real experiences from the community (anonymous).</p>
        </div>

        <button 
          onClick={() => navigate('/offices')}
          className="group flex items-center gap-1 text-teal-700 font-bold hover:text-teal-800 transition-colors text-[11px] uppercase tracking-wider whitespace-nowrap"
        >
          <span>View all offices</span>
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
          {offices.map((office, i) => (
            <div
              key={i}
              onClick={() => navigate('/offices')}
              className="
                flex-shrink-0 w-[280px] md:w-[320px] snap-start
                group relative flex flex-col p-6 rounded-3xl 
                bg-white border border-gray-100 shadow-sm
                hover:shadow-xl hover:border-teal-100 transition-all duration-300 cursor-pointer overflow-hidden
              "
            >
              {/* TOP ROW: ICON & INFO */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center p-2 group-hover:bg-teal-50 transition-colors shrink-0">
                  <img src={office.icon} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-bold text-gray-800 group-hover:text-teal-700 transition-colors truncate leading-tight">
                    {office.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-700">{office.rating}</span>
                    <span className="text-[10px] text-gray-400">({office.reviews})</span>
                  </div>
                </div>
              </div>

              {/* INSIGHTS */}
              <div className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Average waiting time today</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold border border-teal-100">
                    {office.waitTime}
                  </span>
                </div>
                <p className={`text-[10px] ${office.tip ? 'text-teal-600 font-medium' : 'text-gray-500'} leading-relaxed line-clamp-2`}>
                  {office.peak}
                </p>
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-teal-600 font-bold text-[10px] uppercase tracking-wider group-hover:gap-2.5 transition-all">
                  <span>View full report</span>
                  <ArrowRight size={12} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SCROLL BUTTON */}
        <button 
          onClick={scrollRight}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all z-20 opacity-0 group-hover/section:opacity-100 hidden md:flex ${!showRightScroll ? 'pointer-events-none !opacity-0' : ''}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecentExperiences;

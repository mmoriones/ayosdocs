import { ArrowRight, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bundles } from '../../../../data/bundles';

/**
 * StartWithGoal Component
 * Displays horizontal goal-based bundles for users to start their journey.
 */
const StartWithGoal = () => {
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
          <h2 className="text-lg font-bold text-gray-900 leading-none">Start with a goal</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Choose a life event and we'll help you track requirements.</p>
        </div>

        <button 
          onClick={() => navigate('/coming-soon')}
          className="group flex items-center gap-1 text-teal-700 font-bold hover:text-teal-800 transition-colors text-[11px] uppercase tracking-wider whitespace-nowrap"
        >
          <span>View all goals</span>
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
            gap-4 md:gap-6 
            snap-x snap-mandatory
            scrollbar-hide
          "
        >
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => navigate('/coming-soon')}
              className="
                flex-shrink-0 w-[200px] md:w-[220px] snap-start
                group p-6 rounded-3xl 
                bg-white border border-gray-100 shadow-sm
                hover:shadow-xl hover:border-teal-100 transition-all duration-300 cursor-pointer flex flex-col items-center text-center
              "
            >
              {/* ICON */}
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-teal-50 transition-transform duration-300">
                {bundle.icon}
              </div>

              {/* CONTENT */}
              <h3 className="text-[15px] font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                {bundle.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                {bundle.description}
              </p>

              {/* INDICATOR */}
              <div className="mt-auto pt-6">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-50 transition-colors">
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
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

export default StartWithGoal;

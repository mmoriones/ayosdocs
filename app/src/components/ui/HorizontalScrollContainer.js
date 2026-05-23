'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Horizontal Scroll Container with dot indicators and navigation buttons.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The items to scroll.
 * @param {number} props.itemCount - Total number of items for the indicator.
 * @param {string} [props.className] - Optional container classes.
 */
export default function HorizontalScrollContainer({ children, itemCount, className = "" }) {
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Update active dot
    const index = Math.round((scrollLeft / (scrollWidth - clientWidth)) * (itemCount - 1)) || 0;
    setActiveDot(Math.min(index, itemCount - 1));

    // Update arrows visibility
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < (scrollWidth - clientWidth - 10));
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`w-full flex flex-col gap-4 relative group/scroll ${className}`}>
      {/* Navigation Buttons - Hidden on mobile, shown on hover on desktop */}
      <button 
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-8 h-8 rounded-full bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-text shadow-lg transition-all duration-300 ${
          showLeftArrow ? 'opacity-0 lg:group-hover/scroll:opacity-100' : 'opacity-0 pointer-events-none'
        } hover:bg-ctp-mantle hover:border-ctp-sky-800/30 active:scale-90`}
      >
        <ChevronLeft size={16} strokeWidth={3} />
      </button>

      <button 
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-8 h-8 rounded-full bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-text shadow-lg transition-all duration-300 ${
          showRightArrow ? 'opacity-0 lg:group-hover/scroll:opacity-100' : 'opacity-0 pointer-events-none'
        } hover:bg-ctp-mantle hover:border-ctp-sky-800/30 active:scale-90`}
      >
        <ChevronRight size={16} strokeWidth={3} />
      </button>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-1 gap-3 scrollbar-hide snap-x snap-mandatory"
      >
        {children}
      </div>

      {/* Scroll Indicator Dots */}
      {itemCount > 1 && (
        <div className="flex justify-center items-center gap-1.5 px-2">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                activeDot === i ? 'w-4 bg-ctp-sky-800' : 'w-1 bg-ctp-surface1'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

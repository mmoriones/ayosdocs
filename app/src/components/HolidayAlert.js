'use client';

import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import Card from './ui/Card';

const HolidayAlert = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`${className}`}>
      <Card 
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 149, 0, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="relative overflow-hidden border-white/40 shadow-[0_8px_32px_rgba(255,59,48,0.08)] group"
        noPadding
      >
        <div className="flex items-center gap-4 p-5 md:p-6">
          {/* Icon Container */}
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-white/50">
             <Calendar size={24} className="text-[#FF3B30]" strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-[15px] font-bold text-[#1C1C1E] leading-tight">Independence Day Holiday</h4>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">
              Government offices will be closed on <span className="text-[#FF3B30] font-bold">June 12 (Friday)</span>.
            </p>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-400 hover:bg-black/10 active:scale-90 transition-all ml-2"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Subtle Decorative Background Element */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-[#FF3B30]/10 to-transparent blur-2xl rounded-full pointer-events-none" />
      </Card>
    </div>
  );
};

export default HolidayAlert;

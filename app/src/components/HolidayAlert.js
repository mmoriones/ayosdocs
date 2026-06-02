'use client';

import { useState, useMemo } from 'react';
import { Calendar, X } from 'lucide-react';
import holidays from '@/data/holidays.json';
import { Card } from '@/components/ui';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function HolidayAlert({ className = '', daysBefore = 14 }) {
  const [isVisible, setIsVisible] = useState(true);

  const activeHoliday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowEnd = new Date(today);
    windowEnd.setDate(windowEnd.getDate() + daysBefore);

    return holidays.find(h => {
      const d = new Date(h.date + 'T00:00:00');
      return d >= today && d <= windowEnd;
    }) || null;
  }, [daysBefore]);

  if (!isVisible || !activeHoliday) return null;

  const d = new Date(activeHoliday.date + 'T00:00:00');
  const isToday = new Date().toDateString() === d.toDateString();

  return (
    <div className={className}>
      <Card
        style={{
          background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 149, 0, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="relative overflow-hidden border-[#FF3B30]/10 shadow-[0_8px_32px_rgba(255,59,48,0.08)] group"
        noPadding
      >
        <div className="flex items-center gap-4 p-5 md:p-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-white/50">
            <Calendar size={24} className="text-[#FF3B30]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[15px] font-bold text-[#1C1C1E] leading-tight">{activeHoliday.name}</h4>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">
              {isToday ? (
                <><span className="text-[#FF3B30] font-bold">Today</span> is {activeHoliday.name}. Government offices are closed.</>
              ) : (
                <>{activeHoliday.name} is on <span className="text-[#FF3B30] font-bold">{formatDate(activeHoliday.date)}</span>.</>
              )}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-400 hover:bg-black/10 active:scale-90 transition-all ml-2"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-[#FF3B30]/10 to-transparent blur-2xl rounded-full pointer-events-none" />
      </Card>
    </div>
  );
}

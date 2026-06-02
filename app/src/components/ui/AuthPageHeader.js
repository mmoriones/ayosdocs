'use client';

import { ChevronLeft, User } from 'lucide-react';

export default function AuthPageHeader({ onBackClick, onGuestClick }) {
  return (
    <div className="w-full max-w-[1200px] px-6 pt-6 pb-10 flex justify-between items-start relative">
      <button
        onClick={onBackClick}
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
      >
        <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
      </button>

      {onGuestClick && (
        <button
          onClick={onGuestClick}
          className="h-12 px-5 rounded-full border-2 border-[#0038A8]/20 text-[#0038A8] font-black text-[13px] flex items-center gap-1.5 hover:bg-[#0038A8]/5 hover:border-[#0038A8]/40 active:scale-90 transition-all shrink-0"
        >
          <User size={15} strokeWidth={2.5} />
          Continue as Guest
        </button>
      )}
    </div>
  );
}

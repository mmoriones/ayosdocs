'use client';

import { ChevronLeft, User } from 'lucide-react';
import Button from './Button';

export default function AuthPageHeader({ onBackClick, onGuestClick }) {
  return (
    <div className="w-full max-w-[1200px] px-6 pt-6 pb-10 flex justify-between items-start relative">
      <Button
        variant="icon"
        size="lg"
        onClick={onBackClick}
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </Button>

      {onGuestClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onGuestClick}
          leftIcon={<User size={15} strokeWidth={2.5} />}
          className="h-12 px-5 border-2 border-[#0038A8]/20 text-[#0038A8] hover:bg-[#0038A8]/5 hover:border-[#0038A8]/40 shrink-0"
        >
          Continue as Guest
        </Button>
      )}
    </div>
  );
}

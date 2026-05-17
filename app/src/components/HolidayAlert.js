'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';
import Banner from './ui/Banner';

const HolidayAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner
      variant="sky"
      icon={Info}
      onClose={() => setIsVisible(false)}
      className="py-1 px-3 items-center whitespace-nowrap shadow-none border-ctp-sky-800/10"
    >
      <div className="text-xs font-medium">
        <span className="font-bold mr-1.5">Holiday Alert:</span>
        Offices may be closed today (May 15)
      </div>
    </Banner>
  );
};

export default HolidayAlert;

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
      title="Local Holiday Alert"
      onClose={() => setIsVisible(false)}
    >
      Offices may be closed today{" "}
      <span className="text-ctp-sky-800 font-bold">
        (May 15, Friday)
      </span>
    </Banner>
  );
};

export default HolidayAlert;

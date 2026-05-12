import { Info } from 'lucide-react';
import { useState } from 'react';
import Banner from './ui/Banner';

const HolidayAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner
      variant="orange"
      icon={Info}
      title="Local Holiday Alert"
      onClose={() => setIsVisible(false)}
    >
      Offices may be closed today{" "}
      <span className="text-orange-600 font-bold">
        (April 9, Araw ng Kagitingan)
      </span>
    </Banner>
  );
};

export default HolidayAlert;

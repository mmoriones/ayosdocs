import { Info, X } from 'lucide-react';
import { useState } from 'react';

const HolidayAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 
    rounded-[24px] border border-teal-100 bg-teal-50/50 text-teal-900 group">

      {/* LEFT CONTENT */}
      <div className="flex items-center gap-4">
        <div className="shrink-0 p-2 rounded-full bg-white text-teal-600 shadow-sm border border-teal-100">
          <Info size={18} strokeWidth={2.5} />
        </div>

        <p className="text-[13px] font-medium text-slate-700">
          <span className="font-bold text-teal-800">
            Local Holiday Alert:
          </span>{" "}
          Offices may be closed today{" "}
          <span className="text-teal-600 font-bold">
            (April 9, Araw ng Kagitingan)
          </span>
        </p>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setIsVisible(false)}
        className="shrink-0 p-1.5 rounded-full hover:bg-teal-100/50 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default HolidayAlert;

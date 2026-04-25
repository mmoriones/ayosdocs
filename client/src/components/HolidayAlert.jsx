import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const HolidayAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 
    rounded-xl border border-teal-100 bg-teal-50 text-teal-900">

      {/* LEFT CONTENT */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-teal-100">
          <AlertCircle size={16} className="text-teal-600" />
        </div>

        <p className="text-sm">
          <span className="font-semibold">
            Local Holiday Alert:
          </span>{" "}
          Offices may be closed today{" "}
          <span className="text-teal-700">
            (April 9, Araw ng Kagitingan)
          </span>
        </p>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-teal-500 hover:text-teal-700 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default HolidayAlert;

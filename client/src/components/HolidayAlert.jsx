import { AlertCircle } from 'lucide-react';

const HolidayAlert = () => {
  return (
    <div className="mt-8 flex items-center gap-3 p-4 border rounded-lg shadow-sm transition-colors duration-300
      bg-blue-50 border-blue-200 ">
      
      <AlertCircle className="text-blue-600" size={20} />
      
      <p className="text-sm font-semibold italic text-blue-900">
        LOCAL HOLIDAY ALERT: 
        <span className="font-normal ml-1 text-blue-800">
          Offices may be closed today (April 9, Araw ng Kagitingan)
        </span>
      </p>
    </div>
  );
};

export default HolidayAlert;
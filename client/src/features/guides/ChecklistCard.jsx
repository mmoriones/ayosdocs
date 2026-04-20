import { CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChecklistCard = ({ title, initialSteps, slug }) => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(initialSteps || [
    { id: 1, task: 'Gather REQUIREMENTS', completed: true },
    { id: 2, task: 'Book Appointment', completed: true },
    { id: 3, task: 'Pay Fee', completed: true },
    { id: 4, task: 'Photo & Biometrics', completed: false },
  ]);

  const progress = Math.round((steps.filter(s => s.completed).length / steps.length) * 100);

  return (
    <div className="transition-colors duration-300 p-6 max-w-sm rounded-2xl shadow-lg border-2 
      bg-white border-gray-100 
      dark:bg-[#242729] dark:border-gray-800">

      <h3 className="text-lg font-black mb-4 border-b pb-2 uppercase italic 
        text-gray-900 dark:text-gray-100 dark:border-gray-700">
        {title || "Passport Renewal"}
      </h3>

      <div className="space-y-4 mb-6">
        {steps.map((step, index)  => (
          <div key={step.id} className="flex items-start gap-3 group cursor-pointer">
            {step.completed ?
              <CheckSquare className="text-teal-600 shrink-0" size={20} /> :
              <Square className="text-gray-300 dark:text-gray-600 shrink-0" size={20} />
            }
            <span className={`text-sm font-medium transition-colors ${step.completed
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-gray-400 dark:text-gray-600'
              }`}>
              {index + 1}. {step.task}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="h-4 rounded-full overflow-hidden mb-4 relative bg-gray-100 dark:bg-[#1a1c1e]">
        <div
          className="bg-teal-600 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
          {progress}%
        </span>
      </div>

      <div className="space-y-3">
        {/* New "View Full Guide" Button */}
        <button 
          onClick={() => navigate(`/guides/${slug}`)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border-2
            text-teal-700 border-teal-600 hover:bg-teal-50
            dark:text-teal-500 dark:border-teal-700 dark:hover:bg-teal-900/20"
        >
          View Full Guide
          <ArrowRight size={14} />
        </button>

        {/* Existing Register Button */}
        <button className="w-full bg-teal-700 text-white text-xs py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-teal-800 transition-colors">
          Register / Login to Track Your Progress
        </button>
      </div>
    </div>
  );
};

export default ChecklistCard;
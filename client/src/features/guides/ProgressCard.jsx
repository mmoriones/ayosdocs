import { Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgressCard = ({ title, steps, slug, onDelete }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();
  
  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedCount / totalSteps) * 100);

  const handleDelete = async (e) => {
      e.stopPropagation();
      
      if (window.confirm(`Stop tracking "${title}"?`)) {
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          const response = await fetch(`${API_URL}/api/user/delete/${slug}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${storedUser.token}` }
          });

          if (response.ok) {
            // Trigger the parent's function to update the UI immediately
            onDelete(slug); 
          }
        } catch (error) {
          console.error("Delete failed:", error);
        }
      }
    };

  return (
    <div 
      onClick={() => navigate(`/guides/${slug}`)}
      className="group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 
                 bg-white border-gray-100 hover:border-teal-500 hover:shadow-md
                 dark:bg-[#242729] dark:border-gray-800 dark:hover:border-teal-600"
    >
      {/* Progress Ring */}
      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24" cy="24" r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="24" cy="24" r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * progress) / 100}
            className="text-teal-600 transition-all duration-500"
          />
        </svg>
        <span className="absolute text-[10px] font-black dark:text-white">
          {progress}%
        </span>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold truncate uppercase tracking-tight text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {completedCount}/{totalSteps} steps
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Remove Guide"
        >
          <Trash2 size={16} />
        </button>
        
        <div className="p-2 text-gray-300 group-hover:text-teal-500 transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
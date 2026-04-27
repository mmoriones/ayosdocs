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

        const response = await fetch(
          `${API_URL}/api/user/delete/${slug}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${storedUser.token}`
            }
          }
        );

        if (response.ok) {
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
      className="
        group bg-white border border-gray-100 rounded-2xl p-5 
        shadow-sm 
        hover:shadow-md hover:-translate-y-0.5 
        transition-all duration-200 ease-out
        cursor-pointer flex flex-col justify-between
      ">

      {/* TOP */}
      <div className="flex items-start justify-between mb-4">

        {/* ICON + TITLE */}
        <div className="flex items-start gap-3">

          {/* ICON (placeholder for now) */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-500">
              {title.charAt(0)}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase text-gray-800 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {completedCount} / {totalSteps} steps
            </p>
          </div>

        </div>

        {/* PERCENT BADGE */}
        <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
          {progress}%
        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="mb-4">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between">

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>

        <div className="p-2 text-gray-300 group-hover:text-teal-600 transition-colors">
          <ChevronRight size={20} />
        </div>

      </div>
    </div>
  );
};

export default ProgressCard;

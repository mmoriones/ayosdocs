import { useState, useRef, useEffect } from 'react';
import { Bookmark, MoreVertical, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';

/**
 * GuideRowCard Component
 * High-density horizontal list item for individual guide tracking.
 */
const GuideRowCard = ({ guide, progress, steps = [], onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const percentage = Math.round((progress.completedCount / progress.totalCount) * 100) || 0;
  const status = percentage === 100 ? 'Completed' : 'In Progress';

  // Next step logic: Find the first task that is not completed
  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  // Handle click outside to close context menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      onClick={() => navigate(`/guides/${guide.slug}`)}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
    >
      <div className="flex items-center gap-5">
        {/* Guide Icon */}
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2.5 group-hover:bg-teal-50 transition-colors">
          <img src={getGuideIcon(guide.slug)} alt="" className="w-full h-full object-contain" />
        </div>
        
        {/* Title and Status/Next Step */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-teal-700 transition-colors">
              {guide.title}
            </h3>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
              status === 'Completed' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600'
            }`}>
              {status}
            </span>
          </div>
          
          {/* Dynamic Insight: Shows completion badge or next actionable step */}
          {status === 'Completed' ? (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Check size={12} strokeWidth={4} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Requirement complete</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-tight">Next:</span>
              <p className="text-[11px] text-gray-600 truncate font-medium">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Last updated: May 8, 2026
            </p>
          )}
        </div>

        {/* Progress Bar and Actions */}
        <div className="flex items-center gap-8 px-4">
          <div className="w-40 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{progress.completedCount} of {progress.totalCount} steps</span>
              <span className="text-gray-900">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  status === 'Completed' ? 'bg-purple-500' : 'bg-teal-500'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            {/* Direct Delete Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="hover:text-red-500 transition-colors p-1"
              title="Remove from progress"
            >
              <Trash2 size={18} />
            </button>
            
            {/* Bookmark Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="hover:text-teal-600 transition-colors p-1"
            >
              <Bookmark size={18} />
            </button>
            
            {/* Context Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`hover:text-gray-600 transition-colors p-1 ${isMenuOpen ? 'text-gray-900' : ''}`}
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Remove from progress
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRowCard;

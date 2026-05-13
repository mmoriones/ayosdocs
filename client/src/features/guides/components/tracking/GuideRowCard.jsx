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
      className="bg-ctp-mantle rounded-[2rem] p-5 border border-ctp-surface0 shadow-sm hover:shadow-xl hover:border-ctp-green/30 transition-all group relative cursor-pointer"
    >
      <div className="flex items-center gap-6">
        {/* Guide Icon */}
        <div className="w-14 h-14 rounded-2xl bg-ctp-base flex items-center justify-center p-3 group-hover:scale-110 transition-transform shadow-inner border border-ctp-surface0">
          <img src={getGuideIcon(guide.slug)} alt="" className="w-full h-full object-contain" />
        </div>
        
        {/* Title and Status/Next Step */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-[16px] font-black text-ctp-text truncate group-hover:text-ctp-green transition-colors uppercase tracking-tight">
              {guide.title}
            </h3>
            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border ${
              status === 'Completed' 
                ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                : 'bg-ctp-green/10 text-ctp-green border-ctp-green/20'
            }`}>
              {status}
            </span>
          </div>
          
          {/* Dynamic Insight: Shows completion badge or next actionable step */}
          {status === 'Completed' ? (
            <div className="flex items-center gap-2 text-ctp-green">
              <Check size={14} strokeWidth={4} />
              <span className="text-[10px] font-black uppercase tracking-widest">Requirement complete</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-ctp-green uppercase tracking-widest">Next:</span>
              <p className="text-[13px] text-ctp-subtext1 truncate font-bold">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-[10px] text-ctp-subtext0 font-black uppercase tracking-[0.2em]">
              Ready to begin
            </p>
          )}
        </div>

        {/* Progress Bar and Actions */}
        <div className="flex items-center gap-10 px-4">
          <div className="w-48 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-80">{progress.completedCount} of {progress.totalCount} steps</span>
              <span className="text-ctp-text">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-ctp-base rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)] ${
                  status === 'Completed' ? 'bg-ctp-mauve shadow-ctp-mauve/20' : 'bg-ctp-green shadow-ctp-green/20'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Delete Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-red hover:bg-ctp-red/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
              title="Remove from progress"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
            
            {/* Bookmark Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-green hover:bg-ctp-green/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
            >
              <Bookmark size={18} strokeWidth={2.5} />
            </button>
            
            {/* Context Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-text transition-all flex items-center justify-center active:scale-90 shadow-sm ${isMenuOpen ? 'text-ctp-text bg-ctp-mantle' : ''}`}
              >
                <MoreVertical size={18} strokeWidth={2.5} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface0 py-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 mb-2 border-b border-ctp-surface0">
                    <p className="text-[9px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">Options</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-ctp-red hover:bg-ctp-red/10 transition-colors uppercase tracking-widest"
                  >
                    <Trash2 size={14} strokeWidth={3} />
                    Remove from tracker
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

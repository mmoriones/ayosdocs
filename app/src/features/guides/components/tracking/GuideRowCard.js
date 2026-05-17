'use client';

import { useState, useRef, useEffect } from 'react';
import { Bookmark, MoreVertical, Trash2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getGuideIcon } from '@/lib/guideIcons';
import Image from 'next/image';

/**
 * GuideRowCard Component
 * High-density horizontal list item for individual guide tracking.
 */
const GuideRowCard = ({ guide, progress, steps = [], onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const percentage = Math.round((progress.completedCount / progress.totalCount) * 100) || 0;
  const status = percentage === 100 ? 'Completed' : 'In Progress';

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

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
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-lg bg-ctp-mantle flex items-center justify-center p-3 group-hover:scale-105 transition-transform border border-ctp-surface1">
          <Image src={getGuideIcon(guide.slug, guide.agency)} alt={guide.title} width={40} height={40} className="w-full h-full object-contain" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-1">
            <h3 className="text-lg font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors tracking-tight">
              {guide.title}
            </h3>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider border ${
              status === 'Completed' 
                ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
            }`}>
              {status}
            </span>
          </div>
          
          {status === 'Completed' ? (
            <div className="flex items-center gap-2 text-ctp-mauve">
              <Check size={14} strokeWidth={3} />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Requirement complete</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ctp-sky-800 uppercase tracking-wider">Next:</span>
              <p className="text-sm text-ctp-subtext1 truncate font-medium">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-xs text-ctp-subtext0 font-semibold uppercase tracking-wider">
              Ready to begin journey
            </p>
          )}
        </div>

        <div className="flex items-center gap-8 px-4">
          <div className="w-48 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-ctp-subtext1 opacity-60">{progress.completedCount}/{progress.totalCount} steps</span>
              <span className="text-ctp-text">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  status === 'Completed' ? 'bg-ctp-mauve' : 'bg-ctp-sky-800'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-red hover:bg-ctp-red/10 transition-all flex items-center justify-center active:scale-90"
              title="Remove from progress"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/10 transition-all flex items-center justify-center active:scale-90"
            >
              <Bookmark size={18} strokeWidth={2.5} />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text transition-all flex items-center justify-center active:scale-90 ${isMenuOpen ? 'text-ctp-text bg-ctp-mantle' : ''}`}
              >
                <MoreVertical size={18} strokeWidth={2.5} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-ctp-base rounded-xl shadow-lg border border-ctp-surface1 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-1.5 mb-1 border-b border-ctp-surface1">
                    <p className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest">Options</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-ctp-red hover:bg-ctp-red/5 transition-colors uppercase tracking-wider"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                    Remove tracker
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

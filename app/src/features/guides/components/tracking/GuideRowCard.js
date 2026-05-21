'use client';

import { useState, useRef, useEffect } from 'react';
import { Bookmark, MoreVertical, Trash2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GuideIcon } from '@/lib/guideIcons';

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
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all group relative cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
          <GuideIcon slug={guide.slug} agency={guide.agency} className="w-6 h-6 text-ctp-sky-800" strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors tracking-tight leading-none">
              {guide.title}
            </h3>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${
              status === 'Completed' 
                ? 'bg-ctp-green/10 text-ctp-green border-ctp-green/20' 
                : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
            }`}>
              {status}
            </span>
          </div>
          
          {status === 'Completed' ? (
            <div className="flex items-center gap-2 text-ctp-green opacity-80">
              <Check size={12} strokeWidth={3} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Requirement verified</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest">Up next:</span>
              <p className="text-xs text-ctp-subtext1 truncate font-medium">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest opacity-60">
              Ready to start workflow
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 shrink-0 px-4">
          <div className="w-40 space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-60">{progress.completedCount}/{progress.totalCount} steps</span>
              <span className="text-ctp-text">{percentage}%</span>
            </div>
            <div className="h-1 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  status === 'Completed' ? 'bg-ctp-green' : 'bg-ctp-sky-800'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 transition-all flex items-center justify-center active:scale-90"
              title="Bookmark"
            >
              <Bookmark size={14} />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text hover:border-ctp-surface2 transition-all flex items-center justify-center active:scale-90 ${isMenuOpen ? 'text-ctp-text bg-ctp-mantle' : ''}`}
              >
                <MoreVertical size={14} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right p-1">
                  <div className="px-3 py-1.5 mb-1 border-b border-ctp-surface1">
                    <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">Actions</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-bold text-ctp-red hover:bg-ctp-red/5 transition-all uppercase tracking-widest"
                  >
                    <Trash2 size={14} />
                    Stop Tracking
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

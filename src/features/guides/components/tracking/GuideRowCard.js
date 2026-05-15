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
      className="bg-ctp-base rounded-[2.5rem] p-6 border border-ctp-surface0 soft-shadow soft-shadow-hover transition-all group relative cursor-pointer"
    >
      <div className="flex items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-ctp-mantle flex items-center justify-center p-4 group-hover:scale-110 transition-transform shadow-sm border border-ctp-surface0">
          <Image src={getGuideIcon(guide.slug, guide.agency)} alt={guide.title} width={40} height={40} className="w-full h-full object-contain" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-[18px] font-black text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors tracking-tight">
              {guide.title}
            </h3>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border ${
              status === 'Completed' 
                ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
            }`}>
              {status}
            </span>
          </div>
          
          {status === 'Completed' ? (
            <div className="flex items-center gap-2 text-ctp-mauve">
              <Check size={16} strokeWidth={4} />
              <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Requirement complete</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-ctp-sky-800 uppercase tracking-widest">Next Step:</span>
              <p className="text-[14px] text-ctp-subtext1 truncate font-bold">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-[11px] text-ctp-subtext0 font-black uppercase tracking-[0.2em]">
              Ready to begin journey
            </p>
          )}
        </div>

        <div className="flex items-center gap-12 px-4">
          <div className="w-56 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-60">{progress.completedCount} of {progress.totalCount} steps</span>
              <span className="text-ctp-text">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-ctp-mantle rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  status === 'Completed' ? 'bg-ctp-mauve shadow-[0_0_12px_rgba(136,57,239,0.3)]' : 'bg-ctp-sky-800 shadow-[0_0_12px_rgba(32,159,181,0.3)]'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-11 h-11 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-red hover:bg-ctp-red/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
              title="Remove from progress"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-11 h-11 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/10 transition-all flex items-center justify-center active:scale-90 shadow-sm"
            >
              <Bookmark size={20} strokeWidth={2.5} />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-11 h-11 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-text transition-all flex items-center justify-center active:scale-90 shadow-sm ${isMenuOpen ? 'text-ctp-text bg-ctp-mantle' : ''}`}
              >
                <MoreVertical size={20} strokeWidth={2.5} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-ctp-base rounded-2xl shadow-2xl border border-ctp-surface0 py-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-2 mb-2 border-b border-ctp-surface0">
                    <p className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">Options</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-[12px] font-black text-ctp-red hover:bg-ctp-red/10 transition-colors uppercase tracking-widest"
                  >
                    <Trash2 size={16} strokeWidth={3} />
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

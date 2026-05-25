'use client';

import { Trash2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GuideIcon } from '@/lib/guideIcons';
import { Skeleton, ProgressBar, DropdownMenu, DropdownMenuItem, BookmarkButton } from '@/components/ui';

/**
 * GuideRowCard Component
 * High-density horizontal list item for individual guide tracking.
 */
const GuideRowCard = ({ guide, progress, steps = [], onDelete, onFavorite }) => {
  const router = useRouter();
  const percentage = Math.round((progress.completedCount / progress.totalCount) * 100) || 0;
  const status = percentage === 100 ? 'Completed' : 'In Progress';
  const isFavorite = progress.isFavorite;

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  return (
    <div 
      onClick={() => router.push(`/guides/${guide.slug}`)}
      className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/70 transition-all group relative cursor-pointer"
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
            <span className={`text-ui-tiny font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${
              status === 'Completed' 
                ? 'bg-ctp-green/[0.07] text-ctp-green border-ctp-green/20' 
                : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
            }`}>
              {status}
            </span>
          </div>
          
          {status === 'Completed' ? (
            <div className="flex items-center gap-2 text-ctp-green opacity-70">
              <Check size={12} strokeWidth={3} />
              <span className="text-ui-micro font-bold uppercase tracking-widest">Requirement verified</span>
            </div>
          ) : nextStep ? (
            <div className="flex items-center gap-2">
              <span className="text-ui-micro font-bold text-ctp-sky-800 uppercase tracking-widest">Up next:</span>
              <p className="text-xs text-ctp-subtext1 truncate font-medium">{nextStep.task}</p>
            </div>
          ) : (
            <p className="text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-widest opacity-60">
              Ready to start workflow
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 shrink-0 px-4">
          <div className="w-40 space-y-2">
            <div className="flex items-center justify-between text-ui-tiny font-bold uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-60">{progress.completedCount}/{progress.totalCount} steps</span>
              <span className="text-ctp-text">{percentage}%</span>
            </div>
            <ProgressBar
              value={percentage}
              size="sm"
              color={status === 'Completed' ? 'green' : 'sky'}
            />
          </div>

          <div className="flex items-center gap-2">
            <BookmarkButton
              isFavorite={isFavorite}
              onClick={onFavorite}
              variant="bare"
            />
            
            <DropdownMenu
              trigger={
                <button 
                  className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text hover:border-ctp-surface2 transition-all flex items-center justify-center active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
              }
              align="right"
            >
              <DropdownMenuItem
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(); 
                }}
                variant="danger"
                icon={Trash2}
              >
                Stop Tracking
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

GuideRowCard.Skeleton = function GuideRowCardSkeleton() {
  return (
    <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm flex items-center gap-6 w-full">
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="hidden md:flex items-center gap-8 shrink-0 px-4">
        <div className="w-40 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-12 h-2" />
            <Skeleton className="w-8 h-2" />
          </div>
          <Skeleton className="w-full h-1 rounded-full" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
};

export default GuideRowCard;

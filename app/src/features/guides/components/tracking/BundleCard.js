import { ChevronRight, Layers, Trash2, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBundleIcon } from '@/lib/bundleIcons';
import Skeleton from '@/components/ui/Skeleton';
import ProgressBar from '@/components/ui/ProgressBar';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui';

/**
 * BundleCard Component
 * Displays a life event bundle with aggregate progress.
 */
const BundleCard = ({ bundle, progress, onDelete }) => {
  const router = useRouter();
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <div 
      onClick={() => router.push(`/bundles/${bundle.id}`)}
      className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/70 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex gap-5 items-start">
        <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center group-hover:scale-105 transition-transform border border-ctp-surface1 shrink-0 shadow-inner">
          {getBundleIcon(bundle.id, { size: 20, className: "text-ctp-sky-800" })}
        </div>
        
        <div className="flex-1 min-w-0 space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-ui-tiny font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${
                  percentage === 100 
                    ? 'bg-ctp-green/[0.07] text-ctp-green border-ctp-green/20' 
                    : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
                }`}>
                  {percentage === 100 ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={12} className="text-ctp-subtext0" />
                  {bundle.flow.length} Stages
                </span>
              </div>
              <h3 className="text-base font-bold text-ctp-text truncate tracking-tight group-hover:text-ctp-sky-800 transition-colors leading-tight">{bundle.title}</h3>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {onDelete && (
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button 
                        className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text hover:border-ctp-surface2 transition-all flex items-center justify-center active:scale-90"
                      >
                        <MoreVertical size={14} />
                      </button>
                    }
                    align="right"
                  >
                    <DropdownMenuItem
                      onClick={() => onDelete(bundle.id)}
                      variant="danger"
                      icon={Trash2}
                    >
                      Stop Tracking
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              )}
              <div className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-0.5">
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-ui-micro font-bold uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-80">{progress.completed} of {progress.total} guides</span>
              <span className="text-ctp-sky-800">{percentage}%</span>
            </div>
            <ProgressBar
              value={percentage}
              size="sm"
              color={percentage === 100 ? 'green' : 'sky'}
            />
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
            {bundle.flow.slice(0, 3).map((step, idx) => {
              const isCurrent = idx === 0 && percentage < 100;
              return (
                <div key={idx} className="flex items-center gap-1.5 opacity-80">
                   <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-ctp-sky-800 animate-pulse' : 'bg-ctp-surface1'}`} />
                   <span className={`text-ui-tiny font-bold uppercase tracking-tight ${isCurrent ? 'text-ctp-text' : 'text-ctp-subtext1'}`}>{step.label}</span>
                </div>
              );
            })}
            {bundle.flow.length > 3 && (
              <span className="text-ui-tiny font-bold text-ctp-subtext1 uppercase tracking-widest">+{bundle.flow.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm flex flex-col h-full space-y-4">
      <div className="flex gap-5 items-start">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <Skeleton className="w-16 h-3.5 rounded-md" />
                <Skeleton className="w-16 h-3" />
              </div>
              <Skeleton className="w-3/4 h-5" />
            </div>
            <Skeleton className="w-4 h-4 rounded-md shrink-0" />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between">
               <Skeleton className="w-24 h-2.5" />
               <Skeleton className="w-8 h-2.5" />
             </div>
             <Skeleton className="w-full h-1.5 rounded-full" />
          </div>
          <div className="flex gap-3 pt-1">
            <Skeleton className="w-16 h-2.5" />
            <Skeleton className="w-16 h-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;

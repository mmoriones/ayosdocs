import { ChevronRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBundleIcon } from '@/lib/bundleIcons';

/**
 * BundleCard Component
 * Displays a life event bundle with aggregate progress.
 */
const BundleCard = ({ bundle, progress }) => {
  const router = useRouter();
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <div 
      onClick={() => router.push(`/bundles/${bundle.id}`)}
      className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex gap-5 items-start">
        <div className="w-12 h-12 rounded-lg bg-ctp-mantle flex items-center justify-center group-hover:scale-105 transition-transform border border-ctp-surface1 shrink-0 shadow-inner">
          {getBundleIcon(bundle.id, { size: 20, className: "text-ctp-sky-800" })}
        </div>
        
        <div className="flex-1 min-w-0 space-y-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${
                  percentage === 100 
                    ? 'bg-ctp-green/10 text-ctp-green border-ctp-green/20' 
                    : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
                }`}>
                  {percentage === 100 ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={12} className="text-ctp-subtext0" />
                  {bundle.flow.length} Stages
                </span>
              </div>
              <h3 className="text-base font-bold text-ctp-text truncate tracking-tight group-hover:text-ctp-sky-800 transition-colors leading-tight">{bundle.title}</h3>
            </div>
            
            <div className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-0.5 shrink-0">
              <ChevronRight size={16} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-80">{progress.completed} of {progress.total} guides</span>
              <span className="text-ctp-sky-800">{percentage}%</span>
            </div>
            <div className="h-1 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  percentage === 100 ? 'bg-ctp-green' : 'bg-ctp-sky-800 shadow-[0_0_8px_rgba(4,165,229,0.3)]'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
            {bundle.flow.slice(0, 3).map((step, idx) => {
              const isCurrent = idx === 0 && percentage < 100;
              return (
                <div key={idx} className="flex items-center gap-1.5 opacity-80">
                   <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-ctp-sky-800 animate-pulse' : 'bg-ctp-surface1'}`} />
                   <span className={`text-[9px] font-bold uppercase tracking-tight ${isCurrent ? 'text-ctp-text' : 'text-ctp-subtext1'}`}>{step.label}</span>
                </div>
              );
            })}
            {bundle.flow.length > 3 && (
              <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">+{bundle.flow.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;

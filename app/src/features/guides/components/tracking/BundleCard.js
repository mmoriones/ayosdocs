import { ChevronRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      className="bg-ctp-base rounded-xl p-6 border border-ctp-surface1 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-16 h-16 rounded-lg bg-ctp-mantle flex items-center justify-center text-3xl group-hover:scale-105 transition-transform border border-ctp-surface1 shrink-0">
          {bundle.icon}
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider border ${
                  percentage === 100 
                    ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                    : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
                }`}>
                  {percentage === 100 ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-xs font-bold text-ctp-subtext0 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={12} />
                  {bundle.flow.length} Stages
                </span>
              </div>
              <h3 className="text-lg font-bold text-ctp-text truncate tracking-tight group-hover:text-ctp-sky-800 transition-colors">{bundle.title}</h3>
            </div>
            
            <div className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-1">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-ctp-subtext1 opacity-60">{progress.completed} of {progress.total} guides completed</span>
              <span className="text-ctp-sky-800">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-ctp-mantle rounded-full overflow-hidden border border-ctp-surface1">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  percentage === 100 ? 'bg-ctp-mauve' : 'bg-ctp-sky-800'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            {bundle.flow.map((step, idx) => {
              return (
                <div key={idx} className="flex items-center gap-1">
                   <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 && percentage < 100 ? 'bg-ctp-sky-800 animate-pulse' : 'bg-ctp-surface1'}`} />
                   <span className="text-[10px] font-semibold text-ctp-subtext1 uppercase tracking-tight">{step.label}</span>
                   {idx < bundle.flow.length - 1 && <ChevronRight size={8} className="text-ctp-surface2" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;

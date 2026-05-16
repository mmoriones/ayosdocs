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
      className="bg-ctp-base rounded-[2.5rem] p-8 border border-ctp-surface0 soft-shadow soft-shadow-hover transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-20 h-20 rounded-2xl bg-ctp-mantle flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-sm border border-ctp-surface0 shrink-0">
          {bundle.icon}
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-[0.2em] border ${
                  percentage === 100 
                    ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                    : 'bg-ctp-sky-800/10 text-ctp-sky-800 border-ctp-sky-800/20'
                }`}>
                  {percentage === 100 ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-[9px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] flex items-center gap-1">
                  <Layers size={12} />
                  {bundle.flow.length} Stages
                </span>
              </div>
              <h3 className="text-[22px] font-black text-ctp-text truncate uppercase tracking-tight group-hover:text-ctp-sky-800 transition-colors">{bundle.title}</h3>
            </div>
            
            <div className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-1">
              <ChevronRight size={24} strokeWidth={3} />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-60">{progress.completed} of {progress.total} guides completed</span>
              <span className="text-ctp-sky-800">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-ctp-mantle rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  percentage === 100 ? 'bg-ctp-mauve shadow-[0_0_12px_rgba(136,57,239,0.2)]' : 'bg-ctp-sky-800'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            {bundle.flow.map((step, idx) => {
              // This is a simplified check for step completion for UI feedback
              return (
                <div key={idx} className="flex items-center gap-1">
                   <div className={`w-2 h-2 rounded-full ${idx === 0 && percentage < 100 ? 'bg-ctp-sky-800 animate-pulse' : 'bg-ctp-surface0'}`} />
                   <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-tighter">{step.label}</span>
                   {idx < bundle.flow.length - 1 && <ChevronRight size={8} className="text-ctp-surface1" />}
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

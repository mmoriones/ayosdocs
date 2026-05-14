import { ChevronRight } from 'lucide-react';

/**
 * BundleCard Component
 * Displays a life event bundle with aggregate progress.
 */
const BundleCard = ({ bundle, progress }) => {
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <div className="bg-ctp-base rounded-[2.5rem] p-8 border border-ctp-surface0 soft-shadow soft-shadow-hover transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 rounded-2xl bg-ctp-mantle flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-sm border border-ctp-surface0">
            {bundle.icon}
          </div>
          <div className="text-ctp-subtext1 group-hover:text-ctp-sapphire transition-colors">
            <ChevronRight size={24} strokeWidth={3} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <div className="space-y-1">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border ${
              percentage === 100 
                ? 'bg-ctp-mauve/10 text-ctp-mauve border-ctp-mauve/20' 
                : 'bg-ctp-sapphire/10 text-ctp-sapphire border-ctp-sapphire/20'
            }`}>
              {percentage === 100 ? 'Completed' : 'In Progress'}
            </span>
            <h3 className="text-[22px] font-black text-ctp-text truncate uppercase tracking-tight">{bundle.title}</h3>
            <p className="text-[14px] text-ctp-subtext1 font-medium line-clamp-2 opacity-80">{bundle.description}</p>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-ctp-subtext1 opacity-60">{progress.completed} of {progress.total} completed</span>
              <span className="text-ctp-sapphire">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-ctp-mantle rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  percentage === 100 ? 'bg-ctp-mauve shadow-[0_0_12px_rgba(136,57,239,0.2)]' : 'bg-ctp-sapphire'
                }`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;

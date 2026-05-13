import { ChevronRight } from 'lucide-react';

/**
 * BundleCard Component
 * Displays a life event bundle with aggregate progress.
 */
const BundleCard = ({ bundle, progress }) => {
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <div className="bg-ctp-mantle rounded-[2rem] p-6 border border-ctp-surface0 shadow-sm hover:shadow-xl hover:border-ctp-green/30 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-ctp-base flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-ctp-surface0">
          {bundle.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-ctp-green bg-ctp-green/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-ctp-green/20">
              {percentage === 100 ? 'Completed' : 'In Progress'}
            </span>
            <div className="text-ctp-subtext1 group-hover:text-ctp-green transition-colors">
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          </div>
          <h3 className="text-[18px] font-black text-ctp-text truncate uppercase tracking-tight mb-1">{bundle.title}</h3>
          <p className="text-[13px] text-ctp-subtext1 font-medium line-clamp-1 mb-4">{bundle.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-ctp-subtext1">{progress.completed} of {progress.total} completed</span>
              <span className="text-ctp-green">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-ctp-base rounded-full overflow-hidden shadow-inner border border-ctp-surface0">
              <div 
                className="h-full bg-ctp-green rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(166,227,161,0.3)]" 
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

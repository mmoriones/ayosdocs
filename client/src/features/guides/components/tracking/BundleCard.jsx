import { ChevronRight } from 'lucide-react';

/**
 * BundleCard Component
 * Displays a life event bundle with aggregate progress.
 */
const BundleCard = ({ bundle, progress }) => {
  const percentage = Math.round((progress.completed / progress.total) * 100) || 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {bundle.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-gray-900 truncate">{bundle.title}</h3>
            <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              In Progress
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium truncate mb-4">{bundle.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
              <span className="text-gray-400">{progress.completed} of {progress.total} completed</span>
              <span className="text-teal-600">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-gray-300 group-hover:text-teal-500 transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default BundleCard;

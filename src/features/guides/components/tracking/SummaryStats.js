import { LayoutGrid, CheckCircle2, Star, Clock } from 'lucide-react';

/**
 * SummaryStats Component
 * Displays top-level progress statistics in card format.
 */
const SummaryStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'Active Bundles', 
      value: stats.activeBundles || 0, 
      sub: 'Workflows active', 
      icon: Clock, 
      color: 'text-ctp-green', 
      bg: 'bg-ctp-green/10',
      progress: 0
    },
    { 
      label: 'In Progress', 
      value: stats.inProgress || 0, 
      sub: 'Keep going!', 
      icon: LayoutGrid, 
      color: 'text-ctp-sky-800', 
      bg: 'bg-ctp-sky-800/10',
      progress: 65 
    },
    { 
      label: 'Completed', 
      value: stats.completed || 0, 
      sub: 'Great job!', 
      icon: CheckCircle2, 
      color: 'text-ctp-mauve', 
      bg: 'bg-ctp-mauve/10',
      progress: 100
    },
    { 
      label: 'Favorites', 
      value: stats.favorites || 0, 
      sub: 'Saved guides', 
      icon: Star, 
      color: 'text-ctp-orange', 
      bg: 'bg-ctp-orange/10',
      progress: 0
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-ctp-mantle rounded-3xl p-6 border border-ctp-surface0 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black text-ctp-text tracking-tight">{item.value}</span>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-ctp-text uppercase tracking-widest">{item.label}</h4>
            <p className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest mt-1 opacity-80">{item.sub}</p>
          </div>
          {item.progress > 0 && (
            <div className="mt-5 h-1.5 w-full bg-ctp-base rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full ${item.color.replace('text', 'bg')} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;

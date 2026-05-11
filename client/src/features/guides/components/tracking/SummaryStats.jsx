import { LayoutGrid, CheckCircle2, Star, Clock } from 'lucide-react';

/**
 * SummaryStats Component
 * Displays top-level progress statistics in card format.
 */
const SummaryStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'In Progress', 
      value: stats.inProgress || 0, 
      sub: 'Keep going!', 
      icon: LayoutGrid, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50',
      progress: 65 // Visual placeholder
    },
    { 
      label: 'Completed', 
      value: stats.completed || 0, 
      sub: 'Great job!', 
      icon: CheckCircle2, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      progress: 100
    },
    { 
      label: 'Favorites', 
      value: stats.favorites || 0, 
      sub: 'Saved guides', 
      icon: Star, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      progress: 0
    },
    { 
      label: 'Expiring Soon', 
      value: stats.expiring || 0, 
      sub: 'Take action soon', 
      icon: Clock, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      progress: 20
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>
            <span className="text-2xl font-black text-gray-900">{item.value}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">{item.label}</h4>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">{item.sub}</p>
          </div>
          {item.progress > 0 && (
            <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color.replace('text', 'bg')} transition-all duration-1000`} 
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

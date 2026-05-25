import { LayoutGrid, CheckCircle2, Star, Clock } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

/**
 * SummaryStats Component
 * Displays top-level progress statistics in high-density cards.
 */
const SummaryStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'Active Bundles', 
      value: stats.activeBundles || 0, 
      sub: 'Bundles active', 
      icon: Clock, 
      color: 'text-ctp-sky-800', 
      bg: 'bg-ctp-sky-800/10',
      border: 'border-ctp-sky-800/20'
    },
    { 
      label: 'In Progress', 
      value: stats.inProgress || 0, 
      sub: 'Guides tracked', 
      icon: LayoutGrid, 
      color: 'text-ctp-sky-800', 
      bg: 'bg-ctp-sky-800/10',
      border: 'border-ctp-sky-800/20'
    },
    { 
      label: 'Completed', 
      value: stats.completed || 0, 
      sub: 'All tasks done', 
      icon: CheckCircle2, 
      color: 'text-ctp-green', 
      bg: 'bg-ctp-green/[0.07]',
      border: 'border-ctp-green/20'
    },
    { 
      label: 'Favorites', 
      value: stats.favorites || 0, 
      sub: 'Saved items', 
      icon: Star, 
      color: 'text-ctp-orange', 
      bg: 'bg-ctp-orange/10',
      border: 'border-ctp-orange/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div key={item.label} className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center border ${item.border} group-hover:scale-105 transition-transform shadow-inner`}>
              <item.icon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-ctp-text tracking-tight leading-none">{item.value}</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest leading-none">{item.label}</h4>
            <p className="text-ui-micro font-bold text-ctp-subtext0 opacity-50 uppercase tracking-tight">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

SummaryStats.Skeleton = function SummaryStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-ctp-mantle/50 rounded-xl p-5 border border-ctp-surface1 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-12 h-8 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-20 h-2.5" />
            <Skeleton className="w-24 h-2.5 opacity-40" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;

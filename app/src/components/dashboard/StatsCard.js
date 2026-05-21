'use client';

/**
 * Simple metrics card for the dashboard overview.
 * Displays a value, label, icon, and optional trend indicator.
 * 
 * @param {Object} props
 * @param {string} props.label - Metric name (e.g., "Active Guides")
 * @param {string} props.value - Numeric or text value to display
 * @param {import('lucide-react').LucideIcon} props.icon - Icon component
 * @param {'up' | 'down'} [props.trend] - Direction of the trend
 * @param {string} [props.trendValue] - Text describing the trend (e.g., "+5%")
 */
export default function StatsCard({ label, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="bg-ctp-base border border-ctp-surface1 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 border border-ctp-sky-800/20">
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-ctp-green/10 text-ctp-green' : 'bg-ctp-yellow/10 text-ctp-yellow'
          }`}>
            {trendValue}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-ctp-text tracking-tight">{value}</p>
      </div>
    </div>
  );
}

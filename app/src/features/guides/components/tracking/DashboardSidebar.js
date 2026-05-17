'use client';

import { Calendar, ChevronRight, Zap, ListChecks, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * DashboardSidebar Component
 */
const DashboardSidebar = () => {
  const router = useRouter();
  return (
    <aside className="w-full lg:w-[380px] shrink-0 space-y-6">
      
      <section className="bg-ctp-mantle rounded-xl p-6 border border-ctp-surface1 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-ctp-surface1">
          <h3 className="text-xs font-bold text-ctp-subtext0 uppercase tracking-wider">Upcoming Reminders</h3>
          <button 
            onClick={() => router.push('/coming-soon')}
            className="text-xs font-bold text-ctp-sky-800 hover:underline uppercase tracking-wider transition-all"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 group-hover:bg-ctp-sky-800/10 group-hover:text-ctp-sky-800 transition-all shrink-0">
              <Calendar size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-ctp-text leading-tight tracking-tight">Passport Appointment</h4>
              <p className="text-xs text-ctp-subtext1 mt-1.5 leading-relaxed">You have no appointment yet. Consider booking early.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-ctp-peach/10 border border-ctp-peach/20 flex items-center justify-center text-ctp-peach shrink-0">
              <Clock size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-ctp-text leading-tight tracking-tight uppercase">Driver&apos;s License</h4>
              <p className="text-xs text-ctp-subtext0 mt-1.5 font-bold uppercase tracking-wider opacity-80">Expires Jun 12, 2026</p>
              <p className="text-xs text-ctp-peach font-bold mt-1 uppercase tracking-tight animate-pulse">28 days left</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ctp-mantle rounded-xl p-6 border border-ctp-surface1 shadow-sm">
        <h3 className="text-xs font-bold text-ctp-subtext0 uppercase tracking-wider mb-6">Next Best Steps</h3>
        
        <div className="space-y-2">
          {[
            { title: 'Schedule DFA appointment', sub: 'Passport Appointment', icon: Calendar },
            { title: 'Register online account', sub: 'SSS Registration', icon: Zap },
            { title: 'Check requirements', sub: 'PhilHealth ID', icon: ListChecks },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-lg hover:bg-ctp-base border border-transparent hover:border-ctp-surface1 transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-lg bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 shrink-0">
                <step.icon size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-ctp-text truncate tracking-tight">{step.title}</h4>
                <p className="text-[10px] text-ctp-subtext1 mt-1 truncate font-semibold uppercase tracking-wider opacity-70">{step.sub}</p>
              </div>
              <ChevronRight size={14} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-1" />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => router.push('/coming-soon')}
          className="w-full mt-6 py-3 text-xs font-bold text-ctp-sky-800 border border-ctp-sky-800/20 rounded-lg hover:bg-ctp-sky-800/5 transition-all uppercase tracking-wider active:scale-[0.98]"
        >
          View recommendations
        </button>
      </section>

      <section className="bg-ctp-mantle rounded-xl p-6 border border-ctp-surface1 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-ctp-subtext0 uppercase tracking-wider">Activity</h3>
          <select className="text-[10px] font-bold text-ctp-sky-800 bg-ctp-base border border-ctp-surface1 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-ctp-sky-800/20 transition-all cursor-pointer uppercase tracking-wider">
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="space-y-5">
          {[
            { label: 'Guides started', value: '5', icon: ListChecks },
            { label: 'Steps completed', value: '18', icon: CheckCircle2 },
            { label: 'Guides finished', value: '2', icon: CheckCircle2, color: 'text-ctp-mauve' },
            { label: 'Time spent', value: '2h 45m', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center ${item.color || 'text-ctp-subtext1'}`}>
                  <item.icon size={12} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-ctp-subtext1 uppercase tracking-tight">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-ctp-text tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => router.push('/coming-soon')}
          className="w-full mt-6 py-3 text-xs font-bold text-ctp-subtext1 border border-ctp-surface1 rounded-lg hover:bg-ctp-base hover:text-ctp-text transition-all uppercase tracking-wider active:scale-[0.98]"
        >
          Full Activity log
        </button>
      </section>

      <section className="bg-ctp-sky-800 rounded-xl p-6 text-ctp-base relative overflow-hidden group border border-ctp-sky-800/20 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ctp-mantle/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700 blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 relative">
            <div className="absolute inset-0 bg-ctp-mantle/20 rounded-full blur-2xl opacity-50 animate-pulse" />
            <Image src="/assets/person.webp" alt="" width={96} height={96} className="w-full h-full object-contain relative z-10 drop-shadow-xl" />
          </div>
          <h3 className="text-lg font-bold mb-1.5 tracking-tight">Stay on track!</h3>
          <p className="text-ctp-base/90 text-[11px] leading-relaxed mb-6 max-w-[200px] font-medium">
            Small steps today lead to big accomplishments tomorrow.
          </p>
          <button className="w-full py-3.5 bg-ctp-base text-ctp-sky-800 rounded-lg font-bold text-xs shadow-xl hover:opacity-95 transition-all uppercase tracking-wider active:scale-95">
            Explore guides
          </button>
        </div>
      </section>

    </aside>
  );
};

export default DashboardSidebar;

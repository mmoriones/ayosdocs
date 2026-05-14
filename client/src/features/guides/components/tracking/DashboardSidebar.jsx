import { Calendar, ChevronRight, Zap, ListChecks, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import personImg from '../../../../assets/person.webp';

/**
 * DashboardSidebar Component
 * Container for dashboard utility widgets.
 */
const DashboardSidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-full lg:w-[380px] shrink-0 space-y-8">
      
      {/* Upcoming Reminders */}
      <section className="bg-ctp-mantle rounded-[2rem] p-8 border border-ctp-surface0 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">Upcoming Reminders</h3>
          <button 
            onClick={() => navigate('/coming-soon')}
            className="text-[10px] font-black text-ctp-sky-800 hover:underline uppercase tracking-widest transition-all"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-start gap-5 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-ctp-base border border-ctp-surface0 flex items-center justify-center text-ctp-subtext1 group-hover:bg-ctp-sky-800/10 group-hover:text-ctp-sky-800 transition-all shadow-sm shrink-0">
              <Calendar size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-black text-ctp-text leading-tight uppercase tracking-tight">Passport Appointment</h4>
              <p className="text-[11px] text-ctp-subtext1 mt-2 leading-relaxed font-medium">You have no appointment yet. Consider booking early.</p>
            </div>
          </div>

          <div className="flex items-start gap-5 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-ctp-peach/10 border border-ctp-peach/20 flex items-center justify-center text-ctp-peach shadow-sm shrink-0">
              <Clock size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-black text-ctp-text leading-tight uppercase tracking-tight">Driver's License</h4>
              <p className="text-[10px] text-ctp-subtext0 mt-2 font-black uppercase tracking-widest opacity-80">Expires Jun 12, 2026</p>
              <p className="text-[11px] text-ctp-peach font-black mt-1 uppercase tracking-tight animate-pulse">28 days left</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Best Steps */}
      <section className="bg-ctp-mantle rounded-[2rem] p-8 border border-ctp-surface0 shadow-sm">
        <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-8">Next Best Steps</h3>
        
        <div className="space-y-2">
          {[
            { title: 'Schedule DFA appointment', sub: 'Passport Appointment', icon: Calendar },
            { title: 'Register online account', sub: 'SSS Registration', icon: Zap },
            { title: 'Check requirements', sub: 'PhilHealth ID', icon: ListChecks },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ctp-base border border-transparent hover:border-ctp-surface0 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0">
                <step.icon size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-black text-ctp-text truncate uppercase tracking-tight">{step.title}</h4>
                <p className="text-[10px] text-ctp-subtext1 mt-1 truncate font-bold uppercase tracking-widest opacity-70">{step.sub}</p>
              </div>
              <ChevronRight size={16} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-1" />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => navigate('/coming-soon')}
          className="w-full mt-8 py-4 text-[11px] font-black text-ctp-sky-800 border border-ctp-sky-800/20 rounded-2xl hover:bg-ctp-sky-800/5 transition-all uppercase tracking-[0.2em] active:scale-[0.98] shadow-sm"
        >
          View recommendations
        </button>
      </section>

      {/* Activity Overview */}
      <section className="bg-ctp-mantle rounded-[2rem] p-8 border border-ctp-surface0 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">Activity</h3>
          <select className="text-[10px] font-black text-ctp-sky-800 bg-ctp-base border border-ctp-surface0 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-ctp-sky-800/20 transition-all cursor-pointer uppercase tracking-widest shadow-sm">
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Guides started', value: '5', icon: ListChecks },
            { label: 'Steps completed', value: '18', icon: CheckCircle2 },
            { label: 'Guides finished', value: '2', icon: CheckCircle2, color: 'text-ctp-mauve' },
            { label: 'Time spent', value: '2h 45m', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface0 flex items-center justify-center ${item.color || 'text-ctp-subtext1'} shadow-sm`}>
                  <item.icon size={14} strokeWidth={2.5} />
                </div>
                <span className="text-[12px] font-bold text-ctp-subtext1 uppercase tracking-tight">{item.label}</span>
              </div>
              <span className="text-[13px] font-black text-ctp-text tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/coming-soon')}
          className="w-full mt-8 py-4 text-[11px] font-black text-ctp-subtext1 border border-ctp-surface0 rounded-2xl hover:bg-ctp-base hover:text-ctp-text transition-all uppercase tracking-[0.2em] active:scale-[0.98] shadow-sm"
        >
          Full Activity log
        </button>
      </section>

      {/* Motivation Widget */}
      <section className="bg-ctp-sky-800 rounded-[2rem] p-8 text-ctp-base relative overflow-hidden group border border-ctp-sky-800/20 shadow-xl shadow-ctp-sky-800/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-ctp-mantle/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-125 duration-700 blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 bg-ctp-mantle/20 rounded-full blur-3xl opacity-50 animate-pulse" />
            <img src={personImg} alt="" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
          </div>
          <h3 className="text-[20px] font-black mb-2 uppercase tracking-tight">Stay on track!</h3>
          <p className="text-ctp-base/90 text-[12px] leading-relaxed mb-8 max-w-[200px] font-medium">
            Small steps today lead to big accomplishments tomorrow.
          </p>
          <button className="w-full py-4 bg-ctp-base text-ctp-sky-800 rounded-2xl font-black text-[11px] shadow-2xl hover:opacity-95 transition-all uppercase tracking-[0.2em] active:scale-95">
            Explore guides
          </button>
        </div>
      </section>

    </aside>
  );
};

export default DashboardSidebar;

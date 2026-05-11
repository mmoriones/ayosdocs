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
      <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-gray-900">Upcoming Reminders</h3>
          <button 
            onClick={() => navigate('/coming-soon')}
            className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-tight"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">Passport Appointment</h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">You have no appointment yet. Consider booking early.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">Driver's License Renewal</h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed uppercase tracking-tighter">Expires on Jun 12, 2026</p>
              <p className="text-[10px] text-orange-600 font-bold mt-0.5">28 days left</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Best Steps */}
      <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Next Best Steps</h3>
        
        <div className="space-y-1">
          {[
            { title: 'Schedule your DFA appointment', sub: 'For Passport Appointment', icon: Calendar },
            { title: 'Register online account', sub: 'For SSS Registration', icon: Zap },
            { title: 'Check requirements', sub: 'For PhilHealth ID', icon: ListChecks },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <step.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-gray-900 truncate leading-tight">{step.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{step.sub}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-600" />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => navigate('/coming-soon')}
          className="w-full mt-6 py-2.5 text-[10px] font-bold text-teal-600 border border-teal-100 rounded-xl hover:bg-teal-50 transition-all uppercase tracking-widest"
        >
          View all recommendations
        </button>
      </section>

      {/* Activity Overview */}
      <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-gray-900">Activity Overview</h3>
          <select className="text-[10px] font-bold text-teal-600 bg-transparent border-none focus:ring-0 cursor-pointer uppercase tracking-tight">
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Guides started', value: '5', icon: ListChecks },
            { label: 'Steps completed', value: '18', icon: CheckCircle2 },
            { label: 'Guides completed', value: '2', icon: CheckCircle2, color: 'text-purple-600' },
            { label: 'Time spent', value: '2h 45m', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3 text-gray-400">
                <item.icon size={16} className={item.color || ''} />
                <span className="text-[11px] font-medium text-gray-500">{item.label}</span>
              </div>
              <span className="text-[11px] font-black text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/coming-soon')}
          className="w-full mt-6 py-2.5 text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-widest"
        >
          View full activity
        </button>
      </section>

      {/* Motivation Widget */}
      <section className="bg-teal-900 rounded-3xl p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 mb-4 relative">
            <div className="absolute inset-0 bg-teal-800 rounded-full blur-2xl opacity-50" />
            <img src={personImg} alt="" className="w-full h-full object-contain relative z-10" />
          </div>
          <h3 className="text-base font-bold mb-2">Stay on track!</h3>
          <p className="text-teal-100/80 text-[10px] leading-relaxed mb-6 max-w-[180px]">
            Small steps today lead to big accomplishments tomorrow.
          </p>
          <button className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-teal-950/20 hover:bg-teal-500 transition-all uppercase tracking-widest active:scale-95">
            Explore more guides
          </button>
        </div>
      </section>

    </aside>
  );
};

export default DashboardSidebar;

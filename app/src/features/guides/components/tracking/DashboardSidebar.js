'use client';

import { useState } from 'react';
import { Calendar, ChevronRight, Zap, ListChecks, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Card, SortDropdown } from '@/components/ui';

/**
 * DashboardSidebar Component
 */
const DashboardSidebar = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  const monthOptions = [
    { label: 'May 2026', value: 'May 2026' },
    { label: 'April 2026', value: 'April 2026' }
  ];

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      
      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Reminders</h3>
          <Button 
            variant="link"
            onClick={() => router.push('/coming-soon')}
            className="text-ui-tiny uppercase tracking-widest"
          >
            View all
          </Button>
        </div>
        
        <div className="divide-y divide-ctp-surface1/50">
          <div className="p-4 hover:bg-ctp-mantle/30 transition-colors group cursor-pointer flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all shrink-0">
              <Calendar size={14} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-ctp-text tracking-tight">Passport Appointment</h4>
              <p className="text-ui-micro text-ctp-subtext1 mt-1 font-medium leading-tight">No appointment set yet.</p>
            </div>
          </div>

          <div className="p-4 hover:bg-ctp-mantle/30 transition-colors group cursor-pointer flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-ctp-peach/10 border border-ctp-peach/20 flex items-center justify-center text-ctp-peach shrink-0">
              <Clock size={14} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-ctp-text tracking-tight uppercase">Driver&apos;s License</h4>
              <p className="text-ui-tiny text-ctp-peach font-bold mt-1 uppercase tracking-tight animate-pulse">Expires in 28 days</p>
            </div>
          </div>
        </div>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Next Best Steps</h3>
        </div>
        
        <div className="p-1.5 space-y-0.5">
          {[
            { title: 'Schedule DFA appointment', sub: 'Passport Appointment', icon: Calendar },
            { title: 'Register online account', sub: 'SSS Registration', icon: Zap },
            { title: 'Check requirements', sub: 'PhilHealth ID', icon: ListChecks },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-ctp-mantle transition-all cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-ctp-sky-800/5 border border-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-inner">
                <step.icon size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-ctp-text truncate tracking-tight">{step.title}</h4>
                <p className="text-ui-tiny text-ctp-subtext1 mt-0.5 truncate font-bold uppercase tracking-widest opacity-60">{step.sub}</p>
              </div>
              <ChevronRight size={12} className="text-ctp-subtext1 group-hover:text-ctp-sky-800 transition-all group-hover:translate-x-0.5" />
            </div>
          ))}
        </div>
        
        <Button 
          variant="link"
          onClick={() => router.push('/coming-soon')}
          className="w-full rounded-none border-t border-ctp-surface1 text-ui-tiny uppercase tracking-widest py-3"
        >
          View recommendations
        </Button>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
          <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Activity</h3>
          <SortDropdown 
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={monthOptions}
            label=""
          />
        </div>

        <div className="p-4 space-y-4">
          {[
            { label: 'Guides started', value: '5', icon: ListChecks },
            { label: 'Steps completed', value: '18', icon: CheckCircle2 },
            { label: 'Guides finished', value: '2', icon: CheckCircle2, color: 'text-ctp-mauve' },
            { label: 'Time spent', value: '2.8h', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center ${item.color || 'text-ctp-subtext1'} shadow-inner`}>
                  <item.icon size={12} strokeWidth={2.5} />
                </div>
                <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-ctp-text tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>

        <Button 
          variant="link"
          onClick={() => router.push('/coming-soon')}
          className="w-full rounded-none border-t border-ctp-surface1 text-ui-tiny uppercase tracking-widest py-3"
        >
          View detailed log
        </Button>
      </Card>

      <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden group">
        <div className="p-4 border-b border-ctp-surface1 flex items-center gap-2">
          <Zap size={14} className="text-ctp-sky-800" />
          <h3 className="text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Workspace Tip</h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-ui-micro font-medium leading-relaxed text-ctp-subtext1">
            Keep your momentum! Small daily checks lead to stress-free government applications.
          </p>
          <Button 
            variant="secondary"
            onClick={() => router.push('/guides')}
            className="w-full text-ui-micro uppercase tracking-widest shadow-lg shadow-ctp-sky-800/5"
          >
            Explore more guides
          </Button>
        </div>
      </Card>

    </aside>
  );
};

export default DashboardSidebar;

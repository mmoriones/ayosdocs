'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  ChevronDown,
  Info,
  CheckCircle2,
  Users,
  Zap,
  MessageSquare
} from 'lucide-react';
import { getGuideIcon } from '@/lib/guideIcons';
import Image from 'next/image';

/**
 * OfficesClient Component
 */
export default function OfficesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All Agencies');
  const router = useRouter();

  const offices = [
    {
      id: 1,
      name: 'DFA Manila Aseana',
      agency: 'DFA',
      location: 'Parañaque, Metro Manila',
      rating: 4.3,
      reviews: 182,
      waitTime: '2-3 hrs',
      speed: 85,
      friendliness: 78,
      queue: 92,
      proTip: "Slots open at midnight. Photocopy services available across the street.",
      icon: getGuideIcon('passport-appointment'),
      status: 'Regular Hours'
    },
    {
      id: 2,
      name: 'PSA Quezon City Main Office',
      agency: 'PSA',
      location: 'East Ave, Quezon City',
      rating: 4.5,
      reviews: 156,
      waitTime: '1-2 hrs',
      speed: 90,
      friendliness: 82,
      queue: 88,
      proTip: "Apply online first to use the priority lane.",
      icon: getGuideIcon('psa-birth-certificate'),
      status: 'Regular Hours'
    },
    {
      id: 3,
      name: 'NBI Clearance Center - UN Avenue',
      agency: 'NBI',
      location: 'Manila, Metro Manila',
      rating: 4.1,
      reviews: 98,
      waitTime: '2-4 hrs',
      speed: 75,
      friendliness: 70,
      queue: 65,
      proTip: "Go before 8 AM for walk-ins, though online appointment is preferred.",
      icon: getGuideIcon('nbi-clearance'),
      status: 'Busy'
    }
  ];

  const filteredOffices = offices.filter(office => 
    (office.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     office.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedAgency === 'All Agencies' || office.agency === selectedAgency)
  );

  return (
    <div className="min-h-screen bg-ctp-base font-sans flex flex-col transition-colors duration-300 text-ctp-text">
      <div className="bg-ctp-mantle border-b border-ctp-surface0 sticky top-[73px] z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 flex-1">
            <div className="p-4 rounded-2xl bg-ctp-sky-800/10 shrink-0 border border-ctp-sky-800/20 shadow-sm">
              <Building2 className="text-ctp-sky-800" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-ctp-text tracking-tight uppercase">
                Office Insights
              </h1>
              <p className="text-ctp-subtext1 text-sm font-medium mt-1">
                Real-time community data on government branches and wait times.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="bg-ctp-base/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-ctp-surface0 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse shadow-[0_0_8px_rgba(32,159,181,0.5)]" />
              <span className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">5,402 Reports this month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-10">
            <section className="bg-ctp-mantle rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-ctp-subtext0" />
                  <input 
                    type="text"
                    maxLength={100}
                    placeholder="Search by office name, city, or province..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-ctp-base border border-ctp-surface0 rounded-2xl text-[16px] focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all bg-ctp-base text-ctp-text placeholder:text-ctp-subtext0 font-medium"
                  />
                </div>
                <div className="relative min-w-[220px]">
                  <select 
                    value={selectedAgency}
                    onChange={(e) => setSelectedAgency(e.target.value)}
                    className="appearance-none w-full bg-ctp-base border border-ctp-surface0 rounded-2xl pl-6 pr-12 py-4 text-[13px] font-black uppercase tracking-widest text-ctp-subtext1 cursor-pointer focus:ring-4 focus:ring-ctp-sky-800/10 transition-all shadow-sm bg-ctp-base"
                  >
                    <option>All Agencies</option>
                    <option>DFA</option>
                    <option>PSA</option>
                    <option>NBI</option>
                    <option>LTO</option>
                    <option>SSS</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                </div>
              </div>
            </section>

            <div className="space-y-6">
              {filteredOffices.length > 0 ? (
                filteredOffices.map((office) => (
                  <OfficeCard key={office.id} office={office} router={router} />
                ))
              ) : (
                <div className="text-center py-24 bg-ctp-mantle rounded-[3rem] border-2 border-dashed border-ctp-surface0">
                  <div className="w-16 h-16 bg-ctp-base rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ctp-surface0 shadow-inner">
                    <Search size={32} className="text-ctp-subtext0" />
                  </div>
                  <h3 className="text-xl font-black text-ctp-text uppercase tracking-tight">No offices found</h3>
                  <p className="text-ctp-subtext1 font-medium mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 space-y-10">
            <section className="bg-ctp-mantle rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp size={20} className="text-ctp-sky-800" />
                <h3 className="text-[13px] font-black text-ctp-text uppercase tracking-widest">Best Performing</h3>
              </div>
              
              <div className="space-y-8">
                {offices.slice(0, 3).map((office, i) => (
                  <div key={office.id} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-ctp-sky-800/10 text-ctp-sky-800 flex items-center justify-center text-xs font-black border border-ctp-sky-800/20 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight">{office.name}</h4>
                      <p className="text-[10px] text-ctp-subtext0 font-black uppercase tracking-widest mt-1 opacity-80">{office.agency} • {office.rating} rating</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-ctp-sky-800 bg-ctp-sky-800/10 border border-ctp-sky-800/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Fast</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => router.push('/coming-soon')}
                className="w-full mt-10 py-4 bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-ctp-surface0 hover:text-ctp-text transition-all shadow-sm active:scale-95"
              >
                View Full Rankings
              </button>
            </section>

            <section className="bg-ctp-sky-800 rounded-[2.5rem] p-8 text-ctp-base relative overflow-hidden group border border-ctp-sky-800/20 shadow-xl shadow-ctp-sky-800/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-ctp-mantle/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-125 duration-700 blur-2xl" />
              
              <div className="relative z-10">
                <ShieldCheck size={32} className="mb-6 opacity-90" strokeWidth={2.5} />
                <h3 className="text-[20px] font-black mb-3 uppercase tracking-tight">Community Insights</h3>
                <p className="text-ctp-base/80 text-[12px] leading-relaxed mb-8 font-medium">
                  Our data is powered by real people sharing their actual experiences. All reports are moderated to ensure accuracy.
                </p>
                
                <div className="space-y-4">
                  {[
                    "100% Anonymous reports",
                    "Moderated for quality",
                    "Real-time wait updates"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-ctp-base" strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-ctp-mantle rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-ctp-peach/10 border border-ctp-peach/20 rounded-2xl flex items-center justify-center text-ctp-peach mb-6 shadow-sm">
                <Zap size={32} className="fill-ctp-peach/10" strokeWidth={2.5} />
              </div>
              <h3 className="text-[18px] font-black text-ctp-text mb-2 uppercase tracking-tight">Recently visited?</h3>
              <p className="text-[12px] text-ctp-subtext1 leading-relaxed mb-8 font-medium">
                Your experience helps thousands of others plan their visits better.
              </p>
              <button 
                onClick={() => router.push('/rate')}
                className="w-full py-4 bg-ctp-sky-800 text-ctp-base rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-ctp-sky-800/20 hover:opacity-90 transition-all active:scale-95"
              >
                Share Your Experience
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

const OfficeCard = ({ office, router }) => {
  return (
    <div className="group bg-ctp-mantle rounded-[2.5rem] p-8 border border-ctp-surface0 shadow-sm hover:shadow-2xl hover:border-ctp-sky-800/30 transition-all relative overflow-hidden flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-8 md:items-start">
        <div className="flex md:flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-[1.25rem] bg-ctp-base flex items-center justify-center p-4 group-hover:bg-ctp-sky-800/10 transition-colors shadow-inner border border-ctp-surface0 shrink-0">
            <Image src={office.icon} alt="" width={40} height={40} className="w-full h-full object-contain" />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-ctp-surface0 text-ctp-mauve text-[9px] font-black uppercase tracking-[0.2em] border border-ctp-surface0 whitespace-nowrap">
            {office.agency}
          </span>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-[22px] font-black text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight uppercase tracking-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-ctp-subtext0">
                <MapPin size={14} className="text-ctp-sky-800" />
                <span className="text-[12px] font-bold uppercase tracking-widest">{office.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Star size={16} className="fill-ctp-yellow text-ctp-yellow shadow-sm" />
                  <span className="text-[18px] font-black text-ctp-text">{office.rating}</span>
                </div>
                <p className="text-[10px] text-ctp-subtext0 font-black uppercase tracking-widest mt-0.5 whitespace-nowrap">{office.reviews} reports</p>
              </div>
              <div className="h-12 w-px bg-ctp-surface1 hidden md:block" />
              <div className="bg-ctp-sky-800/10 px-5 py-2.5 rounded-2xl border border-ctp-sky-800/20 flex flex-col items-center shadow-sm">
                <span className="text-[9px] font-black text-ctp-sky-800 uppercase tracking-[0.2em] mb-0.5 opacity-80 whitespace-nowrap">Avg. Wait</span>
                <span className="text-[14px] font-black text-ctp-sky-800 uppercase tracking-tight whitespace-nowrap">{office.waitTime}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-ctp-surface0/30">
            {[
              { label: 'Speed', value: office.speed, icon: Zap, color: 'ctp-sky-800' },
              { label: 'Staff', value: office.friendliness, icon: Users, color: 'ctp-mauve' },
              { label: 'Queue', value: office.queue, icon: Clock, color: 'ctp-peach' },
              { label: 'Facility', value: 85, icon: Building2, color: 'ctp-green' }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-widest flex items-center gap-1.5">
                    <stat.icon size={12} className={`text-${stat.color}`} strokeWidth={2.5} />
                    {stat.label}
                  </span>
                  <span className="text-[11px] font-black text-ctp-text">{stat.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-ctp-surface0 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full bg-${stat.color} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {office.proTip && (
            <div className="bg-ctp-peach/5 border border-ctp-peach/20 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-ctp-base border border-ctp-peach/20 flex items-center justify-center text-ctp-peach shadow-sm shrink-0">
                <Info size={18} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] text-ctp-subtext1 font-bold leading-relaxed italic">
                &quot;{office.proTip}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-ctp-surface0/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-ctp-base border border-ctp-surface0 shadow-xs">
            <MessageSquare size={16} className="text-ctp-subtext0" />
          </div>
          <span className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">3 Recent reports today</span>
        </div>
        <button 
          onClick={() => router.push('/coming-soon')}
          className="group flex items-center gap-2 text-ctp-sky-800 font-black text-[11px] uppercase tracking-widest hover:text-ctp-sky-300 transition-all"
        >
          View detailed insights
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

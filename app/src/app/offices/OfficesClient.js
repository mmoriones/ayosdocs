'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Info,
  CheckCircle2,
  Users,
  Zap,
  MessageSquare,
  Filter,
  Loader2
} from 'lucide-react';
import { GuideIcon } from '@/lib/guideIcons';
import PageHeader from '@/components/ui/PageHeader';
import SearchInput from '@/components/ui/SearchInput';
import HolidayAlert from '@/components/HolidayAlert';

/**
 * OfficesClient Component
 */
export default function OfficesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All Agencies');
  const router = useRouter();

  const agencies = ['All Agencies', 'DFA', 'PSA', 'NBI', 'SSS', 'LTO', 'PhilHealth', 'PAG-IBIG'];

  const { data: offices = [], isLoading } = useQuery({
    queryKey: ['offices', selectedAgency, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedAgency !== 'All Agencies') params.append('agency', selectedAgency);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axios.get(`/api/offices?${params.toString()}`);
      return response.data;
    },
    // Keep data fresh but allow some stale time for UX
    staleTime: 60 * 1000,
  });

  const bestPerformingOffices = useMemo(() => {
    return [...offices].sort((a, b) => b.stats.avgRating - a.stats.avgRating).slice(0, 3);
  }, [offices]);

  return (
    <div className="min-h-screen bg-ctp-base font-sans flex flex-col transition-colors duration-300 text-ctp-text">
      <PageHeader 
        icon={Building2}
        title="Office Insights"
        description="Real-time community data on government branches and wait times."
        actions={
          <div className="bg-ctp-base/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse shadow-[0_0_8px_rgba(4,165,229,0.5)]" />
            <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Community Reports Active</span>
          </div>
        }
      />

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[64px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1">
            <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
              <Filter size={12} className="text-ctp-subtext1" />
              <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Filter agency</span>
            </div>
            {agencies.map((agency) => (
              <button
                key={agency}
                onClick={() => setSelectedAgency(agency)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedAgency === agency
                    ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-sm'
                    : 'bg-ctp-mantle text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800 hover:text-ctp-sky-800'
                }`}
              >
                {agency}
              </button>
            ))}
          </div>

          <div className="shrink-0 hidden lg:block max-w-sm">
            <HolidayAlert />
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0 space-y-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by office name, city, or province..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-ctp-sky-800" size={40} />
                  <p className="text-sm font-bold text-ctp-subtext1 uppercase tracking-widest">Fetching intelligence...</p>
                </div>
              ) : offices.length > 0 ? (
                offices.map((office) => (
                  <OfficeCard key={office._id} office={office} router={router} />
                ))
              ) : (
                <div className="text-center py-20 bg-ctp-mantle rounded-xl border border-dashed border-ctp-surface1 shadow-sm">
                  <div className="w-14 h-14 bg-ctp-base/50 border border-ctp-surface1 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Search size={24} className="text-ctp-subtext1" />
                  </div>
                  <h3 className="text-lg font-bold text-ctp-text tracking-tight uppercase tracking-widest">No offices found</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <section className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-3">
                <TrendingUp size={14} className="text-ctp-sky-800" />
                <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Top Rated Branches</h3>
              </div>
              
              <div className="divide-y divide-ctp-surface1/50">
                {bestPerformingOffices.map((office, i) => (
                  <div key={office._id} className="flex items-center gap-4 p-4 hover:bg-ctp-mantle/30 transition-colors group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-ctp-mantle border border-ctp-surface1 text-ctp-sky-800 flex items-center justify-center text-[10px] font-bold shadow-sm">
                      0{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight">{office.name}</h4>
                      <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest mt-0.5 opacity-80">{office.agency} • {office.stats.avgRating} rating</p>
                    </div>
                    <span className="text-[8px] font-bold text-ctp-green bg-ctp-green/5 border border-ctp-green/20 px-1.5 py-0.5 rounded uppercase tracking-widest">Top</span>
                  </div>
                ))}
                {bestPerformingOffices.length === 0 && (
                  <p className="p-4 text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest text-center">No data yet</p>
                )}
              </div>
              
              <button 
                onClick={() => router.push('/coming-soon')}
                className="p-3 bg-ctp-mantle border-t border-ctp-surface1 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest hover:text-ctp-text transition-colors"
              >
                View Full Rankings
              </button>
            </section>

            <section className="bg-ctp-sky-800 rounded-xl p-5 text-white relative overflow-hidden group shadow-lg shadow-ctp-sky-800/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest">Community Verification</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-90">
                  Data is crowdsourced from real citizens. All reports are verified for quality and relevance.
                </p>
                
                <div className="space-y-2 pt-1">
                  {[
                    "Anonymous reports",
                    "Moderated content",
                    "Real-time updates"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-ctp-mantle border border-ctp-surface1 rounded-xl flex items-center justify-center text-ctp-sky-800 shadow-inner">
                <Zap size={24} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-ctp-text uppercase tracking-widest">Recently visited?</h3>
                <p className="text-[10px] text-ctp-subtext1 font-medium leading-relaxed">
                  Help the community by reporting your wait time and experience.
                </p>
              </div>
              <button 
                onClick={() => router.push('/rate')}
                className="w-full py-2.5 bg-ctp-sky-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-ctp-sky-800/90 active:scale-[0.98] transition-all"
              >
                Submit Report
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

const OfficeCard = ({ office, router }) => {
  const waitTimeLabel = {
    fast: '< 1 hr',
    medium: '1-3 hrs',
    slow: 'Whole day',
    'N/A': 'No data'
  }[office.stats.avgWaitTime || 'N/A'];

  const waitTimeColor = {
    fast: 'text-ctp-green bg-ctp-green/5 border-ctp-green/20',
    medium: 'text-ctp-sky-800 bg-ctp-sky-800/5 border-ctp-sky-800/20',
    slow: 'text-ctp-peach bg-ctp-peach/5 border-ctp-peach/20',
    'N/A': 'text-ctp-subtext1 bg-ctp-mantle border-ctp-surface1'
  }[office.stats.avgWaitTime || 'N/A'];

  return (
    <div className="group bg-ctp-base rounded-xl p-5 lg:p-6 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all relative overflow-hidden flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        <div className="flex md:flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
            <GuideIcon agency={office.agency} className="w-8 h-8 text-ctp-sky-800" strokeWidth={1.5} />
          </div>
          <span className="px-2 py-0.5 rounded bg-ctp-sky-800/5 text-ctp-sky-800 text-[9px] font-bold uppercase tracking-widest border border-ctp-sky-800/20 whitespace-nowrap">
            {office.agency}
          </span>
        </div>

        <div className="flex-1 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-ctp-subtext1">
                <MapPin size={12} className="text-ctp-sky-800" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{office.city}, {office.province}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Star size={14} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-lg font-bold text-ctp-text">{office.stats.avgRating?.toFixed(1) || '0.0'}</span>
                </div>
                <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap opacity-80">{office.stats.totalReports} interactions</p>
              </div>
              <div className="h-8 w-px bg-ctp-surface1 hidden md:block" />
              <div className={`${waitTimeColor} px-3 py-1.5 rounded-lg border flex flex-col items-center min-w-[80px]`}>
                <span className="text-[8px] font-bold uppercase tracking-widest mb-0.5 opacity-80">Avg. Wait</span>
                <span className="text-xs font-bold uppercase tracking-tight">{waitTimeLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Office Address:</p>
             <p className="text-xs text-ctp-text font-medium leading-relaxed opacity-90">{office.address}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-ctp-surface1/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 opacity-80">
          <div className="p-1.5 rounded bg-ctp-mantle border border-ctp-surface1">
            <MessageSquare size={12} className="text-ctp-subtext1" />
          </div>
          <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">
            {office.stats.totalReports > 0 ? `Crowdsourced from ${office.stats.totalReports} citizens` : 'Be the first to report'}
          </span>
        </div>
        <button 
          onClick={() => router.push('/coming-soon')}
          className="group flex items-center gap-1.5 text-ctp-sky-800 font-bold text-[10px] uppercase tracking-widest hover:underline transition-all"
        >
          View detailed insights
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

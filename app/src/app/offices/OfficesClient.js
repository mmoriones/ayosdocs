'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Users,
  Filter
} from 'lucide-react';
import { GuideIcon } from '@/lib/guideIcons';
import { PageHeader, Banner, Button, Card, Badge, SearchInput, Skeleton } from '@/components/ui'
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
            <div className="w-2 h-2 rounded-full bg-ctp-sky-800 animate-pulse shadow-[0_0_8px_var(--sky-800)]" />
            <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Community Reports Active</span>
          </div>
        }
      />

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[64px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-2 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
              <Filter size={12} className="text-ctp-subtext1" />
              <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Agencies</span>
            </div>
            {agencies.map((agency) => (
              <button
                key={agency}
                onClick={() => setSelectedAgency(agency)}
                className={`px-3 py-1.5 rounded-md text-ui-tiny font-bold uppercase tracking-[0.1em] transition-all whitespace-nowrap border ${
                  selectedAgency === agency
                    ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-sm'
                    : 'bg-ctp-mantle/50 text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800/30 hover:text-ctp-sky-800'
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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl flex-1">
                <SearchInput 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search branch name or location..."
                  className="bg-ctp-mantle/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <OfficeCard.Skeleton key={i} />
                ))
              ) : offices.length > 0 ? (
                offices.map((office) => (
                  <OfficeCard key={office._id} office={office} router={router} />
                ))
              ) : (
                <div className="text-center py-20 bg-ctp-mantle/50 rounded-xl border border-dashed border-ctp-surface1 shadow-sm">
                  <div className="w-12 h-12 bg-ctp-base border border-ctp-surface1 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Search size={22} className="text-ctp-subtext1" />
                  </div>
                  <h3 className="text-base font-bold text-ctp-text uppercase tracking-widest">No matching offices</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try broadening your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <Card background="base" noPadding className="flex flex-col">
              <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-2">
                <TrendingUp size={14} className="text-ctp-sky-800" />
                <h3 className="text-ui-subhead font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Top Performers</h3>
              </div>
              
              <div className="divide-y divide-ctp-surface1/30">
                {bestPerformingOffices.map((office, i) => (
                  <div key={office._id} className="flex items-center gap-3.5 p-4 hover:bg-ctp-mantle/50 transition-colors group cursor-pointer">
                    <div className="w-7 h-7 rounded bg-ctp-mantle border border-ctp-surface1 text-ctp-surface2 flex items-center justify-center text-ui-tiny font-bold group-hover:text-ctp-sky-800 transition-colors">
                      0{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-ui-detail font-bold text-ctp-text truncate group-hover:text-ctp-sky-800 transition-colors uppercase leading-tight">{office.name}</h4>
                      <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-widest mt-0.5 opacity-60">{office.agency} • {office.stats.avgRating} ★</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => router.push('/coming-soon')}
                className="w-full p-3 bg-ctp-mantle/50 border-t border-ctp-surface1 text-ui-micro font-bold text-ctp-sky-800 uppercase tracking-widest hover:bg-ctp-sky-800 hover:text-white transition-all"
              >
                View Analytics
              </button>
            </Card>

            <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm">
              <div className="p-4 border-b border-ctp-surface1 flex items-center gap-2">
                <ShieldCheck size={14} className="text-ctp-green" />
                <h3 className="text-ui-subhead font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Verified Insights</h3>
              </div>
              <div className="p-5 space-y-4 text-center">
                <p className="text-ui-detail font-medium leading-relaxed text-ctp-subtext1">
                  Join 1.2k+ citizens in improving government service transparency with real-time reports.
                </p>
                <Button 
                  onClick={() => router.push('/rate')}
                  className="w-full shadow-lg shadow-ctp-sky-800/10"
                >
                  Post Experience
                </Button>
              </div>
            </Card>
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

  const waitTimeVariant = {
    fast: 'green',
    medium: 'sky',
    slow: 'yellow',
    'N/A': 'slate'
  }[office.stats.avgWaitTime || 'N/A'];

  return (
    <Card className="group hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all flex flex-col h-full relative overflow-hidden p-0" noPadding>
      <div className="p-4 flex flex-col md:flex-row gap-5 md:items-start">
        <div className="flex md:flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 shrink-0 group-hover:bg-ctp-base transition-colors duration-300 shadow-sm">
            <GuideIcon agency={office.agency} className="w-6 h-6 text-ctp-sky-800" strokeWidth={1.5} />
          </div>
          <Badge variant="sky" className="px-1">{office.agency}</Badge>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors leading-tight tracking-tight">
                {office.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-ctp-subtext1">
                <MapPin size={10} className="text-ctp-sky-800" />
                <span className="text-ui-micro font-bold uppercase tracking-[0.1em]">{office.city}, {office.province}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={12} className="fill-ctp-yellow text-ctp-yellow" />
                  <span className="text-sm font-bold text-ctp-text">{office.stats.avgRating?.toFixed(1) || '0.0'}</span>
                </div>
                <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-[0.1em] mt-0.5 whitespace-nowrap opacity-60">{office.stats.totalReports} interactions</p>
              </div>
              <div className="h-6 w-px bg-ctp-surface1 hidden md:block" />
              <div className="flex flex-col items-center min-w-[70px] gap-0.5">
                <span className="text-ui-micro font-bold uppercase tracking-ui-caps opacity-60">Wait</span>
                <Badge variant={waitTimeVariant} className="px-1 py-0">{waitTimeLabel}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
             <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.1em]">Address:</p>
             <p className="text-ui-micro text-ctp-text font-medium leading-relaxed opacity-80 line-clamp-1">{office.address}</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2.5 bg-ctp-mantle/30 border-t border-ctp-surface1/50 flex items-center justify-between">
        <div className="flex items-center gap-2 opacity-80">
          <Users size={12} className="text-ctp-subtext1" />
          <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">
            {office.stats.totalReports > 0 ? `${office.stats.totalReports} Citizen Reports` : 'No reports yet'}
          </span>
        </div>
        <button 
          onClick={() => router.push('/coming-soon')}
          className="text-ctp-sky-800 font-bold text-ui-micro uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Details
          <ArrowRight size={10} strokeWidth={4} />
        </button>
      </div>
    </Card>
  );
};

OfficeCard.Skeleton = function OfficeCardSkeleton() {
  return (
    <div className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row gap-5 md:items-start">
        <div className="flex md:flex-col items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
          <Skeleton className="w-12 h-4 rounded-md" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-1/2 h-2.5" />
            </div>
            
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-right space-y-1">
                <Skeleton className="w-10 h-4 ml-auto" />
                <Skeleton className="w-16 h-2 ml-auto" />
              </div>
              <div className="h-6 w-px bg-ctp-surface1 hidden md:block" />
              <div className="flex flex-col items-center min-w-[70px] gap-1.5">
                <Skeleton className="w-8 h-2" />
                <Skeleton className="w-16 h-4 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <Skeleton className="w-12 h-2" />
             <Skeleton className="w-full h-3" />
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2.5 bg-ctp-mantle/30 border-t border-ctp-surface1/50 flex items-center justify-between">
        <Skeleton className="w-24 h-2.5" />
        <Skeleton className="w-12 h-2.5" />
      </div>
    </div>
  );
};
;

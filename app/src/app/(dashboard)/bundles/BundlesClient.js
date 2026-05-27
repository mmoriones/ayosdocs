'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  ArrowRight, 
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { DashboardPageHeader, Button, SearchInput, SortDropdown, Skeleton, Badge, TrackingIndicator, SelectionPill } from '@/components/ui'
import { getBundleIcon } from '@/lib/bundleIcons';

/**
 * BundlesClient Component
 * Discovery page for Requirement Bundles.
 */
export default function BundlesClient({ initialBundles }) {
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === 'authenticated';
  const isVerified = session?.user?.isVerified;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

  // Fetch user data to check for tracked bundles
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const sortOptions = [
    { label: 'Default', value: 'Default' },
    { label: 'Alphabetical', value: 'Alphabetical' }
  ];

  const categories = useMemo(() => 
    ['All', ...new Set(initialBundles.map(b => b.category))], 
    [initialBundles]
  );

  const filteredBundles = useMemo(() => {
    let result = initialBundles.filter(bundle => {
      const matchesSearch = 
        bundle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || bundle.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialBundles, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-ctp-base font-sans transition-colors duration-300">
      <DashboardPageHeader 
        icon={Layers}
        title="Bundles"
        description="Goal-oriented document groups for life events and business needs."
        actions={
          <div className="bg-ctp-base/50 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <Sparkles size={14} className="text-ctp-sky-800" />
            <span className="text-ui-tiny font-bold text-ctp-subtext0 uppercase tracking-[0.2em]">Ready-to-use bundles</span>
          </div>
        }
      />

      {/* QUICK CATEGORY PILLS */}
      <div className="bg-ctp-base border-b border-ctp-surface1 sticky top-[64px] z-40 backdrop-blur-md bg-ctp-base/80">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-4 border-r border-ctp-surface1 shrink-0">
            <Filter size={12} className="text-ctp-subtext1" />
            <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Goals</span>
          </div>
          {categories.map((cat) => (
            <SelectionPill
              key={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </SelectionPill>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 w-full">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search life events (e.g., Marriage, First Job, Business)..."
                className="bg-ctp-mantle/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <SortDropdown 
                value={sortBy} 
                onChange={setSortBy} 
                options={sortOptions} 
                className="h-10"
              />

              <Button 
                onClick={() => window.location.href = '/coming-soon'}
                leftIcon={<Plus size={14} strokeWidth={3} />}
                className="group text-ui-micro h-10"
              >
                Custom Bundle
              </Button>
            </div>
          </div>

          {/* BUNDLES GRID */}
          {filteredBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBundles.map((bundle) => {
              const isTracking = userData?.trackedBundles?.some(b => b.bundleId === bundle.id);
              return <BundleCard key={bundle.id} bundle={bundle} isTracking={isTracking} />;
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-ctp-mantle/50 rounded-xl border border-dashed border-ctp-surface1 shadow-sm">
            <div className="w-16 h-16 bg-ctp-base border border-ctp-surface1 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Layers size={32} className="text-ctp-subtext1" />
            </div>
            <h3 className="text-lg font-bold text-ctp-text uppercase tracking-widest">No bundles matched</h3>
            <p className="text-xs text-ctp-subtext1 mt-2 max-w-md mx-auto font-medium">
              We&apos;re constantly building new bundles. Try adjusting your search.
            </p>
            <Button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-8 px-8 uppercase text-ui-micro tracking-widest"
            >
              Reset Search
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

const BundleCard = ({ bundle, isTracking }) => {
  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);

  return (
    <Link 
      href={`/bundles/${bundle.id}`}
      className="hover-lift click-ripple group bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm hover:border-ctp-sky-800/20 hover:bg-ctp-mantle/50 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-9 h-9 rounded-lg bg-ctp-mantle flex items-center justify-center border border-ctp-surface1 group-hover:bg-ctp-base transition-colors duration-300 shrink-0 shadow-sm">
          {getBundleIcon(bundle.id, { size: 18, className: "text-ctp-sky-800" })}
        </div>
        
        {isTracking && (
          <TrackingIndicator variant="bundle" pulse />
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Badge variant="sky" className="px-1 text-ui-micro">{bundle.category}</Badge>
            <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.1em] opacity-60">
              {bundle.flow.length} Stages
            </span>
          </div>
          <h3 className="text-base font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors tracking-tight leading-tight">
            {bundle.title}
          </h3>
          <p className="text-ui-detail text-ctp-subtext1 leading-relaxed line-clamp-2 font-medium opacity-80">
            {bundle.description}
          </p>
        </div>

        <div className="pt-4 border-t border-ctp-surface1/30 space-y-2.5">
          <p className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest opacity-60">Bundle Preview:</p>
          <div className="flex flex-wrap gap-1.5">
            {bundle.flow.flatMap(s => s.guides).slice(0, 2).map((guide, idx) => (
              <span key={idx} className="text-ui-micro font-bold text-ctp-text bg-ctp-mantle px-1.5 py-0.5 rounded border border-ctp-surface1 truncate max-w-[110px] uppercase tracking-tight">
                {guide.replace(/-/g, ' ')}
              </span>
            ))}
            {totalGuides > 2 && (
              <span className="text-ui-micro font-bold text-ctp-subtext1 px-1 py-0.5 uppercase tracking-widest">
                +{totalGuides - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-ctp-surface1/30">
        <div className="flex -space-x-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shadow-sm">
              <CheckCircle2 size={8} className="text-ctp-sky-800 opacity-30" />
            </div>
          ))}
        </div>
        <div className="text-ctp-sky-800 font-bold text-ui-micro uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          {isTracking ? 'Resume Bundle' : 'View bundle'}
          <ArrowRight size={10} strokeWidth={4} />
        </div>
      </div>
    </Link>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-ctp-base rounded-xl p-5 border border-ctp-surface1 shadow-sm flex flex-col h-full space-y-4">
      <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="flex gap-2.5">
          <Skeleton className="w-12 h-3.5 rounded-md" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
      </div>
      <div className="pt-4 border-t border-ctp-surface1/30 space-y-2.5">
        <Skeleton className="w-20 h-2.5" />
        <div className="flex gap-1.5">
          <Skeleton className="w-16 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-ctp-surface1/30 flex justify-between items-center">
        <div className="flex -space-x-1.5">
          {[1, 2, 3].map(i => <Skeleton key={i} circle className="w-4 h-4 border border-ctp-surface1" />)}
        </div>
        <Skeleton className="w-16 h-2.5" />
      </div>
    </div>
  );
};


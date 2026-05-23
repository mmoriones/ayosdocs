'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthUI } from '@/components/Providers';
import { useWorkspace, useToast } from '@/context';
import { toggleFavoriteAction } from '@/app/actions/user';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Layers, 
  Star,
  CheckCircle2,
  TrendingUp,
  Search,
  Users,
  ShieldCheck
} from 'lucide-react';

import { ChecklistCard } from '@/features/guides/components/tracking';
import { StartWithGoal, RecentExperiences, OnboardingBanner, TrendingWidget } from '@/features/guides/components/discovery';
import { bundles } from '@/data/bundles';
import StatsCard from '@/components/dashboard/StatsCard';
import Adsense from '@/components/Adsense';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Dashboard Overview (Home).
 */
export default function HomeClient({ allGuides }) {
  const { activeGuideSlug, setActiveGuideSlug } = useWorkspace();
  const [officeSearch, setOfficeSearch] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();

  // Handle hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch comprehensive user data (progress, bundles, etc.)
  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  // Fetch all offices from DB to show actual count and top performers
  const { data: allOffices = [], isLoading: isLoadingOffices } = useQuery({
    queryKey: ['all-offices'],
    queryFn: async () => {
      const response = await axios.get('/api/offices');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const topOffices = useMemo(() => allOffices.slice(0, 5), [allOffices]);

  // Fetch trending guides from DB (dynamically seeded)
  const { data: trendingGuides = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trending-guides'],
    queryFn: async () => {
      const response = await axios.get('/api/guides/trending');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (slug) => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      if (!isVerified) {
        showToast({
          type: 'warning',
          title: 'Verification Required',
          message: 'Please verify your email to favorite guides.'
        });
        return;
      }
      const result = await toggleFavoriteAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
        message: data.message
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update favorite. Please try again.'
      });
    }
  });

  const handleFavoriteGuide = (slug) => {
    favoriteMutation.mutate(slug);
  };

  // Calculate stats based on real progress data
  const stats = useMemo(() => {
    if (!userData?.savedProgress) return { active: 0, completed: 0 };

    let active = 0;
    let completed = 0;

    userData.savedProgress.forEach(progress => {
      const guide = allGuides.find(g => g.slug === progress.guideSlug);
      if (!guide || !guide.checklist) return;

      const completedCount = progress.completedTasks 
        ? progress.completedTasks.split(',').filter(s => s !== "").length 
        : 0;

      // If it's in the list, it's tracked. If it's 100%, it's completed. Otherwise active.
      if (completedCount === guide.checklist.length) {
        completed++;
      } else {
        active++;
      }
    });

    return { active, completed };
  }, [userData, allGuides]);

  const onboarded = session?.user?.onboarded ?? false;

  // Logic to determine which guide to feature in the "Active Workflow"
  const activeGuide = useMemo(() => {
    // 1. Prioritize the global context (recently clicked/viewed)
    if (activeGuideSlug) {
      const contextGuide = allGuides.find(g => g.slug === activeGuideSlug);
      if (contextGuide) return contextGuide;
    }

    // 2. Fallback to latest database progress for auth users
    if (userData?.savedProgress && userData.savedProgress.length > 0) {
      const mostRecent = userData.savedProgress[userData.savedProgress.length - 1];
      return allGuides.find(g => g.slug === mostRecent.guideSlug);
    }

    return null;
  }, [userData, allGuides, activeGuideSlug]);

  const handleOfficeSearch = (e) => {
    e?.preventDefault();
    if (!officeSearch.trim()) {
      router.push('/offices');
    } else {
      router.push(`/offices?q=${encodeURIComponent(officeSearch)}`);
    }
  };

  return (
    <div className="bg-ctp-base font-sans text-ctp-text pb-20">
      <div className="bg-ctp-mantle/30 border-b border-ctp-surface1">
        <PageHeader 
          title="Welcome to AyosDocs"
          description="Your comprehensive guide to Philippine government processes and requirements."
          className="bg-transparent border-none py-6 lg:py-8"
          actions={
            isMounted && isLoggedIn && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-4 pr-6 border-r border-ctp-surface1">
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-60">Account Status</span>
                     <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase ${isVerified ? 'text-ctp-green' : 'text-ctp-yellow'}`}>
                          {isVerified ? 'Verified' : 'Pending'}
                        </span>
                        <ShieldCheck size={12} className={isVerified ? 'text-ctp-green' : 'text-ctp-yellow'} strokeWidth={3} />
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] opacity-60">Auto-Save</span>
                     <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-ctp-sky-800 uppercase">Active</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-ctp-sky-800 animate-pulse" />
                     </div>
                  </div>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/profile')}
                  className="shadow-sm border-dashed"
                >
                  My Profile
                </Button>
              </div>
            )
          }
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden"
            onClick={() => router.push('/guides')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.01] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <BookOpen size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="text-[8px] px-1.5 py-0 uppercase">{allGuides.length} Available Guides</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Requirements Library</h3>
                <p className="text-[11px] text-ctp-subtext1 font-medium leading-relaxed">Browse step-by-step procedures for all government documents.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest pt-2">
                Browse Library
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden"
            onClick={() => router.push('/bundles')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.01] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <Layers size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="text-[8px] px-1.5 py-0 uppercase">{bundles.length} Process Bundles</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Goal Roadmaps</h3>
                <p className="text-[11px] text-ctp-subtext1 font-medium leading-relaxed">Accomplish life goals like starting a business or getting married.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest pt-2">
                Start Planning
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden"
            onClick={() => router.push('/offices')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.01] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <MapPin size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="text-[8px] px-1.5 py-0 uppercase">{allOffices.length || '...'} Offices Tracked</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Office Locator</h3>
                <p className="text-[11px] text-ctp-subtext1 font-medium leading-relaxed">Check real-time branch wait times and community reports.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-ctp-sky-800 uppercase tracking-widest pt-2">
                Find a Branch
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Dashboard Activity Summary */}
        <Card noPadding className="border-ctp-surface1 relative group bg-ctp-mantle/[0.15]">
          <div className="absolute inset-0 bg-gradient-to-r from-ctp-sky-800/[0.02] via-transparent to-ctp-sky-800/[0.02] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-ctp-surface1/50 items-center">
            {status === 'loading' || (isLoggedIn && isLoadingUserData) ? (
              <>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
              </>
            ) : (
              <>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.02] transition-colors cursor-default">
                  <StatsCard 
                    label="Ongoing Guides" 
                    value={stats.active.toString()} 
                    icon={Clock} 
                    isLocked={!isLoggedIn}
                    trend={{ value: "+2", isUp: true }}
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.02] transition-colors cursor-default">
                  <StatsCard 
                    label="Completed Tasks" 
                    value={stats.completed.toString()} 
                    icon={CheckCircle2} 
                    isLocked={!isLoggedIn}
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.02] transition-colors cursor-default">
                  <StatsCard 
                    label="Total Guides" 
                    value={allGuides.length.toString()} 
                    icon={BookOpen} 
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.02] transition-colors cursor-default">
                  <StatsCard 
                    label="Community Reports" 
                    value="1.2k" 
                    icon={TrendingUp} 
                    trend={{ value: "12%", isUp: true }}
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Trending Roadmaps - Dynamic from DB */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Trending Roadmaps</h2>
              <Badge variant="sky" className="text-[10px] px-1.5 py-0">POPULAR</Badge>
            </div>
            <Link 
              href="/guides"
              className="text-[10px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
            >
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {isLoadingTrending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TrendingWidget.Skeleton key={i} />
              ))
            ) : trendingGuides.length > 0 ? (
              trendingGuides.map((guide) => {
                const progress = userData?.savedProgress?.find(p => p.guideSlug === guide.slug);
                return (
                  <TrendingWidget 
                    key={guide.slug} 
                    guide={guide} 
                    progress={progress}
                    stats={guide.stats}
                    onFavorite={() => handleFavoriteGuide(guide.slug)}
                  />
                );
              })
            ) : (
              <p className="col-span-full text-center py-10 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Discovering roadmap trends...</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Workflow & Intelligence */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Life Event Bundles - Primary Position */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Life Event Goals</h2>
                <Link 
                  href="/bundles"
                  className="text-[10px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
                >
                  Browse Roadmaps
                </Link>
              </div>
              <StartWithGoal />
            </section>

            {/* Community Intelligence Module - Search Prioritized */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Community Intelligence</h2>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ctp-green/[0.08] border border-ctp-green/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse shadow-[0_0_8px_rgba(166,227,161,0.5)]" />
                    <span className="text-[8px] font-bold text-ctp-green uppercase tracking-widest">Live: 512 Reports Today</span>
                  </div>
                </div>
                <Link 
                  href="/offices"
                  className="text-[10px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
                >
                  Global Network
                </Link>
              </div>

              <Card background="mantle" noPadding className="relative group overflow-hidden border-ctp-surface1 border-dashed">
                {/* Visual Canvas Background */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
                
                <div className="relative z-10 p-6 lg:p-10 flex flex-col gap-10">
                  {/* Primary Search Area */}
                  <div className="space-y-6 max-w-4xl">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-ctp-sky-800 text-white flex items-center justify-center shadow-lg shadow-ctp-sky-800/20">
                          <Search size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-ctp-text uppercase">Find any office</h3>
                      </div>
                      <p className="text-sm text-ctp-subtext1 font-medium max-w-xl">
                        Search government branches to see real-time wait times and latest community reports.
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <Input 
                          placeholder="e.g. DFA Aseana, NBI Manila, PSA East Avenue..." 
                          value={officeSearch}
                          onChange={(e) => setOfficeSearch(e.target.value)}
                          maxLength={100}
                          className="bg-ctp-base border-ctp-surface1 h-11 text-sm shadow-sm ring-4 ring-ctp-sky-800/[0.01]"
                        />
                      </div>
                      <Button 
                        onClick={handleOfficeSearch}
                        className="h-11 px-6 text-[10px] uppercase tracking-widest shadow-lg shadow-ctp-sky-800/10"
                      >
                        Check Status
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em] mr-2">Quick Access:</span>
                      {['PSA', 'DFA', 'NBI', 'SSS', 'LTO'].map((agency) => (
                        <button
                          key={agency}
                          onClick={() => {
                            setOfficeSearch(agency);
                            setTimeout(() => router.push(`/offices?search=${agency}`), 100);
                          }}
                          className="px-2.5 py-1 rounded-md bg-ctp-mantle border border-ctp-surface1 text-[10px] font-bold text-ctp-text hover:border-ctp-sky-800 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/[0.03] transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-ctp-surface2 group-hover:bg-ctp-sky-800 transition-colors" />
                          {agency}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-ctp-surface1/50">
                    {/* Supporting Insight */}
                    <div className="lg:col-span-2">
                       <div className="bg-ctp-sky-800/[0.04] border border-ctp-sky-800/10 rounded-xl p-5 flex gap-5 items-center relative overflow-hidden group/tip cursor-pointer hover:bg-ctp-sky-800/[0.06] transition-colors h-full shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0 group-hover:bg-ctp-mantle transition-colors">
                             <Sparkles size={20} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-1 pr-4 min-w-0">
                             <p className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest">Community Pro-Tip</p>
                             <p className="text-sm text-ctp-text font-medium leading-relaxed">
                               <span className="font-bold">DFA Aseana:</span> Most users report shortest queues on <span className="underline decoration-ctp-sky-800/30 underline-offset-4 font-bold">Tuesday mornings</span>.
                             </p>
                          </div>
                          <ArrowRight size={18} className="ml-auto text-ctp-sky-800 opacity-20 group-hover/tip:opacity-100 group-hover/tip:translate-x-1 transition-all" />
                       </div>
                    </div>

                    {/* Performance Context */}
                    <div className="space-y-4 flex flex-col justify-center border-l border-ctp-surface1/50 pl-8">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Accuracy</span>
                           <span className="text-[11px] font-bold text-ctp-text">92%</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Daily Reports</span>
                           <span className="text-[11px] font-bold text-ctp-text">512</span>
                        </div>
                        <button 
                          onClick={() => router.push('/rate')}
                          className="w-full mt-2 py-3 bg-ctp-sky-800 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-ctp-sky-700 transition-all shadow-md shadow-ctp-sky-800/10 flex items-center justify-center gap-2 active:scale-95"
                        >
                          Share Experience
                          <MessageSquare size={12} strokeWidth={3} />
                        </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-ctp-crust/50 border-t border-ctp-surface1/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-ctp-green" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.1em]">Verified Community Intelligence Network</span>
                  </div>
                  <button className="text-[10px] font-bold text-ctp-sky-800 uppercase tracking-widest hover:underline decoration-2">
                    How it works
                  </button>
                </div>
              </Card>
            </section>

          </div>

          {/* Sidebar Column: Tracking & Feed */}
          <div className="space-y-12">
            
            {/* Active Workflow - Moved to Sidebar to narrow width */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Current Focus</h2>
                  <Badge variant="sky" className="text-[8px] px-1.5 py-0">TRACKING</Badge>
                </div>
                <Link 
                  href="/my-docs"
                  className="text-[9px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
                >
                  View All
                </Link>
              </div>
              
              {status === 'loading' || (isLoggedIn && isLoadingUserData) ? (
                <ChecklistCard.Skeleton />
              ) : activeGuide ? (
                <ChecklistCard
                  title={activeGuide.title}
                  initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                  slug={activeGuide.slug}
                  agency={activeGuide.agency}
                  inGuidePage={false}
                  isModal={false}
                />
              ) : (
                <Card background="mantle" className="border-dashed py-10 text-center space-y-4">
                  <div className="w-10 h-10 bg-ctp-base border border-ctp-surface1 rounded-lg flex items-center justify-center mx-auto text-ctp-subtext1 shadow-inner">
                    <BookOpen size={20} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-ctp-text text-sm">No active focus</p>
                    <p className="text-[10px] text-ctp-subtext1 max-w-xs mx-auto px-4 font-medium">
                      Start tracking a procedure to see it here.
                    </p>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/guides')}
                    className="text-ctp-sky-800 font-bold text-[9px] uppercase tracking-widest"
                  >
                    Browse Library
                  </Button>
                </Card>
              )}
            </section>

            {/* Recent Experiences */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Community Feed</h2>
              </div>
              <RecentExperiences limit={5} />
            </section>

            {!onboarded && isLoggedIn && (
              <OnboardingBanner />
            )}
            
            <Adsense variant="display" />
          </div>
        </div>

        <section className="py-12 border-t border-ctp-surface1">
          <Card background="mantle" noPadding className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 border-dashed relative overflow-hidden group">
            {/* Subtle Accent matching other dashboard modules */}
            <div className="absolute inset-0 bg-ctp-sky-800/[0.02] pointer-events-none" />
            
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-ctp-sky-800 uppercase tracking-[0.2em]">Support Channel</span>
                <h3 className="text-xl font-bold tracking-tight text-ctp-text uppercase">Need further assistance?</h3>
              </div>
              <p className="text-[13px] text-ctp-subtext1 max-w-lg font-medium leading-relaxed">
                Our specialized Help Center and verified community contributors are here to help you navigate through complex government requirements and procedures.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <Button 
                variant="secondary"
                onClick={() => router.push('/faqs')}
                className="px-8 border-dashed shadow-sm"
              >
                View FAQ
              </Button>
              <Button 
                onClick={() => router.push('/contact')}
                className="px-8 shadow-lg shadow-ctp-sky-800/10"
              >
                Contact Us
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

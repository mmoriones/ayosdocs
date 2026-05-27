'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  CheckCircle2,
  TrendingUp,
  Search,
  ShieldCheck,
  X,
  AlertTriangle
} from 'lucide-react';

import { ChecklistCard } from '@/features/guides/components/tracking';
import { StartWithGoal, RecentExperiences, OnboardingBanner, TrendingWidget, RecentlyUpdated } from '@/features/guides/components/discovery';
import { bundles } from '@/data/bundles';
import StatsCard from '@/components/dashboard/StatsCard';
import Adsense from '@/components/Adsense';
import { DashboardPageHeader, Button, Card, Badge, Input, Modal } from '@/components/ui';

/**
 * Dashboard Overview (Home).
 */
export default function HomeClient({ allGuides }) {
  const { activeGuideSlug, setActiveGuideSlug } = useWorkspace();
  const [officeSearch, setOfficeSearch] = useState('');
  const [restoreBannerDismissed, setRestoreBannerDismissed] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const firstName = session?.user?.name?.split(' ')[0] || '';

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: error === 'AccountPermanentlyDeleted' 
          ? 'This account was permanently deleted and cannot be recovered.'
          : error === 'verification_failed'
          ? 'Email verification failed. The link may be expired.'
          : 'Failed to sign in. Please try again.'
      });
    }
  }, [searchParams, showToast]);

  // Fetch comprehensive user data (progress, bundles, etc.)
  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const hasProgress = (userData?.savedProgress && userData.savedProgress.length > 0) || activeGuideSlug;
  
  const pageTitle = !isLoggedIn ? 'Overview' : session?.user?.isNewUser ? 'Welcome to Ayosdocs' : `Welcome back, ${firstName}`;
  const pageDescription = !isLoggedIn
    ? 'Your comprehensive guide to Philippine government processes and requirements.'
    : hasProgress
    ? 'Pick up where you left off or explore new guides to get things done.'
    : 'Start your journey by exploring our comprehensive library of government guides.';

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

  // Logic to determine which guide to feature in the "Active Guide"
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
        <DashboardPageHeader 
          title={pageTitle}
          description={pageDescription}
          actions={
            isLoggedIn && (
              <div className="flex items-center gap-3">
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

      {session?.user?.restoredAccount && !restoreBannerDismissed && (
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-6">
          <div className="relative bg-ctp-green/[0.07] border border-ctp-green/20 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
            <div className="p-1.5 rounded-lg bg-ctp-green/10 shrink-0">
              <CheckCircle2 size={16} className="text-ctp-green" />
            </div>
            <p className="text-ui-detail font-medium text-ctp-text flex-1">
              <span className="font-bold">Welcome back!</span> Your account has been restored. All your data is exactly as you left it.
            </p>
            <button
              onClick={() => setRestoreBannerDismissed(true)}
              className="p-1 rounded-lg text-ctp-subtext0 hover:text-ctp-text hover:bg-ctp-surface0 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden group"
            onClick={() => router.push('/guides')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <BookOpen size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="px-1.5 py-0 uppercase">{allGuides.length} Available Guides</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Guide Library</h3>
                <p className="text-ui-detail text-ctp-subtext1 font-medium leading-relaxed">Browse step-by-step procedures for all government documents.</p>
              </div>
              <div className="flex items-center gap-1.5 text-ui-detail font-bold text-ctp-sky-800 uppercase tracking-ui-caps pt-2">
                Browse Library
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden group"
            onClick={() => router.push('/bundles')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <Layers size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="px-1.5 py-0 uppercase">{bundles.length} Bundles</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Goal Bundles</h3>
                <p className="text-ui-detail text-ctp-subtext1 font-medium leading-relaxed">Accomplish life goals like starting a business or getting married.</p>
              </div>
              <div className="flex items-center gap-1.5 text-ui-detail font-bold text-ctp-sky-800 uppercase tracking-ui-caps pt-2">
                Start Planning
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          <Card 
            background="base" 
            interactive
            className="relative overflow-hidden group"
            onClick={() => router.push('/offices')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-ctp-sky-800/[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:bg-ctp-sky-800/10 transition-all duration-300">
                  <MapPin size={24} strokeWidth={2} />
                </div>
                <Badge variant="sky" className="px-1.5 py-0 uppercase">{allOffices.length || '...'} Offices Tracked</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base tracking-tight text-ctp-text uppercase">Office Locator</h3>
                <p className="text-ui-detail text-ctp-subtext1 font-medium leading-relaxed">Check real-time branch wait times and office reviews.</p>
              </div>
              <div className="flex items-center gap-1.5 text-ui-detail font-bold text-ctp-sky-800 uppercase tracking-ui-caps pt-2">
                Find a Branch
                <ArrowRight size={10} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Dashboard Activity Summary */}
        <Card noPadding className="border-ctp-surface1 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-ctp-sky-800/[0.01] via-transparent to-ctp-sky-800/[0.01] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-ctp-surface1 items-center">
            {isLoggedIn && isLoadingUserData ? (
              <>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
                <div className="p-4 md:p-5 lg:p-6"><StatsCard.Skeleton /></div>
              </>
            ) : (
              <>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.03] transition-colors cursor-default">
                  <StatsCard 
                    label="Ongoing Guides" 
                    value={stats.active.toString()} 
                    icon={Clock} 
                    isLocked={!isLoggedIn}
                    trend={{ value: "+2", isUp: true }}
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.03] transition-colors cursor-default">
                  <StatsCard 
                    label="Completed Tasks" 
                    value={stats.completed.toString()} 
                    icon={CheckCircle2} 
                    isLocked={!isLoggedIn}
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.03] transition-colors cursor-default">
                  <StatsCard 
                    label="Total Guides" 
                    value={allGuides.length.toString()} 
                    icon={BookOpen} 
                  />
                </div>
                <div className="p-4 md:p-5 lg:p-6 hover:bg-ctp-sky-800/[0.03] transition-colors cursor-default">
                  <StatsCard 
                    label="Office Reviews" 
                    value="1.2k" 
                    icon={TrendingUp} 
                    trend={{ value: "12%", isUp: true }}
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Trending Bundles - Dynamic from DB */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Trending Guides</h2>
              <Badge variant="sky" className="px-1.5 py-0">POPULAR</Badge>
            </div>
            <Button 
              variant="link"
              onClick={() => router.push('/guides')}
            >
              Explore All
            </Button>
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
              <p className="col-span-full text-center py-10 text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Discovering guide trends...</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Bundles & Intelligence */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Life Event Bundles - Primary Position */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Life Event Goals</h2>
                <Button 
                  variant="link"
                  onClick={() => router.push('/bundles')}
                >
                  Browse Bundles
                </Button>
              </div>
              <StartWithGoal trackedBundles={userData?.trackedBundles} />
            </section>

            {/* Community Intelligence Module - Search Prioritized */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Community Intelligence</h2>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ctp-green/[0.08] border border-ctp-green/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-pulse shadow-[0_0_8px_rgba(166,227,161,0.5)]" />
                    <span className="text-ui-micro font-bold text-ctp-green uppercase tracking-ui-caps">Live: 512 Reviews Today</span>
                  </div>
                </div>
                <Button 
                  variant="link"
                  onClick={() => router.push('/offices')}
                >
                  Office Network
                </Button>
              </div>

              <Card background="base" noPadding className="relative group overflow-hidden border-ctp-surface1 border-dashed">
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
                      <p className="text-ui-subhead text-ctp-subtext1 font-medium max-w-xl">
                        Search government branches to see real-time wait times and latest office reviews.
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <Input 
                          placeholder="e.g. DFA Aseana, NBI Manila, PSA East Avenue..." 
                          value={officeSearch}
                          onChange={(e) => setOfficeSearch(e.target.value)}
                          maxLength={100}
                          className="bg-ctp-base border-ctp-surface1 h-11 text-ui-subhead shadow-sm ring-4 ring-ctp-sky-800/[0.01]"
                        />
                      </div>
                      <Button 
                        onClick={handleOfficeSearch}
                        className="h-11 px-6 text-ui-micro uppercase tracking-ui-caps shadow-lg shadow-ctp-sky-800/10"
                      >
                        Check Status
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps mr-2">Quick Access:</span>
                      {['PSA', 'DFA', 'NBI', 'SSS', 'LTO'].map((agency) => (
                        <button
                          key={agency}
                          onClick={() => {
                            setOfficeSearch(agency);
                            setTimeout(() => router.push(`/offices?search=${agency}`), 100);
                          }}
                          className="hover-lift click-ripple px-2.5 py-1 rounded-md bg-ctp-mantle border border-ctp-surface1 text-ui-detail font-bold text-ctp-text hover:border-ctp-sky-800 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/[0.05] shadow-sm flex items-center gap-1.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-ctp-surface2 group-hover:bg-ctp-sky-800 transition-colors" />
                          {agency}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-ctp-surface1">
                    {/* Supporting Insight */}
                    <div className="lg:col-span-2">
                       <div className="bg-ctp-sky-800/[0.04] border border-ctp-sky-800/10 rounded-xl p-5 flex gap-5 items-center relative overflow-hidden group/tip cursor-pointer hover:bg-ctp-sky-800/[0.08] transition-colors h-full shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm shrink-0 group-hover:bg-ctp-mantle transition-colors">
                             <Sparkles size={20} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-1 pr-4 min-w-0">
                             <p className="text-ui-detail font-bold text-ctp-sky-800 uppercase tracking-ui-caps">Community Pro-Tip</p>
                             <p className="text-ui-subhead text-ctp-text font-medium leading-relaxed">
                               <span className="font-bold">DFA Aseana:</span> Most users report shortest queues on <span className="underline decoration-ctp-sky-800/30 underline-offset-4 font-bold">Tuesday mornings</span>.
                             </p>
                          </div>
                          <ArrowRight size={18} className="ml-auto text-ctp-sky-800 opacity-20 group-hover/tip:opacity-100 group-hover/tip:translate-x-1 transition-all" />
                       </div>
                    </div>

                    {/* Performance Context */}
                    <div className="space-y-4 flex flex-col justify-center border-l border-ctp-surface1 pl-8">
                        <div className="flex items-center justify-between">
                           <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Accuracy</span>
                           <span className="text-ui-subhead font-bold text-ctp-text">92%</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Daily Reports</span>
                           <span className="text-ui-subhead font-bold text-ctp-text">512</span>
                        </div>
                        <button 
                          onClick={() => router.push('/rate')}
                          className="hover-lift click-ripple w-full mt-2 py-3 bg-ctp-sky-800 text-white rounded-lg text-ui-micro font-bold uppercase tracking-ui-caps hover:bg-ctp-sky-700 shadow-md shadow-ctp-sky-800/10 flex items-center justify-center gap-2"
                        >
                          Share Experience
                          <MessageSquare size={12} strokeWidth={3} />
                        </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 border-t border-ctp-surface1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-ctp-green" strokeWidth={2.5} />
                    <span className="text-ui-detail font-bold text-ctp-subtext1 uppercase tracking-ui-caps">Verified Community Intelligence Network</span>
                  </div>
                  <Button variant="link">
                    How it works
                  </Button>
                </div>
              </Card>
            </section>

          </div>

          {/* Sidebar Column: Tracking & Feed */}
          <div className="space-y-12">
            
            {/* Active Guide - Moved to Sidebar to narrow width */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Active Guide</h2>
                  <Badge variant="sky" className="px-1.5 py-0">TRACKING</Badge>
                </div>
                <Button 
                  variant="link"
                  onClick={() => router.push('/my-docs')}
                >
                  View All
                </Button>
              </div>
              
              {isLoggedIn && isLoadingUserData ? (
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
              ) : trendingGuides.length > 0 ? (
                <Card background="mantle" className="border-ctp-sky-800/20 py-8 text-center space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2">
                    <Badge variant="sky" className="px-1.5 py-0 uppercase tracking-ui-caps">Suggested</Badge>
                  </div>
                  <div className="w-10 h-10 bg-ctp-sky-800/10 border border-ctp-sky-800/20 rounded-lg flex items-center justify-center mx-auto text-ctp-sky-800 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={20} strokeWidth={2} />
                  </div>
                  <div className="space-y-1 px-4">
                    <p className="font-bold text-ctp-text text-ui-subhead tracking-tight">{trendingGuides[0].title}</p>
                    <p className="text-ui-detail text-ctp-subtext1 max-w-xs mx-auto font-medium leading-relaxed">
                      Most Filipinos start with this guide. Ready to begin your application?
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 px-6 pt-2">
                    <Button 
                      size="sm"
                      onClick={() => router.push(`/guides/${trendingGuides[0].slug}`)}
                      className="w-full text-ui-micro uppercase tracking-ui-caps shadow-md shadow-ctp-sky-800/10"
                    >
                      Start This Guide
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/guides')}
                      className="text-ctp-subtext1 hover:text-ctp-sky-800 font-bold text-ui-micro uppercase tracking-ui-caps transition-colors"
                    >
                      Or Browse All Library
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card background="mantle" className="border-dashed py-10 text-center space-y-4">
                  <div className="w-10 h-10 bg-ctp-base border border-ctp-surface1 rounded-lg flex items-center justify-center mx-auto text-ctp-subtext1 shadow-inner">
                    <BookOpen size={20} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-ctp-text text-base">No active focus</p>
                    <p className="text-ui-micro text-ctp-subtext1 max-w-xs mx-auto px-4 font-medium">
                      Start tracking a procedure to see it here.
                    </p>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/guides')}
                    className="text-ctp-sky-800 font-bold text-ui-micro uppercase tracking-ui-caps"
                  >
                    Browse Library
                  </Button>
                </Card>
              )}
            </section>

            {/* Recent Updates */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Recent Updates</h2>
                  <Badge variant="sky" className="px-1.5 py-0">LATEST</Badge>
                </div>
                <Button 
                  variant="link"
                  onClick={() => router.push('/updates')}
                >
                  View All
                </Button>
              </div>
              <RecentlyUpdated />
            </section>

            {/* Recent Experiences - Hidden for non-onboarded auth users to focus on tutorial */}
            {(onboarded || !isLoggedIn) && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-ui-caps text-ctp-text">Community Feed</h2>
                  <Button 
                    variant="link"
                    onClick={() => router.push('/offices')}
                  >
                    View All
                  </Button>
                </div>
                <RecentExperiences limit={5} />
              </section>
            )}

            {!onboarded && isLoggedIn && (
              <OnboardingBanner />
            )}
            
            <Adsense variant="display" />
          </div>
        </div>

        <section className="py-12 border-t border-ctp-surface1">
          <Card background="base" noPadding className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 border-dashed relative overflow-hidden group">
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-ui-micro font-bold text-ctp-sky-800 uppercase tracking-ui-caps">Support Channel</span>
                <h3 className="text-xl font-bold tracking-tight text-ctp-text uppercase">Need further assistance?</h3>
              </div>
              <p className="text-ui-detail text-ctp-subtext1 max-w-lg font-medium leading-relaxed">
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
                onClick={() => router.push('/support')}
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

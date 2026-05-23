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
  CheckCircle2,
  TrendingUp,
  Search
} from 'lucide-react';

import { ChecklistCard } from '@/features/guides/components/tracking';
import { StartWithGoal, RecentExperiences, OnboardingBanner, RecentlyUpdated, TrendingWidget } from '@/features/guides/components/discovery';
import StatsCard from '@/components/dashboard/StatsCard';
import Adsense from '@/components/Adsense';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

/**
 * Dashboard Overview (Home).
 */
export default function HomeClient({ allGuides }) {
  const { activeGuideSlug, setActiveGuideSlug } = useWorkspace();
  const [officeSearch, setOfficeSearch] = useState('');
  const { data: session, status } = useSession();
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

  const popularSlugs = [
    'passport-appointment',
    'nbi-clearance',
    'sss-registration',
    'psa-birth-certificate',
    'national-id'
  ];

  const popularGuides = popularSlugs
    .map(slug => allGuides.find(g => g.slug === slug))
    .filter(Boolean);

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
      <PageHeader 
        title={status === 'loading' 
          ? 'Overview' 
          : isLoggedIn 
          ? `Welcome back, ${session.user.name?.split(' ')[0] || 'User'}` 
          : 'Welcome to AyosDocs'}
        description={isLoggedIn ? "Here's what's happening with your government applications." : "Your control center for Philippine government requirements."}
        compact
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-6 space-y-10">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            background="mantle" 
            className="group cursor-pointer hover:border-ctp-sky-800/30 transition-all border-dashed"
            onClick={() => router.push('/offices')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-ctp-sky-800/5 text-ctp-sky-800 flex items-center justify-center group-hover:bg-ctp-sky-800 group-hover:text-white transition-all">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Find an Office</h3>
                <p className="text-xs text-ctp-subtext1">Locate branches and check wait times</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-ctp-surface2 group-hover:text-ctp-sky-800 transition-colors" />
            </div>
          </Card>

          <Card 
            background="mantle" 
            className="group cursor-pointer hover:border-ctp-sky-800/30 transition-all border-dashed"
            onClick={() => router.push('/bundles')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-ctp-sky-800/5 text-ctp-sky-800 flex items-center justify-center group-hover:bg-ctp-sky-800 group-hover:text-white transition-all">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Plan a Life Event</h3>
                <p className="text-xs text-ctp-subtext1">Bundled guides for your major goals</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-ctp-surface2 group-hover:text-ctp-sky-800 transition-colors" />
            </div>
          </Card>

          <Card 
            background="mantle" 
            className="group cursor-pointer hover:border-ctp-sky-800/30 transition-all border-dashed"
            onClick={() => router.push('/guides')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-ctp-sky-800/5 text-ctp-sky-800 flex items-center justify-center group-hover:bg-ctp-sky-800 group-hover:text-white transition-all">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Browse Library</h3>
                <p className="text-xs text-ctp-subtext1">Search our database of 50+ guides</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-ctp-surface2 group-hover:text-ctp-sky-800 transition-colors" />
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {status === 'loading' || (isLoggedIn && isLoadingUserData) ? (
            <>
              <StatsCard.Skeleton />
              <StatsCard.Skeleton />
              <StatsCard.Skeleton />
              <StatsCard.Skeleton />
            </>
          ) : (
            <>
              <StatsCard 
                label="Active Trackers" 
                value={stats.active.toString()} 
                icon={Clock} 
                isLocked={!isLoggedIn}
                trend={{ value: "+2", isUp: true }}
              />
              <StatsCard 
                label="Completed" 
                value={stats.completed.toString()} 
                icon={CheckCircle2} 
                isLocked={!isLoggedIn}
              />
              <StatsCard 
                label="Total Guides" 
                value={allGuides.length.toString()} 
                icon={BookOpen} 
              />
              <StatsCard 
                label="User Reports" 
                value="1.2k" 
                icon={TrendingUp} 
                trend={{ value: "12%", isUp: true }}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Workflow */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Primary Workflow</h2>
                  <Badge variant="sky" className="text-[10px] px-1.5 py-0">ACTIVE</Badge>
                </div>
                {activeGuide && !isLoadingUserData && status !== 'loading' && (
                  <Link 
                    href="/my-docs"
                    className="text-[10px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
                  >
                    View All Activity
                  </Link>
                )}
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
                <Card background="mantle" className="border-dashed py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-ctp-base border border-ctp-surface1 rounded-xl flex items-center justify-center mx-auto text-ctp-subtext1 shadow-inner">
                    <BookOpen size={22} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-ctp-text">No active trackers</p>
                    <p className="text-xs text-ctp-subtext1 max-w-xs mx-auto">
                      Start tracking your progress by picking a guide from our knowledge base.
                    </p>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/guides')}
                    className="text-ctp-sky-800 font-bold text-[10px] uppercase tracking-widest"
                  >
                    Explore Guides
                  </Button>
                </Card>
              )}
            </section>

            {/* Life Event Bundles */}
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

            {/* Office Finder */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Intelligence Network</h2>
                <Link 
                  href="/offices"
                  className="text-[10px] font-bold uppercase tracking-widest text-ctp-sky-800 hover:text-ctp-sky-300 transition-colors"
                >
                  Live Status
                </Link>
              </div>
              <Card background="mantle" noPadding className="relative group overflow-hidden border-ctp-surface1">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--sky-800)_1.5px,transparent_1.5px)] [background-size:20px:20px] pointer-events-none" />
                
                <div className="relative z-10 p-6 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:scale-105 transition-all duration-300 shrink-0">
                      <MapPin size={30} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold tracking-tight text-ctp-text mb-1">Office Locator</h3>
                      <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed max-w-sm">
                        Find government branches, check real-time wait times, and read community reports.
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-end gap-2 relative z-10 shrink-0">
                    <form onSubmit={handleOfficeSearch} className="relative flex-1 md:w-64 lg:w-80">
                      <Input 
                        placeholder="Search city or agency..." 
                        value={officeSearch}
                        onChange={(e) => setOfficeSearch(e.target.value)}
                        maxLength={100}
                        containerClassName="space-y-0"
                        className="bg-ctp-base border-ctp-surface1 h-[50px]"
                      />
                    </form>
                    <Button 
                      onClick={handleOfficeSearch}
                      className="whitespace-nowrap h-[50px] px-8"
                    >
                      Locate
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
            {/* Popular Guides */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Trending Now</h2>
              </div>
              <div className="space-y-3">
                {popularGuides.length > 0 ? (
                  popularGuides.map((guide, idx) => {
                    const progress = userData?.savedProgress?.find(p => p.guideSlug === guide.slug);
                    return (
                      <TrendingWidget 
                        key={guide.slug} 
                        guide={guide} 
                        progress={progress}
                        stats={{ views: `${(5.2 - idx * 0.8).toFixed(1)}k` }}
                        variant="compact"
                        onFavorite={() => handleFavoriteGuide(guide.slug)}
                      />
                    );
                  })
                ) : (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TrendingWidget.Skeleton key={i} variant="compact" />
                  ))
                )}
              </div>
            </section>

            {/* Recent Experiences */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-ctp-surface1 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ctp-text">Community Feed</h2>
              </div>
              <RecentExperiences />
            </section>

            {!onboarded && isLoggedIn && (
              <OnboardingBanner />
            )}
            
            <Adsense variant="display" />
          </div>
        </div>

        <section className="py-12 border-t border-ctp-surface1">
          <Card background="mantle" noPadding className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 border-dashed">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-2xl font-bold tracking-tight text-ctp-text">Still have questions?</h3>
              <p className="text-sm text-ctp-subtext1 max-w-lg font-medium">
                Our help center and community contributors are ready to help you navigate through any government process.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary"
                onClick={() => router.push('/faqs')}
                className="px-6"
              >
                Help Center
              </Button>
              <Button 
                onClick={() => router.push('/contact')}
                className="px-6"
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

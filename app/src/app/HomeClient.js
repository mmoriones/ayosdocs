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
          ? `${session.user.isNewUser ? 'Welcome to AyosDocs' : 'Welcome back'}, ${session.user.name?.split(' ')[0] || 'User'}!` 
          : 'Overview'}
        description={status === 'loading'
          ? 'Access your government requirement checklists.'
          : isLoggedIn 
          ? "Track your applications and discover new guides." 
          : "Discover and plan your Philippine government document requirements."}
        actions={
          <Button 
            onClick={() => router.push('/guides')}
            leftIcon={<Search size={16} />}
          >
            Search Guides
          </Button>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                label="Active Guides" 
                value={stats.active.toString()} 
                icon={Clock} 
                isLocked={!isLoggedIn}
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
                label="Community Reports" 
                value="1.2k" 
                icon={TrendingUp} 
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Active Progress & Discovery */}
          <div className="lg:col-span-2 space-y-10">
            {/* Active Guide Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Active Workflow</h2>
                {activeGuide && !isLoadingUserData && status !== 'loading' && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/my-docs')}
                    className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold uppercase tracking-wider"
                  >
                    View All
                  </Button>
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
                <div className="bg-ctp-mantle border border-dashed border-ctp-surface1 rounded-xl p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-ctp-base border border-ctp-surface1 rounded-full flex items-center justify-center mx-auto text-ctp-subtext1">
                    <BookOpen size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">No active guides</p>
                    <p className="text-sm text-ctp-subtext1 max-w-xs mx-auto">
                      Start tracking your progress by picking a guide from our library.
                    </p>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/guides')}
                    className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold"
                  >
                    Browse Library
                  </Button>
                </div>
              )}
            </section>

            {/* Life Event Bundles */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Life Event Goals</h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/bundles')}
                  className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold uppercase tracking-wider"
                >
                  View All
                </Button>
              </div>
              <StartWithGoal />
            </section>

            {/* Office Finder Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Government Offices</h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/offices')}
                  className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold uppercase tracking-wider"
                >
                  View All
                </Button>
              </div>
              <Card background="mantle" noPadding className="relative group overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
                  <div className="flex items-center gap-5 lg:gap-6 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <MapPin size={28} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold tracking-tight leading-none whitespace-nowrap mb-2 text-ctp-text">Locate an Office</h3>
                      <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed max-w-md hidden sm:block">
                        Find government branches near you and check real-time wait times.
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-end gap-2 relative z-10 shrink-0">
                    <form onSubmit={handleOfficeSearch} className="relative flex-1 md:w-64 lg:w-80">
                      <Input 
                        placeholder="City or Agency..." 
                        value={officeSearch}
                        onChange={(e) => setOfficeSearch(e.target.value)}
                        containerClassName="space-y-0"
                      />
                    </form>
                    <Button 
                      onClick={handleOfficeSearch}
                      className="whitespace-nowrap h-[50px]"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Recently Updated */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Latest Changes</h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/updates')}
                  className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold uppercase tracking-wider"
                >
                  View All
                </Button>
              </div>
              <RecentlyUpdated />
            </section>
          </div>

          {/* Sidebar Column: Widgets */}
          <div className="space-y-10">
            {/* Popular Guides */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight">Popular Guides</h2>
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
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Recent Reports</h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/offices')}
                  className="text-ctp-sky-800 hover:text-ctp-sky-700 font-bold uppercase tracking-wider"
                >
                  View All
                </Button>
              </div>
              <RecentExperiences />
            </section>

            {!onboarded && isLoggedIn && (
              <OnboardingBanner />
            )}
            
            <Adsense variant="display" />
          </div>
        </div>

        <section className="py-8 border-t border-ctp-surface1">
          <Card background="mantle" noPadding className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight text-ctp-text">Need assistance?</h3>
              <p className="text-sm text-ctp-subtext1 max-w-md">
                Our help center and community are here to help you navigate complex requirements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary"
                onClick={() => router.push('/faqs')}
              >
                Help Center
              </Button>
              <Button 
                onClick={() => router.push('/contact')}
              >
                Contact Support
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

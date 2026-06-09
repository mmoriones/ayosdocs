'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthUI } from '@/components/Providers';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  LayoutGrid,
  Store,
  User,
  Home,
  Baby,
  Umbrella,
  Layers,
  Flame,
  TrendingUp,
  Target,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { bundles } from '@/data/bundles';
import { bundleStyles, iconStyles, THEMES, getIconTheme } from '@/lib/assetStyles';
import { Card, Button, Badge, SearchBar } from '@/components/ui';
import { GuideIcon, getIconName } from '@/lib/guideIcons';
import HolidayAlert from '@/components/HolidayAlert';

const CATEGORIES = [
  { title: "Gov IDs", theme: THEMES.ORANGE, image: "/assets/guides/Id.webp", cat: "Government ID" },
  { title: "Clearances", theme: THEMES.BLUE, image: "/assets/guides/ShieldCheck.webp", cat: "Government Clearance" },
  { title: "Civil Registry", theme: THEMES.PURPLE, image: "/assets/guides/FileText.webp", cat: "Civil Registry" },
  { title: "Business", theme: THEMES.GOLD, image: "/assets/guides/Briefcase.webp", cat: "Business Registration" },
  { title: "Travel", theme: THEMES.TEAL, image: "/assets/guides/Passport.webp", cat: "Travel" },
  { title: "Documents", theme: THEMES.GREEN, image: "/assets/guides/FileCheck.webp", cat: "Government Documents" },
];

export default function HomeClient({ allGuides }) {
  const { status, data: session } = useSession();
  const { activeGuideSlug } = useWorkspace();
  const isLoggedIn = status === 'authenticated';
  const firstName = session?.user?.name?.split(' ')[0] || 'Juan';

  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn,
  });

  // Select 4 trending guides dynamically for the guest view
  const trendingGuides = useMemo(() => {
    const slugs = [
      { slug: 'passport-appointment', trend: '+12%', theme: THEMES.BLUE },
      { slug: 'nbi-clearance', trend: '+8%', theme: THEMES.TEAL },
      { slug: 'psa-birth-certificate', trend: '+15%', theme: THEMES.GOLD },
      { slug: 'drivers-license', trend: '+5%', theme: THEMES.CORAL }
    ];
    return slugs.map(item => {
      const guide = allGuides.find(g => g.slug === item.slug);
      return guide ? { ...guide, trend: item.trend, theme: item.theme } : null;
    }).filter(Boolean);
  }, [allGuides]);

  return (
    <div className="min-h-screen pb-32 font-sans selection:bg-[#0038A8]/10 lg:pt-0 bg-ios-gradient">
      {isLoggedIn ? (
        <UserView 
          firstName={firstName} 
          userData={userData} 
          isLoading={isLoadingUserData}
          allGuides={allGuides}
          session={session}
          lastViewedSlug={activeGuideSlug}
          trendingGuides={trendingGuides}
        />
      ) : (
        <GuestView 
          trendingGuides={trendingGuides} 
          lastViewedSlug={activeGuideSlug}
          allGuides={allGuides}
        />
      )}
    </div>
  );
}

function GuestView({ trendingGuides, lastViewedSlug, allGuides }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { openAuthModal } = useAuthUI();
  const router = useRouter();

  const lastViewedGuide = useMemo(() => {
    if (!lastViewedSlug) return null;
    return allGuides.find(g => g.slug === lastViewedSlug);
  }, [lastViewedSlug, allGuides]);

  // Select the 4 essential bundles with specific backgrounds
  const essentialBundles = useMemo(() => {
    const config = [
      { id: 'first-job', image: '/assets/bundles/Job.webp', gradient: 'linear-gradient(to top, #E0EFFF 0%, #FDFDFD 100%)' },
      { id: 'travel-tourist', image: '/assets/bundles/Travel.webp', gradient: 'linear-gradient(to top, #F3E8FF 0%, #FDFDFD 100%)' },
      { id: 'wedding', image: '/assets/bundles/Marriage.webp', gradient: 'linear-gradient(to top, #FFE4F2 0%, #FDFDFD 100%)' },
      { id: 'foundational-docs', image: '/assets/bundles/GeneralIdentity.webp', gradient: 'linear-gradient(to top, #E4F9F2 0%, #FDFDFD 100%)' }
    ];
    return config.map(item => {
      const bundle = bundles.find(b => b.id === item.id);
      return bundle ? { ...bundle, bg: item.gradient, image: item.image } : null;
    }).filter(Boolean);
  }, []);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const itemWidth = 190 + 16; // 190 width + gap-4 (16px)
    
    // Check if we've reached the end of the scroll
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setActiveIndex(essentialBundles.length - 1);
      return;
    }

    const index = Math.round(scrollLeft / itemWidth);
    if (index !== activeIndex && index >= 0 && index < essentialBundles.length) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    const container = document.getElementById('bundle-carousel');
    if (container) {
      const itemWidth = 190 + 16;
      container.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
      {/* Hero Title */}
      <section className="px-6 py-8 lg:py-12">
        <h2 className="text-[34px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-[#1C1C1E] max-w-[600px]">
          Make government processes simple, <span className="text-[#0038A8]">together.</span>
        </h2>
      </section>

      {/* Modern Search Bar */}
      <SearchBar placeholder="What do you need to get done today?" className="max-w-2xl" allGuides={allGuides} />

      {/* Holiday Alert */}
      <HolidayAlert className="mb-10 px-6 animate-in fade-in slide-in-from-top-2 duration-1000 delay-150" />

      {/* Recently Viewed for Guest */}
      {lastViewedGuide && (
        <ResumeSection 
          guide={lastViewedGuide} 
          title="Recently Viewed"
          subtitle="Pick up where you left off"
          className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000"
        />
      )}

      {/* Bundles Section */}
      <section className="mb-12">
        <div className="px-6 mb-6 flex justify-between items-end lg:px-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] lg:text-[24px] font-bold text-[#1C1C1E]">Start Here</h3>
            <p className="text-[13px] lg:text-[15px] font-medium text-gray-400">Life Event Bundles</p>
          </div>
          <button 
            onClick={() => router.push('/bundles')}
            className="text-[14px] lg:text-[16px] font-bold text-[#0038A8] pb-0.5 active:opacity-60 transition-opacity"
          >
            View all
          </button>
        </div>
        
        {/* Carousel for Mobile, Grid for Desktop */}
        <div className="lg:hidden">
          <div 
            id="bundle-carousel"
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 px-6 scrollbar-hide snap-x snap-mandatory pb-6 scroll-pl-6"
          >
            {essentialBundles.map((bundle) => (
              <Card 
                key={bundle.id}
                interactive
                noPadding
                onClick={() => router.push(`/bundles/${bundle.id}`)}
                style={{ background: bundle.bg }}
                className="relative min-w-[190px] h-[260px] flex flex-col snap-start !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col px-5 pt-12 pb-8">
                  {/* Illustration Container */}
                  <div className="relative w-full h-20 shrink-0 px-4 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    <Image 
                      src={bundle.image} 
                      alt={bundle.title} 
                      fill 
                      sizes="200px"
                      className="object-contain object-bottom drop-shadow-[-6px_8px_12px_rgba(0,0,0,0.12)]"
                      priority={bundle.id === 'first-job'}
                    />
                  </div>

                  {/* Content Row */}
                  <div>
                      <h4 className="font-bold text-[#1C1C1E] text-[16px] leading-tight">
                        {bundle.title.split(' / ')[0]}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-500 leading-tight mt-1">
                        {bundle.description}
                      </p>
                    </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Functional Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {essentialBundles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx 
                    ? 'w-6 h-1.5 bg-[#0038A8]' 
                    : 'w-1.5 h-1.5 bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 px-10">
          {essentialBundles.map((bundle) => (
            <Card 
              key={bundle.id}
              interactive
              noPadding
              onClick={() => router.push(`/bundles/${bundle.id}`)}
              style={{ background: bundle.bg }}
              className="relative h-[300px] flex flex-col !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            >
              <div className="flex flex-col px-6 pt-14 pb-10">
                {/* Illustration Container */}
                <div className="relative w-full h-28 shrink-0 px-4 mb-10 transform group-hover:scale-110 transition-transform duration-500">
                  <Image 
                    src={bundle.image} 
                    alt={bundle.title} 
                    fill 
                    sizes="300px"
                    className="object-contain object-bottom drop-shadow-[-10px_12px_16px_rgba(0,0,0,0.12)]"
                  />
                </div>

                {/* Content Row */}
                <div>
                  <h4 className="font-bold text-[#1C1C1E] text-[20px] leading-tight">
                    {bundle.title.split(' / ')[0]}
                  </h4>
                  <p className="text-[13px] font-medium text-gray-500 leading-tight mt-1.5">
                    {bundle.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Auth Action Section */}
      <section className="px-6 mb-12 lg:px-10">
        <Card 
          interactive
          onClick={() => openAuthModal()}
          style={{ background: 'linear-gradient(to top, #EDF4FF 0%, #F8FAFF 100%)' }}
          className="w-full max-w-3xl border-white/60 flex flex-row items-center justify-between no-padding shadow-[0_8px_32px_rgba(0,56,168,0.03)]"
          noPadding
        >
          <div className="flex items-center gap-6 lg:gap-10 p-6 lg:p-10">
             <div className="w-14 h-14 lg:w-20 lg:h-20 shrink-0 relative">
               <Image 
                src="/assets/ui/Lock.webp" 
                alt="Lock" 
                fill 
                sizes="(max-width: 1024px) 56px, 80px"
                className="object-contain drop-shadow-[-6px_8px_12px_rgba(0,0,0,0.1)]"
              />
            </div>
            <div className="text-left space-y-1 lg:space-y-2">
              <h4 className="font-bold text-[#1C1C1E] text-base lg:text-xl">Login to AyosDocs</h4>
              <p className="text-[12px] lg:text-[14px] font-medium text-gray-400 leading-tight">
                Save your progress and access your documents anywhere.
              </p>
            </div>
          </div>
          <div className="pr-6 lg:pr-10">
            <ChevronRight size={22} className="text-[#0038A8] shrink-0 opacity-30" strokeWidth={2.5} />
          </div>
        </Card>
      </section>

      {/* Browse by Category Section */}
      <section className="mb-12">
        <div className="px-6 mb-6 flex justify-between items-end lg:px-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] lg:text-[24px] font-bold text-[#1C1C1E]">Explore Topics</h3>
            <p className="text-[13px] lg:text-[15px] font-medium text-gray-400">Knowledge Base</p>
          </div>
          <button 
            onClick={() => router.push('/guides')}
            className="text-[14px] lg:text-[16px] font-bold text-[#0038A8] pb-0.5 active:opacity-60 transition-opacity"
          >
            View all
          </button>
        </div>

        {/* Carousel for Mobile */}
        <div className="lg:hidden">
          <SnapCarousel 
            id="guest-category-carousel"
            itemWidth={140 + 16}
            items={CATEGORIES}
            renderItem={(item) => (
              <CategoryCard 
                title={item.title} 
                theme={item.theme} 
                image={item.image}
                onClick={() => router.push(`/guides?category=${item.cat}`)}
              />
            )}
          />
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-6 gap-6 px-10">
          {CATEGORIES.map((item, idx) => (
            <CategoryCard 
              key={idx}
              title={item.title} 
              theme={item.theme} 
              image={item.image}
              onClick={() => router.push(`/guides?category=${item.cat}`)}
            />
          ))}
        </div>
      </section>

      {/* Trending / Community Insights Section */}
      <section className="px-6 pb-12 lg:px-10">
        <div className="mb-6 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] lg:text-[24px] font-bold text-[#1C1C1E]">Trending Now</h3>
            <p className="text-[13px] lg:text-[15px] font-medium text-gray-400">Most searched by the community</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trendingGuides.map((guide) => (
            <TrendingCard 
              key={guide.slug}
              title={guide.shortTitle || guide.title} 
              agency={guide.agency} 
              trend={guide.trend} 
              slug={guide.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrendingCard({ title, agency, trend, slug }) {
  const router = useRouter();
  const { setActiveGuideSlug } = useWorkspace();
  
  return (
    <Card 
      interactive
      onClick={() => {
        setActiveGuideSlug(slug);
        router.push(`/guides/${slug}`);
      }}
      style={{ background: 'linear-gradient(to top, #F2F4FC 0%, #FFFFFF 100%)' }}
      className="p-5 text-left !border-white/60 flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
      noPadding
    >
      <div className="mb-5">
        <GuideIcon 
          slug={slug} 
          agency={agency} 
          size={36} 
          className="drop-shadow-[-4px_6px_10px_rgba(0,0,0,0.1)]" 
        />
      </div>
      <div className="space-y-0.5 mt-auto">
        <h5 className="font-bold text-[#1C1C1E] text-[13px] leading-tight line-clamp-2">{title}</h5>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{agency}</span>
          <span className="text-[10px] font-black text-[#34C759]">{trend}</span>
        </div>
      </div>
    </Card>
  );
}

function UserView({ firstName, userData, isLoading, allGuides, session, lastViewedSlug, trendingGuides }) {
  const router = useRouter();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const stats = useMemo(() => {
    return {
      guides: userData?.savedProgress?.length || 0,
      bundles: userData?.trackedBundles?.length || 0,
      saved: userData?.savedProgress?.filter(p => p.isFavorite).length || 0
    };
  }, [userData]);

  const latestActiveGuide = useMemo(() => {
    if (!userData?.savedProgress) return null;
    
    const activeGuides = userData.savedProgress
      .filter(p => {
        const guide = allGuides.find(g => g.slug === p.guideSlug);
        const total = guide?.checklist?.length || 0;
        const done = p.completedTasks?.split(',').filter(Boolean).length || 0;
        return total > 0 && done < total;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
    if (activeGuides.length === 0) return null;
    
    const p = activeGuides[0];
    const guide = allGuides.find(g => g.slug === p.guideSlug);
    const total = guide?.checklist?.length || 0;
    const done = p.completedTasks?.split(',').filter(Boolean).length || 0;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    
    return {
      ...guide,
      progress,
      updatedAt: p.updatedAt
    };
  }, [userData, allGuides]);

  const lastViewedGuide = useMemo(() => {
    if (!lastViewedSlug) return null;
    return allGuides.find(g => g.slug === lastViewedSlug);
  }, [lastViewedSlug, allGuides]);

  const pulseData = useMemo(() => {
    if (!userData) return null;

    // 1. Weekly Momentum (Tasks completed in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let weeklyTasks = 0;
    (userData.savedProgress || []).forEach(p => {
       if (new Date(p.updatedAt) > sevenDaysAgo) {
          const count = p.completedTasks?.split(',').filter(Boolean).length || 0;
          weeklyTasks += count;
       }
    });

    // 2. Active Milestone
    let activeMilestone = null;
    if (userData.trackedBundles?.length > 0) {
       const tb = userData.trackedBundles[0];
       const bundle = bundles.find(b => b.id === tb.bundleId);
       if (bundle) {
          const allBundleGuides = bundle.flow.flatMap(f => f.guides);
          const completedGuides = (userData.savedProgress || []).filter(p => 
             allBundleGuides.includes(p.guideSlug) && 
             (allGuides.find(g => g.slug === p.guideSlug)?.checklist?.length || 0) === p.completedTasks?.split(',').filter(Boolean).length
          ).length;
          const percent = Math.round((completedGuides / (allBundleGuides.length || 1)) * 100);
          activeMilestone = { title: bundle.title.split(' / ')[0], percent };
       }
    }

    // 3. Streak (Simplified: Days active based on updates)
    const updateDates = (userData.savedProgress || []).map(p => new Date(p.updatedAt).toDateString());
    const uniqueDates = [...new Set(updateDates)];
    let streak = uniqueDates.length > 0 ? 1 : 0; // Simple placeholder for now

    return { weeklyTasks, activeMilestone, streak };
  }, [userData, allGuides]);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md lg:max-w-[1600px] mx-auto lg:px-10">
      {/* Personalized Greeting */}
      <section className="px-6 py-6">
        <h2 className="text-[34px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
          {greeting}, {firstName}!
        </h2>
        <p className="text-[17px] font-medium text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your government processes.
        </p>
      </section>

      {/* Search Bar for Logged-in User */}
      <SearchBar placeholder="Search for a guide or agency..." allGuides={allGuides} />

      {/* Holiday Alert */}
      <HolidayAlert className="mb-8 px-6 animate-in fade-in slide-in-from-top-2 duration-1000" />

      {/* Unified Stats Card */}
      <section className="px-6 mb-10">
        <div 
          style={{ background: 'linear-gradient(to top, #F8FAFF 0%, #FFFFFF 100%)' }}
          className="rounded-[32px] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white flex items-center justify-between"
        >
           <StatItem 
             icon={<LayoutGrid size={22} className="text-white" strokeWidth={3} />} 
             bg="bg-[#007AFF]" 
             value={stats.guides} 
             label="Guides" 
           />
           <div className="w-px h-12 bg-gray-100 shrink-0" />
           <StatItem 
             icon={<Layers size={22} className="text-white" strokeWidth={3} />} 
             bg="bg-[#34C759]" 
             value={stats.bundles} 
             label="Bundles" 
           />
           <div className="w-px h-12 bg-gray-100 shrink-0" />
           <StatItem 
             icon={<Bookmark size={22} className="text-white" fill="currentColor" />} 
             bg="bg-[#AF52DE]" 
             value={stats.saved} 
             label="Saved" 
           />
        </div>
      </section>

      {/* Resume Section */}
      {latestActiveGuide ? (
        <ResumeSection 
          guide={latestActiveGuide}
          progress={latestActiveGuide.progress}
          title="Continue Where You Left Off"
          className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
        />
      ) : lastViewedGuide ? (
        <ResumeSection 
          guide={lastViewedGuide}
          title="Pick Up Where You Left Off"
          subtitle="Recently Viewed"
          className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
        />
      ) : (
        <section className="px-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-[19px] font-bold text-[#1C1C1E] mb-4">Continue Where You Left Off</h3>
          <Card 
            interactive
            onClick={() => router.push('/guides')}
            className="w-full p-8 flex flex-col items-center justify-center gap-4 text-center border-dashed border-2 border-gray-200 bg-gray-50/50"
            noPadding
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Search className="text-gray-300" size={32} />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1E]">No recent activity</h4>
              <p className="text-[13px] text-gray-400 mt-1">Start a new process to track it here.</p>
            </div>
          </Card>
        </section>
      )}

      {/* Activity Pulse (Minimized Analytics) */}
      {pulseData && (
        <ActivityPulse data={pulseData} />
      )}

      {/* Browse by Category - Horizontal Scroll */}
      <section className="mb-12">
        <div className="px-6 mb-4 flex justify-between items-end lg:px-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] lg:text-[24px] font-bold text-[#1C1C1E]">Browse by Category</h3>
            <p className="text-[13px] lg:text-[15px] font-medium text-gray-400 uppercase tracking-tight">Knowledge Base</p>
          </div>
          <button 
            onClick={() => router.push('/guides')}
            className="text-[14px] lg:text-[16px] font-bold text-[#0038A8] pb-0.5 active:opacity-60 transition-opacity hidden lg:block"
          >
            View all
          </button>
        </div>
        
        {/* Carousel for Mobile */}
        <div className="lg:hidden">
          <SnapCarousel 
            id="category-carousel"
            itemWidth={140 + 16}
            items={CATEGORIES}
            renderItem={(item) => (
              <CategoryCard 
                title={item.title} 
                theme={item.theme} 
                image={item.image}
                onClick={() => router.push(`/guides?category=${item.cat}`)}
              />
            )}
          />
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-6 gap-6 px-10">
          {CATEGORIES.map((item, idx) => (
            <CategoryCard 
              key={idx}
              title={item.title} 
              theme={item.theme} 
              image={item.image}
              onClick={() => router.push(`/guides?category=${item.cat}`)}
            />
          ))}
        </div>
      </section>

      {/* Trending Section for Logged-in User */}
      <section className="px-6 pb-12">
        <div className="mb-6 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] font-bold text-[#1C1C1E]">Trending Now</h3>
            <p className="text-[13px] font-medium text-gray-400 uppercase tracking-tight">Community Pulse</p>
          </div>
          <button 
            onClick={() => router.push('/guides')}
            className="text-[14px] font-bold text-[#0038A8] pb-0.5 active:opacity-60 transition-opacity"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trendingGuides.map((guide) => (
            <TrendingCard 
              key={guide.slug}
              title={guide.shortTitle || guide.title} 
              agency={guide.agency} 
              trend={guide.trend} 
              slug={guide.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityPulse({ data }) {
  return (
    <section className="px-6 mb-10">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-[19px] font-bold text-[#1C1C1E]">Activity Pulse</h3>
        <p className="text-[13px] font-medium text-gray-400 tracking-tight uppercase">Weekly Snapshot</p>
      </div>
      <div 
        style={{ background: 'linear-gradient(to top, #F8FAFF 0%, #FFFFFF 100%)' }}
        className="rounded-[32px] p-2 shadow-[0_8px_32px_rgba(0,56,168,0.03)] border border-white flex items-center justify-between"
      >
        {/* Weekly Momentum */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 border-r border-gray-100">
           <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
             <TrendingUp size={18} className="text-[#0038A8]" />
           </div>
           <span className="text-[18px] font-black text-[#1C1C1E]">{data.weeklyTasks}</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 text-center">Tasks Done</span>
        </div>

        {/* Milestone */}
        <div className="flex-[1.5] flex flex-col px-4 py-4 border-r border-gray-100">
           <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-[#34C759]" />
              <span className="text-[10px] font-bold text-gray-400 uppercase truncate">
                {data.activeMilestone?.title || 'No active goal'}
              </span>
           </div>
           <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-1.5">
              <div 
                className="bg-[#34C759] h-full rounded-full transition-all duration-1000" 
                style={{ width: `${data.activeMilestone?.percent || 0}%` }}
              />
           </div>
           <span className="text-[12px] font-black text-[#1C1C1E]">{data.activeMilestone?.percent || 0}% Complete</span>
        </div>

        {/* Streak */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
           <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
             <Flame size={18} className="text-[#FF9500]" />
           </div>
           <span className="text-[18px] font-black text-[#1C1C1E]">{data.streak} Day</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 text-center">Streak</span>
        </div>
      </div>
    </section>
  );
}

function StatItem({ icon, bg, value, label }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-4">
      <div className={`w-10 h-10 ${bg} rounded-[14px] flex items-center justify-center mb-3 shadow-sm`}>
         {icon}
      </div>
      <div className="flex flex-col items-center">
         <span className="text-[20px] font-black text-[#1C1C1E] leading-none">{value}</span>
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</span>
      </div>
    </div>
  );
}

function ResumeSection({ guide, progress, title, subtitle, className = "mb-10" }) {
  const router = useRouter();
  if (!guide) return null;

  return (
    <section className={`px-6 ${className}`}>
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-[19px] font-bold text-[#1C1C1E]">{title}</h3>
        {subtitle && (
          <p className="text-[13px] font-medium text-gray-400 tracking-tight uppercase">{subtitle}</p>
        )}
      </div>
      <ResumeCard 
        guide={guide} 
        progress={progress}
        onClick={() => router.push(`/guides/${guide.slug}`)} 
      />
    </section>
  );
}

function ResumeCard({ guide, progress, onClick }) {
  const agency = Array.isArray(guide.agency) ? guide.agency[0] : guide.agency;
  const title = guide.shortTitle || guide.title;
  const { setActiveGuideSlug } = useWorkspace();

  // Prioritize theme based on visual keyword for optimal contrast
  const iconName = getIconName(guide.slug, guide.agency);
  const theme = getIconTheme(guide.slug, guide.agency, iconName);

  const handleInteract = () => {
    setActiveGuideSlug(guide.slug);
    if (onClick) onClick();
  };

  return (
    <Card 
      interactive
      onClick={handleInteract}
      style={{ background: theme.gradient }}
      className="w-full flex items-center justify-between group px-5 py-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
      noPadding
    >
      <div className="flex items-center gap-4">
        {/* Simple Icon Wrapper */}
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <GuideIcon 
            slug={guide.slug} 
            agency={guide.agency} 
            size={48} 
            className="object-contain drop-shadow-md" 
          />
        </div>

        <div className="text-left">
          <h4 className="font-bold text-[#1C1C1E] text-[17px] leading-tight line-clamp-1">
            {title}
          </h4>
          <p className="text-[13px] font-medium text-gray-500 mt-0.5 uppercase tracking-tight">
            {agency}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {progress !== undefined && (
          <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="5" fill="transparent" />
                <circle 
                  cx="32" cy="32" r="28" 
                  stroke={theme.ring} 
                  strokeWidth="5" 
                  fill="transparent" 
                  strokeDasharray={175.9} 
                  strokeDashoffset={175.9 * (1 - progress / 100)} 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="absolute text-[13px] font-black text-[#1C1C1E]">{progress}%</span>
          </div>
        )}
        <ChevronRight size={18} className="text-[#1C1C1E]/20 group-active:text-[#0038A8] transition-colors" strokeWidth={3} />
      </div>
    </Card>
  );
}

function CategoryCard({ title, theme, image, onClick }) {
  return (
    <Card 
      interactive
      noPadding
      onClick={onClick}
      style={{ background: theme.gradient }}
      className="relative min-w-[140px] h-[180px] lg:h-[220px] flex flex-col !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden group"
    >
      <div className="flex flex-col items-center justify-between h-full p-5 lg:p-6">
        {/* Icon Container */}
        <div className="relative w-16 h-16 lg:w-24 lg:h-24 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
          <Image 
            src={image} 
            alt={title} 
            fill 
            sizes="(max-width: 1024px) 64px, 96px"
            className="object-contain drop-shadow-[-6px_8px_12px_rgba(0,0,0,0.12)]"
          />
        </div>

        {/* Title */}
        <div className="text-center w-full">
          <h4 className="font-bold text-[#1C1C1E] text-[15px] lg:text-[17px] leading-tight">
            {title}
          </h4>
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-700">
         <Image src={image} alt="" fill className="object-contain" />
      </div>
    </Card>
  );
}

function SnapCarousel({ id, items, renderItem, itemWidth, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setActiveIndex(items.length - 1);
      return;
    }

    const index = Math.round(scrollLeft / itemWidth);
    if (index !== activeIndex && index >= 0 && index < items.length) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    const container = document.getElementById(id);
    if (container) {
      container.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className={className}>
      <div 
        id={id}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 px-6 scrollbar-hide snap-x snap-mandatory pb-4 scroll-pl-6"
      >
        {items.map((item, index) => (
          <div key={index} className="snap-start shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx 
                ? 'w-6 h-1.5 bg-[#0038A8]' 
                : 'w-1.5 h-1.5 bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

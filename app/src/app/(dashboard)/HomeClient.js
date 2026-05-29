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
} from 'lucide-react';
import Image from 'next/image';
import { bundles } from '@/data/bundles';
import { bundleStyles, iconStyles, THEMES, getIconTheme } from '@/lib/assetStyles';
import { Card, Button, Input, Badge } from '@/components/ui';
import { GuideIcon, getIconName } from '@/lib/guideIcons';
import HolidayAlert from '@/components/HolidayAlert';

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
      { slug: 'passport-appointment', trend: '+12%' },
      { slug: 'nbi-clearance', trend: '+8%' },
      { slug: 'psa-birth-certificate', trend: '+15%' },
      { slug: 'drivers-license', trend: '+5%' }
    ];
    return slugs.map(item => {
      const guide = allGuides.find(g => g.slug === item.slug);
      return guide ? { ...guide, trend: item.trend } : null;
    }).filter(Boolean);
  }, [allGuides]);

  return (
    <div className="min-h-screen pb-32 font-sans selection:bg-[#0038A8]/10 lg:pt-0">
      {isLoggedIn ? (
        <UserView 
          firstName={firstName} 
          userData={userData} 
          isLoading={isLoadingUserData}
          allGuides={allGuides}
          session={session}
          lastViewedSlug={activeGuideSlug}
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
      { id: 'first-job', image: '/assets/bundles/Job.webp', gradient: 'linear-gradient(to top, #E0EFFF 0%, #FFFFFF 100%)' },
      { id: 'travel-tourist', image: '/assets/bundles/Travel.webp', gradient: 'linear-gradient(to top, #F3E8FF 0%, #FFFFFF 100%)' },
      { id: 'wedding', image: '/assets/bundles/Marriage.webp', gradient: 'linear-gradient(to top, #FFE4F2 0%, #FFFFFF 100%)' },
      { id: 'foundational-docs', image: '/assets/bundles/GeneralIdentity.webp', gradient: 'linear-gradient(to top, #E4F9F2 0%, #FFFFFF 100%)' }
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
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center lg:hidden">
        <h1 className="text-2xl font-black text-[#0038A8] tracking-tight">AyosDocs</h1>
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => openAuthModal()}
          leftIcon={<User size={18} strokeWidth={2.5} />}
          className="h-11 rounded-full shadow-sm"
        >
          Sign in
        </Button>
      </header>

      {/* Hero Title */}
      <section className="px-6 py-8 lg:py-12">
        <h2 className="text-[34px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-[#1C1C1E] max-w-[600px]">
          Make government processes simple, <span className="text-[#0038A8]">together.</span>
        </h2>
      </section>

      {/* Modern Search Bar */}
      <HomeSearchBar placeholder="What do you need to get done today?" className="max-w-2xl" />

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
                onClick={() => router.push(`/bundles/${bundle.id}`)}
                style={{ background: bundle.bg }}
                className="relative min-w-[190px] h-[260px] flex flex-col justify-center gap-3 snap-start !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                {/* Illustration Container */}
                <div className="relative w-full h-16 shrink-0 px-4 transform group-hover:scale-110 transition-transform duration-500">
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
                <div className="space-y-1">
                    <h4 className="font-bold text-[#1C1C1E] text-[16px] leading-tight line-clamp-2">
                      {bundle.title.split(' / ')[0]}
                    </h4>
                    <p className="text-[11px] font-medium text-gray-500 leading-tight line-clamp-2">
                      {bundle.description}
                    </p>
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
              onClick={() => router.push(`/bundles/${bundle.id}`)}
              style={{ background: bundle.bg }}
              className="relative h-[300px] flex flex-col justify-center gap-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            >
              {/* Illustration Container */}
              <div className="relative w-full h-28 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                <Image 
                  src={bundle.image} 
                  alt={bundle.title} 
                  fill 
                  sizes="300px"
                  className="object-contain object-bottom drop-shadow-[-10px_12px_16px_rgba(0,0,0,0.12)]"
                />
              </div>

              {/* Content Row */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#1C1C1E] text-[20px] leading-tight">
                  {bundle.title.split(' / ')[0]}
                </h4>
                <p className="text-[13px] font-medium text-gray-500 leading-tight">
                  {bundle.description}
                </p>
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
              <h4 className="font-bold text-[#1C1C1E] text-base lg:text-xl">Sign in to AyosDocs</h4>
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

      {/* Trending / Community Insights Section */}
      <section className="px-6 pb-12 lg:px-10">
        <div className="mb-6 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] lg:text-[24px] font-bold text-[#1C1C1E]">Trending Now</h3>
            <p className="text-[13px] lg:text-[15px] font-medium text-gray-400">Most searched by the community</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trendingGuides.map((guide) => {
            const iconName = getIconName(guide.slug, guide.agency);
            const theme = getIconTheme(guide.slug, guide.agency, iconName);
            return (
              <TrendingCard 
                key={guide.slug}
                title={guide.shortTitle || guide.title.split(' / ')[0]} 
                agency={guide.agency} 
                trend={guide.trend} 
                slug={guide.slug}
                theme={theme}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TrendingCard({ title, agency, trend, slug, theme }) {
  const router = useRouter();
  const { setActiveGuideSlug } = useWorkspace();
  
  return (
    <Card 
      interactive
      onClick={() => {
        setActiveGuideSlug(slug);
        router.push(`/guides/${slug}`);
      }}
      style={{ background: theme.gradient }}
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
        <h5 className="font-bold text-[#1C1C1E] text-[14px] leading-tight line-clamp-1">{title}</h5>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{agency}</span>
          <span className="text-[10px] font-black text-[#34C759]">{trend}</span>
        </div>
      </div>
    </Card>
  );
}

function UserView({ firstName, userData, isLoading, allGuides, session, lastViewedSlug }) {
  const router = useRouter();

  const stats = useMemo(() => {
    if (!userData?.savedProgress) return { active: 0, completed: 0, saved: 0 };

    let active = 0;
    let completed = 0;
    let saved = 0;

    userData.savedProgress.forEach(p => {
      const guide = allGuides.find(g => g.slug === p.guideSlug);
      const total = guide?.checklist?.length || 0;
      const done = p.completedTasks?.split(',').filter(Boolean).length || 0;

      if (total > 0) {
        if (done < total) active++;
        else if (done === total) completed++;
      }
      
      if (p.isFavorite) saved++;
    });

    return { active, completed, saved };
  }, [userData, allGuides]);

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

  const userBundles = useMemo(() => {
    // Priority: Actual tracked bundles
    const tracked = (userData?.trackedBundles || []).map(tb => {
      const bundle = bundles.find(b => b.id === tb.bundleId);
      if (!bundle) return null;
      
      const totalGuides = bundle.flow?.reduce((acc, f) => acc + (f.guides?.length || 0), 0) || 0;
      const style = bundleStyles[bundle.id] || THEMES.BLUE;
      
      const assetMap = {
        'business': '/assets/bundles/Business.webp',
        'foundational-docs': '/assets/bundles/GeneralIdentity.webp',
        'first-job': '/assets/bundles/Job.webp',
        'wedding': '/assets/bundles/Marriage.webp',
        'ofw': '/assets/bundles/Ofw.webp',
        'senior-citizen': '/assets/bundles/SeniorCouple.webp',
        'solo-parent': '/assets/bundles/SoloParent.webp',
        'travel-tourist': '/assets/bundles/Travel.webp',
        'pwd-benefits': '/assets/bundles/WheelChair.webp'
      };

      return {
        ...bundle,
        docs: `${totalGuides} documents`,
        bgColor: style.bg,
        image: assetMap[bundle.id] || '/assets/bundles/GeneralIdentity.webp'
      };
    }).filter(Boolean);

    if (tracked.length >= 4) return tracked.slice(0, 4);

    // Fallback/Fill with defaults
    const defaults = [
      { id: 'business', image: '/assets/bundles/Business.webp' },
      { id: 'foundational-docs', image: '/assets/bundles/GeneralIdentity.webp' },
      { id: 'first-job', image: '/assets/bundles/Job.webp' },
      { id: 'senior-citizen', image: '/assets/bundles/SeniorCouple.webp' }
    ];

    const filled = [...tracked];
    defaults.forEach(d => {
      if (filled.length < 4 && !filled.find(f => f.id === d.id)) {
        const bundle = bundles.find(b => b.id === d.id);
        if (bundle) {
           const totalGuides = bundle.flow?.reduce((acc, f) => acc + (f.guides?.length || 0), 0) || 0;
           const style = bundleStyles[bundle.id] || THEMES.BLUE;
           filled.push({
             ...bundle,
             docs: `${totalGuides} documents`,
             bgColor: style.bg,
             image: d.image
           });
        }
      }
    });

    return filled.slice(0, 4);
  }, [userData]);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-center lg:hidden">
        <h1 className="text-2xl font-black text-[#0038A8] tracking-tight">AyosDocs</h1>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <Bell size={26} className="text-[#1C1C1E]" strokeWidth={1.5} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm active:scale-95 transition-transform">
             {session?.user?.image ? (
               <Image src={session.user.image} width={40} height={40} alt="Profile" className="object-cover" />
             ) : (
               <div className="w-full h-full bg-[#0038A8]/10 flex items-center justify-center text-[#0038A8]">
                 <User size={20} />
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Personalized Greeting */}
      <section className="px-6 py-6">
        <h2 className="text-[34px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
          Mabuhay, {firstName}!
        </h2>
        <p className="text-[17px] font-medium text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your government processes.
        </p>
      </section>

      {/* Search Bar for Logged-in User */}
      <HomeSearchBar placeholder="Search for a guide or agency..." />

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
             value={stats.active} 
             label="Active" 
           />
           <div className="w-px h-12 bg-gray-100 shrink-0" />
           <StatItem 
             icon={<CheckCircle2 size={22} className="text-white" strokeWidth={3} />} 
             bg="bg-[#34C759]" 
             value={stats.completed} 
             label="Completed" 
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

      {/* 2x2 Favorites Grid */}
      <section className="px-6 pb-10">
        <h3 className="text-[19px] font-bold text-[#1C1C1E] mb-4">Your Favorite Bundles</h3>
        <div className="grid grid-cols-2 gap-4">
          {userBundles.map((bundle) => (
            <BundleGridCard 
              key={bundle.id}
              title={bundle.title.split(' / ')[0]} 
              docs={bundle.docs} 
              bgColor={bundle.bgColor.startsWith('var') ? `bg-[${bundle.bgColor}]` : ''} 
              style={{ backgroundColor: bundle.bgColor.startsWith('var') ? undefined : bundle.bgColor }}
              image={bundle.image}
              onClick={() => router.push(`/bundles/${bundle.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
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
  const title = guide.shortTitle || guide.title.split(' / ')[0];
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
function HomeSearchBar({ placeholder = "What do you need to get done today?", className = "" }) {
  const [query, setQuery] = useState('');
  
  return (
    <section className={`px-6 mb-8 ${className}`}>
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        leftIcon={Search}
        className="h-16 shadow-[0_8px_32px_rgba(0,56,168,0.04)]"
      />
    </section>
  );
}

function BundleGridCard({ title, docs, bgColor, image, onClick, style }) {

  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-[28px] p-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white active:scale-[0.97] transition-all group relative"
    >
      <div className="flex items-start gap-3">
        <div 
          className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border border-black/5 overflow-hidden p-1 ${bgColor}`}
          style={style}
        >
          <div className="w-full h-full relative">
            <Image src={image} alt={title} fill className="object-contain drop-shadow-sm" />
          </div>
        </div>
        <div className="space-y-0.5 min-w-0">
          <h5 className="font-bold text-[#1C1C1E] text-[14px] leading-tight line-clamp-2">{title}</h5>
          <p className="text-[11px] font-medium text-gray-400">{docs}</p>
        </div>
      </div>
      <div className="absolute bottom-3 right-3">
        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0038A8] transition-colors" strokeWidth={3} />
      </div>
    </button>
  );
}

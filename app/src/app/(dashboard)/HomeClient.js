'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthUI } from '@/components/Providers';
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
import { bundleStyles, iconStyles, THEMES } from '@/lib/assetStyles';
import { Card, Button, Input, Badge } from '@/components/ui';
import { GuideIcon } from '@/lib/guideIcons';

export default function HomeClient({ allGuides }) {
  const { status, data: session } = useSession();
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
        />
      ) : (
        <GuestView trendingGuides={trendingGuides} />
      )}
    </div>
  );
}

function GuestView({ trendingGuides }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { openAuthModal } = useAuthUI();
  const router = useRouter();

  // Select the 4 essential bundles with specific backgrounds
  const essentialBundles = useMemo(() => {
    const config = [
      { id: 'first-job', image: '/assets/bundles/Job.webp' },
      { id: 'travel-tourist', image: '/assets/bundles/Travel.webp' },
      { id: 'wedding', image: '/assets/bundles/Marriage.webp' },
      { id: 'foundational-docs', image: '/assets/bundles/GeneralIdentity.webp' }
    ];
    return config.map(item => {
      const bundle = bundles.find(b => b.id === item.id);
      const style = bundleStyles[item.id] || bundleStyles['foundational-docs'];
      return bundle ? { ...bundle, bg: style.gradient, image: item.image } : null;
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
      <section className="px-6 mb-12 max-w-2xl">
        <Input 
          placeholder="What do you need to get done today?"
          leftIcon={Search}
          className="h-16"
        />
      </section>

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
          style={{ background: 'radial-gradient(circle at bottom right, #bbd6fd, #e8f1ff)' }}
          className="w-full max-w-3xl border-white/50 flex flex-row items-center justify-between no-padding"
          noPadding
        >
          <div className="flex items-center gap-6 lg:gap-10 p-6 lg:p-10">
             <div className="w-14 h-14 lg:w-20 lg:h-20 shrink-0 relative">
               <Image 
                src="/assets/icons/Lock.webp" 
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
          {trendingGuides.map((guide, idx) => {
            const themes = [THEMES.BLUE, THEMES.PURPLE, THEMES.GREEN, THEMES.ORANGE];
            const theme = themes[idx % themes.length];
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
  
  return (
    <Card 
      interactive
      onClick={() => router.push(`/guides/${slug}`)}
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

function UserView({ firstName, userData, isLoading, allGuides, session }) {
  const router = useRouter();

  const activeGuidesCount = useMemo(() => {
    return userData?.savedProgress?.filter(p => {
       const total = allGuides.find(g => g.slug === p.guideSlug)?.checklist?.length || 0;
       const done = p.completedTasks?.split(',').filter(Boolean).length || 0;
       return done < total;
    }).length || 0;
  }, [userData, allGuides]);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-center lg:hidden">
        <h1 className="text-2xl font-black text-[#0038A8] tracking-tight">AyosDocs</h1>
        <div className="flex items-center gap-3">
          <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white active:scale-95 transition-transform">
            <Bell size={22} className="text-[#1C1C1E]" strokeWidth={1.5} />
          </button>
          <div className="w-11 h-11 rounded-full bg-[#0038A8]/10 overflow-hidden border-[3px] border-white shadow-md active:scale-95 transition-transform">
             {session?.user?.image ? (
               <Image src={session.user.image} width={44} height={44} alt="Profile" className="object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-[#0038A8]">
                 <LayoutGrid size={20} />
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Personalized Greeting */}
      <section className="px-6 py-6">
        <h2 className="text-[34px] font-bold tracking-tight text-[#1C1C1E]">
          Mabuhay, {firstName}!
        </h2>
        <p className="text-[15px] font-medium text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your government processes.
        </p>
      </section>

      {/* 3-Column Stats Grid */}
      <section className="px-6 grid grid-cols-3 gap-3.5 mb-10">
        <StatCard 
          icon={<LayoutGrid size={22} className="text-[#0038A8]" strokeWidth={2.5} />} 
          bg="bg-[#E8F1FF]" 
          value={activeGuidesCount} 
          label="Active Guides" 
        />
        <StatCard 
          icon={<CheckCircle2 size={22} className="text-[#34C759]" strokeWidth={2.5} />} 
          bg="bg-[#EAF9EE]" 
          value={userData?.savedProgress?.length || 0} 
          label="Completed" 
        />
        <StatCard 
          icon={<Bookmark size={22} className="text-[#AF52DE]" fill="currentColor" />} 
          bg="bg-[#F4EBFF]" 
          value={userData?.favorites?.length || 0} 
          label="Saved" 
        />
      </section>

      {/* Resume Section */}
      <section className="px-6 mb-10">
        <h3 className="text-[19px] font-bold text-[#1C1C1E] mb-5">Continue Where You Left Off</h3>
        <button 
          onClick={() => router.push('/guides/passport-appointment')}
          className="w-full bg-white rounded-[36px] p-6 flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white active:scale-[0.99] transition-all group"
        >
          {/* Passport Thumbnail Placeholder */}
          <div className="w-18 h-24 bg-[#001D4A] rounded-xl shadow-lg flex flex-col items-center justify-center p-2.5 mr-6 shrink-0 border border-white/10">
             <div className="w-full text-center text-[6px] font-bold text-white/40 uppercase mb-1">Pilipinas</div>
             <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center mb-1">
                <div className="w-5 h-5 bg-[#FFCC00] rounded-full blur-[2px]"></div>
             </div>
             <div className="w-full text-center text-[6px] font-bold text-white/40 uppercase">Pasaporte</div>
          </div>
          
          <div className="flex-1 text-left min-w-0">
            <h4 className="font-bold text-[#1C1C1E] text-[17px] leading-tight truncate">Passport Renewal</h4>
            <p className="text-[13px] font-medium text-gray-400 mt-0.5">DFA</p>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center mr-3">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-[#F2F2F7]" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - 0.65)} className="text-[#FFCC00] rounded-full" />
             </svg>
             <span className="absolute text-[13px] font-black text-[#1C1C1E]">65%</span>
          </div>
          <ChevronRight size={22} className="text-gray-300 group-hover:text-[#0038A8] transition-colors" strokeWidth={2.5} />
        </button>
      </section>

      {/* 2x2 Favorites Grid */}
      <section className="px-6 pb-10">
        <h3 className="text-[19px] font-bold text-[#1C1C1E] mb-5">Your Favorite Bundles</h3>
        <div className="grid grid-cols-2 gap-4">
          <BundleGridCard 
            title="Starting a Business" 
            docs="10 documents" 
            bgColor="bg-[#EBF3FF]" 
            icon={<Store size={24} className="text-[#0038A8]" />} 
          />
          <BundleGridCard 
            title="Buying a Property" 
            docs="8 documents" 
            bgColor="bg-[#EBF9F1]" 
            icon={<Home size={24} className="text-[#34C759]" />} 
          />
          <BundleGridCard 
            title="Having Baby" 
            docs="11 documents" 
            bgColor="bg-[#FFF8E1]" 
            icon={<Baby size={24} className="text-[#FFCC00]" />} 
          />
          <BundleGridCard 
            title="Retirement" 
            docs="7 documents" 
            bgColor="bg-[#F8F1FF]" 
            icon={<Umbrella size={24} className="text-[#AF52DE]" />} 
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, bg, value, label }) {
  return (
    <div className="bg-white rounded-[28px] p-5 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white">
      <div className={`w-11 h-11 ${bg} rounded-[14px] flex items-center justify-center mb-4 shadow-sm`}>
         {icon}
      </div>
      <span className="text-[22px] font-black text-[#1C1C1E]">{value}</span>
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1 text-center">{label}</span>
    </div>
  );
}

function BundleGridCard({ title, docs, bgColor, icon }) {
  return (
    <button className="bg-white rounded-[32px] p-6 text-left shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white active:scale-[0.97] transition-all group">
      <div className={`w-16 h-14 ${bgColor} rounded-[18px] flex items-center justify-center mb-5 border border-black/5 shadow-inner`}>
        {icon}
      </div>
      <div className="space-y-1 pr-2">
        <h5 className="font-bold text-[#1C1C1E] text-[15px] leading-[1.2]">{title}</h5>
        <p className="text-[11px] font-medium text-gray-400">{docs}</p>
      </div>
      <div className="flex justify-end mt-2">
        <ChevronRight size={16} className="text-gray-200 group-hover:text-[#0038A8] transition-colors" strokeWidth={2.5} />
      </div>
    </button>
  );
}

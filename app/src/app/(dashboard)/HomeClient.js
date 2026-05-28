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
  Briefcase,
  Heart,
  Store,
  Book,
  Layers,
  User,
  Home,
  Baby,
  Umbrella,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import { bundles } from '@/data/bundles';

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
        <GuestView />
      )}
    </div>
  );
}

function GuestView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { openAuthModal } = useAuthUI();
  const router = useRouter();

  // Select the 4 essential bundles with specific backgrounds
  const essentialBundles = useMemo(() => {
    const config = [
      { id: 'first-job', bg: 'radial-gradient(circle at top right, #d9e6fd, #dae6fe)', image: '/assets/job.webp' },
      { id: 'travel-tourist', bg: 'radial-gradient(circle at top right, #eeeafd, #eeecfd)', image: '/assets/travel.webp' },
      { id: 'wedding', bg: 'radial-gradient(circle at top right, #fdedf5, #fdecf4)', image: '/assets/marriage.webp' },
      { id: 'foundational-docs', bg: 'radial-gradient(circle at top right, #f4f5f9, #f5f6fa)', image: '/assets/general.webp' }
    ];
    return config.map(item => {
      const bundle = bundles.find(b => b.id === item.id);
      return bundle ? { ...bundle, bg: item.bg, image: item.image } : null;
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
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center lg:hidden">
        <h1 className="text-2xl font-black text-[#0038A8] tracking-tight">AyosDocs</h1>
        <button 
          onClick={() => openAuthModal()}
          className="h-11 px-5 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 active:scale-95 transition-all group"
          style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(248, 249, 255, 1) 100%)' }}
        >
          <User size={18} className="text-[#0038A8]" strokeWidth={2.5} />
          <span className="text-[14px] font-bold text-[#0038A8]">Sign in</span>
        </button>
      </header>

      {/* Hero Title - Forced to 3 rows */}
      <section className="px-6 py-8">
        <h2 className="text-[34px] font-bold leading-[1.1] tracking-tight text-[#1C1C1E] max-w-[320px]">
          Make government processes simple, <span className="text-[#0038A8]">together.</span>
        </h2>
      </section>

      {/* Modern Search Bar */}
      <section className="px-6 mb-12">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0038A8] transition-colors" size={20} />
          <input
            type="text"
            placeholder="What do you need to get done today?"
            className="w-full h-16 pl-14 pr-6 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[2px] border-white text-[15px] font-medium placeholder:text-gray-400 focus:outline-none transition-all"
          />
        </div>
      </section>

      {/* Horizontal Bundles Scroll */}
      <section className="mb-12">
        <div className="px-6 mb-6 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] font-bold text-[#1C1C1E]">Start Here</h3>
            <p className="text-[13px] font-medium text-gray-400">Life Event Bundles</p>
          </div>
          <button 
            onClick={() => router.push('/bundles')}
            className="text-[14px] font-bold text-[#0038A8] pb-0.5 active:opacity-60 transition-opacity"
          >
            View all
          </button>
        </div>
        
        <div 
          id="bundle-carousel"
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 px-6 scrollbar-hide snap-x snap-mandatory pb-6 scroll-pl-6"
        >
          {essentialBundles.map((bundle) => (
            <div 
              key={bundle.id}
              style={{ background: bundle.bg }}
              className="relative min-w-[190px] h-[260px] rounded-[32px] px-5 py-5 flex flex-col justify-center gap-3 snap-start shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/50 active:scale-[0.98] transition-transform cursor-pointer overflow-hidden group"
              onClick={() => router.push(`/bundles/${bundle.id}`)}
            >
              {/* Illustration Container */}
              <div className="relative w-full h-20 shrink-0 px-4 transform group-hover:scale-110 transition-transform duration-500">
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
            </div>
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
      </section>

      {/* Auth Action Section */}
      <section className="px-6 mb-12">
        <button 
          onClick={() => openAuthModal()}
          className="w-full rounded-[32px] py-6 px-7 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/50 active:scale-[0.98] transition-all"
          style={{ background: 'radial-gradient(circle at top right, #f8f9ff, #eef3ff)' }}
        >
          <div className="flex items-center gap-6">
             <div className="w-24 h-24 shrink-0 relative">
               <Image 
                src="/assets/lock.webp" 
                alt="Lock" 
                fill 
                sizes="96px"
                className="object-contain drop-shadow-[-6px_8px_12px_rgba(0,0,0,0.1)]"
              />
            </div>
            <div className="text-left space-y-1">
              <h4 className="font-bold text-[#1C1C1E] text-base">Sign in to AyosDocs</h4>
              <p className="text-[12px] font-medium text-gray-400 leading-tight">
                Save your progress and access your documents anywhere.
              </p>
            </div>
          </div>
          <ChevronRight size={22} className="text-[#0038A8] shrink-0 opacity-30" strokeWidth={2.5} />
        </button>
      </section>

      {/* Trending / Community Insights Section */}
      <section className="px-6 pb-12">
        <div className="mb-6 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h3 className="text-[19px] font-bold text-[#1C1C1E]">Trending Now</h3>
            <p className="text-[13px] font-medium text-gray-400">Most searched by the community</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TrendingCard 
            title="Passport Renewal" 
            agency="DFA" 
            trend="+12%" 
            icon={<Book size={20} className="text-[#0038A8]" />}
            bg="bg-[#E8F1FF]"
          />
          <TrendingCard 
            title="NBI Clearance" 
            agency="NBI" 
            trend="+8%" 
            icon={<CheckCircle2 size={20} className="text-[#34C759]" />}
            bg="bg-[#EAF9EE]"
          />
          <TrendingCard 
            title="PSA Birth Cert" 
            agency="PSA" 
            trend="+15%" 
            icon={<Layers size={20} className="text-[#AF52DE]" />}
            bg="bg-[#F4EBFF]"
          />
          <TrendingCard 
            title="Driver's License" 
            agency="LTO" 
            trend="+5%" 
            icon={<Search size={20} className="text-[#FFCC00]" />}
            bg="bg-[#FFF8E1]"
          />
        </div>
      </section>
    </div>
  );
}

function TrendingCard({ title, agency, trend, icon, bg }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push('/guides')}
      className="bg-white rounded-[28px] p-5 text-left border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] active:scale-[0.97] transition-all group"
    >
      <div className={`w-11 h-11 ${bg} rounded-[14px] flex items-center justify-center mb-4 shadow-sm`}>
        {icon}
      </div>
      <div className="space-y-0.5">
        <h5 className="font-bold text-[#1C1C1E] text-[14px] leading-tight line-clamp-1">{title}</h5>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{agency}</span>
          <span className="text-[10px] font-black text-[#34C759]">{trend}</span>
        </div>
      </div>
    </button>
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

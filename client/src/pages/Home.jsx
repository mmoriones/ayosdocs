import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../features/guides/components/discovery/Hero';
import TrendingGuides from '../features/guides/components/discovery/TrendingGuides';
import StartWithGoal from '../features/guides/components/discovery/StartWithGoal';
import RecentExperiences from '../features/guides/components/discovery/RecentExperiences';
import ChecklistCard from '../features/guides/components/tracking/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';
import WhySignUp from '../features/guides/components/callouts/WhySignUp';
import Adsense from '../components/Adsense';
import OnboardingBanner from '../features/guides/components/discovery/OnboardingBanner';
import RecentlyUpdated from '../features/guides/components/discovery/RecentlyUpdated';
import { guidesMap } from '../utils/loadGuides';
import { useAuth } from '../context/AuthContext'
import { ArrowRight, MapPin, Clock, Sparkles, MessageSquare } from 'lucide-react';

/**
 * Main landing page component.
 * Orchestrates the hero section, guide discovery features, and interactive rows.
 * 
 * @returns {JSX.Element} The rendered Home page.
 */
const Home = () => {
  const [activeSlug, setActiveSlug] = useState('getting-started');
  const { isLoggedIn, user, openAuthModal, onboarded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const lastSlug = localStorage.getItem("lastGuideSlug");
    if (lastSlug) setActiveSlug(lastSlug);
    document.title = "AyosDocs | Your Complete Guide to Government Documents";
  }, []);

  const activeGuide = activeSlug !== 'getting-started' ? guidesMap[activeSlug] : null;

  return (
    <div className="bg-ctp-base font-sans text-ctp-text">
      <meta name="description" content="AyosDocs provides step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more." />

      {/* 1. HERO SECTION (Includes Search) */}
      <Hero />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 space-y-16">
        
        {/* 2. NOTIFICATIONS & ALERTS */}
        <section className="-mt-8 relative z-20">
          <HolidayAlert />
        </section>

        {/* 3. ADSENSE HORIZONTAL TOP */}
        <section className="py-4 border-y border-ctp-surface0/50">
          <Adsense variant="article" />
        </section>

        {/* 4. ACTIVITY & PROGRESS FLOW */}
        <section className="max-w-4xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-ctp-sapphire">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-[14px] font-black uppercase tracking-[0.3em]">Next Steps</span>
            </div>
            <h2 className="text-[36px] lg:text-[42px] font-black text-ctp-text tracking-tight leading-tight">
              {isLoggedIn && user ? "Your Application Progress" : "Plan your government journey"}
            </h2>
            <p className="text-ctp-subtext1 font-medium max-w-xl mx-auto text-[20px] opacity-80">
              Follow our guided workflows to complete your requirements efficiently.
            </p>
          </div>

          <div className="space-y-8">
            {/* A. ACTIVE PROGRESS (If exists) */}
            {activeGuide && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pl-4">
                  <div className="w-9 h-9 rounded-xl bg-ctp-mantle text-ctp-sapphire flex items-center justify-center border border-ctp-surface0 shadow-sm">
                    <Clock size={18} />
                  </div>
                  <h3 className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-widest">Continue where you left off</h3>
                </div>
                <div className="soft-shadow rounded-[2.5rem]">
                  <ChecklistCard
                    title={activeGuide.title}
                    initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                    slug={activeSlug}
                    inGuidePage={false}
                    isModal={false}
                  />
                </div>
              </div>
            )}

            {/* B. START TRACKING BANNER (If no active guide) */}
            {!activeGuide && (
              <div className="bg-ctp-base rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden group border border-ctp-surface0 soft-shadow">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-sapphire/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
                
                <div className="w-20 h-20 rounded-3xl bg-ctp-sapphire text-ctp-base flex items-center justify-center shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <ArrowRight size={32} strokeWidth={3} />
                </div>

                <div className="flex-1 text-center lg:text-left space-y-2">
                  <h3 className="text-[36px] font-black text-ctp-text tracking-tight leading-none">Start Tracking Your Progress</h3>
                  <p className="text-ctp-subtext1 text-[20px] font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                    Pick a guide and start checking off requirements to keep your application on schedule.
                  </p>
                </div>

                <button 
                  onClick={() => navigate('/guides')}
                  className="w-full lg:w-auto px-10 py-5 bg-ctp-sapphire text-ctp-base rounded-2xl font-black hover:bg-ctp-blue transition-all active:scale-95 shadow-xl whitespace-nowrap text-[18px] uppercase tracking-widest"
                >
                  Browse All Guides
                </button>
              </div>
            )}

            {/* C. LIFE EVENT BUNDLES (StartWithGoal) */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pl-4">
                <div className="w-9 h-9 rounded-xl bg-ctp-mantle text-ctp-sapphire flex items-center justify-center border border-ctp-surface0 shadow-sm">
                  <MapPin size={18} />
                </div>
                <h3 className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-widest">Choose a Life Event Goal</h3>
              </div>
              <StartWithGoal />
            </div>

            {/* D. ONBOARDING BANNER (For New/Unonboarded Users) */}
            {!onboarded && (
              <OnboardingBanner />
            )}

          </div>

          {/* Full-width Horizontal Ad */}
          <div className="pt-8 border-t border-ctp-surface0/50">
            <Adsense variant="article" />
          </div>
        </section>

        {/* 5. POPULAR GUIDES GRID */}
        <section className="space-y-10">
          <div className="flex justify-between items-end gap-4 border-b border-ctp-surface0/50 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-ctp-sapphire">
                <Sparkles size={28} />
                <h2 className="text-[36px] font-black text-ctp-text tracking-tight">Popular Guides</h2>
              </div>
              <p className="text-[14px] text-ctp-subtext0 font-black uppercase tracking-[0.2em] pl-1">Quick access to our most requested guides.</p>
            </div>
            
            <button 
              onClick={() => navigate('/guides')}
              className="group flex items-center gap-2 text-ctp-sapphire font-black hover:text-ctp-blue transition-colors text-[14px] uppercase tracking-[0.2em] mb-2"
            >
              <span>View all guides</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <TrendingGuides />
        </section>

        {/* 6. INTELLIGENCE ROW (3 Columns) */}
        <section className="pt-16 border-t border-ctp-surface0/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Government Offices Search/Preview */}
            <div className="space-y-8 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-sapphire">
                    <MapPin size={24} />
                    <h3 className="text-[28px] lg:text-[32px] font-black text-ctp-text tracking-tight">Find an Office</h3>
                  </div>
                  <p className="text-[12px] text-ctp-sapphire font-black uppercase tracking-[0.2em] pl-1">Locate branches and wait times</p>
                </div>
              </div>

              <div className="bg-ctp-base rounded-[2.5rem] p-8 border border-ctp-surface0 space-y-8 overflow-hidden relative group flex-1 flex flex-col justify-between soft-shadow">
                <div>
                  {/* Decorative Map Illustration Area */}
                  <div className="h-44 -mx-8 -mt-8 mb-8 bg-ctp-mantle/50 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#209fb5_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="relative w-24 h-24 rounded-3xl bg-ctp-base shadow-2xl flex items-center justify-center text-ctp-sapphire animate-float border border-ctp-surface0">
                      <MapPin size={48} />
                    </div>
                  </div>

                  <p className="text-[18px] text-ctp-subtext1 font-medium leading-relaxed">
                    Locate government branches near you and check community-reported wait times.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="City or Agency name..." 
                      className="w-full pl-6 pr-14 py-4 rounded-2xl border border-ctp-surface0 text-[18px] font-medium focus:ring-4 focus:ring-ctp-sapphire/10 focus:border-ctp-sapphire transition-all bg-ctp-base text-ctp-text placeholder:text-ctp-surface2"
                    />
                    <ArrowRight size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-ctp-surface2" />
                  </div>
                  <button className="w-full py-5 bg-ctp-mantle text-ctp-text border border-ctp-surface0 rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] hover:bg-ctp-surface0 transition-all shadow-sm active:scale-[0.98]">
                    Search Offices
                  </button>
                </div>
              </div>
            </div>

            {/* Recently Updated */}
            <div className="space-y-8 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-blue">
                    <Sparkles size={24} />
                    <h3 className="text-[28px] lg:text-[32px] font-black text-ctp-text tracking-tight">Latest Updates</h3>
                  </div>
                  <p className="text-[12px] text-ctp-blue font-black uppercase tracking-[0.2em] pl-1">New requirements and processes</p>
                </div>
              </div>
              <RecentlyUpdated className="flex-1" />
            </div>

            {/* Recent Experiences */}
            <div className="space-y-8 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-sky">
                    <MessageSquare size={24} />
                    <h3 className="text-[28px] lg:text-[32px] font-black text-ctp-text tracking-tight">Community Reports</h3>
                  </div>
                  <p className="text-[12px] text-ctp-sky font-black uppercase tracking-[0.2em] pl-1">Latest wait times and ratings</p>
                </div>
              </div>
              <RecentExperiences className="flex-1" />
            </div>

          </div>
        </section>

        {/* 7. VALUE PROP BANNER */}
        <section className="pt-8">
          <WhySignUp onSignUp={openAuthModal} />
        </section>

        {/* 8. BOTTOM CTA BANNER */}
        <section className="pt-8">
          <div className="bg-ctp-base rounded-[3rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-ctp-surface0 soft-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-ctp-sapphire/[0.02] pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-ctp-mantle shadow-2xl flex items-center justify-center text-ctp-sapphire shrink-0 border border-ctp-surface0">
                <span className="text-[40px] font-black">AD</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-[36px] lg:text-[42px] font-black text-ctp-text tracking-tight leading-none">Need more help?</h3>
                <p className="text-ctp-subtext1 font-medium text-[20px] max-w-xl">Join our community or contact support for personalized assistance.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
              <button className="px-10 py-5 bg-ctp-mantle border border-ctp-surface0 rounded-2xl text-ctp-text font-black uppercase tracking-widest hover:bg-ctp-surface0 transition-all active:scale-95 shadow-sm text-[16px]">
                Help Center
              </button>
              <button className="px-10 py-5 bg-ctp-sapphire text-ctp-base rounded-2xl font-black uppercase tracking-widest hover:bg-ctp-blue transition-all active:scale-95 shadow-xl text-[16px]">
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* 9. ADSENSE HORIZONTAL BOTTOM */}
        <section className="py-6 border-y border-ctp-surface0/50">
          <Adsense variant="article" />
        </section>


      </div>
    </div>
  );
};

export default Home;

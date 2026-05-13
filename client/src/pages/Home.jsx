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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 space-y-12">
        
        {/* 2. NOTIFICATIONS & ALERTS */}
        <section className="-mt-6 relative z-20">
          <HolidayAlert />
        </section>

        {/* 3. ADSENSE HORIZONTAL TOP */}
        <section className="py-4 border-y border-ctp-surface0">
          <Adsense variant="article" />
        </section>

        {/* 4. ACTIVITY & PROGRESS FLOW */}
        <section className="max-w-4xl mx-auto space-y-8">
          
          {/* Section Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-ctp-green">
              <ArrowRight size={20} className="-rotate-45" />
              <span className="text-[14px] font-black uppercase tracking-[0.3em]">Next Steps</span>
            </div>
            <h2 className="text-[32px] font-extrabold text-ctp-text tracking-tight leading-tight">
              {isLoggedIn && user ? "Your Application Progress" : "Plan your government journey"}
            </h2>
            <p className="text-ctp-subtext1 font-medium max-w-xl mx-auto text-[18px]">
              Follow our guided workflows to complete your requirements efficiently.
            </p>
          </div>

          <div className="space-y-6">
            {/* A. ACTIVE PROGRESS (If exists) */}
            {activeGuide && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pl-4">
                  <div className="w-8 h-8 rounded-lg bg-ctp-surface0 text-ctp-green flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <h3 className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-widest">Continue where you left off</h3>
                </div>
                <ChecklistCard
                  title={activeGuide.title}
                  initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                  slug={activeSlug}
                  inGuidePage={false}
                  isModal={false}
                />
              </div>
            )}

            {/* B. START TRACKING BANNER (If no active guide) */}
            {!activeGuide && (
              <div className="bg-ctp-mantle rounded-[2rem] p-8 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden group border border-ctp-surface0">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-green/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
                
                <div className="w-16 h-16 rounded-full bg-ctp-green-600 flex items-center justify-center text-ctp-base shadow-xl shrink-0">
                  <ArrowRight size={28} strokeWidth={3} />
                </div>

                <div className="flex-1 text-center lg:text-left space-y-1">
                  <h3 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Start Tracking Your Progress</h3>
                  <p className="text-ctp-subtext1 text-[18px] font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                    Pick a guide and start checking off requirements to keep your application on schedule.
                  </p>
                </div>

                <button 
                  onClick={() => navigate('/guides')}
                  className="w-full lg:w-auto px-8 py-4 bg-ctp-green-600 text-ctp-base rounded-xl font-extrabold hover:bg-ctp-green-500 transition-all active:scale-95 shadow-lg whitespace-nowrap text-[18px]"
                >
                  Browse All Guides
                </button>
              </div>
            )}

            {/* C. LIFE EVENT BUNDLES (StartWithGoal) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pl-4">
                <div className="w-8 h-8 rounded-lg bg-ctp-surface0 text-ctp-green flex items-center justify-center">
                  <MapPin size={16} />
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
          <div className="pt-8 border-t border-ctp-surface0">
            <Adsense variant="article" />
          </div>
        </section>

        {/* 5. POPULAR GUIDES GRID */}
        <section className="space-y-8">
          <div className="flex justify-between items-end gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-ctp-green">
                <ArrowRight size={24} className="-rotate-45" />
                <h2 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Popular Guides</h2>
              </div>
              <p className="text-[14px] text-ctp-subtext0 font-black uppercase tracking-[0.2em] pl-1">Quick access to our most requested guides.</p>
            </div>
            
            <button 
              onClick={() => navigate('/guides')}
              className="group flex items-center gap-2 text-ctp-green font-black hover:text-ctp-green-500 transition-colors text-[14px] uppercase tracking-[0.2em] mb-2"
            >
              <span>View all guides</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <TrendingGuides />
        </section>

        {/* 6. INTELLIGENCE ROW (3 Columns) */}
        <section className="pt-12 border-t border-ctp-surface0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Government Offices Search/Preview */}
            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-mauve">
                    <MapPin size={24} />
                    <h3 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Find an Office</h3>
                  </div>
                  <p className="text-[14px] text-ctp-green font-black uppercase tracking-[0.2em] pl-1">Locate branches and wait times</p>
                </div>
                <button 
                  onClick={() => navigate('/offices')}
                  className="group flex items-center gap-2 text-ctp-green font-black hover:text-ctp-green-500 transition-colors text-[14px] uppercase tracking-[0.2em] mb-2"
                >
                  <span>All Offices</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-ctp-mantle rounded-[2rem] p-6 border border-ctp-surface0 space-y-6 overflow-hidden relative group flex-1 flex flex-col justify-between shadow-sm">
                <div>
                  {/* Decorative Map Illustration Area */}
                  <div className="h-40 -mx-6 -mt-6 mb-6 bg-ctp-surface0 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a6e3a1_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative w-20 h-20 rounded-full bg-ctp-base shadow-xl flex items-center justify-center text-ctp-green animate-pulse">
                      <MapPin size={40} />
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
                      className="w-full pl-5 pr-12 py-3 rounded-xl border border-ctp-surface0 text-[18px] font-medium focus:ring-4 focus:ring-ctp-green/10 focus:border-ctp-green transition-all bg-ctp-base text-ctp-text placeholder:text-ctp-surface2"
                    />
                    <ArrowRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-surface2" />
                  </div>
                  <button className="w-full py-4 bg-ctp-surface1 text-ctp-text rounded-xl text-[14px] font-black uppercase tracking-[0.2em] hover:bg-ctp-surface2 transition-all shadow-xl active:scale-[0.98]">
                    Search Offices
                  </button>
                </div>
              </div>
            </div>

            {/* Recently Updated */}
            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-green">
                    <Sparkles size={24} />
                    <h3 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Latest Updates</h3>
                  </div>
                  <p className="text-[14px] text-ctp-green font-black uppercase tracking-[0.2em] pl-1">New requirements and processes</p>
                </div>
                <button 
                  onClick={() => navigate('/guides')}
                  className="group flex items-center gap-2 text-ctp-green font-black hover:text-ctp-green-500 transition-colors text-[14px] uppercase tracking-[0.2em] mb-2"
                >
                  <span>All Updates</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <RecentlyUpdated className="flex-1" />
            </div>

            {/* Recent Experiences */}
            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ctp-yellow">
                    <MessageSquare size={24} />
                    <h3 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Community Reports</h3>
                  </div>
                  <p className="text-[14px] text-ctp-green font-black uppercase tracking-[0.2em] pl-1">Latest wait times and ratings</p>
                </div>
                <button 
                  onClick={() => navigate('/offices')}
                  className="group flex items-center gap-2 text-ctp-green font-black hover:text-ctp-green-500 transition-colors text-[14px] uppercase tracking-[0.2em] mb-2"
                >
                  <span>All Offices</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <RecentExperiences className="flex-1" />
            </div>

          </div>
        </section>

        {/* 7. VALUE PROP BANNER */}
        <section className="pt-6">
          <WhySignUp onSignUp={openAuthModal} />
        </section>

        {/* 8. BOTTOM CTA BANNER (Row 8 Wireframe) */}
        <section className="pt-6">
          <div className="bg-ctp-mantle rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-ctp-surface0">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <div className="w-20 h-20 rounded-full bg-ctp-base shadow-xl flex items-center justify-center text-ctp-green shrink-0 border-4 border-ctp-surface0">
                <span className="text-[32px] font-black">AD</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-[32px] font-extrabold text-ctp-text tracking-tight">Need more help with your documents?</h3>
                <p className="text-ctp-subtext1 font-medium text-[18px]">Join our community or contact support for personalized assistance.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="px-8 py-4 bg-ctp-surface1 border border-ctp-surface0 rounded-xl text-ctp-text font-bold hover:bg-ctp-surface2 transition-all active:scale-95 shadow-sm text-[18px]">
                Help Center
              </button>
              <button className="px-8 py-4 bg-ctp-green-600 text-ctp-base rounded-xl font-bold hover:bg-ctp-green-500 transition-all active:scale-95 shadow-lg text-[18px]">
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* 9. ADSENSE HORIZONTAL BOTTOM */}
        <section className="py-4 border-y border-ctp-surface0">
          <Adsense variant="article" />
        </section>


      </div>
    </div>
  );
};

export default Home;

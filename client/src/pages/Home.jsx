import { useEffect, useState } from 'react';
import Hero from '../features/guides/components/discovery/Hero';
import TrendingGuides from '../features/guides/components/discovery/TrendingGuides';
import StartWithGoal from '../features/guides/components/discovery/StartWithGoal';
import RecentExperiences from '../features/guides/components/discovery/RecentExperiences';
import ChecklistCard from '../features/guides/components/tracking/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';
import WhySignUp from '../features/guides/components/callouts/WhySignUp';
import TipsCard from '../features/guides/components/callouts/TipsCard';
import Adsense from '../components/Adsense';
import GettingStarted from '../features/guides/components/discovery/GettingStarted';
import OnboardingBanner from '../features/guides/components/discovery/OnboardingBanner';
import RecentlyUpdated from '../features/guides/components/discovery/RecentlyUpdated';
import { guidesMap } from '../utils/loadGuides';
import { useAuth } from '../context/AuthContext'

/**
 * Main landing page component.
 * Orchestrates the hero section, guide discovery features, and sidebars.
 * 
 * @returns {JSX.Element} The rendered Home page.
 */
const Home = () => {
  const [activeSlug, setActiveSlug] = useState('getting-started');
  const { isLoggedIn, user, openAuthModal, onboarded } = useAuth();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Initialization of page state from local storage.
  useEffect(() => {
    // Retrieval of the last viewed guide to provide a personalized "Continue" experience.
    const lastSlug = localStorage.getItem("lastGuideSlug");
    if (lastSlug) setActiveSlug(lastSlug);
  }, []);

  useEffect(() => {
    document.title = "AyosDocs | Your Complete Guide to Government Documents";
  }, []);

  // Selection of the guide data to display in the sidebar progress card.
  const activeGuide = activeSlug !== 'getting-started' ? guidesMap[activeSlug] : null;

  // Carousel items definition for dynamic dots and rendering
  const carouselItems = [
    { id: 'tips', component: <TipsCard /> },
    ...(!isLoggedIn ? [{ id: 'signup', component: <WhySignUp onSignUp={openAuthModal} /> }] : []),
    ...(!onboarded ? [{ id: 'onboarding', component: <OnboardingBanner /> }] : [])
  ];

  /**
   * Tracks the horizontal scroll position to update pagination dots.
   */
  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.offsetWidth * 0.85; // Based on 85vw
    const index = Math.round(scrollPosition / itemWidth);
    
    if (index !== activeCarouselIndex && index >= 0 && index < carouselItems.length) {
      setActiveCarouselIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      <title>AyosDocs | Your Complete Guide to Government Documents</title>
      <meta name="description" content="AyosDocs provides step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more." />

      <Hero />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 flex flex-col lg:flex-row gap-12 items-start">

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* SYSTEM STATUS / NOTIFICATIONS */}
          <section>
            <HolidayAlert />
          </section>

          {/* USER CONTEXT - COMPLEMENTS HERO PERSONALIZATION */}
          {isLoggedIn && user && onboarded && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Continue your progress
              </h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Pick up where you left off or explore new goals below.
              </p>
            </section>
          )}

          {/* START WITH A GOAL - VALUE PROPOSITION / WORKFLOWS */}
          <section>
            <StartWithGoal />
          </section>

          {/* POPULAR GUIDES - THE PRODUCT LIBRARY */}
          <section>
            <TrendingGuides />
          </section>

          {/* PROGRESS / GETTING STARTED - MOBILE VIEW (Below Primary Discovery) */}
          <section className="lg:hidden">
            {activeSlug === 'getting-started' ? (
              <GettingStarted />
            ) : activeGuide ? (
              <ChecklistCard
                title={activeGuide.title}
                initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                slug={activeSlug}
                inGuidePage={false}
                isModal={false}
              />
            ) : null}
          </section>

          {/* RECENT EXPERIENCES - SOCIAL PROOF / COMMUNITY INTELLIGENCE */}
          <section>
            <RecentExperiences />
          </section>

          {/* RECENTLY UPDATED - NEWS & CONTENT UPDATES */}
          <section>
            <RecentlyUpdated />
          </section>

          {/* CALLOUTS HORIZONTAL SCROLL - MOBILE VIEW */}
          <section className="lg:hidden w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-slate-900">Recommended for you</h2>
              <div className="flex gap-1.5 items-center">
                {carouselItems.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeCarouselIndex ? "bg-teal-600 w-4" : "bg-slate-200 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div 
              onScroll={handleScroll}
              className="
                flex overflow-x-auto pb-6 -mx-6 px-6 
                gap-4 snap-x snap-mandatory 
                scrollbar-hide
                items-stretch
              "
            >
              {carouselItems.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-[85vw] snap-center h-auto">
                  {item.component}
                </div>
              ))}
            </div>
          </section>

          {/* HORIZONTAL ADSENSE - MAIN CONTENT BOTTOM */}
          <section>
            <Adsense variant="article" />
          </section>

        </div>

        {/* SIDEBAR - DASHBOARD UTILITIES */}
        <div className="hidden lg:block lg:w-96 shrink-0">
          <div className="sticky top-10 space-y-10">

            {/* 1. USER CONTEXT / PROGRESS (Highest Importance) */}
            {activeSlug === 'getting-started' ? (
              <GettingStarted />
            ) : activeGuide ? (
              <ChecklistCard
                title={activeGuide.title}
                initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                slug={activeSlug}
                inGuidePage={false}
                isModal={false}
              />
            ) : null}

            {/* 2. ACCOUNT ACTIONS (Onboarding or Sign Up) */}
            {!onboarded && (
              <OnboardingBanner />
            )}

            {!isLoggedIn && (
              <WhySignUp onSignUp={openAuthModal} />
            )}

            {/* 3. MONETIZATION (High Visibility) */}
            <Adsense variant="skyscraper" />

            {/* 4. KNOWLEDGE / TIPS (Supplemental) */}
            <TipsCard />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

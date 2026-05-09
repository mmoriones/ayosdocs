import { useEffect, useState } from 'react';
import Hero from '../features/guides/components/discovery/Hero';
import TrendingGuides from '../features/guides/components/discovery/TrendingGuides';
import ChecklistCard from '../features/guides/components/tracking/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';
import WhySignUp from '../features/guides/components/callouts/WhySignUp';
import TipsCard from '../features/guides/components/callouts/TipsCard';
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
  const { isLoggedIn, openAuthModal, onboarded } = useAuth();
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
    <div className="min-h-screen bg-white text-gray-900">

      <title>AyosDocs | Your Complete Guide to Government Documents</title>
      <meta name="description" content="AyosDocs provides step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more." />

      <Hero />

      <div className="px-6 sm:px-8 lg:px-10 py-6 flex flex-col lg:flex-row gap-10 items-start max-w-7xl mx-auto">

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full space-y-10">

          {/* POPULAR GUIDES */}
          <section className="space-y-6">
            <TrendingGuides />
          </section>

          {/* PROGRESS / GETTING STARTED - MOBILE VIEW (Below Trending) */}
          <section className="lg:hidden space-y-6">
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

          {/* RECENTLY UPDATED */}
          <section>
            <RecentlyUpdated />
          </section>

          {/* HOLIDAY ALERT */}
          <section>
            <HolidayAlert />
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

          {/* ONBOARDING BANNER - DESKTOP VIEW */}
          {!onboarded && (
            <section className="hidden lg:block">
              <OnboardingBanner />
            </section>
          )}

        </div>

        {/* SIDEBAR - DESKTOP ONLY */}
        <div className="hidden lg:block w-full lg:w-96 space-y-8 sticky top-8">

          <TipsCard />

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

          {!isLoggedIn && (
            <WhySignUp onSignUp={openAuthModal} />
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;

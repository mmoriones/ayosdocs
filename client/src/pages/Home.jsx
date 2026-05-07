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
import AuthModal from '../features/auth/components/AuthModal';
import { guidesMap } from '../utils/loadGuides';
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [activeSlug, setActiveSlug] = useState('getting-started');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const { isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();

  useEffect(() => {
    const lastSlug = localStorage.getItem("lastGuideSlug");
    if (lastSlug) setActiveSlug(lastSlug);

    const onboarded = localStorage.getItem("onboarded") === "true";
    setIsOnboarded(onboarded);
  }, []);

  useEffect(() => {
    document.title = "AyosDocs | Your Complete Guide to Government Documents";
  }, []);

  const activeGuide = activeSlug !== 'getting-started' ? guidesMap[activeSlug] : null;

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 lg:px-10 py-6">

      <title>AyosDocs | Your Complete Guide to Government Documents</title>
      <meta name="description" content="AyosDocs provides step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more." />

      <Hero />

      <div className="flex flex-col lg:flex-row gap-10 items-start max-w-7xl mx-auto">

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full space-y-10">

          {/* POPULAR GUIDES */}
          <section className="space-y-6">
            <TrendingGuides />
          </section>

          {/* HOLIDAY ALERT */}
          <section>
            <HolidayAlert />
          </section>

          {/* ONBOARDING BANNER / RECENTLY UPDATED */}
          <section>
            {isLoggedIn && isOnboarded ? (
              <RecentlyUpdated />
            ) : (
              <OnboardingBanner />
            )}
          </section>

        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-96 space-y-8 sticky top-8">

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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </div>
  );
};

export default Home;

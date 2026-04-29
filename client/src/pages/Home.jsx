import { useEffect, useState } from 'react';
import SearchBar from '../features/guides/components/discovery/SearchBar';
import TrendingGuides from '../features/guides/components/discovery/TrendingGuides';
import ChecklistCard from '../features/guides/components/tracking/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';
import WhySignUp from '../features/guides/components/callouts/WhySignUp';
import TipsCard from '../features/guides/components/callouts/TipsCard';
import GettingStarted from '../features/guides/components/discovery/GettingStarted';
import AuthModal from '../features/auth/components/AuthModal';
import { guidesMap } from '../utils/loadGuides';
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [activeSlug, setActiveSlug] = useState('getting-started');
  const { isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();

  useEffect(() => {
    const lastSlug = localStorage.getItem("lastGuideSlug");
    if (lastSlug) setActiveSlug(lastSlug);
  }, []);

  useEffect(() => {
    document.title = "AyosDocs | Your Complete Guide to Government Documents";
  }, []);

  const activeGuide = activeSlug !== 'getting-started' ? guidesMap[activeSlug] : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 lg:px-10 py-6">

      <title>AyosDocs | Your Complete Guide to Government Documents</title>
      <meta name="description" content="AyosDocs provides step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more." />

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LEFT SIDE */}
        <div className="flex-1 w-full space-y-8">

          {/* HERO */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="max-w-xl space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Find the right guide,{" "}
                <span className="text-teal-600">get things done.</span>
              </h1>

              <p className="text-gray-600">
                Search for government documents and follow easy steps to complete your requirements.
              </p>
            </div>

            <SearchBar />
          </section>

          {/* POPULAR GUIDES */}
          <section className="space-y-4">
            <TrendingGuides />
          </section>

          {/* HOLIDAY ALERT */}
          <section>
            <HolidayAlert />
          </section>

          {/* Adsense placeholder */}

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-96 space-y-6 sticky top-8">

          {activeSlug === 'getting-started' ? (
            <GettingStarted />
          ) : activeGuide ? (
            <ChecklistCard
              title={activeGuide.title}
              initialSteps={activeGuide.checklist?.map(task => ({ task }))}
              slug={activeSlug}
            />
          ) : null}

          {isLoggedIn ? (
            <TipsCard />
          ) : (
            <WhySignUp onSignUp={openAuthModal} />
          )}

          {/* Adsense placeholder */}

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

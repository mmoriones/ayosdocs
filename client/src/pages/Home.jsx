import { useEffect, useState } from 'react';
import SearchBar from '../components/guides/SearchBar';
import TrendingGuides from '../components/guides/TrendingGuides';
import ChecklistCard from '../components/guides/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';
import WhySignUp from '../components/guides/WhySignUp';
import { guidesMap } from '../utils/loadGuides';


const Home = ({ activeSlug, setActiveSlug }) => {

  const [checklistData, setChecklistData] = useState({
    title: "Getting Started",
    steps: [
      { id: 1, task: 'Find your specific guide', completed: false },
      { id: 2, task: 'Read step-by-step process', completed: false },
      { id: 3, task: 'Prepare requirements', completed: false },
      { id: 4, task: 'Sign up to save progress', completed: false },
    ]
  });

    useEffect(() => {
      if (!activeSlug || activeSlug === 'getting-started') return;

      const guide = guidesMap[activeSlug];

      if (guide) {
        setChecklistData({
          title: guide.title,
          steps: guide.checklist?.map(task => ({
            task,
            completed: false
          })) || []
        });
      }
    }, [activeSlug]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 lg:px-10 py-6">
      
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
            <TrendingGuides onSelectGuide={(slug) => setActiveSlug(slug)} />
          </section>

          {/* HOLIDAY ALERT */}
          <section>
            <HolidayAlert />
          </section>

          {/* Adsense placeholder */}

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-96 space-y-6 sticky top-8">

          <ChecklistCard
            title={checklistData.title}
            initialSteps={checklistData.steps}
            slug={activeSlug}
          />

          <WhySignUp />

          {/* Adsense placeholder */}

        </div>
      </div>
    </div>
  );
};

export default Home;

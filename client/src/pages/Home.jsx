import axios from 'axios';
import { useEffect, useState } from 'react';
import SearchBar from '../features/guides/SearchBar';
import TrendingGuides from '../features/guides/TrendingGuides';
import ChecklistCard from '../features/guides/ChecklistCard';
import HolidayAlert from '../components/HolidayAlert';

const Home = ({activeSlug, setActiveSlug}) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
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
    if (activeSlug == 'getting-started') return;
    
    const fetchChecklist = async () =>{
      try {
        const res = await axios.get(`${API_URL}/api/guides/${activeSlug}`);
        setChecklistData({
          title: res.data.title,
          steps: res.data.checklist
        });
      }catch (err) {
        console.log("Error fetching checklist:", err);
      }
    }
    fetchChecklist();
  }, [activeSlug]);

  return (
    // Use min-h-screen to ensure the dark color covers the whole height
    <div className="min-h-screen flex flex-col lg:flex-row gap-8 px-8 items-start transition-colors duration-300 
      bg-gray-50 text-gray-900 
      dark:bg-[#1a1c1e] dark:text-gray-100">

      <div className="flex-1 w-full space-y-8 pt-4">
        <section><SearchBar /></section>

        <section>
          <TrendingGuides onSelectGuide={(slug) => setActiveSlug(slug)}/>
        </section>

        <section><HolidayAlert /></section>

        <div className="hidden lg:block h-32 w-full border border-dashed rounded-lg flex items-center justify-center text-xs
          bg-gray-50 border-gray-300 text-gray-400
          dark:bg-gray-800/30 dark:border-gray-700 dark:text-gray-500">
          Future AdSense Horizontal Banner
        </div>
      </div>

      <div className="w-full lg:w-96 space-y-6 sticky top-8 pt-4">
        <ChecklistCard
          title={checklistData.title}
          initialSteps={checklistData.steps}
          slug={activeSlug}
        />

        <div className="p-4 border rounded-xl shadow-sm bg-white dark:bg-[#242729] dark:border-gray-800">
          <p className="text-[10px] text-gray-400 mb-2 text-center uppercase font-bold tracking-widest">
            Sponsored Ads
          </p>
          <div className="h-[400px] w-full border-2 border-dashed flex flex-col items-center justify-center rounded-lg text-gray-400 p-4
            bg-gray-100 border-gray-200
            dark:bg-[#1a1c1e] dark:border-gray-800">
            <p className="text-sm font-semibold">AdSense Skyscraper</p>
            <p className="text-[10px] text-center mt-2">(High-visibility placement for manual review)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
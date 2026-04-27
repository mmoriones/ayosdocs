import { useState, useEffect } from 'react';
import ProgressCard from '../features/guides/components/tracking/ProgressCard'
import { Bookmark } from 'lucide-react';
import { guidesMap } from "../utils/loadGuides";

const UserProgress = () => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveFromUI = (slugToRemove) => {
    setProgressList(prev =>
      prev.filter(item => item.slug !== slugToRemove)
    );
  };

  useEffect(() => {
    const fetchAllProgress = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.token) return;

      try {
        const response = await fetch(`${API_URL}/api/user/get-data`, {
          headers: { Authorization: `Bearer ${storedUser.token}` }
        });

        const result = await response.json();
        const savedItems = result.savedProgress || [];

        const detailedProgress = savedItems
          .map((item) => {
            const guide = guidesMap[item.guideSlug];
            if (!guide) return null;

            const completedIndices = item.completedTasks
              .split(',')
              .map(Number);

            const steps = (guide.checklist || []).map((task, idx) => ({
              task,
              completed: completedIndices.includes(idx)
            }));

            return {
              title: guide.title,
              slug: item.guideSlug,
              steps
            };
          })
          .filter(Boolean);

        setProgressList(detailedProgress);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProgress();
  }, []);


  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your progress...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-4 max-w-xl">

            <div className="p-4 rounded-2xl bg-teal-100">
              <Bookmark className="text-teal-600" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                My Tracked Guides
              </h1>

              <p className="text-gray-600 mt-2 text-sm">
                Continue where you left off. Track your progress and stay on top of your requirements.
              </p>
            </div>

          </div>

          {/* RIGHT (optional illustration placeholder) */}
          <div className="hidden lg:block opacity-70">
            <div className="w-40 h-24 bg-teal-100 rounded-xl" />
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        {progressList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {progressList.map((data) => (
              <ProgressCard
                key={data.slug}
                title={data.title}
                steps={data.steps}
                slug={data.slug}
                onDelete={handleRemoveFromUI}
              />
            ))}

          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No guides tracked yet
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Start exploring guides and track your progress here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProgress;

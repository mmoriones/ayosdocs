import { CheckSquare, Square, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';

const ChecklistCard = ({ title, initialSteps, slug, isFullPage = false }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();
  const [steps, setSteps] = useState(initialSteps || []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSavedProgress = async () => {
            // Only fetch if logged in, slug exists, and it's not the default getting-started
            if (!isLoggedIn || !slug || slug === 'getting-started') return;

            const storedUser = JSON.parse(localStorage.getItem("user"));
            
            try {
                const response = await fetch(`${API_URL}/api/user/get-progress/${slug}`, {
                    headers: { 'Authorization': `Bearer ${storedUser.token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    // data.completedTasks is a string like "0,1,3"
                    const completedIndices = data.completedTasks.split(',').map(Number);

                    setSteps(prevSteps => prevSteps.map((step, index) => ({
                        ...step,
                        completed: completedIndices.includes(index)
                    })));
                }
            } catch (error) {
                console.error("Error fetching saved progress:", error);
            }
        };

        fetchSavedProgress();
    }, [isLoggedIn, slug, initialSteps]);

  useEffect(() => {
    if (initialSteps) setSteps(initialSteps);
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, [initialSteps]);

  // Checkbox Logic
  const handleToggleStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].completed = !updatedSteps[index].completed;
    setSteps(updatedSteps);
  };

  // Database Update Logic
  const handleSaveProgress = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please log in to save your progress.");
      setIsAuthModalOpen(true);
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user.token) {
      console.error("Token not found in local storage.");
      return;
    }

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const completedTaskIndices = steps
        .map((s, i) => (s.completed ? i : null))
        .filter((i) => i !== null)
        .join(",");

      const response = await fetch(`${API_URL}/api/user/update-progress`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({
          guideSlug: slug,
          completedTasks: completedTaskIndices
        }),
      });

      if (response.ok) {
        alert("Progress saved successfully!");
      }else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const progress = Math.round((steps.filter(s => s.completed).length / steps.length) * 100);

  return (
    <div className="transition-colors duration-300 p-6 max-w-sm rounded-2xl shadow-lg border-2 bg-white border-gray-100 dark:bg-[#242729] dark:border-gray-800">
      <h3 className="text-lg font-black mb-4 border-b pb-2 uppercase text-gray-700 dark:text-gray-100 dark:border-gray-700">
        {slug === 'getting-started' ? 'Getting Started' : `${title}`}
      </h3>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div 
            key={`${slug}-${step.id || index}`}
            onClick={() => handleToggleStep(index)}
            className="flex items-start gap-3 group cursor-pointer"
          >
            {step.completed ?
              <CheckSquare className="text-teal-600 shrink-0" size={20} /> :
              <Square className="text-gray-300 dark:text-gray-600 shrink-0" size={20} />
            }
            <span className={`text-sm font-medium transition-colors ${step.completed ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>
              {index + 1}. {step.task}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {slug !== 'getting-started' && (
        <div className="h-4 rounded-full overflow-hidden mb-4 relative bg-gray-100 dark:bg-[#1a1c1e]">
          <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {progress}%
          </span>
        </div>
      )}

      <div className="space-y-3">
        {slug !== 'getting-started' && !isFullPage && (
          <button onClick={() => navigate(`/guides/${slug}`)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase border-2 text-teal-700 border-teal-600 hover:bg-teal-50">
            View Full Guide <ArrowRight size={14} />
          </button>
        )}

        {!isLoggedIn ? (
          <button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-teal-700 text-white text-xs py-3 rounded-lg font-bold uppercase">
            Register / Login to Track
          </button>
        ) : (
          /* Save button */
          <button
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
            {isSaving ? "Saving..." : "Save Guide Progress"}
          </button>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default ChecklistCard;
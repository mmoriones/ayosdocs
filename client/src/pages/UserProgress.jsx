import { useState, useEffect } from 'react';
import ProgressCard from '../features/guides/ProgressCard';
import axios from 'axios';

const UserProgress = () => {
    const API_URL = import.meta.env.VITE_BACKEND_API_URL;
    const [progressList, setProgressList] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleRemoveFromUI = (slugToRemove) => {
        setProgressList(prevList => prevList.filter(item => item.slug !== slugToRemove));
    };

    useEffect(() => {
        const fetchAllProgress = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser?.token) return;

            try {
                //Get the list of slugs and completed strings
                const response = await fetch(`${API_URL}/api/user/get-data`, {
                    headers: { 'Authorization': `Bearer ${storedUser.token}` }
                });
                const result = await response.json();
                const savedItems = result.savedProgress || [];

                //Fetch full guide details for each saved slug
                const detailedProgress = await Promise.all(
                    savedItems.map(async (item) => {
                        try {
                            const guideRes = await axios.get(`${API_URL}/api/guides/${item.guideSlug}`);
                            
                            // Map the completed indices string to the actual checklist items
                            const completedIndices = item.completedTasks.split(',').map(Number);
                            const stepsWithProgress = guideRes.data.checklist.map((step, idx) => ({
                                ...step,
                                completed: completedIndices.includes(idx)
                            }));

                            return {
                                title: guideRes.data.title,
                                slug: item.guideSlug,
                                steps: stepsWithProgress
                            };
                        } catch (err) {
                            console.error(`Error fetching guide ${item.guideSlug}`, err);
                            return null;
                        }
                    })
                );

                setProgressList(detailedProgress.filter(Boolean));
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProgress();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading your progress...</div>;

    return (
        <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-[#1a1c1e]">
            <h1 className="text-2xl font-black uppercase mb-8 dark:text-white">My Tracked Guides</h1>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {progressList.length > 0 ? (
                    progressList.map((data) => (
                        <ProgressCard
                            key={data.slug}
                            title={data.title}
                            steps={data.steps}
                            slug={data.slug}
                            onDelete={handleRemoveFromUI}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 italic">No guides tracked yet.</p>
                )}
            </div>
        </div>
    );
}

export default UserProgress;
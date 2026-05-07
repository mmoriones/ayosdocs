import { Trash2, ChevronRight, Loader2, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../../context/ToastContext';
import ConfirmModal from '../../../../components/ConfirmModal';

const ProgressCard = ({ title, steps, slug }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;

  const progress =
    totalSteps === 0
      ? 0
      : Math.round((completedCount / totalSteps) * 100);

  const getStatus = (progress) => {
    if (progress === 100)
      return { label: "Completed", style: "bg-green-100 text-green-700" };
    return { label: "In Progress", style: "bg-yellow-100 text-yellow-700" };
  };

  const status = getStatus(progress);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`${API_URL}/api/user/delete/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });

      if (!response.ok) throw new Error('Failed to remove guide');
      return response.json();
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Guide Removed',
        message: `You have stopped tracking "${title}".`
      });
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
    }
  });

  return (
    <>
      <div className="
        bg-white border border-gray-200
        rounded-2xl shadow-sm hover:shadow-md
        transition-all duration-300
        overflow-hidden
        flex flex-col h-full
      ">

        {/* MAIN CONTENT */}
        <div
          onClick={() => navigate(`/guides/${slug}`)}
          className="p-5 cursor-pointer flex-1"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between mb-4">

            <div className="flex gap-3">

              {/* ICON */}
              <div className="
                w-12 h-12 rounded-2xl
                bg-teal-100 text-teal-700
                flex items-center justify-center font-semibold
              ">
                {title.charAt(0)}
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
                  {title}
                </h3>

                {/* STATUS BELOW TITLE */}
                <div className="mt-1.5">
                    <span className={`
                    text-xs font-medium px-2.5 py-1 rounded-full
                    ${status.style}
                    inline-flex items-center gap-1
                  `}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {status.label}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1.5">
                  {completedCount} / {totalSteps} steps
                </p>
              </div>
            </div>

            {/* PROGRESS BOX */}
            <div className="
              ml-3
              flex items-center justify-center
              min-w-[58px] h-10 px-3
              rounded-xl
              bg-teal-50/70
              border border-teal-100
              text-teal-700 text-sm font-semibold
            ">
              {progress}%
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-200/80 rounded-full overflow-hidden">
                <div
                  className="
                    h-full rounded-full
                    bg-gradient-to-r from-teal-500 to-teal-600
                    transition-all duration-700 ease-out
                    shadow-[inset_0_-1px_1px_rgba(0,0,0,0.1)]
                  "
                  style={{ width: `${progress}%` }}
                />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">

          {/* PRIMARY CTA */}
          <button
            onClick={() => navigate(`/guides/${slug}`)}
            className="
              px-5 py-2.5 rounded-xl
              bg-white border border-gray-200
              shadow-sm
              text-sm font-semibold text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            <div className="flex items-center gap-2">
              <span>{progress === 100 ? "Review Guide" : "Continue Guide"}</span>
              <ChevronRight size={16} />
            </div>
          </button>

          {/* RIGHT ACTIONS */}
          <div className="flex gap-2">

            {/* FAVORITE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(prev => !prev);
              }}
              className={`
                p-2.5 rounded-xl
                border transition
                ${isFavorite
                  ? "bg-yellow-100 border-yellow-200"
                  : "bg-white border-gray-200 hover:bg-gray-100"}
              `}
            >
              <Bookmark
                size={16}
                className={`
                  ${isFavorite ? "text-yellow-600 fill-yellow-500" : "text-gray-600"}
                `}
              />
            </button>

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmOpen(true);
              }}
              className="
                p-2.5 rounded-xl
                bg-white border border-gray-200
                hover:bg-red-50
              "
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </button>

          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Stop tracking?"
        message={`Are you sure you want to stop tracking "${title}"?`}
        confirmText="Remove Guide"
        variant="danger"
      />
    </>
  );
};

export default ProgressCard;
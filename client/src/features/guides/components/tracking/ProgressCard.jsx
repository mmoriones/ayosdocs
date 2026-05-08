import { Trash2, ChevronRight, Bookmark, Scan, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../../context/ToastContext';
import ConfirmModal from '../../../../components/ConfirmModal';
import { getGuideIcon } from '../../../../utils/guideIcons';

const ProgressCard = ({ title, steps, slug }) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  const nextStepIndex = steps.findIndex((s) => !s.completed);
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null;

  const getStatus = (progress) => {
    if (progress === 100)
      return { label: "Completed", style: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    return { label: "In Progress", style: "bg-amber-50 text-amber-700 border-amber-100" };
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
        bg-white border border-slate-100
        rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
        transition-all duration-300
        overflow-hidden
        flex flex-col h-full
        group/card
      ">

        {/* MAIN CONTENT */}
        <div
          onClick={() => navigate(`/guides/${slug}`)}
          className="p-6 cursor-pointer flex-1"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex gap-4">
              {/* ICON */}
              <div className="
                w-12 h-12 rounded-2xl
                bg-slate-50 border border-slate-100
                flex items-center justify-center p-2.5 shrink-0 shadow-sm
                group-hover/card:scale-110 transition-transform duration-300
              ">
                <img 
                  src={getGuideIcon(slug)} 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 leading-tight group-hover/card:text-teal-700 transition-colors">
                  {title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded-full border
                    ${status.style}
                    inline-flex items-center gap-1 uppercase tracking-wider
                  `}>
                    {status.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {completedCount}/{totalSteps} steps
                  </span>
                </div>
              </div>
            </div>

            {/* PROGRESS PERCENTAGE */}
            <div className="text-right shrink-0">
              <span className="text-[13px] font-black text-slate-900 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">{progress}%</span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-6">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
            </div>
          </div>

          {/* NEXT STEP HIGHLIGHT (Only if not completed) */}
          {nextStep && (
            <div className="bg-teal-50/40 border border-teal-100/50 rounded-2xl p-3.5 flex items-start gap-3 group/step hover:bg-teal-50 transition-colors">
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 flex items-center justify-center text-teal-600">
                  <Scan size={14} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-teal-900 line-clamp-1">{nextStep.task}</p>
                <p className="text-[10px] font-bold text-teal-600 mt-0.5 uppercase tracking-wide">
                  Next step
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300 self-center group-hover/step:translate-x-0.5 transition-transform" />
            </div>
          )}

          {/* COMPLETION BADGE (If 100%) */}
          {progress === 100 && (
            <div className="mt-8 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl py-3 px-4 flex items-center gap-3 animate-in fade-in zoom-in duration-500">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-100">
                <Check size={12} strokeWidth={4} />
              </div>
              <p className="text-[13px] font-bold text-emerald-800 tracking-tight">Requirement complete!</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50/50 border-t border-slate-100 p-4 px-6 flex items-center justify-between">
          <div className="flex gap-2">
            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmOpen(true);
              }}
              className="
                p-2.5 rounded-xl
                bg-white border border-slate-200
                hover:bg-red-50 hover:border-red-100 hover:text-red-500
                text-slate-400 transition-all
                active:scale-95
              "
              title="Remove guide"
            >
              <Trash2 size={16} />
            </button>

            {/* FAVORITE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(prev => !prev);
              }}
              className={`
                p-2.5 rounded-xl
                border transition-all active:scale-95
                ${isFavorite
                  ? "bg-amber-50 border-amber-200 text-amber-500"
                  : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"}
              `}
            >
              <Bookmark
                size={16}
                className={isFavorite ? "fill-amber-500" : ""}
              />
            </button>
          </div>

          {/* PRIMARY CTA */}
          <button
            onClick={() => navigate(`/guides/${slug}`)}
            className="
              px-5 py-2.5 rounded-xl
              bg-teal-600 text-white
              shadow-md shadow-teal-100
              text-sm font-bold
              hover:bg-teal-700
              transition-all active:scale-95
              flex items-center gap-2
            "
          >
            <span>{progress === 100 ? "Review" : "Continue"}</span>
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
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
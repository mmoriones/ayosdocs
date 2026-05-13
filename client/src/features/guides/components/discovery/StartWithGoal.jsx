import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bundles } from '../../../../data/bundles';

/**
 * StartWithGoal Component
 * Displays a list of top life-event goals in a horizontal layout.
 */
const StartWithGoal = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-4">
      {bundles.slice(0, 3).map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => navigate('/coming-soon')}
          className="
            group p-6 rounded-[2rem] 
            bg-ctp-mantle border border-ctp-surface0 shadow-sm
            hover:shadow-xl hover:border-ctp-green/20 transition-all duration-300 cursor-pointer 
            flex items-center gap-6
          "
        >
          {/* ICON */}
          <div className="w-14 h-14 rounded-2xl bg-ctp-base flex items-center justify-center text-3xl shrink-0 group-hover:bg-ctp-surface0 transition-all duration-500">
            {bundle.icon}
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[14px] font-bold text-ctp-green uppercase tracking-widest">Life Event</span>
              <span className="text-[14px] text-ctp-surface2">•</span>
              <span className="text-[14px] font-bold text-ctp-subtext0 uppercase tracking-widest">{bundle.category}</span>
            </div>
            <h3 className="text-[18px] font-extrabold text-ctp-text group-hover:text-ctp-green transition-colors truncate">
              {bundle.title}
            </h3>
            <p className="text-[14px] text-ctp-subtext1 font-medium leading-relaxed truncate">
              {bundle.description}
            </p>
          </div>

          {/* ACTION INDICATOR */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-ctp-base flex items-center justify-center text-ctp-green group-hover:bg-ctp-green group-hover:text-ctp-base transition-all shadow-xs">
              <ArrowRight size={18} strokeWidth={3} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartWithGoal;

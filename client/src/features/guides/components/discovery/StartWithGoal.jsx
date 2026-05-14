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
            group p-8 rounded-[2.5rem] 
            bg-ctp-base border border-ctp-surface0 soft-shadow
            hover:shadow-2xl hover:border-ctp-sapphire/20 transition-all duration-500 cursor-pointer 
            flex flex-col md:flex-row items-center gap-8
          "
        >
          {/* ICON */}
          <div className="w-16 h-16 rounded-2xl bg-ctp-mantle flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-500 border border-ctp-surface0 shadow-sm">
            {bundle.icon}
          </div>

          {/* CONTENT */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-[12px] font-black text-ctp-sapphire uppercase tracking-widest">Life Event Workflow</span>
              <span className="text-[12px] text-ctp-surface1">•</span>
              <span className="text-[12px] font-black text-ctp-subtext0 uppercase tracking-widest">{bundle.category}</span>
            </div>
            <h3 className="text-[24px] font-black text-ctp-text group-hover:text-ctp-sapphire transition-colors tracking-tight mb-1">
              {bundle.title}
            </h3>
            <p className="text-[16px] text-ctp-subtext1 font-medium leading-relaxed opacity-80">
              {bundle.description}
            </p>
          </div>

          {/* ACTION INDICATOR */}
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-ctp-mantle flex items-center justify-center text-ctp-sapphire group-hover:bg-ctp-sapphire group-hover:text-ctp-base transition-all shadow-sm border border-ctp-surface0">
              <ArrowRight size={22} strokeWidth={3} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartWithGoal;

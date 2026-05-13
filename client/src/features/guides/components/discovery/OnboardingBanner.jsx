import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notepad from '../../../../assets/notepad.webp';

/**
 * OnboardingBanner component.
 * Prompts new users to see how the platform works.
 * Refactored to a full-width horizontal banner style.
 */
const OnboardingBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-ctp-mantle rounded-[3rem] overflow-hidden relative group border border-ctp-surface0 shadow-sm">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-ctp-green/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-8 py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-center gap-10">
        
        {/* TEXT CONTENT */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ctp-surface0 border border-ctp-surface1 text-ctp-green text-[14px] font-bold uppercase tracking-widest">
            <HelpCircle size={14} />
            <span>New to AyosDocs?</span>
          </div>

          <h2 className="text-[32px] font-extrabold text-ctp-text leading-tight tracking-tight">
            Let's help you get started with <span className="text-ctp-green">your first application.</span>
          </h2>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8">
            {[
              "Find the right guide",
              "Follow step-by-step",
              "Track your progress"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-ctp-green" strokeWidth={3} />
                <span className="text-[14px] font-bold text-ctp-subtext1 uppercase tracking-tight">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base font-extrabold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 text-[18px]"
            >
              <span>See how it works</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:block shrink-0 w-48 pointer-events-none">
          <img 
            src={notepad} 
            alt="Checklist illustration" 
            className="w-full h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;

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
    <div className="w-full bg-ctp-base rounded-[3rem] overflow-hidden relative group border border-ctp-sky-300/20 soft-shadow">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-ctp-sky-800/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-8 py-10 lg:px-12 lg:py-14 flex flex-col lg:flex-row items-center gap-12">
        
        {/* TEXT CONTENT */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ctp-sky-50 border border-ctp-sky-300/20 text-ctp-sky-800 text-[14px] font-black uppercase tracking-widest shadow-sm">
            <HelpCircle size={16} />
            <span>New to AyosDocs?</span>
          </div>

          <h2 className="text-[36px] lg:text-[42px] font-black text-ctp-text leading-[1.1] tracking-tight">
            Let's help you get started with <span className="text-ctp-sky-800">your first application.</span>
          </h2>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10">
            {[
              "Find the right guide",
              "Follow step-by-step",
              "Track your progress"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 group/item">
                <CheckCircle size={20} className="text-ctp-sky-800 group-hover/item:scale-110 transition-transform" strokeWidth={3} />
                <span className="text-[14px] font-black text-ctp-subtext1 uppercase tracking-tight opacity-80">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto bg-ctp-sky-800 hover:opacity-90 text-ctp-base font-black px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 text-[18px] uppercase tracking-widest"
            >
              <span>See how it works</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:block shrink-0 w-56 pointer-events-none p-4">
          <img 
            src={notepad} 
            alt="Checklist illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 -rotate-6"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;

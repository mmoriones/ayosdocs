import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notepad from '../../../../assets/notepad.webp';

const OnboardingBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-[#F4F9F8] rounded-[32px] p-8 md:p-10 overflow-hidden border border-teal-50 h-[320px] lg:h-auto lg:min-h-0 flex flex-col">
      
      <div className="relative z-10 flex flex-col h-full flex-1 md:flex-row md:items-center md:gap-10">
        
        {/* DESKTOP ILLUSTRATION */}
        <div className="hidden md:flex shrink-0 w-48 h-48 items-center justify-center">
          <img 
            src={notepad} 
            alt="Notepad checklist illustration" 
            className="w-full h-full object-contain drop-shadow-md scale-135"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col h-full md:h-auto max-w-[190px] md:max-w-none">
          <div className="space-y-4 md:space-y-5">
            <div className="space-y-1">
              <h3 className="text-[18px] md:text-[22px] font-extrabold text-slate-900 leading-tight">
                New to AyosDocs?
              </h3>
              <p className="text-slate-500 font-medium text-[13px] md:text-[15px]">
                Let us help you get started with confidence.
              </p>
            </div>

            <ul className="space-y-2.5">
              {[
                "Find the right guide in seconds",
                "Follow step-by-step instructions",
                "Track your progress easily"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-teal-600 shrink-0" strokeWidth={3} />
                  <span className="text-[12px] md:text-[13px] font-bold text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-auto md:mt-8 md:self-end">
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-100 flex items-center gap-2 active:scale-95 text-[14px] whitespace-nowrap"
            >
              <span>See how it works</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE ILLUSTRATION (Absolute) */}
      <div className="md:hidden pr-4 absolute -right-6 bottom-0 w-34 h-34 pointer-events-none z-0">
        <img 
          src={notepad} 
          alt="" 
          className="w-full h-full object-contain drop-shadow-md scale-110"
        />
      </div>

      {/* BACKGROUND DECO */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default OnboardingBanner;

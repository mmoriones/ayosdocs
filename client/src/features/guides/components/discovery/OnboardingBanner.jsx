import { ArrowRight, CheckCircle } from 'lucide-react';
import notepad from '../../../../assets/notepad.webp';

const OnboardingBanner = () => {
  return (
    <div className="relative bg-[#F4F9F8] rounded-[32px] p-8 md:p-10 overflow-hidden border border-teal-50">
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-8">
        
        {/* LEFT: ILLUSTRATION */}
        <div className="shrink-0 w-40 h-40 md:w-45 md:h-52 flex items-center justify-center">
          <img 
            src={notepad} 
            alt="Notepad checklist illustration" 
            className="w-full h-full object-contain drop-shadow-md scale-110 md:scale-135"
          />
        </div>

        {/* RIGHT: CONTENT & BUTTON */}
        <div className="flex-1 flex flex-col w-full h-full">
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight">
                New to AyosDocs?
              </h3>
              <p className="text-slate-500 font-medium text-[14px]">
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
                  <span className="text-[13px] font-bold text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA - Positioned bottom right on desktop */}
          <div className="mt-8 md:mt-4 md:self-end">
            <button className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-100 flex items-center gap-2 active:scale-95 text-[14px]">
              <span>See how it works</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>

      {/* BACKGROUND DECO */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default OnboardingBanner;

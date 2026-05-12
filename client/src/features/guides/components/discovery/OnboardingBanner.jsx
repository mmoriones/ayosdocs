import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notepad from '../../../../assets/notepad.webp';

/**
 * OnboardingBanner component.
 * Prompts new users to see how the platform works.
 * Matches the styling of the WhySignUp card for visual consistency.
 * 
 * @returns {JSX.Element} The rendered OnboardingBanner.
 */
const OnboardingBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-[#F0F9F6] rounded-3xl p-6 overflow-hidden h-[320px] lg:h-auto lg:min-h-0 flex flex-col border border-teal-100/50 shadow-sm transition-all group">
      
      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full flex-1">
        
        {/* TEXT CONTENT */}
        <div className="max-w-[220px] md:max-w-[280px]">
          <h3 className="text-[11px] font-bold text-teal-700/60 uppercase tracking-widest leading-none mb-6">
            Getting Started
          </h3>
          
          <h4 className="text-[18px] md:text-[22px] font-extrabold text-gray-900 leading-tight mb-5">
            New to AyosDocs? Let's help you get started.
          </h4>

          <ul className="space-y-3 mb-8">
            {[
              "Find the right guide in seconds",
              "Follow step-by-step instructions",
              "Track your progress easily"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-teal-600 shrink-0" strokeWidth={3} />
                <span className="text-[11px] md:text-[12px] font-bold text-gray-600">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA BUTTON */}
        <div className="mt-auto max-w-[200px]">
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 active:scale-95 text-[12px] uppercase tracking-wider whitespace-nowrap"
          >
            <span>See how it works</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ILLUSTRATION */}
      <div className="absolute -right-10 md:-right-12 bottom-0 w-36 md:w-52 pointer-events-none z-0">
        <img 
          src={notepad} 
          alt="Notepad checklist illustration" 
          className="w-full h-full object-contain object-right-bottom scale-90 group-hover:scale-95 transition-transform duration-700 drop-shadow-sm"
        />
      </div>

      {/* BACKGROUND DECO */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/40 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100/20 rounded-full blur-2xl -ml-12 -mb-12" />
    </div>
  );
};

export default OnboardingBanner;

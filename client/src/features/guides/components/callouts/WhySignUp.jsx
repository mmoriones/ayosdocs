import { CheckCircle, UserPlus, ArrowRight } from 'lucide-react';
import person2 from '../../../../assets/person2.webp';

const WhySignUp = ({ onSignUp }) => {
  return (
    <div className="w-full bg-ctp-mantle rounded-[3rem] overflow-hidden relative group border border-ctp-surface0">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-green/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ctp-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* TEXT CONTENT */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ctp-green/10 border border-ctp-green/20 text-ctp-green text-[14px] font-bold uppercase tracking-widest">
            <UserPlus size={14} />
            <span>Join AyosDocs</span>
          </div>

          <h2 className="text-[32px] font-extrabold text-ctp-text leading-tight tracking-tight">
            Stop losing track of your <span className="text-ctp-green">government requirements.</span>
          </h2>

          <p className="text-ctp-subtext1 text-[18px] font-medium max-w-xl mx-auto lg:mx-0">
            Create a free account to save guides, track your progress, 
            and get reminders for your applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={onSignUp}
              className="w-full sm:w-auto bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base font-extrabold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 text-[18px]"
            >
              <span>Sign up for free</span>
              <ArrowRight size={20} />
            </button>
            <p className="text-ctp-subtext0 text-[14px] font-bold">
              Already have an account? <button onClick={onSignUp} className="text-ctp-green hover:underline">Log in</button>
            </p>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
          {[
            { title: "Progress Tracking", desc: "Never forget where you left off." },
            { title: "Personalized Checklist", desc: "Requirements tailored for you." },
            { title: "Mobile Access", desc: "Check your status on the go." },
            { title: "Smart Reminders", desc: "Get notified of next steps." }
          ].map((feature, i) => (
            <div key={i} className="bg-ctp-mantle/50 backdrop-blur-sm border border-ctp-surface0 p-5 rounded-2xl space-y-2 hover:bg-ctp-mantle transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-ctp-green" strokeWidth={3} />
                <span className="text-ctp-text font-bold text-[14px] uppercase tracking-wide">{feature.title}</span>
              </div>
              <p className="text-ctp-subtext1 text-[14px] font-medium leading-relaxed pl-7">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ILLUSTRATION (Optional/Hidden on Mobile) */}
      <div className="hidden xl:block absolute -right-10 bottom-0 w-80 pointer-events-none z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <img 
          src={person2} 
          alt="" 
          className="w-full h-full object-contain object-right-bottom scale-110 translate-y-10"
        />
      </div>
    </div>
  );
};

export default WhySignUp;

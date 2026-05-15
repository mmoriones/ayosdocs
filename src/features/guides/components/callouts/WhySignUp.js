'use client';

import { CheckCircle, UserPlus, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const WhySignUp = ({ onSignUp }) => {
  return (
    <div className="w-full bg-ctp-base rounded-[3rem] overflow-hidden relative group border border-ctp-sky-300/20 soft-shadow">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-sky-800/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ctp-sky-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ctp-sky-50 border border-ctp-sky-300/20 text-ctp-sky-800 text-[14px] font-black uppercase tracking-widest shadow-sm">
            <UserPlus size={16} />
            <span>Join AyosDocs</span>
          </div>

          <h2 className="text-[40px] lg:text-[48px] font-black text-ctp-text leading-[1.1] tracking-tight">
            Stop losing track of your <span className="text-ctp-sky-800">government requirements.</span>
          </h2>

          <p className="text-ctp-subtext1 text-[20px] font-medium max-w-xl mx-auto lg:mx-0 opacity-80 leading-relaxed">
            Create a free account to save guides, track your progress, 
            and get reminders for your applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
            <button 
              onClick={onSignUp}
              className="w-full sm:w-auto bg-ctp-sky-800 hover:opacity-90 text-ctp-base font-black px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 text-[18px] uppercase tracking-widest"
            >
              <span>Sign up for free</span>
              <ArrowRight size={22} />
            </button>
            <div className="text-ctp-subtext0 text-[14px] font-bold">
              Already have an account? <button onClick={onSignUp} className="text-ctp-sky-800 hover:underline font-black">Log in</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full lg:w-auto shrink-0">
          {[
            { title: "Progress Tracking", desc: "Never forget where you left off.", color: "text-ctp-sky-800" },
            { title: "Personalized Checklist", desc: "Requirements tailored for you.", color: "text-ctp-green" },
            { title: "Mobile Access", desc: "Check your status on the go.", color: "text-ctp-yellow" },
            { title: "Smart Reminders", desc: "Get notified of next steps.", color: "text-ctp-orange" }
          ].map((feature, i) => (
            <div key={i} className="bg-ctp-mantle/30 backdrop-blur-sm border border-ctp-surface0 p-6 rounded-3xl space-y-2 hover:bg-ctp-mantle transition-colors soft-shadow-hover group/item">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className={`${feature.color} group-hover/item:scale-110 transition-transform`} strokeWidth={3} />
                <span className="text-ctp-text font-black text-[14px] uppercase tracking-wide">{feature.title}</span>
              </div>
              <p className="text-ctp-subtext1 text-[15px] font-medium leading-relaxed pl-8 opacity-70">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block absolute -right-10 bottom-0 w-80 pointer-events-none z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <Image 
          src="/assets/person2.webp" 
          alt="" 
          width={320}
          height={400}
          className="w-full h-full object-contain object-right-bottom scale-110 translate-y-10"
        />
      </div>
    </div>
  );
};

export default WhySignUp;

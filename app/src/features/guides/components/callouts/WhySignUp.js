'use client';

import { CheckCircle, UserPlus, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const WhySignUp = ({ onSignUp }) => {
  return (
    <div className="w-full bg-ctp-base rounded-xl overflow-hidden relative group border border-ctp-surface1 shadow-sm">
      {/* Background Decorations - Subtler */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-sky-10 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-6 py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ctp-mantle border border-ctp-surface1 text-ctp-sky-800 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <UserPlus size={14} />
            <span>Join AyosDocs</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-ctp-text leading-tight tracking-tight">
            Stop losing track of your <span className="text-ctp-sky-800">government requirements.</span>
          </h2>

          <p className="text-ctp-subtext0 text-lg font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Create a free account to save guides, track your progress, 
            and get reminders for your applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button 
              onClick={onSignUp}
              className="w-full sm:w-auto bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 text-base"
            >
              <span>Sign up for free</span>
              <ArrowRight size={18} />
            </button>
            <div className="text-ctp-subtext0 text-sm font-medium">
              Already have an account? <button onClick={onSignUp} className="text-ctp-sky-800 hover:underline font-semibold">Log in</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
          {[
            { title: "Progress Tracking", desc: "Never forget where you left off.", color: "text-ctp-sky-800" },
            { title: "Personalized Checklist", desc: "Requirements tailored for you.", color: "text-ctp-green" },
            { title: "Mobile Access", desc: "Check your status on the go.", color: "text-ctp-yellow" },
            { title: "Smart Reminders", desc: "Get notified of next steps.", color: "text-ctp-orange" }
          ].map((feature, i) => (
            <div key={i} className="bg-ctp-mantle/50 border border-ctp-surface1 p-5 rounded-xl space-y-1 hover:bg-ctp-mantle transition-colors group/item">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className={`${feature.color} group-hover/item:scale-105 transition-transform`} />
                <span className="text-ctp-text font-semibold text-sm uppercase tracking-tight">{feature.title}</span>
              </div>
              <p className="text-ctp-subtext0 text-sm font-normal leading-relaxed pl-7">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block absolute -right-10 bottom-0 w-64 pointer-events-none z-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
        <Image 
          src="/assets/person2.webp" 
          alt="" 
          width={256}
          height={320}
          className="w-full h-full object-contain object-right-bottom translate-y-8"
        />
      </div>
    </div>
  );
};

export default WhySignUp;

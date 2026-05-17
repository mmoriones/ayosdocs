'use client';

import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * OnboardingBanner component.
 */
const OnboardingBanner = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-ctp-mantle rounded-2xl overflow-hidden relative group border border-ctp-surface1 soft-shadow">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-ctp-sky-800/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-8 py-10 lg:px-12 lg:py-14 flex flex-col lg:flex-row items-center gap-12">
        
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ctp-sky-800/10 border border-ctp-sky-800/20 text-ctp-sky-800 text-sm font-semibold uppercase tracking-wider shadow-sm">
            <HelpCircle size={16} />
            <span>New to AyosDocs?</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-ctp-text leading-tight tracking-tight">
            Let&apos;s help you get started with <span className="text-ctp-sky-800">your first application.</span>
          </h2>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10">
            {[
              "Find the right guide",
              "Follow step-by-step",
              "Track your progress"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 group/item">
                <CheckCircle size={20} className="text-ctp-sky-800 group-hover/item:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-ctp-subtext1 uppercase tracking-wider opacity-80">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              onClick={() => router.push('/onboarding')}
              className="w-full sm:w-auto bg-ctp-sky-800 hover:opacity-90 text-ctp-base font-bold px-10 py-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 text-lg"
            >
              <span>See how it works</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        <div className="hidden lg:block shrink-0 w-56 pointer-events-none p-4">
          <Image 
            src="/assets/notepad.webp" 
            alt="Checklist illustration" 
            width={224}
            height={224}
            className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 -rotate-6"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;

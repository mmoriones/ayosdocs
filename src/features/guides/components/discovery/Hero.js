'use client';

import {
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';

const Hero = ({ guides }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { openAuthModal } = useAuthUI();

  return (
    <section className="relative w-full overflow-hidden bg-ctp-sky-10/30 pt-16 pb-16 lg:pt-24 lg:pb-24">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ctp-sky-50/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ctp-sky-300/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
      
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="10" cy="10" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sky-300" />
        <circle cx="90" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sky-300" />
        <path d="M-10,50 Q25,25 50,50 T110,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sky-300" />
      </svg>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 text-center lg:text-left space-y-10">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-ctp-sky-50 border border-ctp-sky-300/30 px-5 py-2 text-[14px] font-bold text-ctp-sky-800 shadow-sm">
                {isLoggedIn && session?.user ? (
                  <>Welcome back, {session.user.name?.split(' ')[0] || 'User'}! 👋</>
                ) : (
                  'Empowering your government journey 👋'
                )}
              </span>
            </div>

            <h1 className="text-[42px] lg:text-[60px] font-black tracking-tight leading-[1.1] text-ctp-text max-w-4xl mx-auto lg:mx-0">
              <span className="text-ctp-sky-800">How can we help</span> you today?
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-ctp-subtext1 text-[20px] font-medium leading-relaxed opacity-90">
              Find step-by-step guides for Philippine government documents 
              and official processes, all in one place.
            </p>

            <div className="max-w-2xl mx-auto lg:mx-0">
              <SearchBar guides={guides} />
            </div>

            {!isLoggedIn && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                <button 
                  onClick={openAuthModal}
                  className="flex items-center gap-2 bg-ctp-sky-800 text-ctp-base font-bold py-4 px-8 rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-ctp-sky-800/20 group text-[18px]"
                >
                  <span>Create free account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/guides" className="text-ctp-sky-800/70 font-bold hover:text-ctp-sky-800 transition-colors text-[18px] border-b-2 border-transparent hover:border-ctp-sky-800/30 pb-1">
                  Browse all guides
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex items-center justify-center animate-float">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-ctp-sky-300/20 rounded-[40%_60%_70%_30%/_40%_50%_60%_50%] blur-3xl animate-blob" />
            
            <div className="relative z-10 w-full aspect-square flex items-center justify-center p-6">
              <Image
                src="/assets/person.webp"
                alt="AyosDocs Hero"
                width={500}
                height={500}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-16 lg:mt-24 pt-12 border-t border-ctp-sky-300/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-sky-50/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-sky-50 text-ctp-sky-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-sky-300/30">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Step-by-step guides</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Easy to follow instructions</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-sky-50/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-green/10 text-ctp-green flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-green/20">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Official processes</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Verified by community experts</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-sky-50/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-yellow/10 text-ctp-yellow flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-yellow/20">
              <Clock size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Track your progress</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Never lose your place</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-center lg:text-left text-[13px] font-black text-ctp-subtext0 uppercase tracking-[0.3em] opacity-60">
            Guides for primary government agencies
          </p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <Image src="/assets/psa.webp" alt="PSA" width={100} height={36} className="h-7 lg:h-9 w-auto object-contain" />
            <Image src="/assets/nbi.webp" alt="NBI" width={100} height={36} className="h-7 lg:h-9 w-auto object-contain" />
            <Image src="/assets/dfa.webp" alt="DFA" width={100} height={36} className="h-7 lg:h-9 w-auto object-contain" />
            <Image src="/assets/philhealth.webp" alt="PhilHealth" width={120} height={44} className="h-9 lg:h-11 w-auto object-contain" />
            <Image src="/assets/sss.webp" alt="SSS" width={100} height={36} className="h-7 lg:h-9 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

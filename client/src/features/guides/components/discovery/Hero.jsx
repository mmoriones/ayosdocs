import {
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

import person from '../../../../assets/person.webp';
import psa from '../../../../assets/psa.webp';
import nbi from '../../../../assets/nbi.webp';
import dfa from '../../../../assets/dfa.webp';
import philhealth from '../../../../assets/philhealth.webp';
import sss from '../../../../assets/sss.webp';

const Hero = () => {
  const { isLoggedIn, user, openAuthModal } = useAuth();

  return (
    <section className="relative w-full overflow-hidden bg-ctp-mantle/30 pt-16 pb-16 lg:pt-24 lg:pb-24">
      {/* Background Decorations - Inspired by cpt_sample.png */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ctp-sapphire/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ctp-blue/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
      
      {/* Subtle Background Lines/Circles */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="10" cy="10" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sapphire" />
        <circle cx="90" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sapphire" />
        <path d="M-10,50 Q25,25 50,50 T110,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ctp-sapphire" />
      </svg>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT CONTENT: Text & Search */}
          <div className="flex-1 text-center lg:text-left space-y-10">
            {/* Greeting Pill */}
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-ctp-base border border-ctp-surface0 px-5 py-2 text-[14px] font-bold text-ctp-sapphire shadow-sm">
                {isLoggedIn && user ? (
                  <>Welcome back, {user.fullName?.split(' ')[0] || 'User'}! 👋</>
                ) : (
                  'Empowering your government journey 👋'
                )}
              </span>
            </div>

            {/* Main Headline - Bold and Large as in sample */}
            <h1 className="text-[42px] lg:text-[60px] font-black tracking-tight leading-[1.1] text-ctp-text max-w-4xl mx-auto lg:mx-0">
              <span className="text-ctp-sapphire">How can we help</span> you today?
            </h1>

            {/* Description */}
            <p className="max-w-xl mx-auto lg:mx-0 text-ctp-subtext1 text-[20px] font-medium leading-relaxed opacity-90">
              Find step-by-step guides for Philippine government documents 
              and official processes, all in one place.
            </p>

            {/* Integrated Search Bar */}
            <div className="max-w-2xl mx-auto lg:mx-0">
              <SearchBar />
            </div>

            {/* Secondary CTA / Onboarding */}
            {!isLoggedIn && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                <button 
                  onClick={openAuthModal}
                  className="flex items-center gap-2 text-ctp-text font-bold hover:text-ctp-sapphire transition-all group text-[18px]"
                >
                  <span className="border-b-2 border-ctp-surface0 group-hover:border-ctp-sapphire pb-1">Create free account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="hidden sm:block h-1.5 w-1.5 rounded-full bg-ctp-surface2" />
                <Link to="/guides" className="text-ctp-subtext1 font-bold hover:text-ctp-text transition-colors text-[18px]">
                  Browse all guides
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT CONTENT: Illustration */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex items-center justify-center animate-float">
            {/* Organic Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-ctp-sapphire/10 rounded-[40%_60%_70%_30%/_40%_50%_60%_50%] blur-3xl animate-blob" />
            
            <div className="relative z-10 w-full aspect-square flex items-center justify-center p-6">
              <img
                src={person}
                alt="AyosDocs Hero"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BAR / FEATURE ROW */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-16 lg:mt-24 pt-12 border-t border-ctp-surface0/50">
        
        {/* TOP ROW: Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-base/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-base text-ctp-sapphire flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-surface0">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Step-by-step guides</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Easy to follow instructions</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-base/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-base text-ctp-blue flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-surface0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Official processes</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Verified by community experts</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-ctp-base/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-ctp-base text-ctp-sky flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-ctp-surface0">
              <Clock size={24} />
            </div>
            <div className="space-y-1">
              <span className="block font-black text-[18px] text-ctp-text tracking-tight">Track your progress</span>
              <p className="text-[14px] text-ctp-subtext1 font-medium">Never lose your place</p>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Agency Logos (Trust Bar) */}
        <div className="space-y-8">
          <p className="text-center lg:text-left text-[13px] font-black text-ctp-subtext0 uppercase tracking-[0.3em] opacity-60">
            Guides for primary government agencies
          </p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <img src={psa} alt="PSA" className="h-7 lg:h-9 object-contain" />
            <img src={nbi} alt="NBI" className="h-7 lg:h-9 object-contain" />
            <img src={dfa} alt="DFA" className="h-7 lg:h-9 object-contain" />
            <img src={philhealth} alt="PhilHealth" className="h-9 lg:h-11 object-contain" />
            <img src={sss} alt="SSS" className="h-7 lg:h-9 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
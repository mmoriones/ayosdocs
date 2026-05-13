import {
  FileText,
  ShieldCheck,
  Clock,
  ChevronDown,
  LayoutGrid,
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
    <section className="relative w-full overflow-hidden bg-ctp-base pt-12 pb-12 lg:pt-20 lg:pb-20">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-ctp-green/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-ctp-green/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ctp-teal/10 rounded-full blur-[120px] -z-10" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* LEFT CONTENT: Text & Search */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Greeting Pill */}
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-ctp-green/20 bg-ctp-surface0 px-5 py-2 text-[14px] font-bold text-ctp-green shadow-sm">
                {isLoggedIn && user ? (
                  <>Welcome back, {user.fullName?.split(' ')[0] || 'User'}! 👋</>
                ) : (
                  'Empowering your government journey 👋'
                )}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[48px] font-extrabold tracking-tight leading-tight text-ctp-text max-w-3xl mx-auto lg:mx-0">
              <span className="text-ctp-green">How can we help</span> you today?
            </h1>

            {/* Description */}
            <p className="max-w-xl mx-auto lg:mx-0 text-ctp-subtext1 text-[18px] font-medium leading-relaxed">
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
                  className="flex items-center gap-2 text-ctp-text font-bold hover:text-ctp-green transition-all group text-[18px]"
                >
                  <span className="border-b-2 border-ctp-surface1 group-hover:border-ctp-green pb-1">Create free account</span>
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
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex items-center justify-center">
            {/* Organic Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-ctp-green/10 rounded-[40%_60%_70%_30%/_40%_50%_60%_50%] blur-3xl animate-blob" />
            
            <div className="relative z-10 w-full aspect-square flex items-center justify-center p-6">
              <img
                src={person}
                alt="AyosDocs Hero"
                className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BAR / FEATURE ROW */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-12 lg:mt-20 pt-8 border-t border-ctp-surface0">
        
        {/* TOP ROW: Core Features */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12 mb-12">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-ctp-surface0 text-ctp-green flex items-center justify-center transition-all duration-300">
              <FileText size={20} />
            </div>
            <span className="font-extrabold text-[14px] lg:text-[18px] text-ctp-text tracking-tight">Step-by-step guides</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-ctp-surface0 text-ctp-mauve flex items-center justify-center transition-all duration-300">
              <ShieldCheck size={20} />
            </div>
            <span className="font-extrabold text-[14px] lg:text-[18px] text-ctp-text tracking-tight">Official processes</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-ctp-surface0 text-ctp-yellow flex items-center justify-center transition-all duration-300">
              <Clock size={20} />
            </div>
            <span className="font-extrabold text-[14px] lg:text-[18px] text-ctp-text tracking-tight">Track your progress</span>
          </div>
        </div>

        {/* BOTTOM ROW: Agency Logos (Trust Bar) */}
        <div className="space-y-6">
          <p className="text-left text-[14px] font-black text-ctp-subtext0 uppercase tracking-[0.3em]">
            Guides for primary government agencies:
          </p>
          <div className="flex flex-wrap justify-between items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <img src={psa} alt="PSA" className="h-6 lg:h-8 object-contain" />
            <img src={nbi} alt="NBI" className="h-6 lg:h-8 object-contain" />
            <img src={dfa} alt="DFA" className="h-6 lg:h-8 object-contain" />
            <img src={philhealth} alt="PhilHealth" className="h-8 lg:h-10 object-contain" />
            <img src={sss} alt="SSS" className="h-6 lg:h-8 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
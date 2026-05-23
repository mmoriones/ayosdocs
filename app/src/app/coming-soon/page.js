'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Construction, Home, ArrowLeft, Timer, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * ComingSoon Page Component
 */
export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center px-6 py-20 font-sans text-ctp-text">
      <div className="max-w-xl w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="relative">
          <div className="absolute inset-0 bg-ctp-sky-800/10 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative flex justify-center">
            <div className="w-20 h-20 bg-ctp-mantle rounded-2xl shadow-xl shadow-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-ctp-sky-800/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              <Rocket size={32} className="relative z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
            </div>
            
            <div className="absolute -top-4 -right-4 w-7 h-7 bg-ctp-peach/10 rounded-xl flex items-center justify-center text-ctp-peach animate-bounce delay-75 shadow-sm border border-ctp-peach/20">
               <Sparkles size={14} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ctp-sky-800/10 border border-ctp-sky-800/20 rounded-md text-ctp-sky-800 text-[10px] font-bold uppercase tracking-widest">
            <Construction size={12} />
            Feature Brewing
          </div>
          <h1 className="text-3xl font-bold text-ctp-text tracking-tight uppercase tracking-widest">
            Almost Ready for You
          </h1>
          <p className="text-ctp-subtext1 text-sm max-w-sm mx-auto leading-relaxed font-medium">
            We&apos;re currently polishing this feature to make your government documentation journey even smoother.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
          <div className="bg-ctp-mantle/50 p-5 rounded-xl border border-ctp-surface1 shadow-sm flex items-start gap-4 hover:border-ctp-sky-800/30 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
               <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1">Coming Next</h3>
              <p className="text-xs font-bold text-ctp-text leading-tight tracking-tight">Requirement Bundles</p>
            </div>
          </div>
          <div className="bg-ctp-mantle/50 p-5 rounded-xl border border-ctp-surface1 shadow-sm flex items-start gap-4 hover:border-ctp-sky-800/30 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-peach shrink-0 group-hover:scale-105 transition-transform shadow-inner">
               <Timer size={18} />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-1">Coming Soon</h3>
              <p className="text-xs font-bold text-ctp-text leading-tight tracking-tight">Stay Tuned!</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button 
            onClick={() => router.push('/')}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-2.5 bg-ctp-sky-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-ctp-sky-800/90 active:scale-[0.98] transition-all"
          >
            <Home size={14} />
            Dashboard
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-2.5 bg-ctp-base text-ctp-subtext1 border border-ctp-surface1 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-ctp-mantle hover:text-ctp-text active:scale-[0.98] transition-all shadow-sm"
          >
            Previous Page
          </button>
        </div>

        <p className="text-[9px] text-ctp-subtext1 font-bold uppercase tracking-[0.3em] pt-8 opacity-40">
          AyosDocs Engine v1.0.4
        </p>
      </div>
    </div>
  );
}

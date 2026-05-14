import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Construction, ArrowLeft, Timer, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * ComingSoon Page Component
 * A placeholder page for non-priority features that are still in development.
 */
const ComingSoon = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Coming Soon | AyosDocs";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-2xl w-full text-center space-y-12">
        
        {/* Animated Icon Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-ctp-sky-800/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative flex justify-center">
            <div className="w-24 h-24 bg-ctp-mantle rounded-3xl shadow-xl shadow-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 border border-ctp-surface0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-ctp-sky-800/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              <Rocket size={48} className="relative z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-ctp-peach/10 rounded-2xl flex items-center justify-center text-ctp-peach animate-bounce delay-75">
               <Sparkles size={16} />
            </div>
            <div className="absolute -bottom-2 -left-6 w-10 h-10 bg-ctp-mauve/10 rounded-2xl flex items-center justify-center text-ctp-mauve animate-bounce delay-150">
               <Timer size={20} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ctp-sky-800/10 border border-ctp-sky-800/20 rounded-full text-ctp-sky-800 text-xs font-bold uppercase tracking-widest mb-4">
            <Construction size={14} />
            Feature in Development
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ctp-text tracking-tight leading-tight">
            We're building something <span className="text-ctp-sky-800">amazing.</span>
          </h1>
          <p className="text-ctp-subtext0 text-lg max-w-lg mx-auto leading-relaxed font-medium">
            Our team is working hard to bring you more powerful features to make your government transactions even easier. 
          </p>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
          <div className="bg-ctp-mantle p-5 rounded-3xl border border-ctp-surface0 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shrink-0">
               <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ctp-text mb-1">Coming Next</h3>
              <p className="text-[11px] text-ctp-subtext0 leading-relaxed uppercase tracking-tight font-bold">Bundles & Insights</p>
            </div>
          </div>
          <div className="bg-ctp-mantle p-5 rounded-3xl border border-ctp-surface0 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-ctp-peach/10 flex items-center justify-center text-ctp-peach shrink-0">
               <Timer size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ctp-text mb-1">Timeline</h3>
              <p className="text-[11px] text-ctp-subtext0 leading-relaxed uppercase tracking-tight font-bold">Q3 2026 Release</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-3.5 bg-ctp-text text-ctp-base rounded-2xl font-bold text-sm shadow-xl shadow-ctp-text/10 hover:opacity-90 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-ctp-mantle text-ctp-subtext1 border border-ctp-surface0 rounded-2xl font-bold text-sm hover:bg-ctp-surface1 transition-all active:scale-95"
          >
            Return Home
          </button>
        </div>

        <p className="text-[10px] text-ctp-subtext0 font-bold uppercase tracking-widest pt-8">
          AyosDocs v1.0 • Roadmap 2026
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;

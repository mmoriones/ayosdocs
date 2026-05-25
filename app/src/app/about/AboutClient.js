'use client';

import PageHeader from '@/components/ui/PageHeader';
import { Info, Target, Eye, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * AboutClient Component
 * Handles the interactive parts of the About page.
 */
export default function AboutClient() {
  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={Info}
        title="About AyosDocs"
        description="Our mission to simplify government requirements for every Filipino."
        actions={
          <div className="bg-ctp-mantle/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Version 1.0.4</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Core Narrative */}
            <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50">
                <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Our Story</h2>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  AyosDocs was born from a simple observation: navigating Philippine government requirements shouldn&apos;t feel like a full-time job. We believe that public services should be accessible to everyone, and the first step to accessibility is clear, actionable information.
                </p>
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  Our platform breaks down complex permits, IDs, and licenses into manageable, step-by-step guides. By gathering data from official sources and adding community insights, we provide a clearer picture of what to expect before you even step into an office.
                </p>
              </div>
            </section>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-3">
                  <Target size={16} className="text-ctp-sky-800" />
                  <h2 className="text-ui-micro font-bold text-ctp-text uppercase tracking-widest">Our Mission</h2>
                </div>
                <div className="p-8 flex-1">
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    To empower Filipinos with clear, up-to-date, and practical information about government requirements, making public services accessible to everyone through digital innovation.
                  </p>
                </div>
              </section>

              <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-3">
                  <Eye size={16} className="text-ctp-mauve" />
                  <h2 className="text-ui-micro font-bold text-ctp-text uppercase tracking-widest">Our Vision</h2>
                </div>
                <div className="p-8 flex-1">
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    A Philippines where navigating government offices is stress-free, powered by digital tools that put the right information in the hands of every citizen at the right time.
                  </p>
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-6 space-y-6 shadow-sm">
              <h3 className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Why AyosDocs?</h3>
              <div className="space-y-5">
                {[
                  { icon: ShieldCheck, title: "Official Sources", desc: "Data verified against current gov mandates." },
                  { icon: Sparkles, title: "Step-by-Step", desc: "No more guessing the next requirement." },
                  { icon: Heart, title: "Community Driven", desc: "Real insights from real people in the field." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <item.icon size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-ctp-text">{item.title}</h4>
                      <p className="text-ui-micro text-ctp-subtext1 font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-6 relative overflow-hidden group shadow-sm">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2.5 text-ctp-sky-800">
                    <Sparkles size={16} strokeWidth={2.5} />
                    <h3 className="text-ui-micro font-bold uppercase tracking-widest">Get Involved</h3>
                  </div>
                  <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">
                    AyosDocs is built for the community. Share your experiences and help others navigate their requirements better.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/rate'}
                    variant="secondary"
                    className="w-full bg-ctp-base"
                  >
                    Write a Review
                  </Button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

'use client';

import { PublicPageHeader, Card, Badge } from '@/components/ui';
import { Info, Target, Eye, Sparkles, ShieldCheck, Heart } from 'lucide-react';

/**
 * AboutClient Component
 * Handles the interactive parts of the About page.
 */
export default function AboutClient() {
  return (
    <div className="min-h-full font-sans pb-20">
      <PublicPageHeader 
        icon={Info}
        title="About AyosDocs"
        description="Our mission to simplify government requirements for every Filipino."
        actions={
          <Badge variant="slate">Version 1.0.4</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Core Narrative */}
            <Card title="Our Story" background="mantle">
              <div className="space-y-6">
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  AyosDocs was born from a simple observation: navigating Philippine government requirements shouldn&apos;t feel like a full-time job. We believe that public services should be accessible to everyone, and the first step to accessibility is clear, actionable information.
                </p>
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  Our platform breaks down complex permits, IDs, and licenses into manageable, step-by-step guides. By gathering data from official sources and adding community insights, we provide a clearer picture of what to expect before you even step into an office.
                </p>
              </div>
            </Card>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card 
                title="Our Mission" 
                background="mantle"
                headerAction={<Target size={16} className="text-ctp-sky-800" />}
                className="flex flex-col"
              >
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  To empower Filipinos with clear, up-to-date, and practical information about government requirements, making public services accessible to everyone through digital innovation.
                </p>
              </Card>

              <Card 
                title="Our Vision" 
                background="mantle"
                headerAction={<Eye size={16} className="text-ctp-mauve" />}
                className="flex flex-col"
              >
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                  A Philippines where navigating government offices is stress-free, powered by digital tools that put the right information in the hands of every citizen at the right time.
                </p>
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card title="Why AyosDocs?" background="mantle" className="space-y-6">
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
            </Card>


          </aside>
        </div>
      </div>
    </div>
  );
}

'use client';

import { PublicPageHeader, Card, Badge, Button } from '@/components/ui';
import { Info, Target, Eye, Sparkles, ShieldCheck, Heart, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * AboutClient Component
 * Handles the interactive parts of the About page.
 */
export default function AboutClient() {
  return (
    <div className="min-h-full font-sans pb-20 animate-in fade-in duration-700">
      <PublicPageHeader 
        icon={Info}
        title="About AyosDocs"
        description="Our mission to simplify government requirements for every Filipino."
        actions={
          <Badge variant="secondary" className="!bg-white/80 !text-gray-400 !border-gray-100 shadow-sm px-4 py-1.5 text-[12px] font-bold">VERSION 1.0.4</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 lg:mt-12 space-y-8 lg:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-8 lg:space-y-10">
            {/* Core Narrative */}
            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 lg:p-10" noPadding>
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF9500]">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-[19px] lg:text-[22px] font-bold text-[#1C1C1E]">Our Story</h3>
              </div>
              <div className="space-y-6">
                <p className="text-[15px] lg:text-[17px] text-gray-500 font-medium leading-relaxed">
                  AyosDocs was born from a simple observation: navigating Philippine government requirements shouldn&apos;t feel like a full-time job. We believe that public services should be accessible to everyone, and the first step to accessibility is clear, actionable information.
                </p>
                <p className="text-[15px] lg:text-[17px] text-gray-500 font-medium leading-relaxed">
                  Our platform breaks down complex permits, IDs, and licenses into manageable, step-by-step guides. By gathering data from official sources and adding community insights, we provide a clearer picture of what to expect before you even step into an office.
                </p>
              </div>
            </Card>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card 
                className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 lg:p-8 flex flex-col"
                noPadding
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007AFF]">
                    <Target size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E]">Our Mission</h3>
                </div>
                <p className="text-[14px] lg:text-[15px] text-gray-500 font-medium leading-relaxed">
                  To empower Filipinos with clear, up-to-date, and practical information about government requirements, making public services accessible to everyone through digital innovation.
                </p>
              </Card>

              <Card 
                className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 lg:p-8 flex flex-col"
                noPadding
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#AF52DE]">
                    <Eye size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E]">Our Vision</h3>
                </div>
                <p className="text-[14px] lg:text-[15px] text-gray-500 font-medium leading-relaxed">
                  A Philippines where navigating government offices is stress-free, powered by digital tools that put the right information in the hands of every citizen at the right time.
                </p>
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 lg:p-8" noPadding>
              <h3 className="text-[17px] font-bold text-[#1C1C1E] mb-8">Why AyosDocs?</h3>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: "Official Sources", desc: "Data verified against current gov mandates.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Layers, title: "Step-by-Step", desc: "No more guessing the next requirement.", color: "text-orange-500", bg: "bg-orange-50" },
                  { icon: Heart, title: "Community Driven", desc: "Real insights from real people in the field.", color: "text-red-500", bg: "bg-red-50" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-[#1C1C1E]">{item.title}</h4>
                      <p className="text-[13px] text-gray-500 font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-2">
               <Button 
                as={Link} 
                href="/guides" 
                className="w-full h-14 !rounded-[24px] text-[15px] font-bold shadow-lg shadow-[#0038A8]/20"
                rightIcon={<ArrowRight size={18} />}
               >
                 Start Exploring
               </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

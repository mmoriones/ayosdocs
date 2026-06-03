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
    <div className="min-h-full font-sans pb-32 animate-in fade-in duration-700 relative overflow-hidden">
      <PublicPageHeader 
        icon={Info}
        title="About AyosDocs"
        description="Our mission to simplify government requirements for every Filipino."
        actions={
          <Badge variant="secondary" className="!bg-white/60 !text-gray-400 !border-white/60 shadow-sm px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-full">VERSION 1.0.4</Badge>
        }
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-4 space-y-10 lg:space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-10 lg:space-y-12">
            {/* Core Narrative */}
            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-12 relative group" noPadding>
              <div className="flex items-center gap-4 mb-8 lg:mb-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100/50 flex items-center justify-center text-[#FF9500] shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-[22px] lg:text-[26px] font-black text-[#1C1C1E] tracking-tight">Our Story</h3>
              </div>
              <div className="space-y-8">
                <p className="text-[16px] lg:text-[18px] text-gray-500 font-medium leading-relaxed">
                  AyosDocs was born from a simple observation: navigating Philippine government requirements shouldn&apos;t feel like a full-time job. We believe that public services should be accessible to everyone, and the first step to accessibility is <span className="text-[#0038A8] font-bold text-shadow-sm">clear, actionable information.</span>
                </p>
                <p className="text-[16px] lg:text-[18px] text-gray-500 font-medium leading-relaxed">
                  Our platform breaks down complex permits, IDs, and licenses into manageable, step-by-step guides. By gathering data from official sources and adding community insights, we provide a clearer picture of what to expect before you even step into an office.
                </p>
              </div>
              
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />
            </Card>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card 
                className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 flex flex-col relative group"
                noPadding
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-[#007AFF] shadow-sm group-hover:rotate-6 transition-transform duration-500">
                    <Target size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[19px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">Our Mission</h3>
                </div>
                <p className="text-[15px] lg:text-[16px] text-gray-500 font-medium leading-relaxed">
                  To empower Filipinos with clear, up-to-date, and practical information about government requirements, making public services accessible to everyone through digital innovation.
                </p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />
              </Card>

              <Card 
                className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 flex flex-col relative group"
                noPadding
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-[#AF52DE] shadow-sm group-hover:-rotate-6 transition-transform duration-500">
                    <Eye size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[19px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">Our Vision</h3>
                </div>
                <p className="text-[15px] lg:text-[16px] text-gray-500 font-medium leading-relaxed">
                  A Philippines where navigating government offices is stress-free, powered by digital tools that put the right information in the hands of every citizen at the right time.
                </p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
              </Card>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 relative" noPadding>
              <h3 className="text-[15px] font-black text-gray-400 mb-10 uppercase tracking-[0.2em]">Why AyosDocs?</h3>
              <div className="space-y-10">
                {[
                  { icon: ShieldCheck, title: "Official Sources", desc: "Data verified against current gov mandates.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Layers, title: "Step-by-Step", desc: "No more guessing the next requirement.", color: "text-orange-500", bg: "bg-orange-50" },
                  { icon: Heart, title: "Community Driven", desc: "Real insights from real people in the field.", color: "text-red-500", bg: "bg-red-50" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform shadow-sm border border-black/5`}>
                      <item.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">{item.title}</h4>
                      <p className="text-[14px] text-gray-500 font-medium leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="px-2">
               <Button 
                as={Link} 
                href="/guides" 
                className="w-full h-16 !rounded-[28px] text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.2)] active:scale-95 transition-all bg-[#0038A8] hover:bg-[#0038A8]/90 text-white"
                rightIcon={<ArrowRight size={20} strokeWidth={3} />}
               >
                 Start Exploring
               </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] -left-20 w-80 h-80 bg-[#0038A8]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -right-20 w-96 h-96 bg-[#AF52DE]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

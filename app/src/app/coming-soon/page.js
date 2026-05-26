'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Home, ArrowLeft, Timer, ShieldCheck, Layers } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

/**
 * ComingSoon Page Component
 * Simplified placeholder for upcoming features.
 */
export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="h-screen bg-ctp-base flex items-center justify-center px-6 overflow-hidden relative selection:bg-ctp-sky-800/30">
      
      {/* Background Decorative Glow (Cloudflare-style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[500px] opacity-[0.06] pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-ctp-sky-800 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-ctp-mauve rounded-full blur-[80px]" />
      </div>

      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* Visual Header */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-ctp-mantle rounded-2xl shadow-xl flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-ctp-sky-800/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <Rocket size={28} className="relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ctp-mantle border border-ctp-surface1 rounded-md text-ctp-subtext1 text-[10px] font-bold uppercase tracking-[0.2em]">
            New Features
          </div>
          <h1 className="text-3xl font-bold text-ctp-text tracking-tight uppercase tracking-widest leading-tight">
            Building something <span className="text-ctp-sky-800">new</span>
          </h1>
          <p className="text-ctp-subtext1 text-sm max-w-sm mx-auto leading-relaxed font-medium opacity-80">
            We&apos;re currently getting this part ready to make your government tasks even easier to manage.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
          <Card background="mantle" className="p-4 border-ctp-surface1 shadow-sm group hover:border-ctp-sky-800/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 group-hover:scale-105 transition-transform">
                 <Layers size={16} />
              </div>
              <Badge variant="sky" className="text-[8px] px-1.5 font-black uppercase tracking-widest">Next</Badge>
            </div>
            <h3 className="text-xs font-bold text-ctp-text tracking-tight uppercase">Document Bundles</h3>
            <p className="text-[10px] text-ctp-subtext1 font-medium leading-tight opacity-70">Checklists for your life milestones.</p>
          </Card>

          <Card background="mantle" className="p-4 border-ctp-surface1 shadow-sm group hover:border-ctp-mauve/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-mauve group-hover:scale-105 transition-transform">
                 <Timer size={16} />
              </div>
              <Badge variant="mauve" className="text-[8px] px-1.5 font-black uppercase tracking-widest">Planned</Badge>
            </div>
            <h3 className="text-xs font-bold text-ctp-text tracking-tight uppercase">Reminders</h3>
            <p className="text-[10px] text-ctp-subtext1 font-medium leading-tight opacity-70">Never miss an ID renewal again.</p>
          </Card>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button 
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-8 shadow-lg shadow-ctp-sky-800/10 uppercase text-xs tracking-widest py-3 h-auto"
            leftIcon={<Home size={14} />}
          >
            Dashboard
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 uppercase text-xs tracking-widest py-3 h-auto"
            leftIcon={<ArrowLeft size={14} />}
          >
            Go Back
          </Button>
        </div>

        <p className="text-ui-tiny text-ctp-subtext1 font-bold uppercase tracking-[0.4em] pt-4 opacity-30">
          AyosDocs v1.0.4
        </p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Home, Layers, Timer } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

/**
 * ComingSoon Page Component
 * Simplified placeholder for upcoming features.
 */
export default function ComingSoon() {
  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12 lg:py-24 overflow-hidden relative selection:bg-[#0038A8]/10 animate-in fade-in duration-700">
      
      {/* Background Decorative Glow (iOS-style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] opacity-[0.1] pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#007AFF] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#AF52DE] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl w-full text-center space-y-10 lg:space-y-14 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* Visual Header */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#0038A8] border border-white/60 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#0038A8]/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <Rocket size={40} className="relative z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-5">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/60 rounded-full text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <span>New Features</span>
          </div>
          <h1 className="text-[34px] md:text-[52px] font-black text-[#1C1C1E] tracking-tight leading-[1.1]">
            Building something <span className="text-[#0038A8]">new</span>
          </h1>
          <p className="text-gray-500 text-[16px] md:text-[18px] max-w-sm mx-auto leading-relaxed font-medium px-4">
            We&apos;re currently getting this part ready to make your government tasks even easier to manage.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md mx-auto text-left px-4 sm:px-0">
          <Card className="!rounded-[32px] border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white/70 backdrop-blur-xl p-7 group hover:border-[#007AFF]/30 transition-all active:scale-[0.98]" noPadding>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-[#007AFF] group-hover:scale-110 transition-transform">
                 <Layers size={22} />
              </div>
              <Badge variant="secondary" className="!bg-[#007AFF]/10 !text-[#007AFF] text-[9px] font-black !border-none px-2 py-0.5 rounded-full uppercase tracking-widest">NEXT</Badge>
            </div>
            <h3 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">Document Bundles</h3>
            <p className="text-[13px] text-gray-400 font-medium leading-tight mt-1">Checklists for your life milestones.</p>
          </Card>

          <Card className="!rounded-[32px] border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white/70 backdrop-blur-xl p-7 group hover:border-[#AF52DE]/30 transition-all active:scale-[0.98]" noPadding>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-[#AF52DE] group-hover:scale-110 transition-transform">
                 <Timer size={22} />
              </div>
              <Badge variant="secondary" className="!bg-[#AF52DE]/10 !text-[#AF52DE] text-[9px] font-black !border-none px-2 py-0.5 rounded-full uppercase tracking-widest">PLANNED</Badge>
            </div>
            <h3 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">Reminders</h3>
            <p className="text-[13px] text-gray-400 font-medium leading-tight mt-1">Never miss an ID renewal again.</p>
          </Card>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-center pt-6 px-8 sm:px-0">
          <Button 
            as={Link}
            href="/"
            className="w-full sm:w-auto h-16 !rounded-[24px] px-12 text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.2)] bg-[#0038A8] text-white active:scale-95 transition-all"
            leftIcon={<Home size={20} strokeWidth={2.5} />}
          >
            Back to Dashboard
          </Button>
        </div>

        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pt-12">
          AyosDocs v1.0.4
        </p>
      </div>
    </div>
  );
}

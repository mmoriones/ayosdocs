'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Home, ArrowLeft, Timer, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

/**
 * ComingSoon Page Component
 * Simplified placeholder for upcoming features.
 */
export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12 lg:py-20 overflow-hidden relative selection:bg-[#0038A8]/10 animate-in fade-in duration-700">
      
      {/* Background Decorative Glow (iOS-style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[500px] opacity-[0.08] pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#007AFF] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#AF52DE] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-xl w-full text-center space-y-8 lg:space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* Visual Header */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-[#007AFF] border border-gray-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#007AFF]/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <Rocket size={32} className="relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full text-gray-400 text-[11px] font-bold uppercase tracking-widest shadow-sm">
            <span>New Features</span>
          </div>
          <h1 className="text-[34px] md:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-tight">
            Building something <span className="text-[#007AFF]">new</span>
          </h1>
          <p className="text-gray-500 text-[17px] max-w-sm mx-auto leading-relaxed font-medium px-4">
            We&apos;re currently getting this part ready to make your government tasks even easier to manage.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left px-4 sm:px-0">
          <Card className="!rounded-[28px] border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 group hover:border-[#007AFF]/30 transition-all" noPadding>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007AFF] group-hover:scale-105 transition-transform">
                 <Layers size={20} />
              </div>
              <Badge variant="secondary" className="!bg-[#007AFF]/10 !text-[#007AFF] text-[10px] font-bold !border-none">NEXT</Badge>
            </div>
            <h3 className="text-[15px] font-bold text-[#1C1C1E]">Document Bundles</h3>
            <p className="text-[12px] text-gray-400 font-medium leading-tight mt-1">Checklists for your life milestones.</p>
          </Card>

          <Card className="!rounded-[28px] border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 group hover:border-[#AF52DE]/30 transition-all" noPadding>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#AF52DE] group-hover:scale-105 transition-transform">
                 <Timer size={20} />
              </div>
              <Badge variant="secondary" className="!bg-[#AF52DE]/10 !text-[#AF52DE] text-[10px] font-bold !border-none">PLANNED</Badge>
            </div>
            <h3 className="text-[15px] font-bold text-[#1C1C1E]">Reminders</h3>
            <p className="text-[12px] text-gray-400 font-medium leading-tight mt-1">Never miss an ID renewal again.</p>
          </Card>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-8 sm:px-0">
          <Button 
            onClick={() => router.push('/')}
            className="w-full sm:w-auto h-14 !rounded-[22px] px-10 text-[15px] font-bold shadow-lg shadow-[#0038A8]/20"
            leftIcon={<Home size={18} />}
          >
            Dashboard
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.back()}
            className="w-full sm:w-auto h-14 !rounded-[22px] px-10 text-[15px] font-bold !bg-white/80 !backdrop-blur-md"
            leftIcon={<ArrowLeft size={18} />}
          >
            Go Back
          </Button>
        </div>

        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em] pt-8">
          AyosDocs v1.0.4
        </p>
      </div>
    </div>
  );
}

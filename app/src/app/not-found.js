'use client';

import React from 'react';
import Link from 'next/link';
import { FileSearch, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * Custom 404 Not Found Page
 * Standardized with high-fidelity iOS aesthetics.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-ios-gradient flex items-center justify-center px-6 py-20 font-sans text-[#1C1C1E] selection:bg-[#0038A8]/10 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] opacity-[0.1] pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#007AFF] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#AF52DE] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl w-full text-center space-y-10 lg:space-y-14 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* Visual Header */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#0038A8] border border-white/60 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#0038A8]/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <FileSearch size={40} className="relative z-10 transition-transform group-hover:scale-110 duration-500" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-5 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/60 rounded-full text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <Compass size={12} className="text-[#0038A8]" strokeWidth={3} />
            Error Code 404
          </div>
          <h1 className="text-[34px] md:text-[52px] font-black text-[#1C1C1E] tracking-tight leading-[1.1]">
            Page <span className="text-[#0038A8]">Not Found</span>
          </h1>
          <p className="text-gray-500 text-[16px] md:text-[18px] max-w-sm mx-auto leading-relaxed font-medium">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a new location.
          </p>
        </div>

        {/* Action Center */}
        <div className="max-w-sm mx-auto">
          <Button 
            as={Link}
            href="/"
            className="w-full h-16 !rounded-[24px] px-12 text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.2)] bg-[#0038A8] text-white active:scale-95 transition-all"
            leftIcon={<Home size={20} strokeWidth={2.5} />}
          >
            Back to Dashboard
          </Button>
        </div>

        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pt-12">
          AyosDocs Engine v1.0.4
        </p>
      </div>
    </div>
  );
}

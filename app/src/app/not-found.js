'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * Custom 404 Not Found Page
 * Standardized with high-fidelity components and standalone layout.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center px-6 py-20 font-sans text-ctp-text selection:bg-ctp-sky-800/30">
      <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Simple Visual Header */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-ctp-sky-800/10 blur-3xl rounded-full scale-110" />
          <div className="relative w-20 h-20 bg-ctp-mantle rounded-2xl shadow-xl flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1 group overflow-hidden">
            <div className="absolute inset-0 bg-ctp-sky-800/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <FileSearch size={36} strokeWidth={1.5} className="relative z-10 transition-transform group-hover:scale-110" />
          </div>
        </div>

        {/* Minimalist Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ctp-mantle border border-ctp-surface1 rounded-md text-ctp-subtext1 text-ui-micro font-bold uppercase tracking-[0.2em]">
            <Compass size={12} className="text-ctp-sky-800" />
            Error Code 404
          </div>
          <h1 className="text-3xl font-bold text-ctp-text tracking-tight uppercase tracking-widest leading-tight">
            Route <br/> Not Found
          </h1>
          <p className="text-ctp-subtext1 text-sm leading-relaxed font-medium max-w-[300px] mx-auto opacity-80">
            The page you are trying to access does not exist or has been moved to a new location.
          </p>
        </div>

        {/* Essential Navigation Only */}
        <div className="flex flex-col gap-3 pt-4 max-w-[280px] mx-auto">
          <Button 
            onClick={() => router.push('/')}
            className="w-full shadow-lg shadow-ctp-sky-800/10 uppercase text-xs tracking-widest py-3.5 h-auto"
            leftIcon={<Home size={14} />}
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="text-ui-tiny text-ctp-subtext1 font-bold uppercase tracking-[0.4em] opacity-30 pt-8">
          AyosDocs Engine v1.0.4
        </p>
      </div>
    </div>
  );
}

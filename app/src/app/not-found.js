'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, ArrowLeft, Home, Search, Compass } from 'lucide-react';

/**
 * Custom 404 Not Found Page
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center px-6 py-20 font-sans text-ctp-text">
      <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Simple Visual Header */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-ctp-sky-800/10 blur-3xl rounded-full scale-110" />
          <div className="relative w-20 h-20 bg-ctp-mantle/50 rounded-2xl shadow-xl flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1 group overflow-hidden">
            <div className="absolute inset-0 bg-ctp-sky-800/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <FileSearch size={36} strokeWidth={1.5} className="relative z-10 transition-transform group-hover:scale-110" />
          </div>
        </div>

        {/* Minimalist Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ctp-sky-800/10 border border-ctp-sky-800/20 rounded-md text-ctp-sky-800 text-ui-micro font-bold uppercase tracking-widest">
            <Compass size={12} />
            Error Code 404
          </div>
          <h1 className="text-3xl font-bold text-ctp-text tracking-tight uppercase tracking-widest">
            Route Not Found
          </h1>
          <p className="text-ctp-subtext1 text-sm leading-relaxed font-medium max-w-[280px] mx-auto">
            The page you are trying to access does not exist or has been moved.
          </p>
        </div>

        {/* Essential Navigation Only */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => router.push('/')}
            className="group w-full py-3 bg-ctp-sky-800 text-white rounded-lg font-bold text-ui-micro uppercase tracking-widest shadow-lg shadow-ctp-sky-800/10 hover:bg-ctp-sky-800/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Home size={14} />
            Go to Dashboard
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full py-3 bg-ctp-base text-ctp-subtext1 border border-ctp-surface1 rounded-lg font-bold text-ui-micro uppercase tracking-widest hover:bg-ctp-mantle/50 hover:text-ctp-text transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            Previous Page
          </button>
        </div>

        <p className="text-ui-tiny text-ctp-subtext1 font-bold uppercase tracking-[0.3em] opacity-40">
          AyosDocs Engine v1.0.4
        </p>
      </div>
    </div>
  );
}

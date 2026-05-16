'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, ArrowLeft, Home, Compass, Map, Search } from 'lucide-react';

/**
 * Custom 404 Not Found Page
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ctp-base flex items-center justify-center px-6 py-20 font-sans text-ctp-text">
      <div className="max-w-md w-full text-center space-y-10">
        
        {/* Simple Visual Header */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-ctp-sky-800/10 blur-3xl rounded-full scale-110" />
          <div className="relative w-20 h-20 bg-ctp-mantle rounded-[2rem] shadow-xl flex items-center justify-center text-ctp-sky-800 border border-ctp-surface0">
            <FileSearch size={40} strokeWidth={2.5} />
          </div>
        </div>

        {/* Minimalist Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-ctp-text uppercase tracking-tight">
            Page Not Found
          </h1>
          <p className="text-ctp-subtext0 text-[16px] leading-relaxed font-medium opacity-80">
            The page you are looking for doesn&apos;t exist. <br/>
            Try returning to the home page.
          </p>
        </div>

        {/* Essential Navigation Only */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-ctp-sky-800 text-ctp-base rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-ctp-sky-800/10 hover:bg-ctp-sky-700 transition-all active:scale-95"
          >
            Go Home
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full py-4 bg-ctp-mantle text-ctp-subtext1 border border-ctp-surface0 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-ctp-surface1 transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>

        <p className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-[0.3em] opacity-40">
          Error Code 404
        </p>
      </div>
    </div>
  );
}

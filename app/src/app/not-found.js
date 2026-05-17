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
          <div className="relative w-20 h-20 bg-ctp-mantle rounded-2xl shadow-sm flex items-center justify-center text-ctp-sky-800 border border-ctp-surface1">
            <FileSearch size={40} strokeWidth={2} />
          </div>
        </div>

        {/* Minimalist Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-ctp-text tracking-tight">
            Page Not Found
          </h1>
          <p className="text-ctp-subtext0 text-[16px] leading-relaxed font-medium">
            The page you are looking for doesn&apos;t exist. <br/>
            Try returning to the home page.
          </p>
        </div>

        {/* Essential Navigation Only */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-ctp-sky-800 text-ctp-base rounded-xl font-semibold text-[14px] shadow-sm hover:bg-ctp-sky-700 transition-all active:scale-95"
          >
            Go Home
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full py-3.5 bg-ctp-mantle text-ctp-subtext1 border border-ctp-surface1 rounded-xl font-semibold text-[14px] hover:bg-ctp-surface1 transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>

        <p className="text-[11px] text-ctp-subtext1 font-semibold uppercase tracking-[0.2em] opacity-40">
          Error Code 404
        </p>
      </div>
    </div>
  );
}

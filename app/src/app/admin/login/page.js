'use client';

import React, { useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context';

/**
 * Inner component that uses searchParams.
 * Needs to be wrapped in Suspense for Next.js build.
 */
function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Handle unauthorized or error redirects from NextAuth
  useEffect(() => {
    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl');

    if (error === 'AccessDenied' || (callbackUrl && status === 'authenticated' && session?.user?.role !== 'admin')) {
      showToast('Access Denied: You do not have administrative privileges.', 'error');
    }
  }, [searchParams, status, session, showToast]);

  // Redirect if already an admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [status, session, router]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/admin' });
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-ctp-mantle/50 p-8 rounded-2xl shadow-2xl border border-ctp-surface1 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-ctp-base border border-ctp-sky-800/10 mb-6 shadow-inner text-ctp-sky-800">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-ctp-text uppercase">
          Admin Portal
        </h2>
        <p className="mt-2 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.2em]">
          Authenticated Access Only
        </p>
      </div>
      
      <div className="mt-8 space-y-6 relative z-10">
        <div className="p-4 rounded-xl bg-ctp-sky-800/[0.04] border border-ctp-sky-800/10 text-ctp-subtext1 text-xs text-center leading-relaxed font-medium">
          Admin access is restricted to authorized Google accounts. 
          Ensure your email has been granted the <span className="text-ctp-sky-800 font-bold">admin</span> role.
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-ctp-base border border-ctp-surface1 py-3.5 px-4 text-xs font-bold text-ctp-text hover:border-ctp-sky-800/30 hover:bg-ctp-mantle active:scale-[0.98] transition-all shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="uppercase tracking-widest">Sign in with Google</span>
        </button>
        
        <div className="text-center pt-4">
          <Link href="/" className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest hover:text-ctp-sky-800 transition-colors inline-flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Admin Login Page - Integrated with Google OAuth.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ctp-base p-6 font-sans">
      <Suspense fallback={
        <div className="w-full max-w-md bg-ctp-mantle/50 p-8 rounded-2xl shadow-2xl border border-ctp-surface1 animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-ctp-base mb-6 border border-ctp-surface1" />
          <div className="h-6 w-48 bg-ctp-base rounded mb-4" />
          <div className="h-3 w-32 bg-ctp-base rounded mb-8" />
          <div className="h-12 w-full bg-ctp-base rounded-xl" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

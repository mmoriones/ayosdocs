'use client';

import {
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';

const Hero = ({ guides }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { openAuthModal } = useAuthUI();

  return (
    <section className="relative w-full overflow-hidden bg-ctp-base border-b border-ctp-surface1 pt-16 pb-16 lg:pt-24 lg:pb-24">
      {/* Background Decorations - Subtler */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ctp-sky-10/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-ctp-mantle border border-ctp-surface1 px-4 py-1.5 text-sm font-semibold text-ctp-sky-800 shadow-sm">
                {isLoggedIn && session?.user ? (
                  <>
                    {session.user.isNewUser ? 'Welcome to AyosDocs' : 'Welcome back'}, {session.user.name?.split(' ')[0] || 'User'}! 👋
                  </>
                ) : (
                  'Empowering your government journey 👋'
                )}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-ctp-text max-w-4xl mx-auto lg:mx-0">
              <span className="text-ctp-sky-800">How can we help</span> <br className="hidden lg:block" /> you today?
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-ctp-subtext0 text-lg lg:text-xl font-normal leading-relaxed">
              Find step-by-step guides for Philippine government documents 
              and official processes, all in one place.
            </p>

            <div className="max-w-2xl mx-auto lg:mx-0">
              <SearchBar guides={guides} />
            </div>

            {!isLoggedIn && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2">
                <button 
                  onClick={openAuthModal}
                  className="flex items-center gap-2 bg-ctp-sky-800 text-ctp-base font-semibold py-3 px-6 rounded-xl hover:bg-ctp-sky-800/90 transition-all active:scale-[0.98] shadow-sm group"
                >
                  <span>Create free account</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/guides" className="text-ctp-sky-800 font-semibold hover:underline transition-all text-base">
                  Browse all guides
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex items-center justify-center">
            {/* Multi-layered Animated Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-ctp-sky-10 rounded-full blur-[100px] opacity-60 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-ctp-mauve/10 rounded-full blur-[80px] animate-blob delay-700" />
            
            <div className="relative z-10 w-full aspect-square flex items-center justify-center p-4">
              {/* Floating Feature Card 1: Progress */}
              <div className="absolute -top-4 -left-4 lg:top-10 lg:-left-10 p-4 bg-ctp-base rounded-2xl border border-ctp-surface1 shadow-xl animate-float z-20 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ctp-sky-800/10 text-ctp-sky-800 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-wider">Application</p>
                    <p className="text-sm font-bold text-ctp-text">85% Complete</p>
                  </div>
                </div>
              </div>

              {/* Floating Feature Card 2: Verification */}
              <div className="absolute bottom-10 -right-4 lg:-right-8 p-4 bg-ctp-base rounded-2xl border border-ctp-surface1 shadow-xl animate-float delay-1000 z-20 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ctp-green/10 text-ctp-green flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-bold text-ctp-text">Verified Guide</span>
                </div>
              </div>

              {/* Main Illustration */}
              <div className="relative z-10 w-full h-full flex items-center justify-center animate-float delay-500">
                <Image
                  src="/assets/person.webp"
                  alt="AyosDocs Hero"
                  width={600}
                  height={600}
                  className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-16 lg:mt-24 pt-12 border-t border-ctp-surface1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-ctp-mantle transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-ctp-sky-10 text-ctp-sky-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-ctp-surface1">
              <FileText size={20} />
            </div>
            <div className="space-y-0.5">
              <span className="block font-semibold text-lg text-ctp-text tracking-tight">Step-by-step guides</span>
              <p className="text-sm text-ctp-subtext0 font-normal">Easy to follow instructions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-ctp-mantle transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-ctp-green/10 text-ctp-green flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-ctp-green/20">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-0.5">
              <span className="block font-semibold text-lg text-ctp-text tracking-tight">Official processes</span>
              <p className="text-sm text-ctp-subtext0 font-normal">Verified by community experts</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-ctp-mantle transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-ctp-yellow/10 text-ctp-yellow flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-ctp-yellow/20">
              <Clock size={20} />
            </div>
            <div className="space-y-0.5">
              <span className="block font-semibold text-lg text-ctp-text tracking-tight">Track your progress</span>
              <p className="text-sm text-ctp-subtext0 font-normal">Never lose your place</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-center lg:text-left text-xs font-semibold text-ctp-subtext0 uppercase tracking-[0.2em] opacity-80">
            Guides for primary government agencies
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-12 gap-y-6 opacity-60">
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">PSA</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">NBI</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">DFA</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">PHILHEALTH</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">SSS</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">PAG-IBIG</span>
            <span className="text-sm font-bold text-ctp-subtext0 tracking-wider">BIR</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

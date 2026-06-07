'use client';

import { useMemo, memo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LibraryBig, Layers, User, BotMessageSquare, LayoutDashboard } from 'lucide-react';
import { useWorkspace } from '@/context';

/**
 * BottomNav Component
 * A high-fidelity, responsive navigation bar for mobile devices.
 * Features a fluid "notched" design with an organic SVG background, 
 * a prominent center AI button, and sleek active indicators.
 */
function BottomNav({ isLoggedIn = false }) {
  const pathname = usePathname();
  const { setChatOpen, isChatOpen } = useWorkspace();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Intelligent Auto-Hide Logic: Hides on scroll down, shows on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(() => [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/guides', icon: LibraryBig, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    { 
      href: isLoggedIn ? '/my-docs' : '/login', 
      icon: isLoggedIn ? LayoutDashboard : User, 
      label: isLoggedIn ? 'My Docs' : 'Login' 
    },
  ], [isLoggedIn]);

  return (
    <nav 
      className={`fixed left-0 right-0 w-full z-[60] lg:hidden pb-[env(safe-area-inset-bottom,12px)] transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      } bottom-0 h-[64px]`}
    >
      {/* 
        HIGH-FIDELITY FLUID SVG BACKGROUND 
        Precision-tuned Bezier curves for a tight "half-dip" cradle.
      */}
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        <svg 
          viewBox="0 0 400 64" 
          width="100%" 
          height="100%" 
          preserveAspectRatio="none"
          className="filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.04)]"
        >
          {/* Main Navigation Bar (White) - Organic cutout without solid well background */}
          <path 
            d="M0 0 
               L130 0 
               C160 0, 175 32, 200 32 
               C225 32, 240 0, 270 0 
               L400 0 
               L400 64 
               L0 64 
               Z" 
            fill="white" 
          />
        </svg>
      </div>

      <div className="flex items-center justify-between h-full relative z-10 px-4">
        {/* Left Side Navigation */}
        <div className="flex-1 flex items-center justify-around h-full">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 relative ${
                  isActive ? 'text-brand-blue' : 'text-[#AEAEB2] hover:text-[#1C1C1E]'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="mb-2" />
                
                {/* Precision Active Indicator Dot */}
                {isActive && (
                  <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Center AI Chat Button (Precision Half-Dipped) */}
        <div className="relative w-24 h-full flex items-center justify-center">
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-brand-blue rounded-full shadow-[0_12px_24px_rgba(0,56,168,0.25)] flex items-center justify-center -mt-8 transition-all active:scale-90 group"
            aria-label="Ask AI Assistant"
          >
            <BotMessageSquare className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
          </button>
          
          {/* Precision Active Indicator Dot */}
          {isChatOpen && (
            <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
          )}
        </div>

        {/* Right Side Navigation */}
        <div className="flex-1 flex items-center justify-around h-full">
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 relative ${
                  isActive ? 'text-brand-blue' : 'text-[#AEAEB2] hover:text-[#1C1C1E]'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="mb-1" />
                
                {/* Precision Active Indicator Dot */}
                {isActive && (
                  <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default memo(BottomNav);

'use client';

import { useMemo, memo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LibraryBig, Layers, User, BotMessageSquare, LayoutDashboard } from 'lucide-react';
import { useWorkspace } from '@/context';

function BottomNav({ isLoggedIn = false }) {
  const pathname = usePathname();
  const { setChatOpen, isChatOpen } = useWorkspace();
  const [isVisible, setIsVisible] = useState(true);
  const [bottomOffset, setBottomOffset] = useState(0);
  const lastScrollYRef = useRef(0);
  const navRef = useRef(null);

  const scrollDistanceRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;

      // Always show at the top of the page
      if (currentScrollY <= 10) {
        setIsVisible((prev) => (!prev ? true : prev));
        scrollDistanceRef.current = 0;
      } 
      else {
        // Accumulate scroll distance in the same direction
        if ((delta > 0 && scrollDistanceRef.current < 0) || (delta < 0 && scrollDistanceRef.current > 0)) {
          scrollDistanceRef.current = 0;
        }
        scrollDistanceRef.current += delta;

        // Chrome-like thresholds
        // 1. Hide after scrolling down 40px
        // 2. Show immediately after scrolling up 20px
        if (scrollDistanceRef.current > 40) {
          setIsVisible((prev) => (prev ? false : prev));
        } else if (scrollDistanceRef.current < -20) {
          setIsVisible((prev) => (!prev ? true : prev));
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleViewportChange = () => {
      const vv = window.visualViewport;
      if (vv) {
        const offset = window.innerHeight - (vv.offsetTop + vv.height);
        setBottomOffset(Math.max(0, Math.round(offset)));
      }
    };

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleViewportChange);
    }
    handleViewportChange();

    return () => {
      if (vv) {
        vv.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const navItems = useMemo(() => [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/guides', icon: LibraryBig, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    {
      href: isLoggedIn ? '/my-docs' : '/login',
      icon: isLoggedIn ? LayoutDashboard : User,
      label: isLoggedIn ? 'My Docs' : 'Login',
    },
  ], [isLoggedIn]);

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 w-full z-[60] lg:hidden transform-gpu transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.3,0,0.2,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%+env(safe-area-inset-bottom,0px))] opacity-0 pointer-events-none'
      }`}
      style={{ bottom: bottomOffset }}
    >
      <div className="relative h-[72px]">
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <svg
            viewBox="0 0 400 72"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            className="filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.04)]"
          >
            <path
              d="M0 0
                 L130 0
                 C160 0, 175 32, 200 32
                 C225 32, 240 0, 270 0
                 L400 0
                 L400 72
                 L0 72
                 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between h-full relative z-10 px-4">
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
                  {isActive && (
                    <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="relative w-24 h-full flex items-center justify-center">
            <button
              onClick={() => setChatOpen(true)}
              className="w-14 h-14 bg-brand-blue rounded-full shadow-[0_12px_24px_rgba(0,56,168,0.25)] flex items-center justify-center -mt-8 transition-all active:scale-90 group"
              aria-label="Ask AI Assistant"
            >
              <BotMessageSquare className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
            </button>

            {isChatOpen && (
              <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
            )}
          </div>

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
                  {isActive && (
                    <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}

export default memo(BottomNav);

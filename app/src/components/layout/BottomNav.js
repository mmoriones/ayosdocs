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
      className={`fixed left-0 right-0 w-full z-[60] lg:hidden transform-gpu transition-[transform,opacity] duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ bottom: bottomOffset }}
    >
      <div className="bg-white rounded-t-[32px] shadow-[0_-8px_20px_rgba(0,0,0,0.04)] h-[72px]">
        <div className="flex items-center justify-between h-full px-4">
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
                  <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="mb-0.5" />
                  {isActive && (
                    <div className="absolute bottom-2.5 w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_6px_rgba(0,56,168,0.3)] animate-in zoom-in duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-center w-24 h-full">
            <button
              onClick={() => setChatOpen(true)}
              className="w-14 h-14 bg-brand-blue rounded-full shadow-[0_8px_24px_rgba(0,56,168,0.25)] flex items-center justify-center transition-all active:scale-90 group"
              aria-label="Ask AI Assistant"
            >
              <BotMessageSquare className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
            </button>
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
                  <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="mb-0.5" />
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

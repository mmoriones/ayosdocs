'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Sun, Moon, User, Bell } from 'lucide-react';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context';
import { Button, Avatar } from '@/components/ui';
import { useAuthUI } from '@/components/Providers';
import AccountMenu from './AccountMenu';
import { useRef } from 'react';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Reusable Mobile Header component with iOS Modern aesthetic.
 * Supports sticky behavior and auto-hide logic on scroll.
 */
export default function MobileHeader({ 
  sticky = false, 
  autoHide = false,
  className = "" 
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal } = useAuthUI();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const lastScrollYRef = useRef(0);

  // Auto-hide logic on scroll
  useEffect(() => {
    // Initialize offset on mount
    document.documentElement.style.setProperty('--header-offset', '64px');

    if (!autoHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      let visible = true;
      if (currentScrollY < 10) {
        visible = true;
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        visible = false;
      } else if (currentScrollY < lastScrollY) {
        visible = true;
      }
      
      setIsVisible(visible);
      document.documentElement.style.setProperty('--header-offset', visible ? '64px' : '0px');
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [autoHide]);

  const headerStyles = `
    ${sticky ? 'fixed top-0 left-0 right-0' : 'relative'}
    h-16 z-[100] transition-all duration-500 ease-in-out border-b border-white/50 lg:hidden
    ${autoHide && !isVisible ? '-translate-y-full' : 'translate-y-0'}
    ${sticky && lastScrollY > 10 ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white/70 backdrop-blur-md'}
    ${className}
  `;

  return (
    <>
      <header className={headerStyles}>
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Brand Link */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 active:scale-95 transition-transform"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <Image 
              src="/favicon.svg" 
              alt="AyosDocs" 
              width={32} 
              height={32} 
              className="shrink-0 drop-shadow-sm"
            />
            <span className="text-xl font-black tracking-tight text-[#1C1C1E]">
              Ayos<span className="text-[#0038A8]">Docs</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-[#0038A8] transition-colors active:scale-90"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5" />
              ) : theme === 'light' ? (
                <Moon size={20} strokeWidth={2.5} />
              ) : (
                <Sun size={20} strokeWidth={2.5} />
              )}
            </button>

            {!session ? (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => openAuthModal()}
                leftIcon={<User size={18} strokeWidth={2.5} />}
                className="h-10 rounded-full shadow-sm bg-white border-gray-100 text-[#1C1C1E] font-bold text-sm px-5"
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
                  <Bell size={26} className="text-[#1C1C1E]" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => setIsAccountMenuOpen(true)}
                  className="active:scale-95 transition-transform outline-none"
                >
                  <Avatar 
                    src={session.user?.image} 
                    name={session.user?.name} 
                    size="md" 
                    className="!border-white !shadow-sm" 
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AccountMenu 
        isOpen={isAccountMenuOpen} 
        onClose={() => setIsAccountMenuOpen(false)} 
        session={session} 
      />
    </>
  );
}

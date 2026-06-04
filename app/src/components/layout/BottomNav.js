'use client';

import { useMemo, memo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, Layers, CheckSquare } from 'lucide-react';

function BottomNav({ isLoggedIn = false }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Intelligent Auto-Hide Logic
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
    { href: '/guides', icon: Book, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    ...(isLoggedIn ? [
      { href: '/my-docs', icon: CheckSquare, label: 'My Docs' },
    ] : []),
  ], [isLoggedIn]);

  return (
    <nav 
      className={`fixed left-0 right-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] lg:hidden px-2 pb-safe transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } bottom-0`}
    >
      <div className="flex items-center justify-around relative z-10 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-[64px] transition-all duration-300 active:scale-95 relative group ${
                isActive ? 'text-[#0038A8]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="transition-all duration-300 relative z-10"
              />
              <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 relative z-10 ${isActive ? 'text-[#0038A8]' : 'text-[#8E8E93]'}`}>
                {item.label}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute top-1 w-1 h-1 bg-[#0038A8] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(BottomNav);

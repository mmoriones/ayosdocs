'use client';

import { useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, Layers, CheckSquare } from 'lucide-react';

function BottomNav({ isLoggedIn = false }) {
  const pathname = usePathname();

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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-fit bg-white/80 backdrop-blur-2xl border border-white/50 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[60] lg:hidden p-1.5 overflow-hidden transition-all duration-500 ease-out"
    >
      {/* Glossy Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      
      <div className="flex items-center gap-1 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[76px] h-[58px] rounded-full transition-all duration-300 active:scale-95 relative group ${
                isActive ? 'text-[#0038A8]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              {/* Active Pill Background */}
              {isActive && (
                <div className="absolute inset-0 bg-[#0038A8]/8 animate-in fade-in zoom-in-95 duration-300 rounded-full" />
              )}
              
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="transition-all duration-300 relative z-10"
              />
              <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 relative z-10 ${isActive ? 'text-[#0038A8]' : 'text-[#8E8E93]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(BottomNav);

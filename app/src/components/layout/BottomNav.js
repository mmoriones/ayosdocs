'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Book, Layers, User, CheckSquare } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/guides', icon: Book, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    ...(isLoggedIn ? [
      { href: '/my-docs', icon: CheckSquare, label: 'My Docs' },
    ] : []),
  ];

  return (
    <nav 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-fit backdrop-blur-md border border-white/50 rounded-[40px] shadow-[0_20px_50px_rgba(0,56,168,0.1)] z-[60] lg:hidden overflow-hidden transition-all duration-500 ease-out"
      style={{ background: 'linear-gradient(to top, rgba(248, 250, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)' }}
    >
      {/* Glossy Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      
      <div className="flex items-center justify-center h-20 px-3 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-[72px] h-full relative overflow-hidden transition-all duration-200 active:scale-95 group ${
                isActive ? 'text-[#0038A8]' : 'text-slate-400/80'
              }`}
            >
              {/* Ripple Effect Background Container */}
              <div className="absolute inset-0 bg-[#0038A8]/5 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-2xl mx-1 my-1" />

              <div className={`p-1.5 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill="none"
                  className="transition-all duration-300"
                />
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-[#0038A8]' : 'text-slate-400/80'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

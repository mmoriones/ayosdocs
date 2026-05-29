'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Book, Layers, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/guides', icon: Book, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    ...(isLoggedIn ? [{ href: '/profile', icon: User, label: 'Profile' }] : []),
  ];

  return (
    <nav 
      className="fixed bottom-8 left-6 right-6 backdrop-blur-md border border-white/50 rounded-[40px] shadow-[0_20px_50px_rgba(0,56,168,0.1)] z-[60] lg:hidden overflow-hidden"
      style={{ background: 'linear-gradient(to top, rgba(248, 250, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)' }}
    >
      {/* Glossy Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      
      <div className="flex items-center justify-around h-22 px-2 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-500 ${
                isActive ? 'text-[#0038A8]' : 'text-slate-400/80'
              }`}
            >
              <div className={`p-2 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon 
                  size={26} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill={isActive ? 'currentColor' : 'none'}
                  className="transition-all duration-500"
                />
              </div>
              <span className={`text-[11px] font-bold tracking-tight transition-colors duration-500 ${isActive ? 'text-[#0038A8]' : 'text-slate-400/80'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

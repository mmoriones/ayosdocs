'use client';

import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from "@/context/ThemeContext";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Dashboard header with breadcrumbs and tools.
 */
export default function DashboardHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, href };
  });

  return (
    <header className="h-16 border-b border-ctp-surface1 bg-ctp-base/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-ctp-subtext1 hover:text-ctp-text">
          <Menu size={20} />
        </button>
        
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link href="/" className="text-ctp-subtext1 hover:text-ctp-text transition-colors">
            AyosDocs
          </Link>
          {breadcrumbs.map((bc, i) => (
            <div key={bc.href} className="flex items-center gap-2">
              <span className="text-ctp-surface2">/</span>
              <Link 
                href={bc.href}
                className={i === breadcrumbs.length - 1 ? "font-semibold text-ctp-text" : "text-ctp-subtext1 hover:text-ctp-text"}
              >
                {bc.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ctp-subtext1 group-focus-within:text-ctp-sky-800 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search guides, offices, requirements..." 
            className="w-full bg-ctp-mantle border border-ctp-surface1 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-ctp-sky-800 focus:ring-1 focus:ring-ctp-sky-800 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-crust text-[10px] font-sans text-ctp-subtext0">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-crust text-[10px] font-sans text-ctp-subtext0">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-mantle rounded-lg transition-all"
          aria-label="Toggle theme"
        >
          {!mounted ? (
            <div className="w-5 h-5" />
          ) : theme === 'light' ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>
        <button className="p-2 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-mantle rounded-lg transition-all">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}

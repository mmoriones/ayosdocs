'use client';

import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from "@/context/ThemeContext";
import { useSearch } from "@/context/SearchContext";
import { useSyncExternalStore, useState } from "react";
import SearchInput from '@/components/ui/SearchInput';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Dashboard header with breadcrumbs and tools.
 */
export default function DashboardHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { toggleSearch } = useSearch();
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
        <SearchInput 
          value=""
          onChange={() => {}}
          onClick={toggleSearch}
          placeholder="Search guides, offices, requirements..."
          variant="compact"
          showShortcut={true}
        />
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

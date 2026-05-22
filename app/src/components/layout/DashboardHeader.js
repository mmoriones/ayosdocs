'use client';

import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from "@/context/ThemeContext";
import { useSearch } from "@/context/SearchContext";
import { useSyncExternalStore, useState } from "react";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import SearchInput from '@/components/ui/SearchInput';
import { useAuthUI } from '@/components/Providers';
import Skeleton from '@/components/ui/Skeleton';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Global application header containing breadcrumb navigation, 
 * central search trigger, theme toggling, and account actions.
 * Automatically adapts UI for guest vs authenticated states.
 * 
 * @param {Object} props
 * @param {Function} props.onMenuClick - Triggered to open the mobile sidebar.
 */
export default function DashboardHeader({ onMenuClick }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { toggleSearch } = useSearch();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const user = session?.user;
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, href };
  });

  return (
    <header className="h-16 border-b border-ctp-surface1 bg-ctp-base/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-ctp-subtext1 hover:text-ctp-text active:scale-95 transition-all"
        >
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

        {status === 'loading' ? (
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-lg bg-ctp-mantle border border-ctp-surface1" />
            <div className="w-8 h-8 rounded-full bg-ctp-mantle border border-ctp-surface1" />
          </div>
        ) : !session ? (
          <button 
            onClick={openAuthModal}
            className="px-4 py-1.5 bg-ctp-sky-800 text-white rounded-lg text-sm font-semibold hover:bg-ctp-sky-800/90 transition-all shadow-sm active:scale-95 ml-2"
          >
            Sign In
          </button>
        ) : (
          <>
            <button className="p-2 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-mantle rounded-lg transition-all">
              <Bell size={20} />
            </button>
            
            <Link 
              href="/profile"
              className="ml-1 w-8 h-8 rounded-full border border-ctp-surface1 flex items-center justify-center overflow-hidden hover:border-ctp-sky-800 transition-all active:scale-95 shadow-sm bg-ctp-mantle"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 text-xs font-bold uppercase">
                  {user?.name?.charAt(0) || 'AD'}
                </div>
              )}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

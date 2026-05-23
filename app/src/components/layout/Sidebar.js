'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import { 
  Home, 
  BookOpen, 
  Layers, 
  MapPin, 
  PanelLeft,
  PanelRight,
  CheckSquare, 
  Settings, 
  LogOut, 
  LogIn,
  User
} from 'lucide-react';
import NavItem from './NavItem';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Main navigation container supporting desktop collapse and mobile drawer modes.
 * Groups links into discovery/workspace sections and provides
 * global authentication and settings triggers.
 * 
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Desktop-only toggle for the slim view.
 * @param {Function} props.setIsCollapsed - Callback to toggle desktop view.
 * @param {boolean} [props.isMobileOpen] - Controls visibility on small screens.
 * @param {Function} props.closeMobile - Callback to hide the sidebar on mobile.
 * @param {boolean} [props.isMounted] - Controls whether animations are enabled.
 * @param {string} [props.className] - Optional custom classes.
 */
export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen = false, closeMobile, isMounted = true, className = "" }) {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = status === 'authenticated';

  const navItems = [
    { href: '/', icon: Home, label: 'Overview' },
    { href: '/guides', icon: BookOpen, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
    { href: '/offices', icon: MapPin, label: 'Offices' },
  ];

  const authItems = [
    { href: '/my-docs', icon: CheckSquare, label: 'My Docs' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-ctp-mantle border-r border-ctp-surface1 z-50 flex flex-col ${
        isMounted ? 'transition-all duration-300' : 'transition-none'
      } ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${className}`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-4 shrink-0 overflow-hidden">
        <Link href="/" onClick={closeMobile} className="flex items-center gap-3 shrink-0 ml-1">
          <Image
            src="/favicon.svg"
            alt="AyosDocs"
            width={28}
            height={28}
            className="shrink-0"
          />
          <span className={`text-lg font-bold tracking-tight transition-all duration-300 whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          }`}>
            <span className="text-ctp-sky-800">Ayos</span>Docs
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8 custom-scrollbar overflow-x-hidden">
        <div className="space-y-1">
          <h3 className={`px-4 text-[10px] font-bold text-ctp-subtext0 uppercase tracking-[0.15em] mb-3 transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Discovery
          </h3>
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              {...item} 
              collapsed={isCollapsed} 
              onClick={closeMobile}
            />
          ))}
        </div>

        {isLoggedIn && (
          <div className="space-y-1">
            <h3 className={`px-4 text-[10px] font-bold text-ctp-subtext0 uppercase tracking-[0.15em] mb-3 transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Workspace
            </h3>
            {authItems.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                collapsed={isCollapsed} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer / User */}
      <div className="p-3 border-t border-ctp-surface1 overflow-hidden">
        <div className="space-y-1">
          {status === 'loading' ? (
            <div className="h-10 w-full" />
          ) : isLoggedIn ? (
            <>
              <NavItem 
                href="/settings" 
                icon={Settings} 
                label="Settings" 
                collapsed={isCollapsed} 
                onClick={closeMobile}
              />
              <button
                onClick={() => {
                  signOut();
                  closeMobile?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-ctp-subtext1 hover:bg-ctp-sky-800/[0.05] hover:text-ctp-text transition-all duration-200 group overflow-hidden whitespace-nowrap`}
              >
                <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-red transition-colors">
                  <LogOut size={20} />
                </div>
                <span className={`text-sm font-medium transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                openAuthModal();
                closeMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-ctp-sky-800 text-white hover:bg-ctp-sky-800/90 transition-all duration-200 shadow-sm shadow-ctp-sky-800/20 overflow-hidden whitespace-nowrap group`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
                <LogIn size={20} />
              </div>
              <span className={`text-sm font-bold tracking-tight transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                Sign In
              </span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-ctp-subtext1 hover:bg-ctp-sky-800/[0.05] hover:text-ctp-text transition-all duration-200 group w-full overflow-hidden whitespace-nowrap`}
        >
          <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-text">
            {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
          </div>
          <span className={`text-sm font-medium transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}

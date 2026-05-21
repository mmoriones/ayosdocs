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
 */
export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen = false, closeMobile }) {
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
      className={`fixed left-0 top-0 h-screen bg-ctp-base border-r border-ctp-surface1 z-50 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-4 border-b border-ctp-surface1 shrink-0 overflow-hidden">
        <Link href="/" onClick={closeMobile} className="flex items-center gap-3 shrink-0">
          <Image
            src="/favicon.svg"
            alt="AyosDocs"
            width={32}
            height={32}
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
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar overflow-x-hidden">
        <div className="space-y-1">
          <h3 className={`px-3 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-2 transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
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
            <h3 className={`px-3 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-2 transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
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
          {isLoggedIn ? (
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text transition-all duration-200 group overflow-hidden whitespace-nowrap`}
              >
                <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-text">
                  <LogOut size={20} />
                </div>
                <span className={`text-sm transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-ctp-sky-800 text-white hover:bg-ctp-sky-800/90 transition-all duration-200 overflow-hidden whitespace-nowrap`}
            >
              <div className="shrink-0">
                <LogIn size={20} />
              </div>
              <span className={`text-sm font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                Sign In
              </span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-3 py-2 mt-4 rounded-lg text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text transition-all duration-200 group w-full overflow-hidden whitespace-nowrap`}
        >
          <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-text">
            {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
          </div>
          <span className={`text-sm transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}

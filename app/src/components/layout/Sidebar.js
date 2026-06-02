'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
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
 * @param {boolean} [props.isMounted] - Controls whether animations are enabled.
 * @param {string} [props.className] - Optional custom classes.
 */
export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen = false, closeMobile, isMounted = true, className = "", onLogoutClick }) {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = status === 'authenticated';

  const navItems = [
    { href: '/', icon: Home, label: 'Overview' },
    { href: '/guides', icon: BookOpen, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
  ];

  const authItems = [
    { href: '/my-docs', icon: CheckSquare, label: 'My Docs' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside 
      className={`lg:relative fixed left-0 top-0 h-screen lg:h-full bg-ctp-mantle lg:bg-transparent border-r lg:border-r-0 border-ctp-surface1 z-50 flex flex-col ${
        isMounted ? 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)' : 'transition-none'
      } ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${className}`}
    >
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 shrink-0 overflow-hidden">
        <Link href="/" onClick={closeMobile} className="flex items-center gap-3 shrink-0">
          <Image
            src="/favicon.svg"
            alt="AyosDocs"
            width={32}
            height={32}
            className="shrink-0 drop-shadow-sm"
          />
          <span className={`text-xl font-black tracking-tight transition-all duration-500 ${
            isCollapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}>
            Ayos<span className="text-brand-blue">Docs</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar overflow-x-hidden">
        <div className="space-y-1.5">
          <h3 className={`px-4 text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-[0.15em] mb-4 transition-all duration-500 ${
            isCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100'
          }`}>
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
          <div className="space-y-1.5">
            <h3 className={`px-4 text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-[0.15em] mb-4 transition-all duration-500 ${
              isCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100'
            }`}>
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

      {/* Footer / User Profile Island */}
      <div className="p-4 border-t lg:border-t-0 border-ctp-surface1 overflow-hidden">
        <div className={`space-y-1.5 lg:bg-ctp-mantle lg:rounded-2xl lg:shadow-[0_8px_32px_rgba(0,0,0,0.04)] lg:p-2 lg:border lg:border-white/50 transition-all duration-500 ${
          isCollapsed ? 'lg:px-1' : 'lg:p-2'
        }`}>
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
                onClick={onLogoutClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-ctp-subtext1 hover:bg-ctp-red/5 hover:text-ctp-red transition-all duration-300 group overflow-hidden whitespace-nowrap active:scale-[0.96]`}
              >
                <div className="shrink-0 transition-colors">
                  <LogOut size={20} />
                </div>
                <span className={`text-sm font-bold tracking-tight transition-all duration-500 ${isCollapsed ? 'opacity-0 -translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ctp-sky-800 text-white hover:bg-ctp-sky-800/90 transition-all duration-300 shadow-sm shadow-ctp-sky-800/20 overflow-hidden whitespace-nowrap group active:scale-[0.96]`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
                <LogIn size={20} />
              </div>
              <span className={`text-sm font-bold tracking-tight transition-all duration-500 ${isCollapsed ? 'opacity-0 -translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>
                Sign In
              </span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 mt-4 rounded-xl text-ctp-subtext1 hover:bg-ctp-sky-800/10 hover:text-ctp-sky-800 transition-all duration-300 group w-full overflow-hidden whitespace-nowrap active:scale-[0.96]`}
        >
          <div className="shrink-0 text-ctp-subtext0 group-hover:text-ctp-sky-800 transition-all duration-300">
            {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
          </div>
          <span className={`text-sm font-bold tracking-tight transition-all duration-500 ${isCollapsed ? 'opacity-0 -translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}

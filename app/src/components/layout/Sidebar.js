'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import { useWorkspace } from '@/context';
import {
  Home,
  LibraryBig,
  Layers,
  PanelLeft,
  PanelRight,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  BotMessageSquare
} from 'lucide-react';
import NavItem from './NavItem';
import { Tooltip } from '@/components/ui';

/**
 * Main navigation container supporting desktop collapse and mobile drawer modes.
 * Groups links into discovery/workspace sections and provides
 * global authentication and settings triggers.
 */
export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen = false, closeMobile, isMounted = true, className = "", onLogoutClick }) {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const { setChatOpen, isChatOpen } = useWorkspace();
  const isLoggedIn = status === 'authenticated';

  const navItems = [
    { href: '/', icon: Home, label: 'Overview' },
    { href: '/guides', icon: LibraryBig, label: 'Guides' },
    { href: '/bundles', icon: Layers, label: 'Bundles' },
  ];

  const authItems = [
    { href: '/my-docs', icon: LayoutDashboard, label: 'My Docs' },
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
            src="/ayosdocs.webp"
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
          
          {/* AI Assistant Trigger for Desktop */}
          <div className="pt-2">
            <button
              onClick={() => {
                setChatOpen(true);
                closeMobile?.();
              }}
              className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group active:scale-[0.96] ${
                isChatOpen
                  ? 'bg-brand-blue/15 text-brand-blue shadow-sm shadow-brand-blue/5'
                  : 'text-ctp-subtext1 hover:bg-brand-blue/8 hover:text-ctp-text'
              }`}
            >
              <div className={`shrink-0 transition-all duration-300 ${isChatOpen ? 'text-brand-blue scale-110' : 'text-ctp-subtext0 group-hover:text-ctp-text'}`}>
                <BotMessageSquare size={20} strokeWidth={isChatOpen ? 2.5 : 2} />
              </div>
              
              {!isCollapsed && (
                <span className={`text-sm tracking-tight transition-all duration-300 whitespace-nowrap ${
                  isChatOpen ? 'text-brand-blue font-bold' : 'font-medium'
                }`}>
                  AI Assistant
                </span>
              )}

              {isCollapsed && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 z-50">
                  <Tooltip content="AI Assistant" position="right" delay={100}>
                    <div className="w-full h-full" />
                  </Tooltip>
                </div>
              )}
            </button>
          </div>
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
        <div className={`space-y-1.5 lg:rounded-2xl transition-all duration-500 ${
          isCollapsed ? 'lg:px-1' : ''
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-full bg-white border border-gray-100 text-brand-blue hover:bg-gray-50 transition-all duration-300 shadow-sm overflow-hidden whitespace-nowrap group active:scale-[0.96]`}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
                <User size={20} strokeWidth={2.5} />
              </div>
              <span className={`text-sm font-bold tracking-tight transition-all duration-500 ${isCollapsed ? 'opacity-0 -translate-x-4 w-0' : 'opacity-100 translate-x-0 w-auto'}`}>
                Login
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

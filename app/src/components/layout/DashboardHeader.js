'use client';

import { Bell, Menu, Sun, Moon, User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, useSearch } from "@/context";
import { useSyncExternalStore } from "react";
import { useSession } from 'next-auth/react';
import { SearchInput, Avatar, DropdownMenu, DropdownMenuItem } from '@/components/ui';
import { useAuthUI } from '@/components/Providers';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Global application header containing breadcrumb navigation, 
 * central search trigger, theme toggling, and account actions.
 * Automatically adapts UI for guest vs authenticated states.
 */
export default function DashboardHeader({ onMenuClick, onLogoutClick }) {
  const pathname = usePathname();
  const router = useRouter();
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
        {/* LOGO (Mobile Only) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <Image
            src="/favicon.svg"
            alt="AyosDocs"
            width={28}
            height={28}
            className="shrink-0"
          />
          <span className="text-sm font-black tracking-tight text-ctp-text">
            Ayos<span className="text-ctp-sky-800">Docs</span>
          </span>
        </Link>
        
        {/* BREADCRUMBS (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-all px-2 py-1 rounded-md hover:bg-ctp-sky-800/5 active:scale-[0.97]">
            AyosDocs
          </Link>
          {breadcrumbs.map((bc, i) => (
            <div key={bc.href} className="flex items-center gap-1.5">
              <span className="text-ctp-surface2 font-light">/</span>
              <Link 
                href={bc.href}
                className={`px-2 py-1 rounded-md transition-all active:scale-[0.97] ${
                  i === breadcrumbs.length - 1 
                    ? "font-bold text-ctp-text bg-ctp-surface0/30" 
                    : "text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 font-medium"
                }`}
              >
                {bc.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {session && (
        <div className="flex-1 max-w-lg px-8 hidden sm:block">
          <div className="relative group">
            <SearchInput 
              value=""
              onChange={() => {}}
              onClick={toggleSearch}
              placeholder="Search guides, requirements, bundles..."
              variant="standard"
              showShortcut={true}
              className="bg-ctp-mantle/50 border-ctp-surface1 group-hover:border-ctp-sky-800/30 transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 rounded-lg transition-all active:scale-[0.97]"
          aria-label="Toggle theme"
        >
          {!mounted ? (
            <div className="w-5 h-5" />
          ) : theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>

        {!session ? (
          <button 
            onClick={openAuthModal}
            className="px-5 py-1.5 bg-ctp-sky-800 text-white rounded-lg text-sm font-bold hover:bg-ctp-sky-800/90 transition-all shadow-sm shadow-ctp-sky-800/20 active:scale-95 ml-2"
          >
            Sign In
          </button>
        ) : (
          <>
            <button className="p-2 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 rounded-lg transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-ctp-red rounded-full border-2 border-ctp-base" />
            </button>
            
            <DropdownMenu
              align="right"
              trigger={
                <div className="ml-2 p-0.5 rounded-full hover:ring-2 hover:ring-ctp-sky-800/30 transition-all active:scale-95">
                  <Avatar
                    src={user?.image}
                    name={user?.name || 'User'}
                    size="sm"
                  />
                </div>
              }
            >
              <div className="px-3 py-2.5 border-b border-ctp-surface1 bg-ctp-mantle/30">
                <p className="text-xs font-bold text-ctp-text truncate">{user?.name}</p>
                <p className="text-ui-micro font-medium text-ctp-subtext1 truncate">{user?.email}</p>
              </div>

              <DropdownMenuItem onClick={() => router.push('/profile')} icon={User}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/my-docs')} icon={ShieldCheck}>
                Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')} icon={Settings}>
                Settings
              </DropdownMenuItem>
              
              <div className="h-px bg-ctp-surface1 my-1" />
              
              <DropdownMenuItem 
                onClick={onLogoutClick}
                icon={LogOut}
                className="!text-ctp-red hover:!bg-ctp-red/5"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LogOut, 
  UserPlus, 
  X, 
  Sun, 
  Moon, 
  Home, 
  FileText, 
  LayoutGrid, 
  Building2,
  ShieldAlert
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import { useAuthUI } from "@/components/Providers";
import Image from "next/image";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const MobileMenu = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const { data: session } = useSession();
  const { isMobileMenuOpen, toggleMobileMenu, openAuthModal } = useAuthUI();

  if (!isMobileMenuOpen) return null;

  const user = session?.user;
  const isVerified = user?.isVerified;

  const handleClick = (action) => {
    if (action) action();
    toggleMobileMenu(false);
  };

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  const linkClass = (path) =>
    `block w-full px-6 py-4 rounded-xl transition-all duration-200 text-lg ${
      isActive(path)
        ? "bg-ctp-sky-800/10 text-ctp-sky-800 font-bold"
        : "text-ctp-subtext0 font-semibold hover:bg-ctp-mantle hover:text-ctp-sky-800"
    }`;

  return (
    <div className="fixed inset-0 z-[150] lg:hidden flex flex-col justify-start pt-6 pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] pointer-events-auto"
        onClick={() => toggleMobileMenu(false)}
      />
      
      <div className="relative mx-4 bg-ctp-mantle rounded-2xl shadow-2xl border border-ctp-surface1 flex flex-col overflow-hidden pointer-events-auto max-h-[85vh] animate-slide-down">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ctp-surface1 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {user.image ? (
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-full border border-ctp-surface1 shadow-xs"
                  />
                  {!isVerified && (
                    <div className="absolute -top-1 -right-1 bg-ctp-yellow rounded-full p-0.5 border border-ctp-mantle text-ctp-base">
                      <ShieldAlert size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-9 h-9 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm relative">
                  {user.name?.charAt(0)}
                  {!isVerified && (
                    <div className="absolute -top-1 -right-1 bg-ctp-yellow rounded-full p-0.5 border border-ctp-mantle text-ctp-base">
                      <ShieldAlert size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-ctp-text truncate">
                    {user.name}
                  </span>
                  {!isVerified && (
                    <ShieldAlert size={12} className="text-ctp-yellow shrink-0" />
                  )}
                </div>
                <span className="text-[12px] font-medium text-ctp-subtext1 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Image src="/favicon.svg" alt="" width={28} height={28} />
              <span className="text-base font-bold text-ctp-text">AyosDocs</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90 border border-ctp-surface1"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-[18px] h-[18px]" />
              ) : theme === 'light' ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>
            <button 
              onClick={() => toggleMobileMenu(false)}
              className="p-2 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90 border border-ctp-surface1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-6 space-y-6">
          {/* PRIMARY NAV */}
          <div className="space-y-0.5">
            <p className="px-4 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-2 opacity-60">Explore</p>
            <Link href="/" onClick={() => handleClick()} className={linkClass("/")}>
              <div className="flex items-center gap-3">
                <Home size={18} strokeWidth={isActive("/") ? 2.5 : 2} />
                Home
              </div>
            </Link>
            <Link href="/guides" onClick={() => handleClick()} className={linkClass("/guides")}>
              <div className="flex items-center gap-3">
                <FileText size={18} strokeWidth={isActive("/guides") ? 2.5 : 2} />
                Guides
              </div>
            </Link>
            <Link href="/bundles" onClick={() => handleClick()} className={linkClass("/bundles")}>
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} strokeWidth={isActive("/bundles") ? 2.5 : 2} />
                Bundles
              </div>
            </Link>
            <Link href="/offices" onClick={() => handleClick()} className={linkClass("/offices")}>
              <div className="flex items-center gap-3">
                <Building2 size={18} strokeWidth={isActive("/offices") ? 2.5 : 2} />
                Offices
              </div>
            </Link>
          </div>

          {/* USER WORKSPACE */}
          {user && (
            <div className="space-y-0.5">
              <p className="px-4 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest mb-2 opacity-60">Personal</p>
              {!isVerified && (
                <div className="mx-4 mb-3 px-4 py-3 bg-ctp-yellow-800/10 border border-ctp-yellow-800/20 rounded-xl">
                  <p className="text-[10px] font-bold text-ctp-yellow-800 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={12} />
                    Verify Account
                  </p>
                  <p className="text-[11px] font-medium text-ctp-yellow-800/80 mt-1 leading-relaxed">
                    Personal dashboard and progress sync are locked until verified.
                  </p>
                </div>
              )}
              <Link href="/my-docs" onClick={() => handleClick()} className={linkClass("/my-docs")}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Image src="/favicon.svg" alt="" width={18} height={18} />
                    My Docs
                  </div>
                  {!isVerified && <div className="w-2 h-2 rounded-full bg-ctp-yellow animate-pulse" />}
                </div>
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-ctp-surface1 pb-2">
            {user ? (
              <button
                onClick={() => handleClick(() => signOut({ callbackUrl: '/' }))}
                className="w-full flex items-center justify-center gap-2 bg-red-500/5 text-red-500 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] border border-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleClick(openAuthModal)}
                className="w-full bg-ctp-sky-800 hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon, 
  Home, 
  FileText, 
  LayoutGrid, 
  Building2 
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import { useAuthUI } from "@/components/Providers";
import Image from "next/image";

/**
 * DesktopMenu Component
 * Handles both discovery navigation and user tools based on variant.
 */
const DesktopMenu = ({ variant = 'all' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const { openAuthModal } = useAuthUI();
  
  const user = session?.user;

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileOpen(prev => prev ? false : prev);
  }, [pathname]);

  const navClass = (path) =>
    `relative py-1 transition-all duration-200 text-lg ${isActive(path)
      ? "text-ctp-sky-800 font-bold"
      : "text-ctp-subtext0 font-semibold hover:text-ctp-sky-800"
    }`;

  const renderDiscoveryLinks = () => (
    <div className="flex items-center gap-8">
      <Link href="/" className={navClass("/")}>
        Home
        {isActive("/") && (
          <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-sky-800 rounded-full -translate-x-1/2"></span>
        )}
      </Link>
      <Link href="/guides" className={navClass("/guides")}>
        Guides
        {isActive("/guides") && (
          <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-sky-800 rounded-full -translate-x-1/2"></span>
        )}
      </Link>
      <Link href="/bundles" className={navClass("/bundles")}>
        Bundles
        {isActive("/bundles") && (
          <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-sky-800 rounded-full -translate-x-1/2"></span>
        )}
      </Link>
      <Link href="/offices" className={navClass("/offices")}>
        Offices
        {isActive("/offices") && (
          <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-sky-800 rounded-full -translate-x-1/2"></span>
        )}
      </Link>
    </div>
  );

  const renderUserTools = () => (
    <div className="hidden lg:flex items-center gap-4">
      {user && (
        <Link 
          href="/my-docs" 
          className={`mr-2 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isActive("/my-docs") 
              ? "bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20 font-bold" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-sky-800 font-semibold border border-transparent hover:border-ctp-surface0"
          }`}
        >
          My Docs
        </Link>
      )}

      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl bg-ctp-mantle hover:bg-ctp-surface1 text-ctp-text transition-all active:scale-95 shadow-sm border border-ctp-surface0"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {!user ? (
        <button
          onClick={openAuthModal}
          className="bg-ctp-sky-800 hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-lg font-bold transition-all active:scale-95 shadow-lg"
        >
          Login
        </button>
      ) : (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 bg-ctp-mantle hover:bg-ctp-mantle p-1.5 pr-3 rounded-full border border-ctp-surface0 transition-all active:scale-95"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full border border-ctp-base shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user.name?.charAt(0)}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`text-ctp-subtext0 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-ctp-mantle/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-ctp-surface0 overflow-hidden z-50 animate-slide-down origin-top-right">
              <div className="px-6 py-6 bg-ctp-mantle/30 border-b border-ctp-surface0">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-ctp-base shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-bold text-ctp-text truncate">
                      {user.name}
                    </span>
                    <span className="text-sm font-medium text-ctp-subtext1 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 space-y-1">
                <Link
                  href="/my-docs"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-ctp-text hover:bg-ctp-base rounded-2xl transition-all"
                >
                  <Image src="/favicon.svg" alt="" width={20} height={20} />
                  My Docs
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-lg font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-[0.98]"
                >

                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'discovery') return renderDiscoveryLinks();
  if (variant === 'tools') return renderUserTools();

  return (
    <div className="hidden lg:flex items-center gap-8">
      {renderDiscoveryLinks()}
      <div className="flex items-center border-l border-ctp-surface0 pl-8 ml-2 gap-4">
        {renderUserTools()}
      </div>
    </div>
  );
};

export default DesktopMenu;

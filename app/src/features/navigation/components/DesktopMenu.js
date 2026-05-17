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
    setTimeout(() => {
      setIsProfileOpen(prev => prev ? false : prev);
    }, 0);
  }, [pathname]);

  const navClass = (path) =>
    `relative py-1 transition-all duration-200 text-[15px] ${isActive(path)
      ? "text-ctp-sky-800 font-semibold"
      : "text-ctp-subtext1 font-medium hover:text-ctp-sky-800"
    }`;

  const renderDiscoveryLinks = () => (
    <div className="flex items-center gap-6">
      <Link href="/" className={navClass("/")}>
        Home
      </Link>
      <Link href="/guides" className={navClass("/guides")}>
        Guides
      </Link>
      <Link href="/bundles" className={navClass("/bundles")}>
        Bundles
      </Link>
      <Link href="/offices" className={navClass("/offices")}>
        Offices
      </Link>
    </div>
  );

  const renderUserTools = () => (
    <div className="hidden lg:flex items-center gap-4">
      {user && (
        <Link 
          href="/my-docs" 
          className={`mr-2 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
            isActive("/my-docs") 
              ? "bg-ctp-sky-800 text-white font-semibold shadow-sm" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-sky-800 font-medium border border-transparent hover:border-ctp-surface1"
          }`}
        >
          My Docs
        </Link>
      )}

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-ctp-mantle hover:bg-ctp-surface1 text-ctp-text transition-all active:scale-95 shadow-sm border border-ctp-surface1"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {!user ? (
        <button
          onClick={openAuthModal}
          className="bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm"
        >
          Login
        </button>
      ) : (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 bg-ctp-mantle hover:bg-ctp-surface1 p-1 pr-2.5 rounded-full border border-ctp-surface1 transition-all active:scale-95"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={28}
                height={28}
                className="rounded-full border border-ctp-surface1 shadow-xs"
              />
            ) : (
              <div className="w-7 h-7 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {user.name?.charAt(0)}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`text-ctp-subtext1 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-ctp-mantle rounded-xl shadow-xl border border-ctp-surface1 overflow-hidden z-50 animate-slide-down origin-top-right">
              <div className="px-5 py-5 bg-ctp-crust/50 border-b border-ctp-surface1">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="rounded-full border border-ctp-surface1 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-ctp-text truncate">
                      {user.name}
                    </span>
                    <span className="text-[12px] font-medium text-ctp-subtext1 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <Link
                  href="/my-docs"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-ctp-text hover:bg-ctp-surface1 rounded-lg transition-all"
                >
                  <Image src="/favicon.svg" alt="" width={18} height={18} />
                  My Docs
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-[0.98]"
                >
                  <LogOut size={18} /> Logout
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

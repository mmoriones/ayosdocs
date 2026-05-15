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
  Building2 
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import { useAuthUI } from "@/components/Providers";
import Image from "next/image";

const MobileMenu = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const { isMobileMenuOpen, toggleMobileMenu, openAuthModal } = useAuthUI();

  if (!isMobileMenuOpen) return null;

  const user = session?.user;

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
      
      <div className="relative mx-4 bg-ctp-mantle rounded-[2rem] shadow-2xl border border-ctp-surface0 flex flex-col overflow-hidden pointer-events-auto max-h-[80vh] animate-slide-down">
        <div className="flex items-center justify-between px-6 py-6 border-b border-ctp-surface0 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-ctp-surface0"
                />
              ) : (
                <div className="w-10 h-10 bg-ctp-sky-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
          ) : (
            <div className="flex items-center gap-2">
              <Image src="/favicon.svg" alt="" width={32} height={32} />
              <span className="text-lg font-bold text-ctp-text">AyosDocs</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={() => toggleMobileMenu(false)}
              className="p-2.5 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6 space-y-8">
          {/* PRIMARY NAV */}
          <div className="space-y-0.5">
            <p className="px-6 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-3">Explore</p>
            <Link href="/" onClick={() => handleClick()} className={linkClass("/")}>
              <div className="flex items-center gap-3">
                <Home size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
                Home
              </div>
            </Link>
            <Link href="/guides" onClick={() => handleClick()} className={linkClass("/guides")}>
              <div className="flex items-center gap-3">
                <FileText size={20} strokeWidth={isActive("/guides") ? 2.5 : 2} />
                Guides
              </div>
            </Link>
            <Link href="/bundles" onClick={() => handleClick()} className={linkClass("/bundles")}>
              <div className="flex items-center gap-3">
                <LayoutGrid size={20} strokeWidth={isActive("/bundles") ? 2.5 : 2} />
                Bundles
              </div>
            </Link>
            <Link href="/offices" onClick={() => handleClick()} className={linkClass("/offices")}>
              <div className="flex items-center gap-3">
                <Building2 size={20} strokeWidth={isActive("/offices") ? 2.5 : 2} />
                Offices
              </div>
            </Link>
          </div>

          {/* USER WORKSPACE */}
          {user && (
            <div className="space-y-0.5">
              <p className="px-6 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-3">Personal Workspace</p>
              <Link href="/my-docs" onClick={() => handleClick()} className={linkClass("/my-docs")}>
                <div className="flex items-center gap-3">
                  <Image src="/favicon.svg" alt="" width={20} height={20} />
                  My Docs
                </div>
              </Link>
            </div>
          )}

          {/* INFORMATION */}
          <div className="space-y-0.5">
            <p className="px-6 text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-3">Information</p>
            {[
              { label: "About", href: "/about" },
              { label: "FAQs", href: "/faqs" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleClick()}
                className={linkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-ctp-surface0 pb-2">
            {user ? (
              <button
                onClick={() => handleClick(() => signOut())}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3.5 rounded-xl font-bold text-lg transition-all active:scale-[0.98]"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleClick(openAuthModal)}
                className="w-full bg-ctp-sky-800 hover:opacity-90 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
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

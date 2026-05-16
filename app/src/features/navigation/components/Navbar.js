'use client';

import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DesktopMenu from "./DesktopMenu";
import { useAuthUI } from "@/components/Providers";

const Navbar = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useAuthUI();
  const router = useRouter();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="w-full sticky top-0 z-[60] bg-ctp-base/80 backdrop-blur-xl border-b border-ctp-surface0 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-8 py-4">

        {/* LEFT: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <Image
            src="/favicon.svg"
            alt="AyosDocs logo"
            width={36}
            height={36}
            className="object-contain transition-transform group-hover:scale-110"
          />

          <h1 className="text-2xl font-bold text-ctp-text leading-none tracking-tight">
            <span className="text-ctp-sky-800">Ayos</span>
            <span className="ml-1">Docs</span>
          </h1>
        </Link>

        {/* CENTER: Discovery Links (Desktop Only) */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <DesktopMenu variant="discovery" />
        </div>

        {/* RIGHT: Tools & Toggle */}
        <div className="flex items-center gap-4">
          <DesktopMenu variant="tools" />

          {/* MOBILE TOGGLE */}
          <button
            className={`lg:hidden p-2.5 rounded-2xl transition-all duration-300 ${
              isMobileMenuOpen 
                ? "bg-ctp-mantle text-ctp-sky-800 shadow-inner" 
                : "text-ctp-subtext1 hover:bg-ctp-mantle"
            }`}
            onClick={() => toggleMobileMenu()}
            aria-label="Toggle menu"
          >
            <Menu size={24} className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

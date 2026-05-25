'use client';

import { Home, List, CheckSquare, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthUI } from "@/components/Providers";

/**
 * Navigation component for mobile users, fixed at the bottom of the screen.
 */
const MobileBottomNav = ({ onOpenTOC, onOpenChecklist, isTOCOpen, isChecklistOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthModalOpen } = useAuthUI();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isHomeActive = pathname === "/" && !isTOCOpen && !isChecklistOpen;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isTOCOpen || isChecklistOpen) {
        setIsVisible(true);
        return;
      }

      const isBodyLocked = typeof document !== 'undefined' && document.body.style.overflow === "hidden";
      if (isBodyLocked || isAuthModalOpen) {
        setIsVisible(false);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const intervalId = setInterval(handleScroll, 200);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };
  }, [lastScrollY, isTOCOpen, isChecklistOpen, isAuthModalOpen]);

  return (
    <div className={`lg:hidden fixed bottom-6 left-6 right-6 z-[100] transition-all duration-500 ease-in-out ${
      isVisible && !isAuthModalOpen ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0 pointer-events-none"
    }`}>
      <div className="bg-ctp-mantle/95 backdrop-blur-xl border border-ctp-surface1 shadow-xl rounded-2xl p-1.5 flex items-center gap-1.5">
        
        <button
          onClick={() => router.push("/")}
          className={`click-ripple flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 ${
            isHomeActive 
              ? "bg-ctp-sky-800 text-ctp-base shadow-sm" 
              : "text-ctp-subtext1 hover:bg-ctp-surface0"
          }`}
        >
          <Home size={18} strokeWidth={2} />
          <span className={`text-ui-tiny mt-1 tracking-wide ${isHomeActive ? "font-bold" : "font-medium"}`}>
            Home
          </span>
        </button>

        <button
          onClick={onOpenTOC}
          className={`click-ripple flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 ${
            isTOCOpen 
              ? "bg-ctp-sky-800 text-ctp-base shadow-sm" 
              : "text-ctp-subtext1 hover:bg-ctp-surface0"
          }`}
        >
          {isTOCOpen ? <X size={18} strokeWidth={2} /> : <List size={18} strokeWidth={2} />}
          <span className={`text-ui-tiny mt-1 tracking-wide ${isTOCOpen ? "font-bold" : "font-medium"}`}>
            {isTOCOpen ? "Close" : "TOC"}
          </span>
        </button>

        <button
          onClick={onOpenChecklist}
          className={`click-ripple flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 ${
            isChecklistOpen 
              ? "bg-ctp-sky-800 text-ctp-base shadow-sm" 
              : "text-ctp-subtext1 hover:bg-ctp-surface0"
          }`}
        >
          {isChecklistOpen ? <X size={18} strokeWidth={2} /> : <CheckSquare size={18} strokeWidth={2} />}
          <span className={`text-ui-tiny mt-1 tracking-wide ${isChecklistOpen ? "font-bold" : "font-medium"}`}>
            {isChecklistOpen ? "Close" : "Checklist"}
          </span>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;

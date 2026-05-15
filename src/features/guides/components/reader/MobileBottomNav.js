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
      <div className="bg-ctp-mantle/95 backdrop-blur-xl border border-ctp-surface0 shadow-2xl rounded-[2rem] p-2 flex items-center gap-2">
        
        <button
          onClick={() => router.push("/")}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isHomeActive 
              ? "bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle"
          }`}
        >
          <Home size={20} strokeWidth={isHomeActive ? 3 : 2} />
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${isHomeActive ? "font-black" : "font-bold"}`}>
            Home
          </span>
        </button>

        <button
          onClick={onOpenTOC}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isTOCOpen 
              ? "bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle"
          }`}
        >
          {isTOCOpen ? <X size={20} strokeWidth={3} /> : <List size={20} strokeWidth={2} />}
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${isTOCOpen ? "font-black" : "font-bold"}`}>
            {isTOCOpen ? "Close" : "TOC"}
          </span>
        </button>

        <button
          onClick={onOpenChecklist}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isChecklistOpen 
              ? "bg-ctp-sky-800 text-ctp-base shadow-lg shadow-ctp-sky-800/20" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle"
          }`}
        >
          {isChecklistOpen ? <X size={20} strokeWidth={3} /> : <CheckSquare size={20} strokeWidth={2} />}
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${isChecklistOpen ? "font-black" : "font-bold"}`}>
            {isChecklistOpen ? "Close" : "Checklist"}
          </span>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;

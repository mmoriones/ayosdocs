import { Home, List, CheckSquare, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

/**
 * Navigation component for mobile users, fixed at the bottom of the screen.
 * Provides quick access to Home, Table of Contents, and Requirements Checklist.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.onOpenTOC - Function to toggle the Table of Contents modal.
 * @param {Function} props.onOpenChecklist - Function to toggle the Checklist modal.
 * @param {boolean} props.isTOCOpen - State indicating if the TOC modal is open.
 * @param {boolean} props.isChecklistOpen - State indicating if the Checklist modal is open.
 * @returns {JSX.Element} The rendered MobileBottomNav component.
 */
const MobileBottomNav = ({ onOpenTOC, onOpenChecklist, isTOCOpen, isChecklistOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthModalOpen } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isHomeActive = location.pathname === "/" && !isTOCOpen && !isChecklistOpen;

  // Implementation of "smart" visibility logic based on scroll direction and modal state.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If a modal is open, visibility is forced to true so the user can access "Close" buttons.
      if (isTOCOpen || isChecklistOpen) {
        setIsVisible(true);
        return;
      }

      // Hiding the navigation when other high-priority overlays (like AuthModal) are active.
      const isBodyLocked = document.body.style.overflow === "hidden";
      if (isBodyLocked || isAuthModalOpen) {
        setIsVisible(false);
        return;
      }

      // Detection of scroll direction: scrolling down hides the nav, scrolling up shows it.
      // A minimum threshold of 50px prevents jittering on small movements.
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // A periodic check handles cases where state transitions might not trigger a scroll event.
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
        
        {/* HOME */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isHomeActive 
              ? "bg-ctp-sapphire text-ctp-base shadow-lg shadow-ctp-sapphire/20" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle"
          }`}
        >
          <Home size={20} strokeWidth={isHomeActive ? 3 : 2} />
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${isHomeActive ? "font-black" : "font-bold"}`}>
            Home
          </span>
        </button>

        {/* TOC */}
        <button
          onClick={onOpenTOC}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isTOCOpen 
              ? "bg-ctp-sapphire text-ctp-base shadow-lg shadow-ctp-sapphire/20" 
              : "text-ctp-subtext1 hover:bg-ctp-mantle"
          }`}
        >
          {isTOCOpen ? <X size={20} strokeWidth={3} /> : <List size={20} strokeWidth={2} />}
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${isTOCOpen ? "font-black" : "font-bold"}`}>
            {isTOCOpen ? "Close" : "TOC"}
          </span>
        </button>

        {/* CHECKLIST */}
        <button
          onClick={onOpenChecklist}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 active:scale-95 ${
            isChecklistOpen 
              ? "bg-ctp-sapphire text-ctp-base shadow-lg shadow-ctp-sapphire/20" 
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

import { Home, List, CheckSquare, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

const MobileBottomNav = ({ onOpenTOC, onOpenChecklist, isTOCOpen, isChecklistOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthModalOpen } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isHomeActive = location.pathname === "/" && !isTOCOpen && !isChecklistOpen;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If any modal is open, handle visibility carefully
      if (isTOCOpen || isChecklistOpen) {
        // If AuthModal is ALSO open inside a modal, hide the bottom nav
        if (isAuthModalOpen) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        return;
      }

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isTOCOpen, isChecklistOpen, isAuthModalOpen]);

  return (
    <div className={`lg:hidden fixed bottom-4 left-6 right-6 z-[100] transition-all duration-500 ease-in-out ${
      isVisible && !isAuthModalOpen ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0 pointer-events-none"
    }`}>
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] p-2 flex items-center gap-1">
        
        {/* HOME */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            isHomeActive 
              ? "bg-teal-50 text-teal-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Home size={20} strokeWidth={isHomeActive ? 2.5 : 2} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${isHomeActive ? "font-bold" : "font-medium"}`}>
            Home
          </span>
        </button>

        {/* TOC */}
        <button
          onClick={onOpenTOC}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            isTOCOpen 
              ? "bg-teal-50 text-teal-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {isTOCOpen ? <X size={20} strokeWidth={2.5} /> : <List size={20} strokeWidth={isTOCOpen ? 2.5 : 2} />}
          <span className={`text-[10px] mt-0.5 tracking-tight ${isTOCOpen ? "font-bold" : "font-medium"}`}>
            {isTOCOpen ? "Close" : "TOC"}
          </span>
        </button>

        {/* CHECKLIST */}
        <button
          onClick={onOpenChecklist}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            isChecklistOpen 
              ? "bg-teal-50 text-teal-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {isChecklistOpen ? <X size={20} strokeWidth={2.5} /> : <CheckSquare size={20} strokeWidth={isChecklistOpen ? 2.5 : 2} />}
          <span className={`text-[10px] mt-0.5 tracking-tight ${isChecklistOpen ? "font-bold" : "font-medium"}`}>
            {isChecklistOpen ? "Close" : "Checklist"}
          </span>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomNav;

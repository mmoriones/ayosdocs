import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

/**
 * Primary navigation bar component for the application.
 * Manages both desktop and mobile menu states and orchestrates authentication actions.
 * 
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { 
    user, logout, openAuthModal, 
    isMobileMenuOpen, toggleMobileMenu 
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Management of body scrolling when the mobile menu is active.
  // Preventing scroll ensures the menu remains functional and usable on small screens.
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

  /**
   * Handles user logout by performing state cleanup and redirecting to the home page.
   * Removal of specific local storage keys ensures a fresh start for the next session.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.removeItem("lastGuideSlug");
    showToast({
      type: 'success',
      title: 'Logged Out',
      message: 'You have been successfully logged out.'
    });
  };

  return (
    <nav className="w-full sticky top-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-slate-100/50 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-10 py-3.5">

        {/* LEFT: Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Icon */}
          <img
            src="/favicon.svg"
            alt="AyosDocs logo"
            className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform group-hover:scale-110"
          />

          {/* Brand + tagline container */}
          <div className="flex items-center gap-4">
            {/* Brand name */}
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-none tracking-tight">
              <span className="text-teal-600">Ayos</span>
              <span className="ml-1">Docs</span>
            </h1>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-slate-200"></div>

            {/* Tagline */}
            <p className="hidden md:block text-[11px] font-medium text-slate-500 max-w-[180px] leading-tight">
              Your guide to government documents & more
            </p>
          </div>
        </div>


        {/* RIGHT */}
        <DesktopMenu
          user={user}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          handleLogout={handleLogout}
          openAuthModal={openAuthModal}
        />

        {/* MOBILE */}
        <button
          className={`lg:hidden p-2.5 rounded-2xl transition-all duration-300 ${
            isMobileMenuOpen 
              ? "bg-teal-50 text-teal-600 shadow-inner" 
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => toggleMobileMenu()}
          aria-label="Toggle menu"
        >
          <Menu size={24} className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

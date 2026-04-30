import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import AuthModal from "../../auth/components/AuthModal";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoggedIn, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT: Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          {/* Icon */}
          <img
            src="/favicon.svg"
            alt="AyosDocs logo"
            className="w-8 h-8 md:w-9 md:h-9 object-contain"
          />

          {/* Brand + tagline container */}
          <div className="flex items-center gap-3">
            {/* Brand name */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-none">
              <span className="text-teal-600">Ayos</span>
              <span className="ml-1">Docs</span>
            </h1>

            {/* Divider */}
            <div className="hidden md:block h-5 w-px bg-gray-300"></div>

            {/* Tagline */}
            <p className="hidden md:block text-xs text-gray-500 max-w-[180px] leading-tight">
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
          className="lg:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={26} />
        </button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        closeMenu={() => setIsMobileMenuOpen(false)}
        user={user}
        openAuthModal={openAuthModal}
        handleLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </nav>
  );
};

export default Navbar;

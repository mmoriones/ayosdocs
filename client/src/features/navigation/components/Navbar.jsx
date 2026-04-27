import { Sun, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import AuthModal from "../../auth/components/AuthModal";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoggedIn, logout } = useAuth();  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-800">
            <span className="text-teal-600">Ayos</span>Docs
            <Sun className="text-yellow-400 fill-yellow-400" size={18} />
          </h1>

          {/* Divider */}
          <div className="hidden md:block h-6 w-[1px] bg-gray-300"></div>

          {/* Tagline */}
          <p className="hidden md:block text-xs text-gray-500 max-w-[180px]">
            Your guide to government documents & more
          </p>
        </div>

        {/* RIGHT */}
        <DesktopMenu
          user={user}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          handleLogout={handleLogout}
          openAuthModal={() => setIsAuthModalOpen(true)}
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
        openAuthModal={() => setIsAuthModalOpen(true)}
        handleLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;

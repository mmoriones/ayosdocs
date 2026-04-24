import { Sun, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import AuthModal from "../features/auth/AuthModal";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full">
      <div className="bg-gradient-to-r from-[#008080] via-[#00a8a8] to-[#80cbc4] text-white p-4 lg:px-12 shadow-md">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-5xl font-black flex items-center gap-2">
              AyosDocs
              <Sun className="text-yellow-400 fill-yellow-400" size={28} />
            </h1>

            <div className="hidden md:block h-10 w-[2px] bg-white/30 mx-2"></div>

            {/* TAGLINE (desktop only) */}
            <p className="hidden md:block text-xs uppercase tracking-widest max-w-[200px]">
              AyosDocs | Your Guide to Government Documents & More
            </p>
          </div>

          {/* RIGHT: Desktop Menu */}
          <DesktopMenu
            user={user}
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            handleLogout={handleLogout}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
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

      <div className="h-1 bg-teal-900/10 w-full"></div>
    </nav>
  );
};

export default Navbar;

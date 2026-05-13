import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, UserCircle, Sun, Moon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";

/**
 * Component for the desktop version of the navigation menu.
 * Displays navigation links and user profile/auth actions.
 * 
 * @param {Object} props - Component props.
 * @param {Object|null} props.user - The currently authenticated user object.
 * @param {boolean} props.isProfileOpen - State for the profile dropdown visibility.
 * @param {Function} props.setIsProfileOpen - Function to toggle the profile dropdown.
 * @param {Function} props.handleLogout - Callback for user logout.
 * @param {Function} props.openAuthModal - Callback to open the login modal.
 * @returns {JSX.Element} The rendered DesktopMenu component.
 */
const DesktopMenu = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  handleLogout,
  openAuthModal,
}) => {
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  // Implementation of a "click outside" listener for the profile dropdown.
  // This is a standard way to handle closing UI elements when interacting elsewhere.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verification that the click occurred outside of the dropdown container.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup ensures the listener is removed when the component unmounts to prevent memory leaks.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsProfileOpen]);

  // Automatic closure of the dropdown whenever the route changes.
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname, setIsProfileOpen]);

  const navClass = (path) =>
    `relative py-1 transition-all duration-200 text-lg ${isActive(path)
      ? "text-ctp-green font-bold"
      : "text-ctp-subtext0 font-semibold hover:text-ctp-green"
    }`;

  return (
    <div className="hidden lg:flex items-center gap-8">

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className={navClass("/")}>
          Home
          {isActive("/") && (
            <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-green rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/guides" className={navClass("/guides")}>
          Guides
          {isActive("/guides") && (
            <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-green rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/offices" className={navClass("/offices")}>
          Offices
          {isActive("/offices") && (
            <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-green rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/rate" className={navClass("/rate")}>
          Rate
          {isActive("/rate") && (
            <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-green rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        {user && (
          <Link to="/my-progress" className={navClass("/my-progress")}>
            My Progress
            {isActive("/my-progress") && (
              <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 bg-ctp-green rounded-full -translate-x-1/2"></span>
            )}
          </Link>
        )}
      </div>

      {/* Theme Toggle & Auth Section */}
      <div className="flex items-center border-l border-ctp-surface0 pl-8 ml-2 gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-ctp-mantle hover:bg-ctp-surface1 text-ctp-text transition-all active:scale-95 shadow-sm border border-ctp-surface0"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {!user ? (
          <button
            onClick={openAuthModal}
            className="bg-ctp-green-600 hover:bg-ctp-green-500 text-ctp-base px-6 py-2.5 rounded-xl text-lg font-bold transition-all active:scale-95 shadow-lg"
          >
            Login
          </button>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-ctp-mantle hover:bg-ctp-mantle p-1.5 pr-3 rounded-full border border-ctp-surface0 transition-all active:scale-95"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border border-ctp-base shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 bg-ctp-green text-ctp-base rounded-full flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <ChevronDown
                size={14}
                className={`text-ctp-subtext0 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-4 w-72 bg-ctp-mantle/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-ctp-surface0 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
                
                {/* User Info */}
                <div className="px-6 py-6 bg-ctp-mantle/30 border-b border-ctp-surface0">
                  <div className="flex items-center gap-4">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full border-2 border-ctp-base shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-ctp-green text-ctp-base rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-lg font-bold text-ctp-text truncate">
                        {user.fullName}
                      </span>
                      <span className="text-sm font-medium text-ctp-subtext1 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-lg font-bold text-ctp-red hover:bg-ctp-red/10 rounded-2xl transition-all active:scale-[0.98]"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopMenu;

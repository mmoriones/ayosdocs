import { Link, useLocation } from "react-router-dom";
import { LogOut, UserPlus, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

/**
 * Component for the mobile version of the navigation menu.
 * Full-screen overlay providing access to all site sections on smaller devices.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - State for menu visibility.
 * @param {Function} props.closeMenu - Function to close the mobile menu.
 * @param {Object|null} props.user - The currently authenticated user object.
 * @param {Function} props.openAuthModal - Function to trigger the authentication modal.
 * @param {Function} props.handleLogout - Callback for user logout.
 * @returns {JSX.Element|null} The rendered MobileMenu component or null.
 */
const MobileMenu = ({
  isOpen,
  closeMenu,
  user,
  openAuthModal,
  handleLogout,
}) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  /**
   * Universal handler for menu interactions.
   * Executes a provided action and ensures the menu closes afterwards.
   * 
   * @param {Function} [action] - Optional action to execute (e.g., logout).
   */
  const handleClick = (action) => {
    if (action) action();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block w-full px-6 py-4 rounded-xl transition-all duration-200 text-lg ${
      isActive(path)
        ? "bg-ctp-sapphire/10 text-ctp-sapphire font-bold"
        : "text-ctp-subtext0 font-semibold hover:bg-ctp-mantle hover:text-ctp-sapphire"
    }`;

  return (
    <div className="fixed inset-0 z-[150] lg:hidden flex flex-col justify-start pt-6 pointer-events-none">
      {/* Heavy backdrop to block all background interactions */}
      <div 
        className="fixed inset-0 bg-ctp-crust/40 backdrop-blur-[4px] pointer-events-auto"
        onClick={closeMenu}
      />
      
      {/* Floating Menu Card - Compact GNOME Style */}
      <div className="relative mx-4 bg-ctp-mantle rounded-[2rem] shadow-2xl border border-ctp-surface0 flex flex-col overflow-hidden pointer-events-auto max-h-[80vh]">
        
        {/* HEADER: User Info & Close Button */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-ctp-surface0 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border border-ctp-surface0"
                />
              ) : (
                <div className="w-10 h-10 bg-ctp-sapphire text-ctp-base rounded-full flex items-center justify-center text-sm font-bold">
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
          ) : (
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="w-8 h-8" />
              <span className="text-lg font-bold text-ctp-text">AyosDocs</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              onClick={closeMenu}
              className="p-2.5 rounded-full bg-ctp-base text-ctp-subtext1 hover:text-ctp-text transition-colors active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">

          {/* PRIMARY NAV */}
          <div className="space-y-0.5">
            <Link
              to="/"
              onClick={() => handleClick()}
              className={linkClass("/")}
            >
              Home
            </Link>

            <Link
              to="/guides"
              onClick={() => handleClick()}
              className={linkClass("/guides")}
            >
              Guides
            </Link>

            <Link
              to="/offices"
              onClick={() => handleClick()}
              className={linkClass("/offices")}
            >
              Offices
            </Link>

            <Link
              to="/rate"
              onClick={() => handleClick()}
              className={linkClass("/rate")}
            >
              Rate
            </Link>

            {user && (
              <Link
                to="/my-progress"
                onClick={() => handleClick()}
                className={linkClass("/my-progress")}
              >
                My Progress
              </Link>
            )}
          </div>

          {/* SECONDARY NAV */}
          <div className="space-y-0.5">
            <p className="px-6 text-sm font-bold text-ctp-subtext0 uppercase tracking-widest mb-1">Information</p>
            {[
              { label: "About", to: "/about" },
              { label: "FAQs", to: "/faqs" },
              { label: "Contact", to: "/contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => handleClick()}
                className={linkClass(item.to)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* AUTH ACTIONS */}
          <div className="pt-6 border-t border-ctp-surface0 pb-2">
            {user ? (
              <button
                onClick={() => handleClick(handleLogout)}
                className="w-full flex items-center justify-center gap-2 bg-ctp-red/10 text-ctp-red py-3.5 rounded-xl font-bold text-lg transition-all active:scale-[0.98]"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleClick(openAuthModal)}
                className="w-full bg-ctp-sapphire-800 text-ctp-base py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                Login / Register
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

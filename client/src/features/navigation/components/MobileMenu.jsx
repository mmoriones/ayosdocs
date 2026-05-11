import { Link, useLocation } from "react-router-dom";
import { LogOut, UserPlus, X } from "lucide-react";

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
    `block w-full px-4 py-2 rounded-xl transition-all duration-200 text-[14px] ${
      isActive(path)
        ? "bg-teal-50 text-teal-700 font-bold"
        : "text-slate-600 font-semibold hover:bg-slate-50 hover:text-teal-600"
    }`;

  return (
    <div className="fixed inset-0 z-[150] lg:hidden flex flex-col justify-start pt-[20px] pointer-events-none">
      {/* Heavy backdrop to block all background interactions */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] pointer-events-auto"
        onClick={closeMenu}
      />
      
      {/* Floating Menu Card - Compact GNOME Style */}
      <div className="relative mx-4 bg-white rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden pointer-events-auto max-h-[80vh]">
        
        {/* HEADER: User Info & Close Button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full border border-slate-100"
                />
              ) : (
                <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-slate-900 truncate">
                  {user.fullName}
                </span>
                <span className="text-[10px] font-medium text-slate-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="w-6 h-6" />
              <span className="text-[14px] font-bold text-slate-900">AyosDocs</span>
            </div>
          )}

          <button 
            onClick={closeMenu}
            className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">

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
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Information</p>
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
          <div className="pt-4 border-t border-slate-50 pb-2">
            {user ? (
              <button
                onClick={() => handleClick(handleLogout)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-[0.98]"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleClick(openAuthModal)}
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-[13px] transition-all active:scale-[0.98] shadow-md shadow-teal-100 flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
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

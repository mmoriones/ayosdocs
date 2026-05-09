import { Link, useLocation } from "react-router-dom";
import { LogOut, UserPlus } from "lucide-react";

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
    `block w-full px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] ${isActive(path)
      ? "bg-teal-50 text-teal-700 font-bold"
      : "text-slate-600 font-semibold hover:bg-slate-50 hover:text-teal-600"
    }`;

  return (
    <div className="lg:hidden border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-lg overflow-y-auto max-h-[calc(100vh-80px)] animate-in slide-in-from-top duration-300">

      <div className="px-6 py-8 space-y-8">

        {/* PRIMARY NAV */}
        <div className="space-y-2">
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
        <div className="space-y-2">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Information</p>
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

        {/* USER SECTION */}
        <div className="pt-4 border-t border-slate-100">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-4 py-4 bg-slate-50 rounded-3xl border border-slate-100">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-[15px] font-bold text-slate-900 truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[12px] font-medium text-slate-500 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClick(handleLogout)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-[14px] transition-colors hover:bg-red-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleClick(openAuthModal)}
              className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white py-4 rounded-2xl font-bold text-[14px] transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Login / Register
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MobileMenu;

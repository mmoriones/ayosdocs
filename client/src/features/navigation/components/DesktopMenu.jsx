import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

const DesktopMenu = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  handleLogout,
  openAuthModal,
}) => {
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsProfileOpen]);

  useEffect(() => {
    // Close dropdowns on location change
    setIsProfileOpen(false);
  }, [location.pathname, setIsProfileOpen]);

  const navClass = (path) =>
    `relative pb-1 transition ${isActive(path)
      ? "text-teal-600 font-semibold"
      : "text-gray-600 hover:text-teal-600"
    }`;

  return (
    <div className="hidden lg:flex items-center gap-8 text-sm">

      {/* Home */}
      <Link to="/" className={navClass("/")}>
        Home
        {isActive("/") && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
        )}
      </Link>

      {/* Guides */}
      <Link to="/guides" className={navClass("/guides")}>
        Guides
        {isActive("/guides") && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
        )}
      </Link>

      {/* My Progress */}
      {user && (
        <Link to="/my-progress" className={navClass("/my-progress")}>
          My Progress
          {isActive("/my-progress") && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
          )}
        </Link>
      )}

      {/* Info Pages */}
      <Link to="/about" className={navClass("/about")}>
        About
        {isActive("/about") && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
        )}
      </Link>

      <Link to="/faqs" className={navClass("/faqs")}>
        FAQs
        {isActive("/faqs") && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
        )}
      </Link>

      <Link to="/contact" className={navClass("/contact")}>
        Contact
        {isActive("/contact") && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-teal-600 rounded"></span>
        )}
      </Link>

      {/* Auth */}
      {!user ? (
        <button
          onClick={openAuthModal}
          className="ml-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Login
        </button>
      ) : (
        <div ref={dropdownRef} className="relative ml-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.fullName}
                className="w-6 h-6 rounded-full border border-teal-600"
              />
            ) : (
              <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs">
                {user.fullName.charAt(0)}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* USER HEADER */}
              <div className="flex items-center gap-3 px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full border border-teal-100"
                  />
                ) : (
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* MENU ITEMS */}
              <div className="py-1">

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={14} /> Logout
                </button>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default DesktopMenu;

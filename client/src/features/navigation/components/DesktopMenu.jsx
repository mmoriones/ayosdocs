import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, UserCircle } from "lucide-react";
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
    setIsProfileOpen(false);
  }, [location.pathname, setIsProfileOpen]);

  const navClass = (path) =>
    `relative py-1 transition-all duration-200 text-[14px] ${isActive(path)
      ? "text-teal-600 font-bold"
      : "text-slate-600 font-semibold hover:text-teal-600"
    }`;

  return (
    <div className="hidden lg:flex items-center gap-8">

      {/* Nav Links */}
      <div className="flex items-center gap-7">
        <Link to="/" className={navClass("/")}>
          Home
          {isActive("/") && (
            <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/guides" className={navClass("/guides")}>
          Guides
          {isActive("/guides") && (
            <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        {user && (
          <Link to="/my-progress" className={navClass("/my-progress")}>
            My Progress
            {isActive("/my-progress") && (
              <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
            )}
          </Link>
        )}

        <Link to="/about" className={navClass("/about")}>
          About
          {isActive("/about") && (
            <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/faqs" className={navClass("/faqs")}>
          FAQs
          {isActive("/faqs") && (
            <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
          )}
        </Link>

        <Link to="/contact" className={navClass("/contact")}>
          Contact
          {isActive("/contact") && (
            <span className="absolute left-1/2 -bottom-1 w-1 h-1 bg-teal-600 rounded-full -translate-x-1/2"></span>
          )}
        </Link>
      </div>

      {/* Auth Section */}
      <div className="flex items-center border-l border-slate-100 pl-8 ml-2">
        {!user ? (
          <button
            onClick={openAuthModal}
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-95 shadow-md shadow-teal-100"
          >
            Login
          </button>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 p-1.5 pr-3 rounded-full border border-slate-100 transition-all active:scale-95"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18),0_0_15px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* User Info */}
                <div className="px-5 py-5 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-slate-900 truncate">
                        {user.fullName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <LogOut size={16} /> Logout
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

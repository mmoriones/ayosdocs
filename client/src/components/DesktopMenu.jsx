import { Link } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

const DesktopMenu = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  handleLogout,
  openAuthModal,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsProfileOpen]);

  return (
    <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider">
      
      {/* Home */}
      <Link 
        to="/" 
        className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all border border-white/50"
      >
        Home
      </Link>

      {/* Guides */}
      <div className="relative group cursor-pointer flex items-center gap-1 hover:text-teal-100">
        Guides <ChevronDown size={12} />
      </div>

      {/* My Progress */}
      {user && (
        <Link 
          to="/my-progress" 
          className="hover:text-teal-100"
        >
          My Progress
        </Link>
      )}

      {/* Static */}
      <span className="hover:text-teal-100 cursor-pointer">Resources</span>
      <span className="hover:text-teal-100 cursor-pointer">About</span>

      {/* Auth */}
      {!user ? (
        <button 
          onClick={openAuthModal}
          className="bg-[#006666] hover:bg-[#004d4d] px-4 py-2 rounded-md border border-teal-300 flex items-center gap-2"
        >
          <User size={14} />
          LOGIN / REGISTER
        </button>
      ) : (
        <div ref={dropdownRef} className="relative">
          
          {/* Profile Button */}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md border border-white/30 flex items-center gap-2"
          >
            <div className="w-5 h-5 bg-teal-800 rounded-full flex items-center justify-center text-[10px]">
              {user.fullName.charAt(0)}
            </div>
            <span className="max-w-[80px] truncate">
              {user.fullName}
            </span>
            <ChevronDown
              size={12}
              className={`transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#242729] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
              
              {/* Profile */}
              <Link 
                to="/profile" 
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                <User size={14} /> Profile Settings
              </Link>

              {/* Logout */}
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;

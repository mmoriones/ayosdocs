import { Sun, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthModal from '../features/auth/AuthModal';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Refresh to update UI
  };

  return (
    <nav className="w-full">
      <div className="bg-gradient-to-r from-[#008080] via-[#00a8a8] to-[#80cbc4] text-white p-4 lg:px-12 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-2">
              AyosDocs 
              <Sun className="text-yellow-400 fill-yellow-400 mt-1" size={36} strokeWidth={3} />
            </h1>
            <div className="hidden md:block h-10 w-[2px] bg-white/30 mx-2"></div>
            <p className="text-[10px] md:text-xs font-medium uppercase tracking-widest opacity-90 max-w-[200px] leading-tight">
              AyosDocs | Your Guide to Government Documents & More
            </p>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider">
            <a href="/" className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all border border-white/50">Home</a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-teal-100">
              Guides <ChevronDown size={12} />
            </div>
            
            {/* Conditional Link: Only show if logged in */}
            {user && (
              <a href="/my-progress" className="hover:text-teal-100 transition-colors">My Progress</a>
            )}
            
            <a href="#" className="hover:text-teal-100 transition-colors">Resources</a>
            <a href="#" className="hover:text-teal-100 transition-colors">About</a>
            
            {/* User Auth Section */}
            {!user ? (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#006666] hover:bg-[#004d4d] px-4 py-2 rounded-md border border-teal-300 shadow-inner flex items-center gap-2 transition-all">
                <User size={14} />
                LOGIN / REGISTER
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md border border-white/30 flex items-center gap-2 transition-all">
                  <div className="w-5 h-5 bg-teal-800 rounded-full flex items-center justify-center text-[10px]">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[80px] truncate">{user.fullName}</span>
                  <ChevronDown size={12} className={isProfileOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#242729] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                    <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
                      <User size={14} /> Profile Settings
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:hidden absolute right-4 top-8">
            <Menu size={28} />
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <div className="h-1 bg-teal-900/10 w-full"></div>
    </nav>
  );
};

export default Navbar;
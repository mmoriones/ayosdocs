import { Sun, Menu, User } from 'lucide-react';
import { useState } from 'react';
import AuthModal from '../features/auth/AuthModal';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen ] = useState(false);

  return (
    <nav className="w-full">
      {/* Top Gradient Bar */}
      <div className="bg-gradient-to-r from-[#008080] via-[#00a8a8] to-[#80cbc4] text-white p-4 lg:px-12 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-2">
              FILO-DOCS 
              <Sun className="text-yellow-400 fill-yellow-400 mt-1" size={36} strokeWidth={3} />
            </h1>
            <div className="hidden md:block h-10 w-[2px] bg-white/30 mx-2"></div>
            <p className="text-[10px] md:text-xs font-medium uppercase tracking-widest opacity-90 max-w-[200px] leading-tight">
              Filo-Docs | Your Guide to Government Documents & More
            </p>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider">
            <a href="#" className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all border border-white/50">Home</a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-teal-100">
              Guides <span>▼</span>
            </div>
            <a href="#" className="hover:text-teal-100 transition-colors">My Progress</a>
            <a href="#" className="hover:text-teal-100 transition-colors">Resources</a>
            <a href="#" className="hover:text-teal-100 transition-colors">About</a>
            
            {/* Login Button */}
            <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#006666] hover:bg-[#004d4d] px-4 py-2 rounded-md border border-teal-300 shadow-inner flex items-center gap-2 transition-all">
              <User size={14} />
              LOGIN / REGISTER
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden absolute right-4 top-8">
            <Menu size={28} />
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Thin Accent Bar below the nav */}
      <div className="h-1 bg-teal-900/10 w-full"></div>
    </nav>
  );
};

export default Navbar;
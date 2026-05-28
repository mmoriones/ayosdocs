'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import BottomNav from './BottomNav';
import Footer from '@/components/Footer';
import { SignOutModal } from '@/components/ui';

/**
 * Primary layout wrapper for the application dashboard.
 * Coordinates global navigation (Sidebar, Header, BottomNav), responsive transitions,
 * and the main content area with a unified footer.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be rendered in the main area.
 */
export default function AppShell({ children }) {
  // Consolidate layout state to minimize renders on mount and satisfy linting
  const [layout, setLayout] = useState({
    isCollapsed: false,
    isMounted: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Restore preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLayout({
      isCollapsed: saved === 'true',
      isMounted: true
    });
  }, []);

  // Persist preference to localStorage
  const handleToggleCollapse = (val) => {
    setLayout(prev => ({ ...prev, isCollapsed: val }));
    localStorage.setItem('sidebar-collapsed', val.toString());
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { isCollapsed, isMounted } = layout;

  return (
    <div className={`min-h-screen flex ${!isMounted ? 'opacity-0' : 'animate-in fade-in duration-500'}`}>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ctp-base/80 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <div className={`hidden lg:block ${!isMounted ? 'transition-none' : ''}`}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={handleToggleCollapse} 
          isMobileOpen={isMobileMenuOpen}
          closeMobile={() => setIsMobileMenuOpen(false)}
          className={!isMounted ? '!transition-none' : ''}
          isMounted={isMounted}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      </div>
      
      <div 
        className={`flex-1 flex flex-col min-w-0 ${
          !isMounted ? 'transition-none' : 'transition-all duration-300'
        } ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        } pb-24 lg:pb-0`}
      >
        <div className="hidden lg:block sticky top-0 z-40">
          <DashboardHeader onMenuClick={toggleMobileMenu} onLogoutClick={() => setShowLogoutConfirm(true)} />
        </div>
        
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav />

      <SignOutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onSignOut={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import Footer from '@/components/Footer';

/**
 * Primary layout wrapper for the application dashboard.
 * Coordinates global navigation (Sidebar, Header), responsive transitions,
 * and the main content area with a unified footer.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be rendered in the main area.
 */
export default function AppShell({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-ctp-base flex">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ctp-crust/80 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />
      
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 bg-ctp-base ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        <DashboardHeader onMenuClick={toggleMobileMenu} />
        
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

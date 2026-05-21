'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import Footer from '@/components/Footer';

/**
 * Dashboard layout shell.
 * Manages Sidebar, Header, and Main content area.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function AppShell({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-ctp-base flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        <DashboardHeader />
        
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

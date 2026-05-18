import React from 'react';

/**
 * Admin Layout
 * This layout is used specifically for admin pages.
 * It removes the standard website navbar and footer for a clean management interface.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
      {/* Simple Admin Sidebar/Header can be added here later */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

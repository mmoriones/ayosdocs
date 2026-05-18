'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/features/navigation/components/Navbar";
import Footer from "@/components/Footer";
import ClientAuthWrapper from "@/components/ClientAuthWrapper";

/**
 * ConditionalLayout Component
 * 
 * This component conditionally renders the Navbar, Footer, and ClientAuthWrapper
 * based on the current route. It's designed to hide these standard website
 * elements on admin-related pages.
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current path is an admin page
  // This includes /admin, /admin/login, and any other sub-routes
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ClientAuthWrapper />
    </>
  );
}

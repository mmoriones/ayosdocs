'use client';

import { usePathname } from 'next/navigation';
import AppShell from "@/components/layout/AppShell";
import ClientAuthWrapper from "@/components/ClientAuthWrapper";
import VerificationBanner from "@/features/auth/components/VerificationBanner";

/**
 * ConditionalLayout Component
 * 
 * This component conditionally renders the new AppShell (Cloudflare-style)
 * based on the current route. It's designed to hide these standard website
 * elements on admin-related pages.
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current path is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <AppShell>
      <VerificationBanner />
      {children}
      <ClientAuthWrapper />
    </AppShell>
  );
}

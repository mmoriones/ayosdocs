'use client';

import { AppShell } from "@/components/layout";
import ClientAuthWrapper from "@/components/ClientAuthWrapper";

/**
 * Dashboard Layout
 * Wraps all main application pages in the AppShell with sidebar and header.
 */
export default function DashboardLayout({ children }) {
  return (
    <AppShell>
      {children}
      <ClientAuthWrapper />
    </AppShell>
  );
}

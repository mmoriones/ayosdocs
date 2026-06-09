'use client';

import { AppShell } from "@/components/layout";
import ChatAssistant from "@/components/chat/ChatAssistant";

/**
 * Dashboard Layout
 * Wraps all main application pages in the AppShell with sidebar and header.
 */
export default function DashboardLayout({ children }) {
  return (
    <AppShell>
      {children}
      <ChatAssistant />
    </AppShell>
  );
}

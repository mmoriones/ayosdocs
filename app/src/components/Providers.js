'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider, ToastProvider, SearchProvider, WorkspaceProvider } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import CommandPalette from "./ui/CommandPalette";

const AuthUIContext = createContext();

export const useAuthUI = () => useContext(AuthUIContext);

export default function Providers({ children, session }) {
  // We initialize QueryClient inside the component to avoid sharing it across requests on the server.
  // Using useState ensures it's created only once during the lifetime of the component.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ThemeProvider>
          <ToastProvider>
            <SearchProvider>
              <WorkspaceProvider>
                <AuthUIContext.Provider value={{
                  isAuthModalOpen,
                  openAuthModal,
                  closeAuthModal
                }}>
                  {children}
                  <CommandPalette />
                </AuthUIContext.Provider>
              </WorkspaceProvider>
            </SearchProvider>
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

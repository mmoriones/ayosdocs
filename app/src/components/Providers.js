'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { SearchProvider } from "@/context/SearchContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import CommandPalette from "./ui/CommandPalette";

const AuthUIContext = createContext();

export const useAuthUI = () => useContext(AuthUIContext);

export default function Providers({ children }) {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const toggleMobileMenu = (val) => setIsMobileMenuOpen(prev => val !== undefined ? val : !prev);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider>
          <ToastProvider>
            <SearchProvider>
              <AuthUIContext.Provider value={{
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
                isMobileMenuOpen,
                toggleMobileMenu
              }}>
                {children}
                <CommandPalette />
              </AuthUIContext.Provider>
            </SearchProvider>
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

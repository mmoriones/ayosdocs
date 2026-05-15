'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";

const AuthUIContext = createContext();

export const useAuthUI = () => useContext(AuthUIContext);

const queryClient = new QueryClient();

export default function Providers({ children }) {
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
            <AuthUIContext.Provider value={{
              isAuthModalOpen,
              openAuthModal,
              closeAuthModal,
              isMobileMenuOpen,
              toggleMobileMenu
            }}>
              {children}
            </AuthUIContext.Provider>
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

'use client';

import { SessionProvider } from "next-auth/react";
import { ToastProvider, SearchProvider, WorkspaceProvider } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import CommandPalette from "./ui/CommandPalette";

const AuthUIContext = createContext();

export const useAuthUI = () => useContext(AuthUIContext);

export default function Providers({ children, session }) {
  const router = useRouter();
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

  const openAuthModal = () => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 1024;
    const isGuest = document.cookie.includes('guest-access=true');

    if (isMobile) {
      router.push('/login');
    } else {
      // Desktop logic: Use modal if already a guest to keep context, else go to login page
      if (isGuest) {
        setIsAuthModalOpen(true);
      } else {
        router.push('/login');
      }
    }
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
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
      </SessionProvider>
    </QueryClientProvider>
  );
}

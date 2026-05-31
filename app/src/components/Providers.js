'use client';

import { SessionProvider } from "next-auth/react";
import { ToastProvider, SearchProvider, WorkspaceProvider, useSearch, useWorkspace } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Layers, ArrowRight, Loader2, Settings, User, CheckSquare, Home, Shield, Sparkles } from 'lucide-react';

// --- Inlined from components/ui/CommandPalette.js ---
function CommandPalette() {
  const { isOpen, closeSearch, searchItems, isLoading } = useSearch();
  const { activeGuideSlug } = useWorkspace();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);

  const appItems = [
    { title: 'Overview', href: '/', type: 'nav', icon: Home, description: 'Return to your dashboard' },
    { title: 'My Documents', href: '/my-docs', type: 'nav', icon: CheckSquare, description: 'Track your active guides' },
    { title: 'User Profile', href: '/profile', type: 'nav', icon: User, description: 'Manage your personal info' },
    { title: 'System Settings', href: '/settings', type: 'nav', icon: Settings, description: 'Interface and account preferences' },
    { title: 'Privacy Policy', href: '/privacy', type: 'nav', icon: Shield, description: 'Data protection and usage' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery('');
        setSelectedIndex(0);
      }, 0);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (query) {
      const allSearchable = [...appItems, ...searchItems];
      return allSearchable.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);
    }

    const activeGuide = activeGuideSlug ? searchItems.find(item => item.id === activeGuideSlug) : null;
    
    const suggestions = [...appItems];
    
    if (activeGuide) {
      suggestions.unshift({ ...activeGuide, isActive: true });
    } else {
      suggestions.push(...searchItems.slice(0, 2));
    }

    return suggestions.slice(0, 6);
  }, [query, searchItems, activeGuideSlug]);

  const handleSelect = (item) => {
    router.push(item.href);
    closeSearch();
  };

  const handleKeyDown = (e) => {
    if (filteredItems.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-ctp-crust/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={closeSearch}
      />
      
      <div className="relative w-full max-w-2xl bg-ctp-base border border-ctp-surface1 rounded-2xl shadow-2xl shadow-ctp-crust/50 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        <div className="flex items-center px-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
          <Search className="text-ctp-subtext1" size={20} />
          <input
            ref={inputRef}
            type="text"
            maxLength={50}
            placeholder="Search guides, settings, and more..."
            value={query}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^\w\s-]/gi, '');
              setQuery(sanitized);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none py-4 px-3 text-sm focus:ring-0 outline-none text-ctp-text font-medium"
          />
          <button 
            onClick={closeSearch}
            className="p-1 hover:bg-ctp-surface1 rounded text-ctp-subtext1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-ctp-sky-800" size={24} />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-1 px-2">
              <div className="px-3 py-2 text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">
                {query ? 'Search Results' : 'Suggested Actions'}
              </div>
              {filteredItems.map((item, index) => {
                const Icon = item.icon || (item.type === 'guide' ? BookOpen : Layers);
                const isSelected = index === selectedIndex;
                const isActiveGuide = item.isActive;
                
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-all ${
                      isSelected ? 'bg-ctp-sky-800 text-white shadow-lg shadow-ctp-sky-800/20' : 'hover:bg-ctp-mantle'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-white/10 border-white/20' : 'bg-ctp-mantle border-ctp-surface1'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{item.title}</span>
                        {isActiveGuide ? (
                          <span className="px-1.5 py-0.5 rounded border border-ctp-sky-800/30 bg-ctp-sky-800/10 text-ui-tiny font-bold text-ctp-sky-800 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Sparkles size={8} />
                            Active
                          </span>
                        ) : (
                          <span className={`text-ui-tiny px-1.5 py-0.5 rounded border uppercase tracking-widest font-bold ${
                            isSelected ? 'border-white/30 bg-white/10' : 'border-ctp-surface1 bg-ctp-crust text-ctp-subtext1'
                          }`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className={`text-xs truncate opacity-70 mt-0.5`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    {isSelected && <ArrowRight size={16} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-ctp-subtext1">No results found for &quot;<span className="font-bold text-ctp-text">{query}</span>&quot;</p>
              <p className="text-xs text-ctp-subtext0 mt-1">Try searching for &quot;Profile&quot; or &quot;Passport&quot;.</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-ctp-mantle/50 border-t border-ctp-surface1 flex items-center justify-between text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-ui-tiny">ENTER</kbd>
              to select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-ui-tiny">↑↓</kbd>
              to navigate
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-ui-tiny">ESC</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
// --- End of CommandPalette ---

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

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
        className="absolute inset-0 bg-[#F2F2F7]/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={closeSearch}
      />
      
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="flex items-center px-6 py-2 border-b border-gray-100/50 bg-white/40">
          <Search className="text-gray-400" size={20} strokeWidth={2.5} />
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
            className="w-full bg-transparent border-none py-5 px-4 text-[15px] focus:ring-0 outline-none text-[#1C1C1E] font-bold placeholder-gray-400"
          />
          <button 
            onClick={closeSearch}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all active:scale-90"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-[#0038A8]" size={28} strokeWidth={2.5} />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-1.5 px-3">
              <div className="px-4 py-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
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
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-[20px] text-left transition-all duration-200 ${
                      isSelected ? 'bg-[#0038A8] text-white shadow-lg shadow-[#0038A8]/20' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected ? 'bg-white/10 border-white/20' : 'bg-white border-gray-100 shadow-sm'
                    }`}>
                      <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold truncate">{item.title}</span>
                        {isActiveGuide ? (
                          <span className="px-2 py-0.5 rounded-full border border-white/30 bg-white/10 text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={10} fill="currentColor" />
                            Active
                          </span>
                        ) : (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-black ${
                            isSelected ? 'border-white/30 bg-white/10' : 'border-gray-100 bg-gray-50 text-gray-400'
                          }`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className={`text-[12px] truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-400 font-medium'}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    {isSelected && <ArrowRight size={18} strokeWidth={2.5} className="shrink-0 animate-in slide-in-from-left-2 duration-300" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-[15px] text-gray-600 font-bold">No results found for &quot;<span className="text-[#0038A8]">{query}</span>&quot;</p>
              <p className="text-[13px] text-gray-400 mt-1 font-medium">Try searching for &quot;Profile&quot; or &quot;Passport&quot;.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100/50 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-md border border-gray-200 bg-white text-[10px] shadow-sm">ENTER</kbd>
              to select
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-md border border-gray-200 bg-white text-[10px] shadow-sm">↑↓</kbd>
              to navigate
            </span>
          </div>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded-md border border-gray-200 bg-white text-[10px] shadow-sm">ESC</kbd>
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
  
  const openAuthModal = () => {
    if (typeof window === 'undefined') return;
    router.push('/login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ToastProvider>
          <SearchProvider>
            <WorkspaceProvider>
              <AuthUIContext.Provider value={{
                openAuthModal
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

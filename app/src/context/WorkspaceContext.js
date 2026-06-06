'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WorkspaceContext = createContext();

/**
 * WorkspaceProvider
 * Manages global application state related to the user's active guide and context.
 */
export function WorkspaceProvider({ children }) {
  const [activeGuideSlug, setActiveGuideSlugState] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ayosdocs_last_viewed_guide');
    if (saved) {
      setTimeout(() => {
        setActiveGuideSlugState(saved);
      }, 0);
    }
  }, []);

  const setActiveGuideSlug = useCallback((slug) => {
    if (!slug) return;
    setActiveGuideSlugState(slug);
    localStorage.setItem('ayosdocs_last_viewed_guide', slug);
  }, []);

  const setChatOpen = useCallback((isOpen) => {
    setIsChatOpen(isOpen);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      activeGuideSlug, 
      setActiveGuideSlug,
      isChatOpen,
      setChatOpen
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

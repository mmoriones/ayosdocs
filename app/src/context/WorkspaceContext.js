'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WorkspaceContext = createContext();

/**
 * WorkspaceProvider
 * Manages global application state related to the user's active workflow and context.
 */
export function WorkspaceProvider({ children }) {
  const [activeGuideSlug, setActiveGuideSlugState] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastGuideSlug');
    if (saved) {
      setTimeout(() => {
        setActiveGuideSlugState(saved);
      }, 0);
    }
  }, []);

  const setActiveGuideSlug = useCallback((slug) => {
    if (!slug) return;
    setActiveGuideSlugState(slug);
    localStorage.setItem('lastGuideSlug', slug);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      activeGuideSlug, 
      setActiveGuideSlug 
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

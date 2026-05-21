'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Fetch search items on mount
  useEffect(() => {
    const fetchSearchItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/search');
        setSearchItems(response.data);
      } catch (error) {
        console.error('Failed to fetch search items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchItems();
  }, []);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch, closeSearch]);

  return (
    <SearchContext.Provider value={{ 
      isOpen, 
      toggleSearch, 
      closeSearch, 
      searchItems,
      isLoading 
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

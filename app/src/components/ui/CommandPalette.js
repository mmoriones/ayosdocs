'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { Search, X, BookOpen, Layers, ArrowRight, Loader2 } from 'lucide-react';

/**
 * Global command palette for searching guides and bundles.
 */
export default function CommandPalette() {
  const { isOpen, closeSearch, searchItems, isLoading } = useSearch();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);

  // Focus input on open
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
    if (!query) return searchItems.slice(0, 5); // Show first 5 as suggestions
    return searchItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query, searchItems]);

  const handleSelect = (item) => {
    router.push(item.href);
    closeSearch();
  };

  const handleKeyDown = (e) => {
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ctp-crust/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={closeSearch}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-ctp-base border border-ctp-surface1 rounded-2xl shadow-2xl shadow-ctp-crust/50 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        <div className="flex items-center px-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
          <Search className="text-ctp-subtext1" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search guides, bundles, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              <div className="px-3 py-2 text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
                {query ? 'Search Results' : 'Suggested for you'}
              </div>
              {filteredItems.map((item, index) => {
                const Icon = item.type === 'guide' ? BookOpen : Layers;
                const isSelected = index === selectedIndex;
                
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
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-widest font-bold ${
                          isSelected ? 'border-white/30 bg-white/10' : 'border-ctp-surface1 bg-ctp-crust text-ctp-subtext1'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className={`text-xs truncate opacity-70 mt-0.5`}>
                        {item.description}
                      </p>
                    </div>
                    {isSelected && <ArrowRight size={16} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-sm text-ctp-subtext1">No results found for &quot;<span className="font-bold text-ctp-text">{query}</span>&quot;</p>
              <p className="text-xs text-ctp-subtext0 mt-1">Try searching for common documents like &quot;Passport&quot; or &quot;TIN&quot;.</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-ctp-mantle/50 border-t border-ctp-surface1 flex items-center justify-between text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-[9px]">ENTER</kbd>
              to select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-[9px]">↑↓</kbd>
              to navigate
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-base text-[9px]">ESC</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, X } from 'lucide-react';
import Input from './Input';
import { GuideIcon } from '@/lib/guideIcons';

const MAX_QUERY_LENGTH = 100;

const SearchBar = ({ placeholder = "What do you need to get done today?", className = "", allGuides = [] }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  const sanitize = (val) => val.replace(/[<>]/g, '').slice(0, MAX_QUERY_LENGTH);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allGuides.filter(guide =>
      guide.title.toLowerCase().includes(q) ||
      guide.shortTitle?.toLowerCase().includes(q) ||
      guide.description?.toLowerCase().includes(q) ||
      guide.agency?.toLowerCase().includes(q) ||
      guide.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, allGuides]);

  useEffect(() => {
    if (!isFocused) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isFocused]);

  const showResults = isFocused && query.trim();
  const isOverLimit = query.length >= MAX_QUERY_LENGTH;

  return (
    <section className={`px-6 mb-8 ${className}`}>
      <div ref={containerRef} className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(sanitize(e.target.value))}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          leftIcon={Search}
          rightContent={query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                containerRef.current?.querySelector('input')?.focus();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-90 transition-all"
            >
              <X size={14} strokeWidth={3} />
            </button>
          ) : null}
          maxLength={MAX_QUERY_LENGTH}
          className="h-16 shadow-[0_8px_32px_rgba(0,56,168,0.04)]"
        />

        {isOverLimit && isFocused && (
          <p className="text-[10px] font-bold text-[#FF3B30] mt-1.5 ml-1 animate-in fade-in duration-200">
            Maximum {MAX_QUERY_LENGTH} characters
          </p>
        )}

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/40 shadow-lg overflow-hidden">
              {results.length > 0 ? (
                <div className="py-2 max-h-[400px] overflow-y-auto">
                  {results.map((guide) => (
                    <button
                      key={guide.slug}
                      onClick={() => {
                        router.push(`/guides/${guide.slug}`);
                        setIsFocused(false);
                      }}
                      className="w-full flex items-center gap-4 px-5 py-3.5 text-left active:scale-[0.98] transition-transform hover:bg-black/[0.02]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-white/50 flex items-center justify-center shrink-0">
                        <GuideIcon slug={guide.slug} agency={guide.agency} size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[14px] font-bold text-[#1C1C1E] leading-tight truncate">
                          {guide.shortTitle || guide.title}
                        </h5>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5 truncate">
                          {guide.agency}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 shrink-0" strokeWidth={3} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <Search size={20} />
                  </div>
                  <h5 className="text-[14px] font-bold text-[#1C1C1E]">No results found</h5>
                  <p className="text-[12px] font-medium text-gray-400 mt-1 max-w-[200px]">
                    Try a different search term.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchBar;

'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchGuides } from '@/lib/searchGuides';
import { GuideIcon } from "@/lib/guideIcons";

/**
 * Search input component for finding government guides.
 */
const SearchBar = ({ guides }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setResults(searchGuides(query, guides));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, guides]);

  const handleSelect = (slug) => {
    setResults([]);
    setQuery("");
    router.push(`/guides/${slug}`);
  };

  const handleSearchAction = () => {
    if (results[0]) {
      handleSelect(results[0].slug);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="w-full max-w-3xl relative">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 text-ctp-subtext0"
        />

        <input
          type="text"
          maxLength={100}
          placeholder="Search (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
          className="w-full pl-11 pr-11 sm:pr-32 py-3.5 rounded-xl border border-ctp-surface1 
          bg-ctp-base text-base text-ctp-text placeholder:text-ctp-subtext1
          focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800
          shadow-sm
          transition-all duration-200"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 sm:right-32 text-ctp-subtext0 hover:text-ctp-text transition-colors"
          >
            <X size={16} />
          </button>
        )}

        <button
          onClick={handleSearchAction}
          className="absolute right-1.5 hidden sm:flex bg-ctp-sky-800 hover:bg-ctp-sky-800/90 
          text-ctp-base px-5 py-2 rounded-lg transition-all duration-200 
          shadow-sm items-center gap-2 active:scale-95"
        >
          <Search size={16} />
          <span className="font-semibold text-sm">Search</span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-ctp-base border border-ctp-surface1 
        rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((guide, index) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className={`px-4 py-3 cursor-pointer transition flex items-center gap-3
              ${index === 0 ? "bg-ctp-mantle" : ""}
              hover:bg-ctp-mantle active:bg-ctp-surface0`}
            >
              <div className="w-8 h-8 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                <GuideIcon 
                  slug={guide.slug} 
                  agency={guide.agency} 
                  className="w-5 h-5 text-ctp-sky-800"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ctp-text leading-tight">
                  {guide.title}
                </p>
                <p className="text-[11px] text-ctp-subtext0 mt-0.5 font-medium uppercase tracking-wider">
                  Step-by-step guide
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

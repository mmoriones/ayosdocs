'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchGuides } from '@/lib/searchGuides';
import { getGuideIcon } from "@/lib/guideIcons";
import Image from "next/image";

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
          className="absolute left-4 sm:left-6 text-ctp-subtext0"
        />

        <input
          type="text"
          maxLength={100}
          placeholder="Search (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
          className="w-full pl-11 sm:pl-14 pr-11 sm:pr-36 py-4 sm:py-5 rounded-full border border-ctp-surface0 
          bg-ctp-base text-[18px] text-ctp-text placeholder:text-ctp-subtext1
          focus:outline-none focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800
          shadow-xl
          transition-all duration-200"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 sm:right-36 text-ctp-subtext0 hover:text-ctp-text transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <button
          onClick={handleSearchAction}
          className="absolute right-2 hidden sm:flex bg-ctp-sky-800 hover:opacity-90 
          text-ctp-base px-5 sm:px-7 py-3 rounded-full transition-all duration-200 
          shadow-md hover:shadow-lg items-center gap-2 active:scale-95"
        >
          <Search size={18} strokeWidth={2.5} />
          <span className="font-bold text-[18px]">Search</span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-ctp-base border border-ctp-surface0 
        rounded-2xl shadow-xl z-50 overflow-hidden ring-1 ring-black/5">
          {results.map((guide, index) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className={`px-5 py-4 cursor-pointer transition flex items-center gap-4
              ${index === 0 ? "bg-ctp-mantle/50" : ""}
              hover:bg-ctp-mantle active:bg-ctp-surface1`}
            >
              <div className="w-10 h-10 rounded-xl bg-ctp-mantle border border-ctp-surface0 flex items-center justify-center p-2 shrink-0 shadow-sm">
                <Image 
                  src={getGuideIcon(guide.slug, guide.agency)} 
                  alt={guide.title} 
                  width={24}
                  height={24}
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-black text-ctp-text leading-tight uppercase tracking-tight">
                  {guide.title}
                </p>
                <p className="text-[14px] text-ctp-subtext1 mt-0.5 font-bold uppercase tracking-widest opacity-60">
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

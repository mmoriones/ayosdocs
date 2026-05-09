import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchGuides } from '../../../../utils/searchGuides'
import { getGuideIcon } from "../../../../utils/guideIcons";

/**
 * Search input component for finding government guides.
 * Implements debouncing and a minimum character threshold to optimize performance.
 * 
 * @returns {JSX.Element} The rendered SearchBar component.
 */
const SearchBar = () => {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  // Execution of search logic happens within an effect that watches the query state.
  useEffect(() => {
    // Implementation of a debounce timer (300ms).
    // Delaying the search prevents excessive utility calls while the user is still typing.
    const timeout = setTimeout(() => {
      // Threshold check: queries shorter than 2 characters are ignored to reduce noise.
      if (query.length < 2) {
        setResults([]);
        return;
      }
      // Results are fetched from the local guidesMap utility.
      setResults(searchGuides(query));
    }, 300);

    // Cleanup clears the timeout if the query changes again before 300ms have passed.
    return () => clearTimeout(timeout);
  }, [query]);


  /**
   * Handles selection of a search result.
   * Clears state and navigates to the guide's dedicated page.
   * 
   * @param {string} slug - The unique identifier of the selected guide.
   */
  const handleSelect = (slug) => {
    setResults([]);
    setQuery("");
    navigate(`/guides/${slug}`);
  };

  /**
   * Triggers navigation to the first search result, if any.
   * This is used by both the search button and the Enter key.
   */
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
      
      {/* INPUT WRAPPER */}
      <div className="relative flex items-center">

        {/* LEFT ICON */}
        <Search
          size={18}
          className="absolute left-4 sm:left-6 text-slate-400"
        />

        {/* INPUT */}
        <input
          type="text"
          placeholder="Search (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
          className="w-full pl-11 sm:pl-14 pr-11 sm:pr-36 py-3.5 sm:py-5 rounded-full border border-slate-200 
          bg-white text-base text-slate-800 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500
          shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08),0_8px_15px_-5px_rgba(0,0,0,0.05)]
          transition-all duration-200"
        />

        {/* CLEAR BUTTON */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 sm:right-36 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearchAction}
          className="absolute right-2 hidden sm:flex bg-[#0D9488] hover:bg-[#0F766E] 
          text-white px-5 sm:px-7 py-3 rounded-full transition-all duration-200 
          shadow-md hover:shadow-lg items-center gap-2 active:scale-95"
        >
          <Search size={18} strokeWidth={2.5} />
          <span className="font-bold text-[15px]">Search</span>
        </button>
      </div>

      {/* RESULTS DROPDOWN */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-slate-100 
        rounded-2xl shadow-xl z-50 overflow-hidden ring-1 ring-black/5">

          {results.map((guide, index) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className={`px-5 py-3.5 cursor-pointer transition flex items-center gap-3.5
              ${index === 0 ? "bg-slate-50/50" : ""}
              hover:bg-slate-50 active:bg-slate-100`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shrink-0 shadow-sm">
                <img 
                  src={getGuideIcon(guide.slug)} 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex-1">
                <p className="text-[14.5px] font-semibold text-slate-800 leading-tight">
                  {guide.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  View step-by-step guide
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

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
          className="absolute left-4 sm:left-6 text-ctp-subtext0"
        />

        {/* INPUT */}
        <input
          type="text"
          placeholder="Search (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
          className="w-full pl-11 sm:pl-14 pr-11 sm:pr-36 py-4 sm:py-5 rounded-full border border-ctp-surface0 
          bg-ctp-base text-[18px] text-ctp-text placeholder:text-ctp-subtext1
          focus:outline-none focus:ring-4 focus:ring-ctp-sapphire/10 focus:border-ctp-sapphire
          shadow-xl
          transition-all duration-200"
        />

        {/* CLEAR BUTTON */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 sm:right-36 text-ctp-subtext0 hover:text-ctp-text transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearchAction}
          className="absolute right-2 hidden sm:flex bg-ctp-sapphire hover:bg-ctp-blue 
          text-ctp-base px-5 sm:px-7 py-3 rounded-full transition-all duration-200 
          shadow-md hover:shadow-lg items-center gap-2 active:scale-95"
        >
          <Search size={18} strokeWidth={2.5} />
          <span className="font-bold text-[18px]">Search</span>
        </button>
      </div>

      {/* RESULTS DROPDOWN */}
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
                <img 
                  src={getGuideIcon(guide.slug)} 
                  alt="" 
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchGuides } from '../../../../utils/searchGuides'

const SearchBar = () => {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

    useEffect(() => {
      const debouncedSearch = debounce((q) => {
        if (q.length < 2) {
          setResults([]);
          return;
        }

        setResults(searchGuides(q));
      }, 300);

      debouncedSearch(query);
    }, [query]);



  const handleSelect = (slug) => {
    setResults([]);
    setQuery("");
    navigate(`/guides/${slug}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="w-full max-w-2xl relative">
      
      {/* INPUT WRAPPER */}
      <div className="relative flex items-center">

        {/* LEFT ICON */}
        <Search
          size={18}
          className="absolute left-4 text-gray-400"
        />

        {/* INPUT */}
        <input
          type="text"
          placeholder="Search for a document or process (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-20 py-4 rounded-xl border border-gray-200 
          bg-white text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          shadow-sm"
        />

        {/* CLEAR BUTTON */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-14 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}

        {/* SEARCH BUTTON */}
        <button
          onClick={() => results[0] && handleSelect(results[0].slug)}
          className="absolute right-2 bg-teal-600 hover:bg-teal-700 
          text-white p-2.5 rounded-lg transition shadow-sm"
        >
          <Search size={16} />
        </button>
      </div>

      {/* RESULTS DROPDOWN */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-100 
        rounded-xl shadow-lg z-50 overflow-hidden">

          {results.map((guide, index) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className={`px-4 py-3 cursor-pointer transition text-sm
              ${index === 0 ? "bg-gray-50" : ""}
              hover:bg-gray-100`}
            >
              <p className="font-medium text-gray-800">
                {guide.title}
              </p>
              <p className="text-xs text-gray-500">
                View guide
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default SearchBar;

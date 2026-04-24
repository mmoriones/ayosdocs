import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/api/guides/search?q=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
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
    <div className="w-full max-w-2xl transition-colors duration-300 relative">
      <h2 className="text-xl font-bold mb-3 uppercase tracking-tight text-gray-800">
        Find Your Guide:
      </h2>

      {/* INPUT */}
      <div className="relative">

        {/* Search Icon */}
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search for document or process... (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pl-11 pr-10 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm italic transition-colors
          bg-white border-teal-600 text-gray-800"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((guide) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-800"
            >
              {guide.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

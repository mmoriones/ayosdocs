import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";

const SearchBar = () => {
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
          `http://localhost:5000/api/guides/search?q=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = () => {
    if (!query) return;
    navigate(`/search?q=${query}`);
  };

  const handleSelect = (slug) => {
    setResults([]);
    setQuery("");
    navigate(`/guides/${slug}`);
  };

  return (
    <div className="w-full max-w-2xl transition-colors duration-300 relative">
      <h2 className="text-xl font-bold mb-3 uppercase tracking-tight text-gray-800 dark:text-gray-100">
        Find Your Guide:
      </h2>

      <div className="relative flex items-center gap-2">
        <input
          type="text"
          placeholder="SEARCH FOR DOCUMENT OR PROCESS... (e.g., NBI Clearance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pr-12 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm italic transition-colors
          bg-white border-teal-600 text-gray-800
          dark:bg-[#1a1c1e] dark:border-teal-700 dark:text-gray-200 dark:placeholder-gray-500"
        />

        <button
          onClick={handleSearch}
          className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <Search size={18} />
          SEARCH
        </button>
      </div>

      {/* SEARCH RESULTS */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white dark:bg-[#1a1c1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {results.map((guide) => (
            <div
              key={guide.slug}
              onClick={() => handleSelect(guide.slug)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-800 dark:text-gray-200"
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

import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="w-full max-w-2xl transition-colors duration-300">
      <h2 className="text-xl font-bold mb-3 uppercase tracking-tight text-gray-800 dark:text-gray-100">
        Find Your Guide:
      </h2>
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          placeholder="SEARCH FOR DOCUMENT OR PROCESS... (e.g., NBI Clearance,"
          className="w-full p-4 pr-12 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm italic transition-colors
            bg-white border-teal-600 text-gray-800
            dark:bg-[#1a1c1e] dark:border-teal-700 dark:text-gray-200 dark:placeholder-gray-500"
        />
        <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-lg font-bold transition-colors">
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
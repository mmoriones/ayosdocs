import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { guidesMap } from '../utils/loadGuides';
import { getGuideIcon } from '../utils/guideIcons';

const AllGuides = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    document.title = "All Guides | AyosDocs";
  }, []);

  // Convert guidesMap to array and sort by title
  const allGuides = Object.values(guidesMap).sort((a, b) => a.title.localeCompare(b.title));

  // Filter based on search
  const filteredGuides = allGuides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guide.description && guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGuides = filteredGuides.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HERO / HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            All <span className="text-teal-600">Guides</span>
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Browse our complete collection of step-by-step guides for government documents, 
            registrations, and essential processes.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 max-w-md relative">
            <div className="relative flex items-center">

              {/* LEFT ICON */}
              <Search
                size={18}
                className="absolute left-4 text-gray-400"
              />

              {/* INPUT */}
              <input
                type="text"
                placeholder="Search for a guide..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 
                  bg-white text-base text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  shadow-sm"
              />
            </div>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        
        {currentGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {currentGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/guides/${guide.slug}`}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm 
                  hover:shadow-md hover:border-teal-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-teal-50 transition">
                    <img 
                      src={getGuideIcon(guide.slug)} 
                      alt="" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {guide.description || "Step-by-step requirements and procedures."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  View Guide
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500">No guides found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-teal-600 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-teal-600 
                disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    currentPage === i + 1
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                      : "text-gray-600 hover:bg-white hover:text-teal-600 border border-transparent hover:border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-teal-600 
                disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AllGuides;

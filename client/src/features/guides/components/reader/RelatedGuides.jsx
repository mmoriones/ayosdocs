import { Link } from "react-router-dom";
import { guidesMap } from "../../../../utils/loadGuides";
import { getGuideIcon } from "../../../../utils/guideIcons";

const RelatedGuides = ({ currentSlug, category }) => {
  const guides = Object.values(guidesMap);

    const related = guides
    .filter(g => g.slug !== currentSlug)
    .filter(g => g.category === category || !category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Related Guides
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(g => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
          >
            <div className="w-10 h-10 shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center group-hover:bg-white transition-colors">
              <img 
                src={getGuideIcon(g.slug)} 
                alt="" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-teal-600 text-sm font-medium group-hover:text-teal-700 line-clamp-2">
              {g.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedGuides;
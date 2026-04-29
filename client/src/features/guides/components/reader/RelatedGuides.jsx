import { Link } from "react-router-dom";
import { guidesMap } from "../../../../utils/loadGuides";

const RelatedGuides = ({ currentSlug, category }) => {
  const guides = Object.values(guidesMap);

    const related = guides
    .filter(g => g.slug !== currentSlug)
    .filter(g => g.category === category || !category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Related Guides
      </h3>

      <ul className="space-y-2">
        {related.map(g => (
          <li key={g.slug}>
            <Link
              to={`/guides/${g.slug}`}
              className="text-teal-600 text-sm hover:underline"
            >
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedGuides;
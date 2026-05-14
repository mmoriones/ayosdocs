import { Link } from "react-router-dom";
import { guidesMap } from "../../../../utils/loadGuides";
import { getGuideIcon } from "../../../../utils/guideIcons";

/**
 * Component for displaying a list of guides related to the current one.
 * Filtering is based on the category of the current guide.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.currentSlug - The slug of the guide currently being viewed.
 * @param {string} props.category - The category of the current guide for finding related matches.
 * @returns {JSX.Element|null} The rendered RelatedGuides component or null.
 */
const RelatedGuides = ({ currentSlug, category }) => {
  const guides = Object.values(guidesMap);

  // Discovery of related guides by matching categories while excluding the current guide.
  // Limiting the output to 4 items maintains a clean layout.
  const related = guides
    .filter(g => g.slug !== currentSlug)
    .filter(g => g.category === category || !category)
    .slice(0, 4);

  // If no related guides are found, the component renders nothing to avoid empty space.
  if (related.length === 0) return null;

  return (
    <div className="bg-ctp-mantle border border-ctp-surface0 rounded-[2rem] p-8 shadow-sm">
      <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-6">
        Recommended for you
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(g => (
          <Link
            key={g.slug}
            to={`/guides/${g.slug}`}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ctp-base transition-all border border-transparent hover:border-ctp-surface0 group shadow-sm"
          >
            <div className="w-12 h-12 shrink-0 bg-ctp-base rounded-xl p-2.5 flex items-center justify-center group-hover:bg-ctp-mantle transition-colors border border-ctp-surface0/50">
              <img 
                src={getGuideIcon(g.slug, g.agency)} 
                alt="" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-ctp-text text-sm font-bold group-hover:text-ctp-sapphire line-clamp-2 uppercase tracking-tight">
              {g.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedGuides;
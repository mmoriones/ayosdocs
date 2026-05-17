import Link from "next/link";
import { getGuideIcon } from "@/lib/guideIcons";
import Image from "next/image";

/**
 * Component for displaying a list of guides related to the current one.
 */
const RelatedGuides = ({ currentSlug, category, allGuides }) => {
  const related = allGuides
    .filter(g => g.slug !== currentSlug)
    .filter(g => g.category === category || !category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 shadow-sm">
      <h3 className="text-xs font-bold text-ctp-subtext1 uppercase tracking-wider mb-5">
        You might also need
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(g => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-ctp-base transition-all border border-transparent hover:border-ctp-surface1 group shadow-sm"
          >
            <div className="w-10 h-10 shrink-0 bg-ctp-base rounded-lg p-2 flex items-center justify-center group-hover:bg-ctp-mantle transition-colors border border-ctp-surface1">
              <Image 
                src={getGuideIcon(g.slug, g.agency)} 
                alt={g.title}
                width={32}
                height={32}
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-ctp-text text-sm font-semibold group-hover:text-ctp-sky-800 line-clamp-2 tracking-tight">
              {g.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedGuides;

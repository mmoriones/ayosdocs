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
    <div className="bg-ctp-mantle border border-ctp-surface0 rounded-[2rem] p-8 shadow-sm">
      <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-6">
        Recommended for you
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(g => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-ctp-base transition-all border border-transparent hover:border-ctp-surface0 group shadow-sm"
          >
            <div className="w-12 h-12 shrink-0 bg-ctp-base rounded-xl p-2.5 flex items-center justify-center group-hover:bg-ctp-mantle transition-colors border border-ctp-surface0/50">
              <Image 
                src={getGuideIcon(g.slug, g.agency)} 
                alt={g.title}
                width={32}
                height={32}
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-ctp-text text-sm font-bold group-hover:text-ctp-sky-800 line-clamp-2 uppercase tracking-tight">
              {g.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedGuides;

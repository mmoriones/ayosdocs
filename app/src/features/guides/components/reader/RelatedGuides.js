import Link from "next/link";
import { GuideIcon } from "@/lib/guideIcons";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {related.map(g => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-ctp-base border border-ctp-surface1 hover:border-ctp-sky-800/30 hover:bg-ctp-mantle/50 transition-all group shadow-sm"
        >
          <div className="w-10 h-10 shrink-0 bg-ctp-mantle rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform border border-ctp-surface1">
            <GuideIcon 
              slug={g.slug} 
              agency={g.agency} 
              className="w-5 h-5 text-ctp-sky-800"
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <span className="text-ctp-text text-sm font-bold group-hover:text-ctp-sky-800 transition-colors line-clamp-1 tracking-tight">
              {g.title}
            </span>
            <p className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest truncate">
              {g.agency}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedGuides;

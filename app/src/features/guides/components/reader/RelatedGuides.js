import { useMemo } from "react";
import Link from "next/link";
import { GuideIcon } from "@/lib/guideIcons";

/**
 * Component for displaying a list of guides related to the current one.
 */
const RelatedGuides = ({ currentSlug, category, allGuides, relatedGuideSlugs = [] }) => {
  const related = useMemo(() => {
    // 1. First, get guides explicitly mentioned in the relatedGuideSlugs array
    const explicitRelated = (relatedGuideSlugs || [])
      .map(slug => allGuides.find(g => g.slug === slug))
      .filter(Boolean);

    // 2. Fill the rest (up to 4) with guides from the same category
    const categoryRelated = allGuides
      .filter(g => (g.category === category || !category) && g.slug !== currentSlug && !(relatedGuideSlugs || []).includes(g.slug))
      .slice(0, 4 - explicitRelated.length);

    return [...explicitRelated, ...categoryRelated].slice(0, 4);
  }, [currentSlug, category, allGuides, relatedGuideSlugs]);

  if (related.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {related.map(g => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="hover-lift active:scale-[0.98] flex items-center gap-4 p-5 rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 hover:border-[#0038A8]/20 group shadow-sm transition-all"
        >
          <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/50 shadow-sm">
            <GuideIcon 
              slug={g.slug} 
              agency={g.agency} 
              size={28}
            />
          </div>
          <div className="min-w-0">
            <span className="text-[#1C1C1E] text-[15px] font-black group-hover:text-[#0038A8] transition-colors line-clamp-1 tracking-tight">
              {g.shortTitle || g.title}
            </span>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate mt-0.5">
              {g.agency}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedGuides;

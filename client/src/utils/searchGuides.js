import { guidesMap } from "./loadGuides";

export const searchGuides = (query) => {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();

  return Object.values(guidesMap)
    .filter((guide) => {
      return (
        guide.title?.toLowerCase().includes(q) ||
        guide.slug?.toLowerCase().includes(q) ||
        guide.category?.toLowerCase().includes(q)
      );
    })
    .slice(0, 5) // limit results
    .map((g) => ({
      title: g.title,
      slug: g.slug,
      category: g.category,
    }));
};

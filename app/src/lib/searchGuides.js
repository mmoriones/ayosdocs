/**
 * Searches for guides based on a query string.
 */
export const searchGuides = (query, guides) => {
  if (!query || query.length < 2 || !guides) return [];

  const q = query.toLowerCase();

  return guides
    .filter((guide) => {
      return (
        guide.title?.toLowerCase().includes(q) ||
        guide.slug?.toLowerCase().includes(q) ||
        guide.category?.toLowerCase().includes(q) ||
        guide.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        guide.aliases?.some(alias => alias.toLowerCase().includes(q))
      );
    })
    .slice(0, 5) // limit results
    .map((g) => ({
      title: g.title,
      slug: g.slug,
      category: g.category,
      agency: g.agency,
    }));
};

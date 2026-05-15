import { getGuideSlugs } from "@/lib/guides";

export default async function sitemap() {
  const slugs = getGuideSlugs();
  const baseUrl = "https://ayosdocs.com";

  const guideUrls = slugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages = [
    "",
    "/guides",
    "/offices",
    "/about",
    "/faqs",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.5,
  }));

  return [...staticPages, ...guideUrls];
}

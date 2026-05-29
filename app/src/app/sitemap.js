import { getGuideSlugs } from "@/lib/guides";
import { bundles } from "@/data/bundles";

export default async function sitemap() {
  const guideSlugs = getGuideSlugs();
  const baseUrl = "https://ayosdocs.com";

  const guideUrls = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const bundleUrls = bundles.map((bundle) => ({
    url: `${baseUrl}/bundles/${bundle.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages = [
    "",
    "/guides",
    "/bundles",
    "/updates",
    "/about",
    "/faqs",
    "/support",
    "/privacy",
    "/terms",
    "/coming-soon",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.5,
  }));

  return [...staticPages, ...guideUrls, ...bundleUrls];
}

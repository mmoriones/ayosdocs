export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-docs/", "/onboarding/"],
    },
    sitemap: "https://ayosdocs.com/sitemap.xml",
  };
}

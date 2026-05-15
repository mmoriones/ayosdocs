export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-progress/", "/onboarding/"],
    },
    sitemap: "https://ayosdocs.com/sitemap.xml",
  };
}

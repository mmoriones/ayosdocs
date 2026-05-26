export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api",
        "/my-docs",
        "/onboarding",
        "/admin",
        "/auth",
        "/profile",
        "/settings",
        "/verified",
        "/login",
      ],
    },
    sitemap: "https://ayosdocs.com/sitemap.xml",
  };
}

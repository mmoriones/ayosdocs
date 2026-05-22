export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/my-docs/",
        "/onboarding/",
        "/admin/",
        "/auth/",
        "/profile/",
        "/settings/",
        "/verified/",
        "/reset-password/",
      ],
    },
    sitemap: "https://ayosdocs.com/sitemap.xml",
  };
}

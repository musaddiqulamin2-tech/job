export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/draft"],
    },
    sitemap: `${process.env.SITE_URL || "https://jobcareercanvas.in"}/sitemap.xml`,
  };
}
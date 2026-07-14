// Next.js robots.txt — auto-generates /robots.txt
// Allows all crawlers, points them to the sitemap, and blocks API/auth routes.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/signin", "/signup"],
      },
    ],
    sitemap: "https://www.tarotbyte.app/sitemap.xml",
  };
}

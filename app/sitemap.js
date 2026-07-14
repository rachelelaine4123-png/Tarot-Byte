import { SPREADS } from "@/lib/readingEngine";

// Next.js sitemap — auto-generates /sitemap.xml
// Lists all public routes + the 3 spreads for search engine discovery.
export default function sitemap() {
  const base = "https://www.tarotbyte.app";
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/readings`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/oracle`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/guide`, priority: 0.75, changeFrequency: "monthly" },
    { url: `${base}/subscribe`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/signup`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/signin`, priority: 0.4, changeFrequency: "monthly" },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
  ];

  const spreadRoutes = Object.values(SPREADS).map((s) => ({
    url: `${base}/readings/${s.id}`,
    priority: s.tier === "free" ? 0.85 : 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...spreadRoutes].map((r) => ({
    ...r,
    lastModified: now,
  }));
}

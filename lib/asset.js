// Prefix static/public asset URLs with the deployment base path.
// next.config sets NEXT_PUBLIC_BASE_PATH so client + server agree.
// For <Link> hrefs Next.js handles basePath automatically; this helper is
// ONLY for raw <img src> and other public asset references.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** @type {import('next').NextConfig} */
// When served from a subpath (e.g. the .pages.dev-style deploy), assets must be
// prefixed. We use a relative asset prefix so /_next and /public assets resolve
// against the current directory instead of the domain root.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: BASE,
  assetPrefix: BASE || undefined,
};

export default nextConfig;

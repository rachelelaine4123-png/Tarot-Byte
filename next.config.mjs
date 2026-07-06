/** @type {import('next').NextConfig} */
// Vercel-native config. We no longer use static export (`output: "export"`)
// because Supabase auth, Stripe payments, and AI narration require server-side
// API routes. Vercel runs Next.js natively, so images, API routes, and SSR all
// work out of the box — no basePath/assetPrefix hacks needed on a root domain.
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

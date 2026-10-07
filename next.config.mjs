/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // /portfolio is a standalone 3D archive page (public/archive/index.html).
  // Its content lives in public/archive/manifest.json.
  async rewrites() {
    return [{ source: "/portfolio", destination: "/archive/index.html" }];
  },
};

export default nextConfig;

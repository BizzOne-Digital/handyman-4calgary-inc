import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
    // Stored MongoDB uploads under /api/uploads/** are rendered with `unoptimized`
    // (see components/ui/SafeImage.tsx), so they are served directly with immutable caching.
  },
  // Service pages before the October 2026 restructure.
  async redirects() {
    return [
      { source: "/residential/basement-development", destination: "/residential/renovations", permanent: true },
      { source: "/residential/kitchen-bathroom-renovations", destination: "/residential/renovations", permanent: true },
      { source: "/residential/home-improvements-maintenance", destination: "/residential/flooring-painting-carpentry", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;

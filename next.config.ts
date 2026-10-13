import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Import only the icons/animation helpers actually used instead of whole packages.
    optimizePackageImports: ["lucide-react", "framer-motion", "swiper"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demo2.themelexus.com",
        pathname: "/bocpak/wp-content/uploads/**",
      },
    ],
  },
  // Short, easy-to-remember admin address: /admin, /Admin, /ADMIN, /admin/quotes ... all open the panel.
  // (Redirect sources are matched case-insensitively.)
  async redirects() {
    return [
      { source: "/admin/:path*", destination: "/adminpanel/:path*", permanent: false },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demo2.themelexus.com",
        pathname: "/bocpak/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;

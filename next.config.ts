import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn-icons-png.freepik.com",
        protocol: "https",
      },
      {
        hostname: "static.vecteezy.com",
        protocol: "https",
      },
      
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "hungryinthailand.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

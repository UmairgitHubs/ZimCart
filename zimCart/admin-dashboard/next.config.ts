import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  experimental: {
    optimizePackageImports: ["@reduxjs/toolkit", "react-redux", "lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  typescript: {
  ignoreBuildErrors: true,
},
};

export default nextConfig;

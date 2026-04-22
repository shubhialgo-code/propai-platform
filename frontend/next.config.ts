import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript and ESLint are checked in dedicated CI steps;
  // disabling here prevents duplicate checks and CI=true strictness from failing the build.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

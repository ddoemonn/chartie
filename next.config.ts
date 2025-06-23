import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'components'],
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;

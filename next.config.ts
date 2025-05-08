import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce the number of pages that get pre-rendered
  output: 'standalone',
};

export default nextConfig;

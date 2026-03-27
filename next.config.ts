import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix Turbopack workspace-root detection warning (Next.js 16+)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

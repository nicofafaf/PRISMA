import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    // Weniger parallele Worker = weniger RAM (hilft bei netlify deploy --build auf Windows)
    cpus: 1,
  },
  // Fix Turbopack workspace-root detection warning (Next.js 16+)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for Vercel Monorepo deployment: Output build to root directory
  distDir: process.env.VERCEL ? "../.next" : ".next",
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;

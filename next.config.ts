import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    api_url: process.env.API_URL,
    access_key: process.env.ACCESS_KEY,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    optimizeCss: true,
    reactCompiler: false,
  },
};

export default nextConfig;

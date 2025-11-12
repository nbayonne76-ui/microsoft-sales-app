import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for AI email generator app
  turbopack: {
    // Enable Turbopack for faster builds
  },
  
  // Improve development experience
  reactStrictMode: true,
  
  // Handle hydration issues from browser extensions
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === "production"
  },
  
  // API configuration for AI endpoints
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

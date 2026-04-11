import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", 
          },
          {
            key: "X-Frame-Options",
            value: "DENY", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
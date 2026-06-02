const isDev = process.env.NODE_ENV !== 'production';
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'none'; " +
              "default-src 'self'; " +
              `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://challenges.cloudflare.com; ` +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "img-src 'self' data: https://*.googlesyndication.com https://*.google.com; " +
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://challenges.cloudflare.com; " +
              "child-src 'self'; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "connect-src 'self' https://safebrowsing.googleapis.com https://www.virustotal.com https://challenges.cloudflare.com https://cloudflareinsights.com; " +
              "upgrade-insecure-requests;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
<<<<<<< HEAD
export default nextConfig
=======

export default nextConfig;
>>>>>>> 7a0249b1bcbe42265f03cc2d0b6b6e283552b63f

const isDev = process.env.NODE_ENV !== 'production';
const nextConfig = {
  images: {
    unoptimized: false,
  },
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
              "img-src 'self' data: blob: https://*.googlesyndication.com https://*.google.com;" +
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://challenges.cloudflare.com; " +
              "child-src 'self'; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "connect-src 'self' https://pasdaoiji-bigdata.hf.space/api/youtube/analyze/youtube https://pasdaoiji-bigdata.hf.space/api/trend/trending  https://pasdaoiji-chatbot.hf.space/chat https://pasdaoiji-bigdata.hf.space/api/news/analyze/google-news https://backendconverter-production.up.railway.app https://safebrowsing.googleapis.com https://www.virustotal.com https://challenges.cloudflare.com https://cloudflareinsights.com; " +
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

export default nextConfig

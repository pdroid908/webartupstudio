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
             " form-action 'self';"+
             "frame-ancestors 'none'; "+
              "default-src 'self'; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "img-src 'self' data: https://*.googlesyndication.com https://*.google.com; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "connect-src 'self' https://safebrowsing.googleapis.com https://www.virustotal.com; " +
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
            value: "strict-origin-when-cross-origin", // Mencegah kebocoran URL asal saat pindah situs
          },
        ],
      },
    ];
  },
};

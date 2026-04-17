const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              // Menambahkan 'unsafe-eval' hanya jika dibutuhkan Next.js dev, jika tidak, hapus saja.
              "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https://i.ytimg.com https://s.ytimg.com; " + // Tambah domain gambar YT
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; " +
              "child-src 'self' https://www.youtube.com; " +
              "font-src 'self' data:; " + // Mengizinkan font lokal/inline
              "connect-src 'self' https://safebrowsing.googleapis.com https://www.virustotal.com; " +
              "upgrade-insecure-requests;", // Memaksa semua koneksi ke HTTPS
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
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

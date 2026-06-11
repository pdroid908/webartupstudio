import type { Metadata } from "next";
import Scanner from "./Scanner";

export const metadata: Metadata = {
  title: "Website Security Scanner Online Gratis | artup Studio",

  description:
    "Scanner keamanan website online gratis untuk mendeteksi phishing, malware, scam, dan website berbahaya secara cepat menggunakan multi-engine security verification.",

  keywords: [
    "website security scanner",
    "scan link phishing",
    "cek website aman",
    "url scanner",
    "phishing checker",
    "website malware scanner",
    "scan url online",
    "website checker",
    "security scanner online",
    "link safety checker",
    "website trust checker",
    "cek link scam",
  ],

  authors: [{ name: "artup Studio" }],

  creator: "artup Studio",

  publisher: "artup Studio",

  metadataBase: new URL("https://artup.pages.dev/"),

  alternates: {
    canonical: "https://artup.pages.dev//Security",
  },

  openGraph: {
    title: "Website Security Scanner Online",

    description:
      "Cek keamanan website dan URL secara online untuk mendeteksi phishing, malware, scam, dan ancaman keamanan lainnya.",

    url: "https://artup.pages.dev//Security",

    siteName: "artup Studio",

    locale: "id_ID",

    type: "website",

    images: [
      {
        url: "/og-security.png",
        width: 1200,
        height: 630,
        alt: "Website Security Scanner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Website Security Scanner Online",

    description:
      "Scanner keamanan URL online cepat dan aman berbasis multi-engine verification.",

    images: ["/og-security.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Page() {
  return (
    <>
      <Scanner />

      {/* SEO CONTENT */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto bg-slate-800 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white leading-tight">
            Website Security Scanner Online
          </h2>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Tool security scanner ini membantu memeriksa keamanan website, link,
            dan URL secara online untuk mendeteksi phishing, malware, scam,
            serta aktivitas mencurigakan lainnya.
          </p>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Sistem menggunakan multi-engine verification dan analisis heuristic
            untuk memberikan hasil pemeriksaan yang cepat dan akurat.
          </p>

          <p className="mb-10 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Cocok digunakan untuk memeriksa keamanan link sebelum membuka
            website, login akun, atau mengunduh file dari internet.
          </p>

          {/* FEATURES */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-5">Fitur Utama</h3>

            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Scan URL dan website online</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Deteksi phishing dan scam</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Analisis malware website</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Trust score keamanan website</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Multi-engine verification system</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Gratis dan cepat digunakan</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">FAQ</h3>

            <div className="space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Apakah scanner ini gratis?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  Ya, website security scanner ini dapat digunakan gratis untuk
                  memeriksa keamanan link dan website.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Ancaman apa saja yang bisa dideteksi?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  Sistem dapat membantu mendeteksi phishing, malware, scam, fake
                  login page, dan website mencurigakan lainnya.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Apakah data URL disimpan?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  Pemeriksaan dilakukan secara aman dan sistem tidak menyimpan
                  data sensitif pengguna secara permanen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

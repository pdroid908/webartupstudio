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

  metadataBase: new URL("https://webartupstudio.pages.dev"),

  alternates: {
    canonical: "https://webartupstudio.pages.dev/Security",
  },

  openGraph: {
    title: "Website Security Scanner Online",

    description:
      "Cek keamanan website dan URL secara online untuk mendeteksi phishing, malware, scam, dan ancaman keamanan lainnya.",

    url: "https://webartupstudio.pages.dev/Security",

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
      <section className="max-w-4xl mx-auto px-4 py-20 text-zinc-300">

        <h2 className="text-3xl font-black mb-6 text-white">
          Website Security Scanner Online
        </h2>

        <p className="mb-4 leading-relaxed">
          Tool security scanner ini membantu memeriksa keamanan website,
          link, dan URL secara online untuk mendeteksi phishing,
          malware, scam, serta aktivitas mencurigakan lainnya.
        </p>

        <p className="mb-4 leading-relaxed">
          Sistem menggunakan multi-engine verification dan analisis
          heuristic untuk memberikan hasil pemeriksaan yang cepat
          dan akurat.
        </p>

        <p className="mb-10 leading-relaxed">
          Cocok digunakan untuk memeriksa keamanan link sebelum
          membuka website, login akun, atau mengunduh file dari internet.
        </p>

        <h3 className="text-2xl font-bold text-white mb-4">
          Fitur Utama
        </h3>

        <ul className="list-disc pl-6 space-y-3 mb-10">
          <li>Scan URL dan website online</li>
          <li>Deteksi phishing dan scam</li>
          <li>Analisis malware website</li>
          <li>Trust score keamanan website</li>
          <li>Multi-engine verification system</li>
          <li>Gratis dan cepat digunakan</li>
        </ul>

        <h3 className="text-2xl font-bold text-white mb-4">
          FAQ
        </h3>

        <div className="space-y-6">

          <div>
            <h4 className="font-bold text-white mb-2">
              Apakah scanner ini gratis?
            </h4>

            <p>
              Ya, website security scanner ini dapat digunakan gratis
              untuk memeriksa keamanan link dan website.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">
              Ancaman apa saja yang bisa dideteksi?
            </h4>

            <p>
              Sistem dapat membantu mendeteksi phishing, malware,
              scam, fake login page, dan website mencurigakan lainnya.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">
              Apakah data URL disimpan?
            </h4>

            <p>
              Pemeriksaan dilakukan secara aman dan sistem tidak
              menyimpan data sensitif pengguna secara permanen.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
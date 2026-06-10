import type { Metadata } from "next";
import Humanizer from "./humaniz";

export const metadata: Metadata = {
  title: "AI Text Humanizer Online Gratis | Ubah Teks AI Jadi Natural",

  description:
    "Humanizer teks AI online gratis untuk mengubah tulisan AI menjadi lebih natural, human-like, dan sulit terdeteksi AI detector. Cepat, aman, dan tanpa login.",

  keywords: [
    "ai humanizer",
    "text humanizer",
    "paraphraser indonesia",
    "ubah teks ai jadi manusia",
    "ai text rewriter",
    "ai detector bypass",
    "rewrite text online",
    "humanize text",
    "paraphrase tool",
    "anti ai detection",
    "rewrite paragraf",
    "ubah tulisan otomatis",
  ],

  authors: [{ name: "Artup Studio" }],
  creator: "Artup Studio",
  publisher: "Artup Studio",

  metadataBase: new URL("https://artup.pages.dev/"),

  alternates: {
    canonical: "https://artup.pages.dev//humanize",
  },

  openGraph: {
    title: "AI Text Humanizer Online Gratis",
    description:
      "Ubah teks AI menjadi lebih natural, human-like, dan mudah dibaca dengan tool humanizer gratis.",
    url: "https://artup.pages.dev//humanize",
    siteName: "Artup Studio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-humanize.png",
        width: 1200,
        height: 630,
        alt: "AI Text Humanizer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Text Humanizer Gratis",
    description: "Humanizer teks AI agar lebih natural dan manusiawi.",
    images: ["/og-humanize.png"],
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
      {/* Hidden SEO H1 */}
      <h1 className="sr-only">
        AI Text Humanizer Online Gratis - Ubah Teks AI Jadi Natural
      </h1>

      {/* Main Tool */}
      <Humanizer />

      {/* SEO Content */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white leading-tight">
            Humanizer Teks AI yang Natural & Mudah Dibaca
          </h2>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Tool ini membantu mengubah teks yang dihasilkan oleh AI menjadi
            lebih natural seperti tulisan manusia asli. Cocok untuk artikel,
            tugas, blog, maupun konten SEO.
          </p>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Dengan teknik paraphrasing dan rewriting, kalimat akan dibuat lebih
            mengalir, tidak kaku, dan tetap mempertahankan makna asli dari teks.
          </p>

          <p className="mb-10 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Semua proses dilakukan secara cepat di browser tanpa menyimpan data
            pengguna sehingga tetap aman dan privat.
          </p>

          {/* Features */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-5">Fitur Utama</h3>

            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Humanize teks AI otomatis</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Mengubah gaya tulisan menjadi natural</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Paraphrase tanpa mengubah makna</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Support teks panjang dan artikel</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Privasi aman tanpa penyimpanan data</span>
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
                  Apa itu AI Humanizer?
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  AI Humanizer adalah alat untuk mengubah teks AI menjadi lebih
                  natural seperti tulisan manusia.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Apakah hasilnya berubah makna?
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  Tidak, makna asli tetap dipertahankan meskipun struktur
                  kalimat diubah.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Apakah gratis digunakan?
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  Ya, semua fitur humanizer dapat digunakan gratis tanpa login.
                  dan cek kembali hasilnya karna tidak semua tools itu 100%
                  benar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI Text Humanizer",
            applicationCategory: "TextEditor",
            operatingSystem: "All",
            url: "https://artup.pages.dev//humanizer",
            description:
              "Humanizer teks AI online gratis untuk membuat teks lebih natural dan manusiawi.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </>
  );
}

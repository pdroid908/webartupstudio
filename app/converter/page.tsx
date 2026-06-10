import type { Metadata } from "next";
import ImageConverter from "./ImageConverter";

export const metadata: Metadata = {
  title: "Convert & Resize Foto Online Gratis | Artup Studio",

  description:
    "Convert JPG, PNG, dan WebP online gratis dengan cepat dan aman. Resize dan compress foto tanpa upload ke server sehingga privasi tetap terjaga.",

  keywords: [
    "convert foto online",
    "resize foto",
    "compress image",
    "jpg to webp",
    "png converter",
    "webp converter",
    "resize image online",
    "compress jpg",
    "photo converter",
    "image optimizer",
  ],

  authors: [{ name: "Artup Studio" }],

  creator: "Artup Studio",

  publisher: "Artup Studio",

  metadataBase: new URL("https://artup.pages.dev/"),

  alternates: {
    canonical: "https://artup.pages.dev//converter",
  },

  openGraph: {
    title: "Convert & Resize Foto Online",

    description:
      "Tool convert gambar modern untuk JPG, PNG, dan WebP dengan proses cepat dan privasi aman.",

    url: "https://artup.pages.dev//converter",

    siteName: "Artup Studio",

    locale: "id_ID",

    type: "website",

    images: [
      {
        url: "/og-convert.png",
        width: 1200,
        height: 630,
        alt: "Convert Foto Online",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Convert & Resize Foto Online",

    description: "Convert JPG PNG WEBP online dengan aman dan cepat.",

    images: ["/og-convert.png"],
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
      <h1 className="sr-only">Convert & Resize Foto Online Gratis</h1>

      {/* Main Tool */}
      <ImageConverter />

      {/* SEO Content */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white leading-tight">
            Convert Foto Online Aman & Cepat
          </h2>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Tool ini memungkinkan pengguna mengubah format gambar JPG, PNG, dan
            WebP secara online langsung di browser. Semua proses dilakukan
            dengan cepat tanpa mengurangi kualitas gambar secara signifikan.
          </p>

          <p className="mb-4 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Fitur resize dan compress image membantu memperkecil ukuran file
            agar lebih ringan digunakan untuk website, upload dokumen, maupun
            media sosial.
          </p>

          <p className="mb-10 leading-relaxed text-zinc-300 text-base sm:text-lg">
            Privasi pengguna tetap aman karena file tidak disimpan permanen di
            server.
          </p>

          {/* Features */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-5">Fitur Utama</h3>

            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Convert JPG ke WebP</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Resize gambar online</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Compress image otomatis</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Support PNG, JPG, dan WebP</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Privasi aman tanpa penyimpanan file</span>
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
                  Apakah file gambar aman?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  Ya, proses convert dilakukan secara aman dan file tidak
                  disimpan permanen.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Format apa saja yang didukung?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  JPG, PNG, dan WebP untuk convert maupun resize foto.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-2">
                  Apakah gratis digunakan?
                </h4>

                <p className="text-zinc-300 leading-relaxed">
                  Ya, semua fitur convert dan resize dapat digunakan gratis.
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
            name: "Convert & Resize Foto Online",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "All",
            url: "https://artup.pages.dev//converter",
            description:
              "Convert JPG, PNG, dan WebP online gratis dengan cepat dan aman.",
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

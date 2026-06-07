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

  metadataBase: new URL("https://webartupstudio.pages.dev"),

  alternates: {
    canonical: "https://webartupstudio.pages.dev/converter",
  },

  openGraph: {
    title: "Convert & Resize Foto Online",

    description:
      "Tool convert gambar modern untuk JPG, PNG, dan WebP dengan proses cepat dan privasi aman.",

    url: "https://webartupstudio.pages.dev/converter",

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

    description:
      "Convert JPG PNG WEBP online dengan aman dan cepat.",

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
      <h1 className="sr-only">
        Convert & Resize Foto Online Gratis
      </h1>

      {/* Main Tool */}
      <ImageConverter />

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-zinc-300">
        <h2 className="text-3xl font-black mb-6 text-white">
          Convert Foto Online Aman & Cepat
        </h2>

        <p className="mb-4 leading-relaxed">
          Tool ini memungkinkan pengguna mengubah format gambar
          JPG, PNG, dan WebP secara online langsung di browser.
          Semua proses dilakukan dengan cepat tanpa mengurangi
          kualitas gambar secara signifikan.
        </p>

        <p className="mb-4 leading-relaxed">
          Fitur resize dan compress image membantu memperkecil
          ukuran file agar lebih ringan digunakan untuk website,
          upload dokumen, maupun media sosial.
        </p>

        <p className="mb-10 leading-relaxed">
          Privasi pengguna tetap aman karena file tidak disimpan
          permanen di server.
        </p>

        {/* Features */}
        <h3 className="text-2xl font-bold text-white mb-4">
          Fitur Utama
        </h3>

        <ul className="list-disc pl-6 space-y-3 mb-10">
          <li>Convert JPG ke WebP</li>
          <li>Resize gambar online</li>
          <li>Compress image otomatis</li>
          <li>Support PNG, JPG, dan WebP</li>
          <li>Privasi aman tanpa penyimpanan file</li>
          <li>Gratis dan cepat digunakan</li>
        </ul>

        {/* FAQ */}
        <h3 className="text-2xl font-bold text-white mb-4">
          FAQ
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-white mb-2">
              Apakah file gambar aman?
            </h4>

            <p>
              Ya, proses convert dilakukan secara aman dan file
              tidak disimpan permanen.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">
              Format apa saja yang didukung?
            </h4>

            <p>
              JPG, PNG, dan WebP untuk convert maupun resize foto.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">
              Apakah gratis digunakan?
            </h4>

            <p>
              Ya, semua fitur convert dan resize dapat digunakan gratis.
            </p>
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
            url: "https://webartupstudio.pages.dev/converter",
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
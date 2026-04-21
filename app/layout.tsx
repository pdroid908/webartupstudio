import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARTUP STUDIO",
  description: "HIGH TECH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* CSS untuk memaksa iklan Social Bar turun */}
        <style>{`
  #at-cv-lightbox-container, 
  .at-social-bar,
  div[id^="at-"] {
    top: 100px !important; 
    right: 20px !important;
    z-index: 999999 !important; /* Tambahkan ini agar tidak tertutup */
  }
`}</style>
      </head>
      <body className="min-h-full flex flex-col">
        {/* IKLAN SOCIAL BAR */}
        <Script
          src="https://pl29203000.profitablecpmratenetwork.com/0d/da/d5/0ddad59f7e91d22e0bb53a5ea1521176.js"
          strategy="lazyOnload" // Ubah dari afterInteractive ke lazyOnload
        />

        {/* --- 3. SKRIP PENGAMAN GLOBAL (Anti-Server Error) --- */}
        <Script id="security-layer" strategy="beforeInteractive">
          {`
            window.onerror = function(message, source, lineno, colno, error) {
              console.log("System protected a crash:", message);
              return true; // Mencegah website blank putih jika ada error skrip jahat
            };
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}

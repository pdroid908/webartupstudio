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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 overflow-x-visible">
        {/* Security Layer tetap dipertahankan untuk memantau error */}
        <Script id="security-layer" strategy="beforeInteractive">
          {`
            window.onerror = function(message) {
              console.warn("Captured Error:", message);
              return false;
            };
          `}
        </Script>

        {children}

        {/* Script Adsterra sudah dihapus dari sini. 
            Sekarang web Artup Studio sudah bersih dari iklan pop-up liar.
        */}
      </body>
    </html>
  );
}

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
        <Script id="security-layer" strategy="beforeInteractive">
          {`
            window.onerror = function(message) {
              console.warn("Captured Error:", message);
              return false;
            };
          `}
        </Script>

        {children}

        <Script
          id="adsterra-social-bar"
          src="https://pl29203000.profitablecpmratenetwork.com/0d/da/d5/0ddad59f7e91d22e0bb53a5ea1521176.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

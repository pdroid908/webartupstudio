import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  description: "HIGH TECH SECURITY SYSTEMS",
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
        {/* GOOGLE ADSENSE */}
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1112580585827937"
          crossOrigin="anonymous"
        />

        {/* BASIC SECURITY */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'none';"
        />

        {/* ANTI CLICKJACK */}
        <Script id="clickjack-protector" strategy="beforeInteractive">
          {`
            if (self !== top) {
              top.location = self.location;
            }
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col overflow-x-hidden selection:bg-blue-500/30">
        {/* SECURITY MONITOR */}
        <Script id="security-layer" strategy="beforeInteractive">
          {`
            window.onerror = function(message, source, lineno, colno, error) {
              console.warn("🛡️ Artup Security Alert:", message);
              return false;
            };

            document.addEventListener('contextmenu', function(event) {
              if (window.location.pathname.includes('/cek')) {
                // event.preventDefault();
              }
            });
          `}
        </Script>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
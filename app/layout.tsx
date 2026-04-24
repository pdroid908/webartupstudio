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
  description: "HIGH TECH SECURITY SYSTEMS",
  // 1. ANTAL-CLICKJACKING (Frame Options) via Metadata
  other: {
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "frame-ancestors 'none';",
  },
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
      <head>
        {/* 2. ANTI-CLICKJACKING (Script Guard) */}
        <Script id="clickjack-protector" strategy="beforeInteractive">
          {`
            if (self === top) {
              var antiClickjack = document.getElementById("antiClickjack");
              if (antiClickjack) antiClickjack.parentNode.removeChild(antiClickjack);
            } else {
              top.location = self.location;
            }
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col  overflow-x-hidden selection:bg-blue-500/30">
        {/* 3. SECURITY MONITORING LAYER */}
        <Script id="security-layer" strategy="beforeInteractive">
          {`
            // Monitor Error & Percobaan Injection
            window.onerror = function(message, source, lineno, colno, error) {
              console.warn("🛡️ Artup Security Alert:", message);
              return false;
            };

            // Mencegah klik kanan di area sensitif 
            document.addEventListener('contextmenu', event => {
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

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
  
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Meta Tag AdSense dihapus demi keamanan */}
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden selection:bg-blue-500/30">
        
        {/* Security Layer yang lebih bersih */}
        <Script id="security-layer" strategy="afterInteractive">
          {`
            // Monitor Error
            window.onerror = function(message) {
              console.warn("🛡️ Artup Security Alert: ", message);
            };
            
          `}
        </Script>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

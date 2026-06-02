"use client";
import { useState, useEffect } from "react";
import { SecurityResult } from "@/types";
import { Turnstile } from "@marsidev/react-turnstile";
// 1. Tambahkan fungsi ini di atas komponen SecurityPage
const GOOGLE_STATUS_MAP: Record<string, { color: string; label: string }> = {
  BAHAYA: { color: "text-red-500", label: "⚠️ BLACKLISTED" },
  "ADA CELAH": { color: "text-orange-500", label: "❓ BELUM TERVERIFIKASI" },
  DEFAULT: { color: "text-green-500", label: "✔️ VERIFIED" },
};

const VIRUS_STATUS_MAP: Record<string, { color: string; label: string }> = {
  BAHAYA: { color: "text-red-500", label: "⚠️ DETECTED" }, // Label dinamis nanti kita handle
  "TIDAK ADA DATA": { color: "text-orange-500", label: "NO RECORD" },
  DEFAULT: { color: "text-green-500", label: "✔️ NO VIRUS" },
};
export default function SecurityPage() {
  const [token, setToken] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<SecurityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const getGoogle = result
    ? GOOGLE_STATUS_MAP[result.googleStatus] || GOOGLE_STATUS_MAP.DEFAULT
    : GOOGLE_STATUS_MAP.DEFAULT;

  const getVirus = result
    ? VIRUS_STATUS_MAP[result.virusTotal] || VIRUS_STATUS_MAP.DEFAULT
    : VIRUS_STATUS_MAP.DEFAULT;
  const getTrustColor = (score: number) => {
    if (score < 50) return "bg-red-500";
    if (score < 90) return "bg-orange-500";
    return "bg-green-500";
  };
  const messages = [
    "INITIALIZING ARTUP NEURAL CORE...",
    "DECRYPTING PACKET OBFUSCATION...",
    "SCANNING DATABASE REPUTATION...",
    "EXTRACTING HEURISTIC PATTERNS...",
    "CALCULATING RISK PROBABILITY...",
    "FINALIZING SECURITY INTEGRITY...",
  ];
  const [statusIndex, setStatusIndex] = useState(0);
  const statusText = loading ? messages[statusIndex] : "SCAN LINK SEKARANG";
  const [turnstileToken, setTurnstileToken] = useState("");
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [loading]);

 const handleCekKeamanan = async () => {
    if (!urlInput) return;
    
    // Validasi tambahan: Cek apakah token sudah ada
    if (!turnstileToken) {
        alert("Mohon selesaikan verifikasi keamanan terlebih dahulu.");
        return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Masukkan token ke sini
        body: JSON.stringify({ 
            url: urlInput,
            token: turnstileToken // Kirim token ke backend
        }),
      });

      const data: SecurityResult = await response.json();
      setResult(data);
    } catch (error) {
        console.error("Gagal melakukan scan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-red-600/40 relative overflow-x-hidden">
      
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"> <a
          href="https://www.tiktok.com/@artupstd?lang=id-ID"
          target="_blank"
          rel="noopener noreferrer" // Tambahkan ini agar aman
          className=" p-3 bg-red-600 rounded-full hover:scale-110 transition-all text-xs font-black"
        >
          My TikTok
        </a>
      </aside>

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-blue-600 mb-3 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] uppercase">
            🛡️ ARTUP SECURITY
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] px-4">
            Multi-Engine Real-time Verification System
          </p>
        </header>

        <div className="flex justify-center items-center gap-2 mb-6 text-emerald-500/80">
          <div className="flex gap-2 bg-emerald-950/30 px-4 py-1 rounded-full border border-emerald-900/50">
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="text-sm">🛡️</span> 95% DETECTION RATE
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-l border-emerald-900/50 pl-2">
              <span className="text-sm">⚡</span> Real-time Scan
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/40 p-5 md:p-8 rounded-4xl md:rounded-[2.5rem] border border-zinc-800/50 shadow-2xl mb-8 backdrop-blur-xl">
          <input
  type="text"
  value={urlInput}
  onChange={(e) => setUrlInput(e.target.value)}
  placeholder="Tempel link web, e-commerce, atau link mencurigakan..."
  className="w-full p-4 md:p-5 bg-black/60 border border-zinc-800 rounded-2xl mb-4 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-zinc-300 placeholder:text-zinc-700 text-sm md:text-base"
/>


<div className="mb-6">
  {/* Status Bar Container */}
  <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
    <div 
      className={`h-full transition-all duration-1000 ${
        turnstileToken ? "bg-green-500 w-full" : "bg-red-600 w-1/2 animate-pulse"
      }`}
    />
  </div>
  
  {/* Pesan Dinamis */}
  <p className="text-[10px] md:text-[20px] text-center font-bold uppercase tracking-widest text-zinc-500 mb-4">
    {turnstileToken 
      ? "✅ Ternyata Kamu Masih Punya Hati" 
      : "🛡️ Sedang memahami mu: APAKAH KAMUPUNYA HATI?"
    }
  </p>

  {/* Widget Turnstile - Bisa kita bungkus agar rapi */}
  <div className={`flex justify-center transition-opacity duration-500 ${turnstileToken ? "hidden" : "opacity-100"}`}>
    <Turnstile 
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
      onSuccess={(token) => setTurnstileToken(token)} 
    />
  </div>
</div>

<button
  onClick={handleCekKeamanan}
  // Tombol akan disable jika loading ATAU token belum ada (biar user wajib verifikasi)
  disabled={loading || !turnstileToken} 
  className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl tracking-tight transition-all active:scale-95 ${
    (loading || !turnstileToken)
      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" // Warna lebih redup saat disabled
      : "bg-red-700 hover:bg-red-600 shadow-[0_10px_40px_rgba(185,28,28,0.2)] text-white"
  }`}
>
  {loading ? statusText : "LINK / WEBSITE SCANNER"}
</button>
        </div>

        {result &&
          !result.error &&
          (() => {
            // 1. Ambil status yang pasti ada
            const status = result.finalStatus || "AMAN";

            const getContainerStyles = (s: string) => {
              switch (s) {
                case "BAHAYA":
                  return "bg-red-950/80 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.2)]";
                case "HATI-HATI":
                  return "bg-orange-950/80 border-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.15)]";
                default:
                  return "bg-zinc-900/90 border-green-600 shadow-[0_0_40px_rgba(34,197,94,0.15)]";
              }
            };

            const getHeaderText = (s: string) => {
              switch (s) {
                case "BAHAYA":
                  return "🚨 WEBSITE BERBAHAYA";
                case "HATI-HATI":
                  return "⚠️ PERLU KEWASPADAAN";
                case "AMAN":
                  return "✅ WEBSITE AMAN";
                default:
                  return "🛡️ AMAN TERVERIFIKASI";
              }
            };

            return (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div
                  className={`p-6 md:p-10 rounded-[2.5rem] border-2 md:border-4 transition-all duration-700 shadow-2xl ${getContainerStyles(status)}`}
                >
                  <h2 className="text-2xl md:text-4xl font-black italic mb-6 md:mb-10 leading-tight uppercase tracking-tighter text-center">
                    {getHeaderText(status)}
                  </h2>

                  <div className="bg-black/60 backdrop-blur-md p-5 md:p-7 rounded-3xl space-y-5 border border-white/5">
                    {/* GLOBAL ENGINE */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                        GLOBAL ENGINE:
                      </span>
                      <span
                        className={`font-black tracking-widest text-xs md:text-sm ${getGoogle.color}`}
                      >
                        {getGoogle.label}
                      </span>
                    </div>

                    {/* VIRUS ENGINE */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                        VIRUS ENGINE:
                      </span>
                      <span
                        className={`font-black tracking-widest text-xs md:text-sm ${getVirus.color}`}
                      >
                        {result.virusTotal === "BAHAYA"
                          ? `⚠️ DETECTED (${result.vtDetails?.malicious || 0} Engines)`
                          : getVirus.label}
                      </span>
                    </div>
                    {/* ARTUP LOGIC */}
                    <div className="flex flex-col gap-2">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                        ARTUP LOGIC:
                      </span>
                      {result.heuristicFlags?.length > 0 ? (
                        result.heuristicFlags.map(
                          (flag: string, index: number) => (
                            <span
                              key={flag} // Menggunakan string flag itu sendiri sebagai key yang unik
                              className="text-orange-400 text-xs font-bold"
                            >
                              ⚠️ {flag}
                            </span>
                          ),
                        )
                      ) : (
                        <span className="text-green-500 text-xs font-bold">
                          🛡️ Tidak ada indikator manipulasi
                        </span>
                      )}
                    </div>

                    {/* TRUST SCORE */}
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                        TRUST SCORE
                      </span>
                      <div className="mt-2">
                        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${result.trustScore}%` }}
                            className={`h-full ${getTrustColor(result.trustScore)}`}
                          />
                        </div>
                        <p className="mt-2 font-black">
                          {result.trustScore}/100
                        </p>
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="mt-8 text-center px-2">
                      <p className="font-black text-[10px] md:text-xs uppercase tracking-widest leading-relaxed opacity-90 text-zinc-200">
                        {result.userMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        {result?.error && (
          <div className="p-5 bg-red-600/10 border border-red-600/50 rounded-2xl text-center text-red-500 text-xs font-bold uppercase tracking-widest animate-bounce">
            {result.error}
          </div>
        )}
      </div>

      <section className="mt-20 max-w-xl mx-auto px-6 text-center">
        <h2 className="text-zinc-00 font-black text-[10px] md:text-[20px] uppercase tracking-[0.3em] mb-4">
          Mengapa Menggunakan Artup Link Scanner?
        </h2>
        <p className="text-zinc-500 text-[13px] leading-relaxed">
          <strong>Artup Security</strong> menyediakan layanan{" "}
          <em>Link Scanner</em> dan <em>Website Security Checker</em> untuk
          membantu Anda mendeteksi potensi ancaman siber. Dengan teknologi{" "}
          <strong>Multi-Engine Verification</strong>, kami memindai setiap
          tautan untuk mencari indikator <strong>phishing</strong>,{" "}
          <strong>malware</strong>, dan penipuan <em>e-commerce</em> secara
          real-time.
        </p>
      </section>

      <footer  className="mt-20 text-center pb-12 border-t border-zinc-900 pt-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] md:text-[20px] text-zinc-500 font-black uppercase tracking-[0.4em]">
            ARTUP STUDIO SECURITY DIVISION &copy; 2026
          </p>
          <div className="flex gap-4 ">
            <span className="text-[9px] text-zinc-800 font-bold uppercase tracking-widest">
              System Operational
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

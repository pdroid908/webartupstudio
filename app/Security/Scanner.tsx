"use client";
import { useState, useEffect } from "react";
import { SecurityResult } from "@/types";
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
    if (score >= 80) {
      return {
        text: "text-emerald-300",
        bg: "bg-emerald-500",
        border: "border-emerald-800",
        glow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
      };
    }

    if (score >= 50) {
      return {
        text: "text-orange-300",
        bg: "bg-orange-500",
        border: "border-orange-500/20",
        glow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]",
      };
    }

    return {
      text: "text-red-300",
      bg: "bg-red-500",
      border: "border-red-500/20",
      glow: "shadow-[0_0_40px_rgba(239,68,68,0.25)]",
    };
  };
  const messages = [
    "Please Wait...",
    "DECRYPTING PACKET OBFUSCATION...",
    "SCANNING DATABASE REPUTATION...",
    "EXTRACTING HEURISTIC PATTERNS...",
    "CALCULATING RISK PROBABILITY...",
    "FINALIZING SECURITY INTEGRITY...",
  ];
  const [statusIndex, setStatusIndex] = useState(0);
  const statusText = loading ? messages[statusIndex] : "SCAN LINK SEKARANG";
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, messages.length]);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);

      // hanya izinkan http/https
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return false;
      }

      // harus punya domain valid
      if (!parsed.hostname.includes(".")) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleCekKeamanan = async () => {
    const cleanUrl = urlInput.trim();

    // VALIDASI KOSONG
    if (!cleanUrl) {
      setResult({
        error: "Masukkan URL terlebih dahulu.",
      } as SecurityResult);

      return;
    }

    // VALIDASI FORMAT URL
    if (!isValidUrl(cleanUrl)) {
      setResult({
        error: " LINK tidak valid.",
      } as SecurityResult);

      return;
    }

    // MULAI SCAN
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      // VALIDASI RESPONSE ERROR
      if (!response.ok) {
        throw new Error("Gagal memproses scan.");
      }

      const data: SecurityResult = await response.json();

      setResult(data);
    } catch {
      setResult({
        error: "Terjadi kesalahan saat memeriksa website.",
      } as SecurityResult);
    } finally {
      setLoading(false);
    }
  };
  const trustUI = getTrustColor(result?.trustScore || 0);

  return (
    <div className="min-h-screen md:bg-slate-900 bg-slate-800 text-white relative overflow-hidden isolate">
      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-150px] w-[400px] h-[400px] bg-cyan-900 rounded-full opacity-20 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-blue-900 rounded-full opacity-20 blur-3xl" />
      {/* SOCIAL */}
      <aside className="fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-50">
        <a
          href="https://www.tiktok.com/@artupstd?lang=id-ID"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-500 border border-slate-700 hover:bg-cyan-500 hover:scale-105 transition-all text-sm font-bold shadow-xl"
        >
          MY TikTok
        </a>
      </aside>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* HEADER */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] uppercase tracking-[0.2em] font-bold mb-5">
            AI Security Scanner
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 leading-none">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Artup Security
            </span>
          </h1>

          <p className="text-zinc-300 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Scanner keamanan link berbasis multi-engine verification untuk
            mendeteksi website phishing, malware, dan scam secara cepat.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold">
              Real-time Scan
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
              Accurary 95%
            </span>

            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
              Privacy Safe
            </span>
          </div>
        </header>

        {/* MAIN CARD */}
        <div className="bg-slate-900 border border-slate-800 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl">
          <div className="space-y-5">
            {/* INPUT */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">
                URL Scanner
              </label>

              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Masukkan URL/Link untuk diperiksa keamanannya"
                className="w-full p-5 rounded-2xl bg-slate-950 border border-white/10 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder:text-zinc-500"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleCekKeamanan}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all ${
                loading
                  ? "bg-white/10 text-cyan-300 animate-pulse"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
              }`}
            >
              {loading ? statusText : "Scan Website"}
            </button>
          </div>

          {/* RESULT */}
          {result && !result.error && (
            <div className="mt-8 animate-in fade-in duration-500">
              <div
                className={`rounded-[28px] border bg-slate-950 p-6 md:p-8 transition-all duration-500 ${trustUI.border} ${trustUI.glow}`}
              >
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex px-5 py-2 rounded-full text-sm font-black tracking-widest mb-5 ${
                      status === "BAHAYA"
                        ? "bg-red-500/10 text-red-300 border border-red-500/20"
                        : status === "HATI-HATI"
                          ? "bg-orange-500/10 text-orange-300 border border-orange-500/20"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  ></div>

                  <h2 className={`text-5xl font-black mb-2 ${trustUI.text}`}>
                    {result.trustScore}
                    <span className="text-xl text-zinc-500">/100</span>
                  </h2>
                  <div className="mt-4">
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${result.trustScore}%`,
                        }}
                        className={`h-full transition-all duration-700 ${trustUI.bg}`}
                      />
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm">Trust Security Score</p>
                </div>

                {/* GRID */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-900 border border-white/10 p-5">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                      Global Engine
                    </p>

                    <p className={`font-black text-lg ${getGoogle.color}`}>
                      {getGoogle.label}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 border border-white/10 p-5">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                      Virus Engine
                    </p>

                    <p className={`font-black text-lg ${getVirus.color}`}>
                      {result.virusTotal === "BAHAYA"
                        ? `Detected (${result.vtDetails?.malicious || 0})`
                        : getVirus.label}
                    </p>
                  </div>
                </div>

                {/* FLAGS */}
                <div className="mt-5 rounded-2xl bg-slate-900 border border-white/10 p-5">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
                    Security Analysis
                  </p>

                  {result.heuristicFlags?.length > 0 ? (
                    <div className="space-y-2">
                      {result.heuristicFlags.map((flag: string) => (
                        <div
                          key={flag}
                          className="rounded-xl bg-orange-950 border border-orange-800 px-4 py-3 text-orange-300 text-sm font-semibold"
                        >
                          ⚠️ {flag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-emerald-950 border border-emerald-800 px-4 py-3 text-emerald-300 text-sm font-semibold">
                      ✅ Tidak ditemukan indikasi berbahaya
                    </div>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="mt-6 text-center">
                  <p className="text-zinc-300 leading-relaxed">
                    {result.userMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}
          {result?.error && (
            <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-5 text-center text-red-300 font-bold">
              {result.error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-20 text-center">
          <p className="text-zinc-500 text-xs md:text-sm tracking-[0.3em] uppercase font-bold">
            Artup Studio Security Division © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}

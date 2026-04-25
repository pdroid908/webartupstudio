"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SecurityPage() {
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [statusText, setStatusText] = useState("SCAN LINK SEKARANG");

  const [manualVideo, setManualVideo] = useState("tzYhNOu7Bdg"); // Video default saat pertama buka
  // 1. Simpan ID video tadi di variable atau state
  const videoId = "tzYhNOu7Bdg";

  const handleManualVideo = (id: string) => {
    setManualVideo(id);
    // Scroll otomatis ke video agar terlihat di HP
    const element = document.getElementById("video-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const messages = [
        "INITIALIZING ARTUP NEURAL CORE...",
        "DECRYPTING PACKET OBFUSCATION...",
        "SCANNING DATABASE REPUTATION...",
        "EXTRACTING HEURISTIC PATTERNS...",
        "CALCULATING RISK PROBABILITY...",
        "FINALIZING SECURITY INTEGRITY...",
      ];
      let i = 0;
      setStatusText(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setStatusText(messages[i]);
      }, 2000);
    } else {
      setStatusText("SCAN LINK SEKARANG");
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCekKeamanan = async () => {
    if (!urlInput) return;


    // --- 2. LOGIKA SCAn (Tetap Jalan) ---
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Gagal menyambung ke Artup Infrastructure" });
    } finally {
      setLoading(false);
      setStatusText("SCAN LINK SEKARANG");
    }
  };

  const finalStatus = result?.finalStatus;
  const isPublicHosting = result?.details?.isPublicHosting; // Ambil data dari backend

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-red-600/40 relative overflow-x-hidden">
      {/* --- SIDEBAR/DOCK MEDSOS (Responsive) --- */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:right-4 md:left-auto z-50 flex flex-row md:flex-col gap-3 bg-zinc-900/80 md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none border border-zinc-800 md:border-none backdrop-blur-md md:backdrop-blur-none shadow-2xl md:shadow-none">
        <a
          href="https://www.facebook.com/profile.php?id=61580560360762&locale=id_ID"
          target="_blank"
          rel="noopener noreferrer" // Tambahkan ini agar aman
          className="p-3 bg-blue-600 rounded-full hover:scale-110 transition-all text-xs font-black"
        >
          FACEEBOOK
        </a>
        <a
          href="https://www.tiktok.com/@artupstudio"
          target="_blank"
          rel="noopener noreferrer" // Tambahkan ini agar aman
          className="p-3 bg-pink-600 rounded-full hover:scale-110 transition-all text-xs font-black"
        >
          TikTok
        </a>
        <a
          href="https://www.youtube.com/@Artup-STUDIO"
          target="_blank"
          rel="noopener noreferrer" // Tambahkan ini agar aman
          className=" p-3 bg-red-600 rounded-full hover:scale-110 transition-all text-xs font-black"
        >
          YouTube
        </a>
      </aside>

      <Link
        onClick={() => setLoading(false)}
        href="/"
        /* Ganti mb-18 (tidak ada) menjadi mb-12 untuk HP.
     Ganti md:mb-12 menjadi md:mb-20 untuk Laptop agar lebih lega.
     Tambahkan block atau flex agar margin bekerja maksimal.
  */
        className="relative mb-12 md:mb-20 inline-flex items-center justify-center p-[3px] rounded-full overflow-hidden transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] group shadow-lg shadow-black active:scale-90"
      >
        {/* 1. LAYER ANIMASI WARNA BERPUTAR (DIAM GERAK-GERAK) */}
        <div
          className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#334155_0%,#ef4444_20%,#3b82f6_50%,#ef4444_80%,#334155_100%)]
    /* Saat Hover: Warna Berubah jadi Merah Terang */
    group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f97316_50%,#ef4444_100%)]"
        />

        {/* 2. LAYER BACKROUND HITAM (Agar Teks Terbaca & Hover Effect) */}
        <div
          className="flex h-full w-full items-center gap-3 rounded-full bg-zinc-900 px-3 py-2.5 transition-all duration-300 z-10 
    group-hover:bg-red-600/10 group-hover:backdrop-blur-sm"
        >
          {/* Icon Panah */}
          <span className="relative z-20 text-red-500 group-hover:text-white transition-colors text-base">
            ←
          </span>

          {/* Teks */}
          <span className="relative z-20 text-zinc-100 group-hover:text-white transition-colors">
            Kembali
          </span>
        </div>

        {/* 3. LAYER GLOW (Cahaya di Belakang) */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity duration-300 
    bg-blue-600/10 group-hover:bg-red-600/20 blur-xl z-0"
        />
      </Link>

      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-blue-600 mb-3 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] uppercase">
            🛡️ ARTUP SECURITY
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] px-4">
            Multi-Engine Real-time Verification System
          </p>
        </header>

        <div className="bg-zinc-900/40 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-800/50 shadow-2xl mb-8 backdrop-blur-xl">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Tempel link bank, e-commerce, atau link mencurigakan..."
            className="w-full p-4 md:p-5 bg-black/60 border border-zinc-800 rounded-2xl mb-4 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-zinc-300 placeholder:text-zinc-700 text-sm md:text-base"
          />
          <button
            onClick={handleCekKeamanan}
            disabled={loading}
            className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl tracking-tight transition-all active:scale-95 ${
              loading
                ? "bg-zinc-800 text-red-500 cursor-not-allowed animate-pulse"
                : "bg-red-700 hover:bg-red-600 shadow-[0_10px_40px_rgba(185,28,28,0.2)] text-white"
            }`}
          >
            {loading ? statusText : "LINK / WEBSITE SCANNER"}
          </button>

        </div>

        {result && !result.error && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div
              className={`p-6 md:p-10 rounded-[2.5rem] border-2 md:border-4 transition-all duration-700 shadow-2xl ${
                finalStatus === "BAHAYA"
                  ? "bg-red-950/80 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.2)]"
                  : finalStatus === "ADA CELAH"
                    ? "bg-orange-950/80 border-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                    : "bg-zinc-900/90 border-green-600 shadow-[0_0_40_rgba(34,197,94,0.15)]"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-black italic mb-6 md:mb-10 leading-tight uppercase tracking-tighter text-center">
                {finalStatus === "BAHAYA"
                  ? "🚨 POSITIF PHISHING / MANIPULASI!"
                  : finalStatus === "ADA CELAH"
                    ? "⚠️ WASPADA: SITUS PUBLIK/UNVERIFIED"
                    : "✅ LINK AMAN"}
              </h2>

              <div className="bg-black/60 backdrop-blur-md p-5 md:p-7 rounded-3xl space-y-5 border border-white/5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                    GLOBAL ENGINE:
                  </span>
                  <span
                    className={`font-black tracking-widest text-xs md:text-sm ${
                      result.googleStatus === "BAHAYA"
                        ? "text-red-500"
                        : result.googleStatus === "ADA CELAH"
                          ? "text-orange-500"
                          : "text-green-500"
                    }`}
                  >
                    {result.googleStatus === "BAHAYA"
                      ? "⚠️ BLACKLISTED"
                      : result.googleStatus === "ADA CELAH"
                        ? "❓ BELUM TERVERIFIKASI"
                        : "✔️  VERIFIED"}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                    VIRUS ENGINE:
                  </span>
                  <span
                    className={`font-black tracking-widest text-xs md:text-sm ${result.virusTotal === "BAHAYA" ? "text-red-500" : result.virusTotal === "TIDAK ADA DATA" ? "text-orange-500" : "text-green-500"}`}
                  >
                    {result.virusTotal === "BAHAYA"
                      ? `⚠️ DETECTED (${result.vtDetails?.malicious || 0} Engines)`
                      : result.virusTotal === "TIDAK ADA DATA"
                        ? "NO RECORD"
                        : "✔️ NO VIRUS"}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                    ARTUP LOGIC:
                  </span>
                  <span
                    className={`font-black tracking-widest text-xs md:text-sm ${result.artupHeuristic === "BAHAYA" ? "text-red-500" : result.artupHeuristic === "ADA CELAH" ? "text-orange-500" : "text-green-500"}`}
                  >
                    {result.artupHeuristic === "BAHAYA"
                      ? "🚨 MANIPULATION DETECTED"
                      : result.artupHeuristic === "ADA CELAH"
                        ? "⚠️ WEB PUBLIK JANGAN MASUKAN DATA SENSITIF,  "
                        : "🛡️ VERIFIKASI AMAN"}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-center px-2">
                <p className="font-black text-[10px] md:text-xs uppercase tracking-widest leading-relaxed opacity-90 text-zinc-200">
                  {finalStatus === "BAHAYA"
                    ? "Sistem mendeteksi pola PENCURIAN DATA . Jangan masukkan data apa pun!"
                    : finalStatus === "ADA CELAH"
                      ? isPublicHosting
                        ? "PERINGATAN: Jangan masukan data penting keuangan dan data diri sensitif atau kode rahasia, Kecuali percaya pada situs itu"
                        : "WASPADA: Jangan masukkan informasi keuangan atau kode rahasia, KECUALI PERCAYA PADA SITUS ITU."
                      : "Terverifikasi , Link AMAN."}
                </p>
              </div>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="p-5 bg-red-600/10 border border-red-600/50 rounded-2xl text-center text-red-500 text-xs font-bold uppercase tracking-widest animate-bounce">
            {result.error}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-10 pt-4">
        {/* --- TOMBOL EDUKASI (Trigger Ganti Video) --- */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setManualVideo("eIa6zppZ03A")} // ID Video Phishing
            className={`py-3 px-2 rounded-xl border transition-all active:scale-95 text-[9px] font-black uppercase tracking-tighter ${
              manualVideo === "eIa6zppZ03A"
                ? "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                : "bg-red-950/30 border-red-900/50 text-red-500 hover:bg-red-900/40"
            }`}
          >
            🚨 JIKA PHISING?
          </button>
          <button
            onClick={() => setManualVideo("tzYhNOu7Bdg")} // ID Video Celah/Default
            className={`py-3 px-2 rounded-xl border transition-all active:scale-95 text-[9px] font-black uppercase tracking-tighter ${
              manualVideo === "tzYhNOu7Bdgy"
                ? "bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                : "bg-orange-950/30 border-orange-900/50 text-orange-500 hover:bg-orange-900/40"
            }`}
          >
            ⚠️ JIKA ADA CELAH?
          </button>
        </div>

        {/* --- SINGLE VIDEO PLAYER SECTION --- */}
        <div className="mb-10 group">
          <div className="bg-zinc-900/40 p-3 rounded-[2rem] border border-zinc-800 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            {/* Dekorasi Cahaya di Belakang Video */}
            <div
              className={`absolute inset-0 opacity-10 blur-[80px] transition-colors duration-700 ${
                manualVideo === "eIa6zppZ03A" ? "bg-red-600" : "bg-orange-600"
              }`}
            />

            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-white/5 relative z-10 bg-black">
              <iframe
                key={manualVideo} // Key ini penting agar Iframe refresh & autoplay jalan saat ID berubah
                src={`https://www.youtube-nocookie.com/embed/${manualVideo}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                title="Artup Security Education"
                className="w-full h-full"
                allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-3 flex justify-between items-center px-2 relative z-10">
              <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Mode:{" "}
                {manualVideo === "eIa6zppZ03A"
                  ? "PERGI SAJA"
                  : "WASPADA PUBLIK"}
              </p>
              <div className="flex gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${manualVideo === "eIa6zppZ03A4" ? "bg-red-500" : "bg-orange-500"}`}
                />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-center pb-10">
        <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em]">
          ARTUP STUDIO Security Division &copy; 2026
        </p>
      </footer>
    </div>
  );
}

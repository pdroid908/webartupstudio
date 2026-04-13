"use client";
import { useState } from "react";
import Link from "next/link"; // Tambahkan ini untuk navigasi

export default function SecurityPage() {
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCekKeamanan = async () => {
    if (!urlInput) return alert("Masukkan LINK Jika Ingin Check !");
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
    }
  };

  const finalStatus = result?.finalStatus;
  const isVTScanning = result?.vtSource === "NEW_REQUEST";

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-red-600/40 relative overflow-x-hidden">
      
      <div className="max-w-4xl mx-auto mb-10 pt-4">
  <Link 
    href="/" 
    className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-100 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] group shadow-lg shadow-black"
  >
    <span className="text-red-500 group-hover:text-white transition-colors text-base">←</span> 
    Kembali
  </Link>
</div>

      <div className="max-w-2xl mx-auto">
        
        {/* HEADER - Responsif Text */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-red-600 mb-3 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            🛡️ ARTUP SECURITY
          </h1>
          <p className="text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] px-4">
            Multi-Engine Real-time Verification System
          </p>
        </header>

        {/* INPUT BOX - Responsif Padding */}
        <div className="bg-zinc-900/40 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-800/50 shadow-2xl mb-8 backdrop-blur-xl">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Tempel link (Netlify, .icu, IP, dll)..."
            className="w-full p-4 md:p-5 bg-black/60 border border-zinc-800 rounded-2xl mb-4 focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium text-zinc-300 placeholder:text-zinc-700 text-sm md:text-base"
          />
          <button
            onClick={handleCekKeamanan}
            disabled={loading}
            className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl tracking-tight transition-all active:scale-95 ${
              loading 
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed animate-pulse" 
                : "bg-red-700 hover:bg-red-600 shadow-[0_10px_40px_rgba(185,28,28,0.2)] text-white"
            }`}
          >
            {loading ? "ANALYZING INFRASTRUCTURE..." : "SCAN LINK SEKARANG"}
          </button>
        </div>

        {/* RESULT DISPLAY - Responsif Layout */}
        {result && !result.error && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className={`p-6 md:p-10 rounded-[2.5rem] border-2 md:border-4 transition-all duration-700 shadow-2xl ${
              finalStatus === 'BAHAYA' 
                ? 'bg-red-950/80 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.2)]' 
                : finalStatus === 'ADA CELAH' 
                ? 'bg-orange-950/80 border-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.15)]' 
                : 'bg-zinc-900/90 border-green-600 shadow-[0_0_40px_rgba(34,197,94,0.15)]'
            }`}>
              
              <h2 className="text-2xl md:text-4xl font-black italic mb-6 md:mb-10 leading-tight uppercase tracking-tighter text-center">
                {finalStatus === 'BAHAYA' ? "🚨 POSITIF PHISHING!" : 
                 finalStatus === 'ADA CELAH' ? "⚠️ POTENSI BAHAYA!" : "✅ LINK TERVERIFIKASI"}
              </h2>

              <div className="bg-black/60 backdrop-blur-md p-5 md:p-7 rounded-3xl space-y-5 border border-white/5">
                
                {/* GOOGLE ENGINE */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">GLOBAL ENGINE:</span>
                  <span className={`font-black tracking-widest text-xs md:text-sm ${result.googleStatus === "BAHAYA" ? "text-red-500" : "text-green-500"}`}>
                    {result.googleStatus === "BAHAYA" ? "⚠️ BLACKLISTED" : "✔️ CLEAN"}
                  </span>
                </div>

                {/* VIRUS TOTAL */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 border-b border-white/5 pb-4">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Virus ENGINE:</span>
                  <span className={`font-black tracking-widest text-xs md:text-sm ${
                    result.virusTotal?.malicious > 0 ? "text-red-500" : 
                    isVTScanning ? "text-blue-500 animate-pulse" : "text-green-500"
                  }`}>
                    {result.virusTotal?.malicious > 0 
                      ? `DETECTED (${result.virusTotal.malicious} Engines)` 
                      : isVTScanning ? "RE-SCANNING..." : "NO MALWARE"}
                  </span>
                </div>

                {/* RADAR ARTUP */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">ARTUP LOGIC:</span>
                  <span className={`font-black tracking-widest text-xs md:text-sm ${
                    result.artupHeuristic === "BAHAYA" ? "text-red-500" : 
                    result.artupHeuristic === "ADA CELAH" ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {result.artupHeuristic}
                  </span>
                </div>
              </div>

              {/* FOOTER MESSAGE - Responsif Text Size */}
              <div className="mt-8 text-center px-2">
                 <p className="font-black text-[10px] md:text-xs uppercase tracking-widest leading-relaxed opacity-90">
                   {finalStatus === 'BAHAYA' 
                    ? "Sistem mendeteksi pola pencurian data/phishing. Tutup tab ini segera!" 
                    : finalStatus === 'ADA CELAH' 
                    ? "Domain atau IP ini mencurigakan. Jangan masukkan data sensitif." 
                    : "Link aman untuk dikunjungi berdasarkan database keamanan global."}
                 </p>
              </div>
            </div>

            {/* SYSTEM LOGS */}
            <div className="mt-10 flex flex-col items-center gap-2 opacity-30">
               <div className="h-px w-20 bg-zinc-800"></div>
               <p className="text-[8px] md:text-[9px] text-zinc-500 font-mono uppercase tracking-[0.3em]">
                 Infra: {result.vtSource || "EDGE"} | v8.0.2 Stable
               </p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {result?.error && (
          <div className="p-5 bg-red-600/10 border border-red-600/50 rounded-2xl text-center text-red-500 text-xs font-bold uppercase tracking-widest animate-shake">
            {result.error}
          </div>
        )}
      </div>

      {/* FOOTER CREDIT */}
      <footer className="mt-20 text-center pb-10">
         <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em]">
           Artup Studio Security Division &copy; 2026
         </p>
      </footer>
    </div>
  );
}
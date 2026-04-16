"use client";
import React, { useState } from "react";

export default function FinalArtupTest() {
  const [activeVideo, setActiveVideo] = useState("0idNc-BXE54"); // Video Kamu

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-black mb-2 text-red-600">
          ARTUP BYPASS TEST
        </h1>
        <p className="text-zinc-500 mb-8 text-sm uppercase tracking-tighter">
          Testing Localhost Compatibility
        </p>

        {/* Player Container */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-4 border-zinc-800 bg-black shadow-[0_0_80px_rgba(255,255,255,0.05)]">
          <iframe
            key={activeVideo} // Memaksa iframe reload saat ganti video
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${activeVideo}?rel=0`}
            title="Artup Media Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Kontrol Pengetesan */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveVideo("0idNc-BXE54")}
            className={`px-6 py-3 rounded-full font-bold transition ${activeVideo === "0idNc-BXE54" ? "bg-red-600" : "bg-zinc-800"}`}
          >
            TES VIDEO SENDIRI
          </button>

          <button
            onClick={() => setActiveVideo("aqz-KE-bpKQ")} // Video Musik (BigBang) buat perbandingan
            className={`px-6 py-3 rounded-full font-bold transition ${activeVideo === "aqz-KE-bpKQ" ? "bg-blue-600" : "bg-zinc-800"}`}
          >
            TES VIDEO GLOBAL (PEMBANDING)
          </button>
        </div>

        <div className="mt-12 p-6 bg-zinc-900/50 rounded-2xl border border-white/5 text-left">
          <h3 className="text-xs font-bold text-zinc-400 mb-3">
            HASIL ANALISA:
          </h3>
          <ul className="text-sm text-zinc-500 space-y-2">
            <li>
              • Jika <b className="text-blue-400">Video Global</b> muncul tapi{" "}
              <b className="text-red-400">Video Sendiri</b> tidak:{" "}
              <b>Masalah ada di Settingan YouTube Studio kamu.</b>
            </li>
            <li>
              • Jika <b className="text-white">Dua-duanya</b> tetap "Blocked":{" "}
              <b>Masalah ada di Browser/Localhost (CSP).</b>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

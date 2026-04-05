"use client";

import React, { useState } from 'react';

// --- 1. DATA KARYA PNR STUDIO ---
const MY_GAMES = [
  {
    id: "pixel-universe",
    title: "Pixel Universe",
    descShort: "Action platformer dengan mekanik cepat.",
    descFull: "Developed using Godot 4, this game focuses on high-speed movement and a unique teleportation mechanic triggered upon enemy impact. Experience an intense, fast-paced journey through a beautifully crafted pixel-art world.",
    tech: "Godot 4.2",
    link: "https://drive.google.com/file/d/1297vtnwaJKCdRf2u6ftLAb-Tjy2CtoqY/view?usp=sharing", 
    iconFile: "logo.png", 
    screenshots: ["9(1435).png"] 
  },
  {
    id: "block-fight",
    title: "Block Fight",
    descShort: "block puzzle.",
    descFull: "Combine, clash, and conquer! Block Fight is a fast-paced Match-3 puzzle game built with the Godot Engine. Match the blocks to launch powerful attacks and defeat your opponents. Strategize your moves, trigger massive combos, and prove that you are the ultimate block fighter!",
    tech: "Godot 4.6",
    link: "https://drive.google.com/file/d/1Z-RrKKUofQ2yQI8jlFa7UQyKlN2CZS8t/view?usp=sharing",
    iconFile: "ungull.png", 
    screenshots: ["bl1.jpg","2.jpg"] 
  }
];

export default function Home() {
  const [activeId, setActiveId] = useState(MY_GAMES[0].id);
  const currentGame = MY_GAMES.find(game => game.id === activeId) || MY_GAMES[0]; 
  const [isMuted, setIsMuted] = useState(true);
  return (
    <main className="flex min-h-screen bg-slate-950 text-white font-sans">


      {/* --- VIDEO BACKGROUND (DIPERBAIKI) --- */}
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
  <video
    key={isMuted ? "muted" : "unmuted"} // TAMBAHKAN INI agar video refresh saat suara diubah
    autoPlay
    muted={isMuted}
    loop
    playsInline
    className="w-full h-full object-cover opacity-20"
  >
    <source src="videomiku.mp4" type="video/mp4" />
  </video>
  {/* Overlay Gradient agar teks tetap terbaca jelas */}
  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
</div>

{/* --- TOMBOL SOUND (DI POJOK KANAN ATAS) --- */}
<button 
  onClick={() => setIsMuted(!isMuted)}
  className="fixed top-6 right-8 z-50 flex items-center gap-3 px-5 py-2.5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 rounded-full transition-all group shadow-2xl active:scale-95"
>
  {/* Ikon Speaker */}
  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
    {isMuted ? "🔇" : "🔊"}
  </span>
  
  {/* Teks Penanda */}
  <div className="flex flex-col items-start leading-none">
    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-blue-400 transition-colors">
      Background
    </span>
    <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-300">
      {isMuted ? "Audio Muted" : "Audio Playing"}
    </span>
  </div>
</button>
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-900 p-6 flex flex-col bg-slate-950/50 backdrop-blur-xl">
        <h2 className="text-xl font-black text-blue-500 mb-8 tracking-tighter italic">Artup STUDIO</h2>
        
        <div className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Categories</div>
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-left">
            <span>🎮</span> Games
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition text-left group">
            <span className="opacity-50 group-hover:opacity-100">🤖</span> Automation
          </button>
        </nav>

        {/* --- BAGIAN PRIVACY POLICY & CONTACT (VERSI DIPERBESAR) --- */}
<div className="mt-auto pt-6 border-t border-slate-900 space-y-5">
  <nav className="flex flex-col gap-3 px-1">
    {/* Link Privacy: Dibuat lebih besar (text-sm) dan lebih tebal */}
    <a 
      href="/privacy" 
      className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-3 group"
    >
      <span className="text-lg bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-blue-500/50">🛡️</span> 
      Privacy Policy
    </a>

    {/* Link Contact: Langsung ke email p1998nr@gmail.com */}
    <a 
      href="mailto:p1998nr@gmail.com" 
      className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-3 group"
    >
      <span className="text-lg bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-blue-500/50">✉️</span> 
      Contact Support
    </a>
  </nav>

  {/* DEVICE INFO */}
  <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10 text-center shadow-inner">
    <p className="text-[10px] text-blue-500/60 font-mono font-black uppercase tracking-[0.2em]">AMD R6 DEV MODE</p>
  </div>
</div>
      </aside>

      {/* KONTEN UTAMA */}
      <section className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
            <h1 className="text-3xl font-bold">Games app</h1>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
        </header>

        {/* GRID KARTU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {MY_GAMES.map((game) => (
            <div 
              key={game.id}
              onClick={() => setActiveId(game.id)}
              className={`group p-1 rounded-2xl transition-all duration-300 cursor-pointer ${activeId === game.id ? 'bg-blue-600 scale-105 shadow-lg shadow-blue-900/40' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              <div className="bg-slate-900 p-5 rounded-2xl h-full flex flex-col items-center">
                <div className="w-full h-28 bg-slate-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-blue-400 transition-colors">
                  {game.iconFile ? (
                    <img src={`/${game.iconFile}`} alt={game.title} className="w-20 h-20 object-contain" />
                  ) : (
                    <span className="text-4xl">🖼️</span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1 text-center">{game.title}</h3>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase tracking-tight">
                    {game.tech}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL & PREVIEW */}
        <div className="p-8 border border-slate-800 bg-slate-900/40 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-0.5 shadow-lg">
                   <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                      <img src={`/${currentGame.iconFile}`} className="w-14 h-14 object-contain" />
                   </div>
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight">{currentGame.title}</h2>
                  <p className="text-blue-500 font-mono text-sm tracking-widest">{currentGame.tech}</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-2xl font-light">
                {currentGame.descFull}
              </p>
              
              <a 
                href={currentGame.link} 
                target="_blank" 
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-blue-900/30"
              >
                <span>📥</span> DOWNLOAD SEKARANG
              </a>
            </div>

            {/* SCREENSHOT PREVIEW */}
            <div className="w-full xl:w-[400px]">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-500">Live Preview</h4>
              {currentGame.screenshots.length > 0 ? (
                <div className="space-y-4">
                  {currentGame.screenshots.map((ss, index) => (
                    <div key={index} className="group relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                      <img src={`/${ss}`} className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-52 bg-slate-800/50 border border-dashed border-slate-700 rounded-2xl flex items-center justify-center text-slate-600 italic">
                  Preview belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
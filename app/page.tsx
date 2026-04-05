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
    <main className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">

      {/* --- VIDEO BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          key={isMuted ? "muted" : "unmuted"}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="videomiku.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
      </div>

      {/* --- TOMBOL SOUND (DI POJOK KANAN ATAS) --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 md:top-6 md:right-8 z-50 flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 rounded-full transition-all group shadow-2xl active:scale-95"
      >
        <span className="text-lg group-hover:scale-110 transition-transform duration-300">
          {isMuted ? "🔇" : "🔊"}
        </span>
        <div className="flex flex-col items-start leading-none hidden sm:flex">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-blue-400 transition-colors">
            Background
          </span>
          <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-300">
            {isMuted ? "Muted" : "Playing"}
          </span>
        </div>
      </button>
      
      {/* --- SIDEBAR (RESPONSIF) --- */}
      <aside className="w-full md:w-64 border-b md:border-r border-slate-900 p-4 md:p-6 flex flex-col bg-slate-950/80 md:bg-slate-950/50 backdrop-blur-xl z-10">
        <h2 className="text-xl font-black text-blue-500 mb-6 md:mb-8 tracking-tighter italic text-center md:text-left">Artup STUDIO</h2>
        
        <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 hidden md:block">Categories</div>
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button className="flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-sm whitespace-nowrap">
            <span>🎮</span> Games
          </button>
          
          <button className="flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition text-sm whitespace-nowrap group">
            <span className="opacity-50 group-hover:opacity-100">🤖</span> Automation
          </button>
        </nav>

        {/* --- BAGIAN PRIVACY & CONTACT --- */}
        <div className="mt-auto hidden md:flex flex-col pt-6 border-t border-slate-900 space-y-4">
          <nav className="flex flex-col gap-3 px-1">
            <a href="/privacy" className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-3 group">
              <span className="text-base bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-blue-500/50">🛡️</span> 
              Privacy Policy
            </a>
            <a href="mailto:p1998nr@gmail.com" className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-3 group">
              <span className="text-base bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-blue-500/50">✉️</span> 
              Contact Support
            </a>
          </nav>

          <div className="bg-blue-600/5 p-2 rounded-xl border border-blue-500/10 text-center">
            <p className="text-[9px] text-blue-500/60 font-mono font-black uppercase tracking-[0.2em]">AMD R6 DEV</p>
          </div>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <section className="flex-1 p-4 md:p-10 overflow-y-auto z-10">
        <header className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">Games Library</h1>
            <div className="h-1 w-16 bg-blue-600 mt-2 rounded-full mx-auto md:mx-0"></div>
        </header>

        {/* GRID KARTU (1 Kolom di HP, 3 di Laptop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {MY_GAMES.map((game) => (
            <div 
              key={game.id}
              onClick={() => setActiveId(game.id)}
              className={`group p-1 rounded-2xl transition-all duration-300 cursor-pointer ${activeId === game.id ? 'bg-blue-600 scale-[1.02] md:scale-105 shadow-lg shadow-blue-900/40' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              <div className="bg-slate-900 p-4 md:p-5 rounded-2xl h-full flex flex-col items-center">
                <div className="w-full h-24 md:h-28 bg-slate-800 rounded-xl mb-3 md:mb-4 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-blue-400 transition-colors">
                  <img src={`/${game.iconFile}`} alt={game.title} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1 text-center">{game.title}</h3>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded border border-blue-500/20 uppercase">
                    {game.tech}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL & PREVIEW (Box Utama) */}
        <div className="p-5 md:p-8 border border-slate-800 bg-slate-900/40 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-8 md:gap-12">
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-0.5 shadow-lg">
                   <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                      <img src={`/${currentGame.iconFile}`} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                   </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">{currentGame.title}</h2>
                  <p className="text-blue-500 font-mono text-xs md:text-sm tracking-widest">{currentGame.tech}</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm md:text-lg leading-relaxed mb-8 md:10 max-w-2xl font-light">
                {currentGame.descFull}
              </p>
              
              <a 
                href={currentGame.link} 
                target="_blank" 
                className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white w-full md:w-max px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl"
              >
                <span>📥</span> DOWNLOAD SEKARANG
              </a>
            </div>

            {/* SCREENSHOT PREVIEW (Scroll horizontal di HP) */}
            <div className="w-full xl:w-[400px]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-500 text-center md:text-left">Gallery Preview</h4>
              <div className="flex flex-row xl:flex-col gap-4 overflow-x-auto xl:overflow-visible pb-4 xl:pb-0">
                {currentGame.screenshots.map((ss, index) => (
                  <div key={index} className="min-w-[280px] md:min-w-0 group relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                    <img src={`/${ss}`} className="w-full h-44 md:h-52 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRIVACY & CONTACT KHUSUS MOBILE (Muncul di bawah box saat di HP) */}
          <div className="mt-10 md:hidden flex flex-row justify-around text-[10px] font-bold text-slate-500 border-t border-slate-800 pt-6">
            <a href="/privacy" className="flex items-center gap-2">🛡️ PRIVACY</a>
            <a href="mailto:p1998nr@gmail.com" className="flex items-center gap-2">✉️ CONTACT</a>
          </div>
        </div>
      </section>
    </main>
  );
}
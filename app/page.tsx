"use client";

import React, { useState } from 'react';

// --- DATA KARYA PNR STUDIO ---
const MY_GAMES = [
  {
    id: "pixel-universe",
    title: "Pixel Universe",
    descShort: "Action platformer dengan mekanik cepat.",
    descFull: "Developed using Godot 4, this game focuses on high-speed movement and a unique teleportation mechanic triggered upon enemy impact.",
    tech: "Godot 4.2",
    link: "https://drive.google.com/file/d/1297vtnwaJKCdRf2u6ftLAb-Tjy2CtoqY/view?usp=sharing", 
    iconFile: "logo.png", 
    screenshots: ["9(1435).png"] 
  },
  {
    id: "block-fight",
    title: "Block Fight",
    descShort: "block puzzle.",
    descFull: "Combine, clash, and conquer! Block Fight is a fast-paced Match-3 puzzle game built with the Godot Engine.",
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
    // PENTING: flex-col untuk HP, flex-row untuk Laptop
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

      {/* --- TOMBOL SOUND (DI ATAS) --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full shadow-2xl active:scale-95"
      >
        <span className="text-sm">{isMuted ? "🔇" : "🔊"}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Audio</span>
      </button>
      
      {/* --- SIDEBAR (RESPONSIF) --- */}
      {/* Di HP: Jadi barisan atas | Di Laptop: Jadi Sidebar kiri */}
      <aside className="w-full md:w-64 border-b md:border-r border-slate-900 p-4 md:p-6 flex flex-col bg-slate-950/50 backdrop-blur-xl z-10">
        <h2 className="text-xl font-black text-blue-500 mb-6 md:mb-8 tracking-tighter italic text-center md:text-left">Artup STUDIO</h2>
        
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button className="flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-sm whitespace-nowrap">
            <span>🎮</span> Games
          </button>
          <button className="flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl text-slate-400 hover:bg-slate-900 font-bold text-sm whitespace-nowrap">
            <span>🤖</span> Bot
          </button>
        </nav>

        {/* Info Tambahan & Privacy (Sembunyi di HP, muncul di Laptop) */}
        <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-slate-900 space-y-4">
          <a href="mailto:p1998nr@gmail.com" className="text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-2">
            <span>✉️</span> Contact Support
          </a>
          <div className="bg-blue-600/5 p-2 rounded-lg border border-blue-500/10 text-center">
            <p className="text-[9px] text-blue-500/60 font-black uppercase tracking-widest">AMD R6 MODE</p>
          </div>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <section className="flex-1 p-4 md:p-10 overflow-y-auto z-10">
        <header className="mb-6 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">Games App</h1>
            <div className="h-1 w-16 bg-blue-600 mt-2 mx-auto md:mx-0 rounded-full"></div>
        </header>

        {/* GRID KARTU (1 kolom di HP, 3 di Laptop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {MY_GAMES.map((game) => (
            <div 
              key={game.id}
              onClick={() => setActiveId(game.id)}
              className={`group p-1 rounded-2xl transition-all duration-300 cursor-pointer ${activeId === game.id ? 'bg-blue-600 scale-[1.02] shadow-lg shadow-blue-900/40' : 'bg-slate-800'}`}
            >
              <div className="bg-slate-900 p-4 rounded-2xl h-full flex flex-col items-center">
                <div className="w-full h-24 bg-slate-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-slate-700">
                  <img src={`/${game.iconFile}`} alt={game.title} className="w-16 h-16 object-contain" />
                </div>
                <h3 className="font-bold text-sm mb-1 text-center">{game.title}</h3>
                <span className="text-[10px] text-blue-400 font-mono">{game.tech}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL BOX (Lebar penuh di HP) */}
        <div className="p-5 md:p-8 border border-slate-800 bg-slate-900/60 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-8 md:gap-12">
            <div className="w-full flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-slate-800 p-2 border border-slate-700">
                  <img src={`/${currentGame.iconFile}`} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black">{currentGame.title}</h2>
                  <p className="text-blue-500 text-xs font-mono">{currentGame.tech}</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm md:text-lg leading-relaxed mb-8 font-light">
                {currentGame.descFull}
              </p>
              
              <a 
                href={currentGame.link} 
                target="_blank" 
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white w-full md:w-max px-8 py-4 rounded-xl font-black transition-all active:scale-95 shadow-lg"
              >
                <span>📥</span> DOWNLOAD
              </a>
            </div>

            {/* SCREENSHOTS (Lebih kecil di HP) */}
            <div className="w-full xl:w-[350px]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-500 text-center md:text-left">Preview</h4>
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                {currentGame.screenshots.map((ss, index) => (
                  <div key={index} className="min-w-[250px] md:min-w-0 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                    <img src={`/${ss}`} className="w-full h-40 md:h-48 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
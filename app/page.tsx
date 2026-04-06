"use client";

import React, { useState } from 'react';

const MY_GAMES = [
  {
    id: "pixel-universe",
    title: "Pixel Universe",
    descFull: "Developed using Godot 4, this game focuses on high-speed movement and a unique teleportation mechanic.",
    tech: "Godot 4.2",
    link: "https://drive.google.com/file/d/1297vtnwaJKCdRf2u6ftLAb-Tjy2CtoqY/view?usp=sharing", 
    iconFile: "logo.png", 
    screenshots: ["9(1435).png"] 
  },
  {
    id: "block-fight",
    title: "Block Fight",
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
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col md:flex-row">

      {/* --- VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video key={isMuted ? "m" : "u"} autoPlay muted={isMuted} loop playsInline className="w-full h-full object-cover opacity-20">
          <source src="videomiku.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
      </div>

      {/* --- TOMBOL AUDIO --- */}
      <button onClick={() => setIsMuted(!isMuted)} className="fixed top-4 right-4 z-50 p-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full shadow-2xl active:scale-90 transition-transform">
        {isMuted ? "🔇" : "🔊"}
      </button>
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 border-b md:border-r border-slate-900 p-6 bg-slate-950/90 md:bg-slate-950/50 backdrop-blur-xl z-20 flex flex-col">
        <h2 className="text-xl font-black text-blue-500 mb-6 italic tracking-tighter">Artup STUDIO</h2>
        
        <nav className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
          <button className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full font-bold text-xs whitespace-nowrap">🎮 Games</button>
          <button className="px-4 py-2 text-slate-500 hover:text-white font-bold text-xs whitespace-nowrap transition-colors">🤖 Bot</button>
        </nav>
        
        <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-slate-900 space-y-3.5">
            <a href="/privacy" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors">🛡️ PRIVACY POLICY</a>
            <a href="mailto:p1998nr@gmail.com" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors">✉️ CONTACT SUPPORT</a>
            <div className="bg-blue-600/5 p-2 rounded-lg border border-blue-500/10 text-center">
              <p className="text-[8px] text-blue-500/60 font-mono tracking-widest uppercase">AMD R6 Optimized</p>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      {/* Jeda atas diperbesar ke pt-48 (HP & Laptop) */}
      <section className="flex-1 p-5 md:p-10 z-10 relative pt-48 md:pt-60">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Games App</h1>
          <div className="h-1 w-10 bg-blue-600 mt-2 rounded-full"></div>
        </header>

        {/* --- GRID GAME: KOTAK DIPERKECIL (HP & LAPTOP) --- */}
        <div className="flex flex-wrap gap-4 mb-10">
          {MY_GAMES.map((game) => (
            <div 
              key={game.id} 
              onClick={() => setActiveId(game.id)} 
              // Ukuran kotak dikunci ke w-24 (HP) dan w-32 (Laptop)
              className={`p-0.5 rounded-2xl cursor-pointer transition-all duration-300 w-24 md:w-32 ${activeId === game.id ? 'bg-blue-600 scale-[1.02] shadow-lg shadow-blue-900/40' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              <div className="bg-slate-900 p-2 md:p-3 rounded-2xl flex flex-col items-center">
                {/* Icon Container ikut mengecil */}
                <div className="w-full h-12 md:h-16 bg-slate-800/50 rounded-xl mb-2 flex items-center justify-center overflow-hidden border border-slate-700/50">
                  <img src={`/${game.iconFile}`} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="icon" />
                </div>
                <h3 className="font-bold text-[8px] md:text-[10px] text-center truncate w-full text-slate-200">{game.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOX DETAIL GAME --- */}
        <div className="p-6 md:p-10 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] backdrop-blur-md shadow-2xl relative">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl p-2 md:p-3 border border-slate-700 shadow-xl">
                  <img src={`/${currentGame.iconFile}`} className="w-full h-full object-contain" alt="current" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black tracking-tighter">{currentGame.title}</h2>
                <p className="text-blue-500 text-[9px] md:text-[11px] font-mono tracking-widest">{currentGame.tech}</p>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs md:text-base leading-relaxed max-w-3xl font-light">
              {currentGame.descFull}
            </p>
            
            <a href={currentGame.link} target="_blank" className="w-full md:w-max bg-blue-600 hover:bg-blue-500 text-center text-white px-10 py-4 rounded-2xl font-black text-xs md:text-sm active:scale-95 transition-all shadow-lg shadow-blue-900/30 tracking-widest">
              📥 DOWNLOAD SEKARANG
            </a>

            <div className="mt-6">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Gallery Preview</p>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                {currentGame.screenshots.map((ss, i) => (
                  <img key={i} src={`/${ss}`} className="h-32 md:h-52 rounded-2xl border border-slate-800 flex-shrink-0 shadow-2xl transition-transform hover:scale-[1.02]" alt="preview" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER MOBILE --- */}
        <div className="md:hidden mt-20 pt-8 border-t border-slate-900 flex flex-col items-center gap-4 pb-16">
          <div className="flex gap-8">
            <a href="/privacy" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest">Privacy</a>
            <a href="mailto:p1998nr@gmail.com" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest">Contact</a>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-slate-700 font-mono tracking-widest uppercase mb-1">Artup Studio &copy; 2026</p>
            <p className="text-[7px] text-blue-900/50 font-mono">AMD R6 DEV ENVIRONMENT</p>
          </div>
        </div>

      </section>
    </main>
  );
}
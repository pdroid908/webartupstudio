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
    // block di HP (atas-bawah), flex di Laptop (kiri-kanan)
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">

      {/* --- VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video key={isMuted ? "m" : "u"} autoPlay muted={isMuted} loop playsInline className="w-full h-full object-cover opacity-20">
          <source src="videomiku.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
      </div>

      {/* --- TOMBOL AUDIO --- */}
      <button onClick={() => setIsMuted(!isMuted)} className="fixed top-4 right-4 z-50 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full shadow-2xl">
        {isMuted ? "🔇" : "🔊"}
      </button>
      
      <div className="relative z-10 flex flex-col md:flex-row">
        
        {/* --- SIDEBAR: SEMBUNYI DI HP, MUNCUL DI LAPTOP --- */}
        <aside className="w-full md:w-64 md:min-h-screen border-b md:border-r border-slate-900 p-6 bg-slate-950/90 md:bg-slate-950/50 backdrop-blur-xl">
          <h2 className="text-xl font-black text-blue-500 mb-6 italic tracking-tighter">Artup STUDIO</h2>
          <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
            <button className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-xs whitespace-nowrap">🎮 Games</button>
            <button className="px-4 py-2 text-slate-400 font-bold text-xs whitespace-nowrap">🤖 Bot</button>
          </nav>
          
          {/* Info Tambahan hanya muncul di laptop agar tidak sempit di HP */}
          <div className="hidden md:block mt-auto pt-6 border-t border-slate-900 space-y-4">
             <a href="/privacy" className="text-[10px] font-bold text-slate-500 block hover:text-blue-400">🛡️ PRIVACY POLICY</a>
             <a href="mailto:p1998nr@gmail.com" className="text-[10px] font-bold text-slate-500 block hover:text-blue-400">✉️ CONTACT SUPPORT</a>
          </div>
        </aside>

        {/* --- KONTEN UTAMA --- */}
        <section className="flex-1 p-6 md:p-10">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Games App</h1>
            <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
          </header>

          {/* LIST GAME: Menyesuaikan layar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {MY_GAMES.map((game) => (
              <div key={game.id} onClick={() => setActiveId(game.id)} 
                className={`p-1 rounded-xl cursor-pointer transition-all ${activeId === game.id ? 'bg-blue-600 scale-105' : 'bg-slate-800'}`}>
                <div className="bg-slate-900 p-3 rounded-xl flex flex-col items-center">
                  <div className="w-full h-20 bg-slate-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    <img src={`/${game.iconFile}`} className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="font-bold text-[10px] md:text-xs text-center truncate w-full">{game.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* DETAIL GAME BOX */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-lg p-2 border border-slate-700">
                   <img src={`/${currentGame.iconFile}`} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black">{currentGame.title}</h2>
                  <p className="text-blue-500 text-[10px] font-mono">{currentGame.tech}</p>
                </div>
              </div>
              
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                {currentGame.descFull}
              </p>
              
              <a href={currentGame.link} target="_blank" className="w-full md:w-max bg-blue-600 text-center text-white px-6 py-3 rounded-xl font-black text-xs active:scale-95 transition-all">
                📥 DOWNLOAD SEKARANG
              </a>

              {/* GALLERY PREVIEW: Swipe ke samping di HP */}
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-3">Gallery Preview</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {currentGame.screenshots.map((ss, i) => (
                    <img key={i} src={`/${ss}`} className="h-32 md:h-40 rounded-lg border border-slate-800 flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
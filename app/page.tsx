"use client";

import React, { useState } from 'react';

// --- DATA GAMES (DOWNLOADABLE) ---
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
    title: "Cozy Block Fight",
    descFull: "Combine, clash, and conquer! Block Fight is a fast-paced Match-3 puzzle game built with the Godot Engine.",
    tech: "Godot 4.6",
    link: "https://drive.google.com/file/d/1eeCR1z4p6NSYJuGj57cpiM5WqKHLw1k-/view?usp=sharing",
    iconFile: "ungull.png", 
    screenshots: ["bl1.jpg","2.jpg"] 
  }
];

// --- DATA WEB GAMES ---
const WEB_GAMES = [
  {
    id: "block-fight-web",
    title: "Cozy Block Fight",
    descFull: "Play directly in your browser! Align three or more identical pets to clear them from the board and score big combos.",
    tech: "Godot 4.6 (HTML5)",
    embedUrl: "https://itch.io/embed-upload/17083570?color=333333",
    iconFile: "ungull.png", 
    screenshots: ["bl1.jpg"] 
  }
];

// --- DATA BOT ---
const MY_BOTS = [
  {
    id: "bot-antam",
    title: "Bot Antam Selenium",
    descFull: "Automation bot built with Python and Selenium to manage appointment queues effectively and save your time.",
    tech: "Python 3.10",
    link: "#", 
    iconFile: "bot_icon.png", 
    screenshots: [] 
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('games');
  const [activeGameId, setActiveGameId] = useState(MY_GAMES[0].id);
  const [activeWebId, setActiveWebId] = useState(WEB_GAMES[0].id);
  const [activeBotId, setActiveBotId] = useState(MY_BOTS[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  // Logika Data Dinamis
  const currentItems = 
    activeTab === 'games' ? MY_GAMES : 
    activeTab === 'web' ? WEB_GAMES : 
    MY_BOTS;

  const currentActiveId = 
    activeTab === 'games' ? activeGameId : 
    activeTab === 'web' ? activeWebId : 
    activeBotId;

  const currentItem = currentItems.find(item => item.id === currentActiveId) || currentItems[0];

  const handleItemClick = (id: string) => {
    if (activeTab === 'games') setActiveGameId(id);
    else if (activeTab === 'web') {
      setActiveWebId(id);
      setShowIframe(false);
    }
    else setActiveBotId(id);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowIframe(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative">

      {/* --- VIDEO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          key={isMuted ? "m" : "u"} 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-100"
        >
          <source src="videomiku.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
      </div>

      {/* --- TOMBOL AUDIO --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)} 
        className="fixed top-6 right-6 z-50 p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full shadow-2xl active:scale-90 transition-all hover:bg-slate-800"
      >
        <span className="text-xl md:text-2xl">{isMuted ? "🔇" : "🔊"}</span>
      </button>

      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 md:h-screen md:fixed md:top-0 md:left-0 border-b md:border-r border-slate-900 p-4 md:p-6 bg-slate-950/90 md:bg-slate-950/80 backdrop-blur-xl z-30 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black text-blue-500 mb-4 md:mb-6 italic tracking-tighter uppercase">Artup STUDIO</h2>
          
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide mb-4">
            <button 
              onClick={() => handleTabChange('games')}
              className={`px-4 py-2 rounded-full font-bold text-[10px] md:text-xs whitespace-nowrap transition-all ${activeTab === 'games' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-white bg-slate-900/50'}`}
            >
              🎮 App Games
            </button>
            <button 
              onClick={() => handleTabChange('web')}
              className={`px-4 py-2 rounded-full font-bold text-[10px] md:text-xs whitespace-nowrap transition-all ${activeTab === 'web' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-500 hover:text-white bg-slate-900/50'}`}
            >
              🌐 Web Games
            </button>
            <button 
              onClick={() => handleTabChange('bots')}
              className={`px-4 py-2 rounded-full font-bold text-[10px] md:text-xs whitespace-nowrap transition-all ${activeTab === 'bots' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-white bg-slate-900/50'}`}
            >
              🤖 Bot
            </button>
          </nav>

          <a 
            href="https://wa.me/6281328343908?text=Hello%20Artup%20Studio" 
            target="_blank"
            className="w-full px-4 py-2.5 rounded-xl font-bold text-[10px] md:text-xs transition-all bg-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white flex items-center justify-center gap-2"
          >
            Hire Me
          </a>
        </div>

        <div className="hidden md:flex flex-col gap-4 mt-auto ">
            <div className="space-y-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Support Me</p>
              <a href="https://paypal.me/put98" target="_blank" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-sm">❤️</span><span className="text-[10px] font-bold text-blue-400">PayPal</span>
              </a>
              <div className="flex items-center gap-2">
                <span className="text-sm">💚</span><span className="text-[10px] font-bold text-purple-400">OVO: 0813-2834-3908</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-900">
              <a href="/privacy" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 block transition-colors">🛡️ PRIVACY POLICY</a>
              <a href="mailto:p1998nr@gmail.com" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 block transition-colors">✉️ CONTACT SUPPORT</a>
              <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 text-center">
                <p className="text-[8px] text-blue-500 font-mono tracking-widest uppercase italic">AMD R6 Optimized</p>
              </div>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <section className="relative z-10 p-5 md:p-10 md:ml-64 pt-48 md:pt-60 min-h-screen">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {activeTab === 'games' ? 'My Games' : activeTab === 'web' ? 'Web Games' : 'My Bots'}
          </h1>
          <div className="h-1 w-10 bg-blue-600 mt-2 rounded-full"></div>
        </header>

        {/* --- GRID ITEMS --- */}
        <div className="flex flex-wrap gap-4 mb-10">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item.id)} 
              className={`p-0.5 rounded-2xl cursor-pointer transition-all duration-300 w-24 md:w-32 ${currentActiveId === item.id ? 'bg-blue-600 scale-[1.02] shadow-lg shadow-blue-900/40' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              <div className="bg-slate-900 p-2 md:p-3 rounded-2xl flex flex-col items-center">
                <div className="w-full h-12 md:h-16 bg-slate-800/50 rounded-xl mb-2 flex items-center justify-center overflow-hidden border border-slate-700/50">
                  <img src={`/${item.iconFile}`} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="icon" />
                </div>
                <h3 className="font-bold text-[8px] md:text-[10px] text-center truncate w-full text-slate-200">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* --- DETAIL BOX --- */}
        <div className="p-6 md:p-10 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] backdrop-blur-md shadow-2xl relative mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-2xl p-2 md:p-3 border border-slate-700">
                  <img src={`/${currentItem.iconFile}`} className="w-full h-full object-contain" alt="current" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black tracking-tighter">{currentItem.title}</h2>
                <p className="text-blue-500 text-[9px] md:text-[11px] font-mono tracking-widest">{currentItem.tech}</p>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs md:text-base leading-relaxed max-w-3xl font-light">
              {currentItem.descFull}
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {activeTab === 'web' ? (
                <button 
                  onClick={() => setShowIframe(true)}
                  className="w-full md:w-max bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl font-black text-xs md:text-sm active:scale-95 transition-all shadow-lg uppercase tracking-widest flex items-center gap-2"
                >
                  <span>🎮</span> Play Game
                </button>
              ) : (
                <a href={'link' in currentItem ? currentItem.link : '#'} target="_blank" className="w-full md:w-max bg-blue-600 hover:bg-blue-500 text-center text-white px-10 py-4 rounded-2xl font-black text-xs md:text-sm active:scale-95 transition-all shadow-lg uppercase tracking-widest">
                  📥 Download
                </a>
              )}
            </div>

            {/* AREA IFRAME (Full Screen Game Focus) */}
            {showIframe && activeTab === 'web' && (
              <div className="mt-6 flex flex-col items-center w-full relative animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-[800px] aspect-video relative rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-black">
                  <iframe 
                    src={(currentItem as any).embedUrl} 
                    allowFullScreen
                    allow="autoplay; focus-without-user-activation; clipboard-write"
                    className="absolute top-0 left-0 w-full h-full border-none"
                  />
                </div>
                
                <button 
                  onClick={() => setShowIframe(false)}
                  className="mt-6 px-10 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400 hover:bg-red-500 hover:text-white font-bold uppercase tracking-widest transition-all"
                >
                  × Close Session
                </button>
              </div>
            )}

            {/* Gallery Section */}
            {currentItem.screenshots && currentItem.screenshots.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Gallery Preview</p>
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                  {currentItem.screenshots.map((ss, i) => (
                    <img key={i} src={`/${ss}`} className="h-32 md:h-52 rounded-2xl border border-slate-800 flex-shrink-0 shadow-2xl transition-transform hover:scale-[1.02]" alt="preview" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER MOBILE --- */}
        <div className="md:hidden mt-10 p-6 bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center gap-2">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Support My Work</p>
             <div className="flex gap-4">
                <a href="https://paypal.me/put98" className="text-xs font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">❤️PayPal</a>
                <div className="text-xs font-bold text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20">💚OVO: 081328343908</div>
             </div>
          </div>
          <div className="w-full flex flex-row justify-center items-center gap-8 mt-6">
            <a href="/privacy" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-[0.15em] transition-colors">
              Privacy Policy
            </a>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <a href="mailto:p1998nr@gmail.com" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-[0.15em] transition-colors">
              Contact Support
            </a>
          </div>
          <p className="text-[8px] text-slate-700 font-mono text-center tracking-[0.2em] uppercase mt-4 leading-relaxed">
            Artup Studio &copy; 2026<br/>
            Honest and pure heart
          </p>
        </div>

      </section>
    </main>
  );
}
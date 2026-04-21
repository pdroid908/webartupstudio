"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// --- INTERFACE UNTUK TYPE SAFETY ---
interface BaseItem {
  id: string;
  title: string;
  descFull: string;
  tech: string;
  iconFile: string;
  screenshots: string[];
  link?: string; // Opsional untuk App
  embedUrl?: string; // Khusus untuk Web
  videoId?: string;
}

const MY_GAMES: BaseItem[] = [
  {
    id: "pixel-universe",
    title: "Pixel Universe",
    descFull:
      "Master the art of precision and speed! Experience a high-octane platformer built with Godot 4, featuring fluid movement and a unique teleportation mechanic that challenges your reflexes.",
    tech: "Android",
    link: "https://drive.google.com/file/d/1297vtnwaJKCdRf2u6ftLAb-Tjy2CtoqY/view?usp=sharing",
    iconFile: "logo.png",
    videoId: "gIep-OxzPvA",
    screenshots: ["9(1435).png"],
  },
  {
    id: "block-fight",
    title: "Cozy Block Fight",
    descFull:
      "A vibrant fusion of tactical strategy and satisfying Match-3 mechanics. Unleash powerful combos and conquer challenging levels in this polished 2D puzzle adventure.",
    tech: "Android",
    link: "https://drive.google.com/file/d/16gjJGQsM72Roj19gAV1Gmw5kJ-B_Vt_o/view?usp=sharing",
    iconFile: "ungull.png",
    videoId: "2XC5AdWQZf8",
    screenshots: ["bl1.jpg", "2.jpg"],
  },
];

const WEB_GAMES: BaseItem[] = [
  {
    id: "block-fight-web",
    title: "Cozy Block Fight",
    descFull:
      "A fast-paced Match-3 puzzle challenge where strategy meets speed. Align identical blocks, trigger massive combos, and push your skills to the limit. Your goal is simple: achieve the ultimate high score and claim the #1 spot on the leaderboard!",
    tech: "Web Game, All device can play",
    embedUrl: "https://itch.io/embed-upload/17103809?color=333333",
    iconFile: "ungull.png",
    videoId: "2XC5AdWQZf8",
    screenshots: ["bl1.jpg", "ssblov1.png", "blocss2.png", "ssblo3.png"],
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"web" | "games">("web");
  const [activeGameId, setActiveGameId] = useState(MY_GAMES[0].id);
  const [activeWebId, setActiveWebId] = useState(WEB_GAMES[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    
    setLoading(false);

    const handleFocus = () => setLoading(false);
    window.addEventListener("pageshow", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("pageshow", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getItemsByTab = () => (activeTab === "games" ? MY_GAMES : WEB_GAMES);
  const getActiveIdByTab = () =>
    activeTab === "games" ? activeGameId : activeWebId;

  const currentItems = getItemsByTab();
  const currentActiveId = getActiveIdByTab();
  const currentItem =
    currentItems.find((item) => item.id === currentActiveId) || currentItems[0];

  const handleItemClick = (id: string) => {
    if (activeTab === "games") setActiveGameId(id);
    else if (activeTab === "web") {
      setActiveWebId(id);
      setShowIframe(false);
    }
  };

  const handleTabChange = (tab: "web" | "games") => {
    // Reset loading setiap ganti tab agar tidak nyangkut
    setLoading(false);
    setTimeout(() => {
      setActiveTab(tab);
      setShowIframe(false);
    }, 200);
  };

  const handleSecurityClick = () => {
    // Aktifkan loading HANYA sebelum pindah halaman
    
    setTimeout(() => {
      window.location.href = "/Security";
    }, 400);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="bgrun.png"
          alt="Background"
          /* object-cover: Mengunci rasio gambar agar tidak gepeng. 
       object-center: Memastikan bagian tengah GIF selalu di tengah layar.
    */
          className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-1000"
        />

        {/* Overlay agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950"></div>
      </div>

      {/* --- AUDIO TOGGLE --- */}
      {/* --- SIDEBAR --- */}
      <aside className="pt-20 w-full md:w-64 md:h-screen md:fixed md:top-0 md:left-0 border-b md:border-r border-slate-900 p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl z-30 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black text-blue-500 italic tracking-tighter uppercase">
            Artup STUDIO
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-0.5 mb-6">
            HIGH-TECH
          </p>

          {/* NAVIGASI: Flex-row dan overflow-x-auto agar memanjang ke kanan di HP */}
          <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide mb-6 w-full">
            {/* Tombol Web Games */}
            <button
              onClick={() => handleTabChange("web")}
              className="flex-shrink-0 group relative h-12 w-[140px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
            >
              {/* Efek Gerak muncul HANYA saat TIDAK terpilih (activeTab !== "web") */}
              {activeTab !== "web" && (
                <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#3b82f6_50%,#1e293b_100%)]" />
              )}

              <div
                className={`flex h-full w-full items-center justify-center gap-3 rounded-2xl px-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 z-10
      ${
        activeTab === "web"
          ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-2 border-blue-400"
          : "bg-slate-950 text-slate-500 hover:text-white hover:bg-blue-600"
      }`}
              >
                <span className="text-sm">🌐</span> Web Games
              </div>
            </button>

            {/* --- TOMBOL APP GAMES --- */}
            <button
              onClick={() => handleTabChange("games")}
              className="flex-shrink-0 group relative h-12 w-[140px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
            >
              {/* Efek Gerak muncul HANYA saat TIDAK terpilih */}
              {activeTab !== "games" && (
                <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#3b82f6_50%,#1e293b_100%)]" />
              )}

              <div
                className={`flex h-full w-full items-center justify-center gap-3 rounded-2xl px-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 z-10
      ${
        activeTab === "games"
          ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-2 border-blue-400"
          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-blue-600 "
      }`}
              >
                <span className="text-sm">🎮</span> App Games
              </div>
            </button>

            {/* --- TOMBOL SYSTEM INFO (WARNA BIRU/CYAN) --- */}
            <Link
              href="/cek"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
              className="flex-shrink-0 group relative h-12 w-[160px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
            >
              {/* 1. ANIMASI BORDER (GERAK - WARNA BIRU) */}
              <div
                className="absolute inset-[-1000%] 
    animate-[spin_6s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#0f172a_0%,#3b82f6_50%,#0f172a_100%)] 
    
    group-hover:animate-[spin_2s_linear_infinite]
    group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_50%,#06b6d4_100%)]"
              />

              {/* 2. ISI TOMBOL */}
              <div className="hover:bg-blue-600 flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 z-10">
                <span className="text-blue-500">🖥️</span>
                <span className="font-black text-[10px] uppercase tracking-[0.1em] text-blue-200/70">
                  Auto Farming
                </span>
              </div>

              {/* 3. GLOW DI BELAKANG */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity duration-500 
    bg-blue-500/10 group-hover:bg-cyan-500/30 blur-2xl z-0"
              />
            </Link>

            {/* --- TOMBOL SECURITY SCAN (PEMBERANI/MERAH) --- */}
            <Link
              href="/Security"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
              className="flex-shrink-0 group relative h-12 w-[160px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
            >
              {/* 1. ANIMASI BORDER (GERAK TERUS) */}
              <div
                className="absolute inset-[-1000%] 
    /* SAAT DIAM: Putar Kuning-Orange (Efek Standby) */
    animate-[spin_6s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#78350f_0%,#f59e0b_50%,#78350f_100%)] 
    
    /* SAAT HOVER: Putar Merah-Orange Cepat (Efek Alert) */
    group-hover:animate-[spin_2s_linear_infinite]
    group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f97316_50%,#ef4444_100%)]"
              />

              {/* 2. ISI TOMBOL */}
              <div
                className="flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 transition-all duration-500 z-10 
    group-hover:bg-red-950/20 group-hover:backdrop-blur-sm"
              >
                {/* Icon Shield - Kuning saat diam, Merah saat hover */}
                <span className="text-orange-500 group-hover:text-red-500 animate-pulse group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300">
                  🛡️
                </span>

                {/* Teks */}
                <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-orange-200/70 group-hover:text-white transition-all duration-300">
                  LINK SCANNER
                </span>
              </div>

              {/* 3. GLOW DI BELAKANG */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity duration-500 
    bg-orange-500/10 group-hover:bg-red-500/30 blur-2xl z-0"
              />
            </Link>
          </nav>

          <a
            href="https://wa.me/6281328343908"
            target="_blank"
            className="w-full px-4 py-3 rounded-xl font-bold text-[10px] transition-all bg-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white flex items-center justify-center gap-2 mb-6"
          >
            Hire Me / Developer
          </a>

          {/* KONTAK ME */}
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
              My email, tell me what you need
            </p>
            <a
              href="mailto:p1998nr@gmail.com"
              className="text-[10px] md:text-xs font-bold text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800 hover:border-blue-500 transition-all flex items-center gap-2"
            >
              <span>✉️</span> p1998nr@gmail.com
            </a>
          </div>
        </div>

        {/* Support Section Desktop */}
        <div className="hidden md:flex flex-col gap-4 mt-auto pt-6 border-t border-slate-900">
          <div className="space-y-2 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
              Support Me
            </p>
            <a
              href="https://paypal.me/put98"
              target="_blank"
              className="flex items-center gap-2 group"
            >
              <span className="text-sm">❤️</span>
              <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300">
                PayPal
              </span>
            </a>
            <div className="flex items-center gap-2">
              <span className="text-sm">💚</span>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tight">
                OVO: 0813-2834-3908
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <a
              href="/privacy"
              className="text-[10px] font-bold text-slate-500 hover:text-blue-400 block transition-colors uppercase italic"
            >
              🛡️ Privacy Policy
            </a>
            <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 text-center">
              <p className="text-[8px] text-blue-500 font-mono uppercase italic">
                AMD R6 Optimized
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* --- MAIN CONTENT --- */}
      <section className="relative z-10 p-5 md:p-10 md:ml-64 pt-20 md:pt-56 min-h-screen">
        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-zinc-100">
            {activeTab === "web" ? "Web Games" : "My Games"}
          </h1>
          <div
            className={`h-1.5 w-12 mt-2 rounded-full ${activeTab === "web" ? "bg-purple-600" : "bg-blue-600"}`}
          ></div>
        </header>

        {/* GRID SELECTOR */}
        <div className="flex flex-wrap gap-3 mb-10">
          {currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`p-0.5 rounded-2xl cursor-pointer transition-all duration-300 w-24 md:w-32 ${currentActiveId === item.id ? (activeTab === "web" ? "bg-purple-600 shadow-purple-900/40" : "bg-blue-600 shadow-blue-900/40") + " scale-[1.05] shadow-lg" : "bg-slate-800 hover:bg-slate-700"}`}
            >
              <div className="bg-slate-900 p-2 md:p-3 rounded-2xl flex flex-col items-center">
                <div className="w-full h-12 md:h-16 bg-slate-800/50 rounded-xl mb-2 flex items-center justify-center overflow-hidden border border-slate-700/50">
                  <img
                    src={`/${item.iconFile}`}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    alt={item.title}
                  />
                </div>
                <h3 className="font-bold text-[8px] md:text-[10px] text-center truncate w-full text-slate-200">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* DISPLAY PANEL */}
        <div className="p-6 md:p-12 bg-slate-900/70 border border-slate-800 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative mb-20 min-h-[450px]">
          {!showIframe ? (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-800 rounded-2xl p-2 md:p-4 border border-slate-700 shadow-inner">
                  <img
                    src={`/${currentItem.iconFile}`}
                    className="w-full h-full object-contain"
                    alt="icon"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">
                    {currentItem.title}
                  </h2>
                  <p
                    className={`${activeTab === "web" ? "text-purple-500" : "text-blue-500"} text-[10px] md:text-xs font-mono tracking-[0.2em]`}
                  >
                    {currentItem.tech}
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-3xl font-medium">
                {currentItem.descFull}
              </p>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                {activeTab === "web" && currentItem.embedUrl ? (
                  <button
                    onClick={() => setShowIframe(true)}
                    className="w-full md:w-max bg-purple-600 hover:bg-purple-500 text-white px-14 py-4 rounded-2xl font-black text-xs md:text-sm active:scale-95 transition-all shadow-xl shadow-purple-900/20 uppercase tracking-widest flex items-center gap-3"
                  >
                    <span>🎮</span> Play Now
                  </button>
                ) : (
                  <a
                    href={currentItem.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-max bg-blue-600 hover:bg-blue-500 text-center text-white px-12 py-4 rounded-2xl font-black text-xs md:text-sm active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase tracking-widest"
                  >
                    📥 Download
                  </a>
                )}
              </div>

              {/* --- BAGIAN SHOWCASE VIDEO & SCREENSHOTS --- */}
              {currentItem.screenshots.length > 0 && (
                <div className="mt-10">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-5 px-1">
                    Project Trailer & Screenshots
                  </p>

                  <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide items-start">
                    {/* 1. Tampilkan Iframe Video Jika Ada ID Video */}
                    {currentItem.videoId && (
                      <div className="flex-shrink-0 w-[300px] md:w-[480px] aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          // Menggunakan autoplay, mute (agar autoplay jalan), dan loop
                          src={`https://www.youtube-nocookie.com/embed/${currentItem.videoId}?autoplay=0&mute=1&loop=1&playlist=${currentItem.videoId}`}
                          title="Artup Studio Showcase"
                          frameBorder="0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    )}

                    {/* 2. Loop Screenshot Seperti Biasa */}
                    {currentItem.screenshots.map((ss, i) => (
                      <img
                        key={i}
                        src={`/${ss}`}
                        className="h-[168px] md:h-[270px] w-auto rounded-3xl border border-slate-800 shadow-2xl object-cover hover:scale-[1.02] transition-transform duration-500"
                        alt={`screenshot-${i}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-in zoom-in fade-in duration-500">
              <div className="w-full max-w-[480px] aspect-[720/1100] relative rounded-[2rem] overflow-hidden border-8 border-slate-950 bg-black shadow-2xl">
                <iframe
                  src={currentItem.embedUrl}
                  allowFullScreen
                  allow="autoplay; focus-without-user-activation; clipboard-write; storage-access"
                  sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
                  className="absolute top-0 left-0 w-full h-full border-none"
                />
              </div>
              <button
                onClick={() => setShowIframe(false)}
                className="mt-8 px-12 py-3 bg-red-600/10 border border-red-500/20 rounded-full text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-900/10"
              >
                × Close Game
              </button>
            </div>
          )}
        </div>

        {/* FOOTER MOBILE */}
        <footer className="md:hidden mt-10 p-8 bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] border border-slate-800 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">
            Support My Work
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://paypal.me/put98"
              className="text-xs font-bold text-blue-400 bg-blue-500/10 px-5 py-2.5 rounded-xl border border-blue-500/20"
            >
              PayPal
            </a>
            <div className="text-xs font-bold text-purple-400 bg-purple-500/10 px-5 py-2.5 rounded-xl border border-purple-500/20">
              OVO: 0813-2834-3908
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-2">
            <a
              href="mailto:p1998nr@gmail.com"
              className="text-[10px] font-bold text-blue-500 underline uppercase italic"
            >
              Email Support: p1998nr@gmail.com
            </a>
            <a
              href="/privacy"
              className="text-[10px] font-bold text-slate-600 uppercase italic"
            >
              🛡️ Privacy Policy
            </a>
          </div>

          <div className="text-[9px] text-slate-600 font-mono uppercase">
            Artup Studio &copy; 2026
            <br />
            Honest and pure heart
          </div>
        </footer>
      </section>

      {/* --- SATU OVERLAY GLOBAL (DI LUAR SECTION) --- */}
      {/* --- SATU OVERLAY GLOBAL --- */}
      {/* Overlay Loading */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 
  ${loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {loading && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center">
            {/* Isi spinner kamu */}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";
//c
import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- INTERFACE UNTUK TYPE SAFETY ---
interface BaseItem {
  id: string;
  title: string;

  tech: string;

  link?: string;

  isInternal?: boolean; // TAMBAHKAN BARIS INI (Pake tanda tanya)
  route?: string;
}

const MY_GAMES: BaseItem[] = [
  {
    id: "pixel-universe",
    title: "Analisis Big Data",
    tech: "Android",
    link: "https://drive.google.com/file/d/1297vtnwaJKCdRf2u6ftLAb-Tjy2CtoqY/view?usp=sharing",
  },
  {
    id: "block-fight",
    title: "Chats with Mio",
    route: "/chat_otomatis",
    tech: "Web Game",
  },
];

const WEB_GAMES: BaseItem[] = [
  {
    id: "foto_converter",
    title: "Foto Converter",

    tech: "Web Game, All device can play",
    route: "/converter", // Tambahkan ini
  },
  // Kamu bisa tambah tool lain di sini
  {
    id: "scanner",
    title: "Link Scanner",

    tech: "Web Game",
    route: "/Security",
  },
  {
    id: "humanizer",
    title: "AI Humanizer",

    tech: "Web Game",
    route: "/humanize",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"web" | "games">("web");

  useEffect(() => {
    const handleFocus = () => setLoading(false);
    window.addEventListener("pageshow", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("pageshow", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getItemsByTab = () => (activeTab === "games" ? MY_GAMES : WEB_GAMES);

  const currentItems = getItemsByTab();

  const handleTabChange = (tab: "web" | "games") => {
    // Reset loading setiap ganti tab agar tidak nyangkut
    setLoading(false);
    setTimeout(() => {
      setActiveTab(tab);
    }, 200);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/bgrun.png')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/50 via-slate-950/20 to-slate-950/70" />
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="pt-10 w-full md:w-64 md:h-screen md:fixed md:top-0 md:left-0 border-b md:border-r border-slate-900 p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl z-30 flex flex-col md:overflow-y-auto scrollbar-hide">
        {/* CSS inline untuk memastikan scrollbar tidak muncul tapi tetap bisa di-scroll */}
        <style jsx>{`
          aside::-webkit-scrollbar {
            display: none;
          }
          aside {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Bungkus konten utama dengan flex-1 agar bagian bawah terdorong ke bawah secara alami */}
        <div className="flex-1">
          <div>
            <h2 className="text-3xl font-black text-blue-500 italic tracking-tighter uppercase">
              Artup STUDIO
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-0.5 mb-6">
              HIGH-TECH
            </p>

            {/* NAVIGASI */}
            <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide mb-6 w-full">
              {/* Tombol Web Games */}
              <button
                onClick={() => handleTabChange("web")}
                // Tambahkan transition-all dan duration agar pergerakannya tidak patah
                className="flex-shrink-0 group relative h-12 w-[140px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all duration-300 ease-out active:scale-90"
              >
                {/* Border animasi (tetap ada saat tidak aktif) */}
                {activeTab !== "web" && (
                  <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#3b82f6_50%,#1e293b_100%)]" />
                )}

                {/* Div Utama */}
                <div
                  className={`flex h-full w-full items-center justify-center gap-3 rounded-2xl px-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ease-out z-10 ${
                    activeTab === "web"
                      ? "bg-blue-600 text-white scale-105 shadow-[0_0_25px_rgba(37,99,235,0.5)] border-2 border-blue-400"
                      : "bg-slate-950 text-slate-500 hover:bg-blue-900/50"
                  }`}
                >
                  <span className="text-sm">Free tools</span>
                </div>
              </button>

              {/* --- TOMBOL APP GAMES --- */}
              <button
                onClick={() => handleTabChange("games")}
                className="flex-shrink-0 group relative h-12 w-[140px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
              >
                {activeTab !== "games" && (
                  <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#3b82f6_50%,#1e293b_100%)]" />
                )}
                <div
                  className={`flex h-full w-full items-center justify-center gap-3 rounded-2xl px-5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${activeTab === "games" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-2 border-blue-400" : "bg-slate-950 text-slate-400 hover:text-white hover:bg-blue-600 "}`}
                >
                  <span className="text-sm">Premium Tools</span>
                </div>
              </button>
            </nav>

            {/* KONTAK ME */}
            <div className="flex flex-col gap-2 mb-10">
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
        </div>

        {/* Support Section Desktop - Menggunakan mt-10 agar tetap punya jarak meski justify-between dihapus */}
        <div className="hidden md:flex flex-col gap-4 mt-10 pt-6 border-t border-slate-900">
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
          <div className="space-y-2 mb-4">
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
          <h1 className="text-3xl md:text-3xl font-black tracking-tight uppercase italic text-zinc-100">
            {activeTab === "web" ? "Free tools" : "Premium tools"}
          </h1>
          <div
            className={`h-1.5 w-24 mt-2 rounded-full ${activeTab === "web" ? "bg-purple-600" : "bg-blue-600"}`}
          ></div>
        </header>

        {/* GRID SELECTOR */}
        <div className="flex flex-wrap gap-6 mb-10">
          {currentItems.map((item) => {
            const isClickable = !!item.route;

            // Gunakan gradient border dan shadow yang lebih "menyala"
            const Content = (
              <div
                className={`relative w-full h-full p-5 rounded-3xl flex flex-col items-center justify-center 
        ${
          isClickable
            ? "bg-slate-900/80 hover:bg-blue-900/40 border border-blue-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            : "bg-slate-950 border border-slate-800"
        } transition-all duration-300`}
              >
                {isClickable && (
                  <div className="absolute top-2 right-2 opacity-50">
                    <span className="text-[10px] text-cyan-400">↗</span>
                  </div>
                )}

                <h3
                  className={`font-black text-sm uppercase tracking-widest transition-colors
          ${isClickable ? "text-cyan-100 group-hover:text-white" : "text-slate-600"}`}
                >
                  {item.title}
                </h3>
              </div>
            );

            const containerClass = `w-[150px] h-[100px] relative group transition-all duration-300 
      ${isClickable ? "cursor-pointer hover:-translate-y-1" : "cursor-default"}`;

            if (isClickable) {
              return (
                <Link
                  key={item.id}
                  href={item.route!}
                  className={containerClass}
                  onClick={() => setLoading(true)}
                >
                  {Content}
                </Link>
              );
            }
            return (
              <div key={item.id} className={containerClass}>
                {Content}
              </div>
            );
          })}
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

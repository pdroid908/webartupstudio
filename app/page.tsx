"use client";
//c
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';



export default function Home() {
  const [loading, setLoading] = useState(false);
 

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

  

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
        src="/bgrun.png"
        alt="Background"
        fill
        priority
        className="object-cover object-center opacity-100 transition-opacity duration-1000"
      />

        {/* Overlay agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-a from-slate-950/70 via-slate-950/20 to-slate-950"></div>
      </div>


      {/* --- SEO CONTENT (Tengah Layar) --- */}
<div className="absolute inset-0 flex items-center justify-center z-10 px-6">
  <div className="max-w-2xl text-center space-y-6">
    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 uppercase tracking-tighter drop-shadow-2xl">
      High-Tech Development & Security
    </h1>
    <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
      Di <strong>Artup STUDIO</strong>, kami memprioritaskan keamanan siber dalam setiap baris kode. 
      Membangun aplikasi, website, dan game berperforma tinggi yang aman, stabil, dan dirancang khusus untuk memenuhi kebutuhan bisnis digital Anda di era modern.
    </p>
    <div className="flex gap-4 justify-center">
      <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full text-[10px] text-blue-500 font-mono tracking-widest uppercase">
        Secure by Design
      </div>
      <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full text-[10px] text-blue-500 font-mono tracking-widest uppercase">
        Performance Optimized
      </div>
    </div>
  </div>
</div>

      {/* --- AUDIO TOGGLE --- */}
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


              {/* --- TOMBOL LINK SCANNER --- */}
              <Link
                href="/Security"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1000);
                }}
                className="flex-shrink-0 group relative h-12 w-[160px] md:w-full flex items-center justify-center p-[2px] rounded-2xl overflow-hidden transition-all active:scale-95"
              >
                <div className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#78350f_0%,#f59e0b_50%,#78350f_100%)] group-hover:animate-[spin_2s_linear_infinite] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f97316_50%,#ef4444_100%)]" />
                <div className="flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 transition-all duration-500 z-10 group-hover:bg-red-950/20 group-hover:backdrop-blur-sm">
                  <span className="text-orange-500 group-hover:text-red-500 animate-pulse group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300">
                    🛡️
                  </span>
                  <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-orange-200/70 group-hover:text-white transition-all duration-300">
                    LINK SCANNER
                  </span>
                </div>
                <div className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity duration-500 bg-orange-500/10 group-hover:bg-red-500/30 blur-2xl z-0" />
              </Link>
            </nav>


{/* KONTAK ME wa */}
            <a
              href="https://wa.me/6281328343908"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 rounded-xl font-bold text-[10px] transition-all bg-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white flex items-center justify-center gap-2 mb-6"
            >
              wa: jasa buat web / app / games murah dan aman
            </a>

            {/* KONTAK ME */}
            <div className="flex flex-col gap-2 mb-10">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
                My email, tell me what you need
              </p>
              <a
                href="mailto:p1998nr@gmail.com"
                rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
            <Link
              href="/privacy"
              className="text-[10px] font-bold text-slate-500 hover:text-blue-400 block transition-colors uppercase italic"
            >
              🛡️ Privacy Policy
            </Link>
            <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 text-center">
              <p className="text-[8px] text-blue-500 font-mono uppercase italic">
                AMD R6 Optimized
              </p>
            </div>
          </div>
        </div>
      </aside>

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

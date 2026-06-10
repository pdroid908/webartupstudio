"use client";

import { useState } from "react";

export default function DonateBox() {
  const [open, setOpen] = useState(true);
  // State untuk melacak status copy
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("0813-2834-3908");
    setCopied(true);
    
    // Kembalikan ke teks semula setelah 2 detik
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="relative">
        <div className="w-72 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-white p-5 animate-in fade-in slide-in-from-bottom-3">
          
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">☕ Traktir developer kopi</p>
            <p className="text-xs text-white/60">Terima kasih sudah mampir ❤️</p>
          </div>

          {/* OVO */}
          <div className="mb-4 rounded-xl bg-white/5 p-3 border border-white/10">
            <p className="text-xs text-white/50">OVO</p>
            <p className="font-mono text-sm font-semibold tracking-wide">
              0813-2834-3908
            </p>
          </div>

          {/* PayPal */}
          <a
            href="https://paypal.me/put98"
            target="_blank"
            className="block text-center text-sm font-semibold text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 rounded-xl border border-blue-500/20 transition mb-3"
          >
            Donate via PayPal
          </a>

          {/* Copy Button dengan efek dinamis */}
          <button
            onClick={handleCopy}
            className={`w-full text-sm py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              copied 
                ? "bg-green-500 text-white" 
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {copied ? "Berhasil disalin! ✅" : "Copy nomor OVO"}
          </button>
        </div>
      </div>
    </div>
  );
}
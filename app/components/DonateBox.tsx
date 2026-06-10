"use client";

import { useState } from "react";

export default function DonateBox() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Overlay click area kecil (optional, tidak ganggu full screen) */}
      <div className="relative">

        {/* Card */}
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
            <p className="text-xs text-white/60">
              Terima kasih sudah mampir ❤️
            </p>
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

          {/* Copy Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText("0813-2834-3908");
            }}
            className="w-full bg-white text-black text-sm py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Copy nomor OVO
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

type DonateMethod = {
  id: string;
  label: string;
  type: "copy" | "link";
  value: string;
};

const DONATE_METHODS: DonateMethod[] = [
  {
    id: "ovo",
    label: "OVO/Gopay untuk Developer",
    type: "copy",
    value: "0813-2834-3908",
  },
  {
    id: "paypal",
    label: "PayPal untuk Developer",
    type: "link",
    value: "https://paypal.me/put98",
  },
  {
    id: "BANK",
    label: "Donasi palestina melalui abu zyad",
    type: "copy",
    value: "BANK muamalat: 3510-0618-57",
  },
];

export default function DonateBox() {
  const [open, setOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const closeBox = () => {
    setOpen(false);
  };

  const handleCopy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[360px] rounded-2xl border border-white/10 bg-slate-900/90 text-white p-5 shadow-2xl">

        {/* Close */}
        <button
          onClick={closeBox}
          className="absolute right-3 top-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">☕ Traktir developer kopi</p>
          <p className="text-xs text-white/60">
            Support kecil berarti besar ❤️
          </p>
        </div>

        {/* Methods */}
        <div className="space-y-3">
          {DONATE_METHODS.map((method) => (
            <div
              key={method.id}
              className="rounded-xl bg-white/5 p-3 border border-white/10"
            >
              <p className="text-xs text-white/50">{method.label}</p>
              <p className="font-mono text-sm break-all">{method.value}</p>

              {method.type === "link" ? (
                <a
                  href={method.value}
                  target="_blank"
                  className="block mt-2 text-center text-sm font-semibold text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-xl"
                >
                  Buka
                </a>
              ) : (
                <button
                  onClick={() => handleCopy(method.id, method.value)}
                  className={`w-full mt-2 text-sm py-2 rounded-xl font-semibold transition ${
                    copiedId === method.id
                      ? "bg-green-500 text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {copiedId === method.id ? "Tersalin ✅" : "Copy"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Close hint */}
        <p className="text-[10px] text-center text-white/40 mt-4">
          Klik ✕ untuk menutup
        </p>
      </div>
    </div>
  );
}
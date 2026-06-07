"use client";
import { useState, useEffect } from "react";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("webp");
  const [sliderValue, setSliderValue] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedSize, setEstimatedSize] = useState("0 KB");
  const [error, setError] = useState<string | null>(null);
const [isDropping, setIsDropping] = useState(false); // Tambahkan ini
  // Fungsi untuk memanggil estimasi ke server
  const checkAccuracy = async (currentFile: File, currentFormat: string, currentQuality: number) => {
    setIsEstimating(true);
    const fd = new FormData();
    fd.append("file", currentFile);
    fd.append("quality", currentQuality.toString());
    fd.append("format", currentFormat);

    try {
      const res = await fetch("/api/convert?type=estimate", { method: "POST", body: fd });
      const data = await res.json();
      setEstimatedSize(`${data.sizeKB} KB`);
    } catch { 
      setError("Gagal menghitung ukuran."); 
    } finally { 
      setIsEstimating(false); 
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  setError(null);
  if (!f) return;
  
  if (!f.type.startsWith("image/")) {
    setError("Hanya file gambar yang diizinkan.");
    return;
  }
  
  setFile(f);
  setIsDropping(true); // Mulai loading
  
  // Panggil fungsi estimasi
  await checkAccuracy(f, format, sliderValue);
  
  setIsDropping(false); // Selesai loading
};

  // Efek untuk update otomatis jika user mengubah slider atau format
  useEffect(() => {
  if (!file) return;

  // Menunda eksekusi selama 500ms
  const handler = setTimeout(() => {
    checkAccuracy(file, format, sliderValue);
  }, 500);

  // Jika user menggeser lagi sebelum 500ms, timer di-reset
  return () => clearTimeout(handler);
}, [format, sliderValue, file]);

  const handleDownload = async () => {
    if (!file) return;
    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("quality", sliderValue.toString());
    fd.append("format", format);

    try {
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `optimized_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setError("Gagal mengonversi gambar."); } 
    finally { setIsLoading(false); }
  };

  return (
  <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
    
    {/* Background Glow */}
    <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-500/20 rounded-full blur-3xl" />
    <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl" />

    <div className="w-full max-w-lg relative z-10 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl p-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyan-400/30 bg-cyan-950 text-cyan-300 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">
          Aman • Cepat • Privasi Terjaga
        </div>

        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
          Convert & Resize
          <span className="block text-cyan-300">
            Foto Online
          </span>
        </h1>

        <p className="text-zinc-300 text-sm leading-relaxed max-w-md mx-auto">
          Convert JPG, PNG, dan WebP dengan aman langsung di browser.
          Foto tidak disimpan ke server sehingga privasi tetap terjaga.
        </p>
      </div>

      {!file ? (
        <label className="group flex flex-col items-center justify-center w-full h-64 rounded-[28px] border-2 border-dashed border-white/15 bg-slate-800 hover:border-cyan-400/50 hover:bg-cyan-950 transition-all duration-300 cursor-pointer">
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
            📸
          </div>

          <span className="font-bold text-lg text-white mb-2">
            Upload Foto
          </span>

          <span className="text-sm text-zinc-400 text-center px-4">
            Drag & drop atau klik untuk memilih foto JPG, PNG, WEBP
          </span>

          <span className="mt-3 text-xs text-cyan-300 font-semibold">
            Maksimal ukuran 20MB
          </span>

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-5">

          {/* File Info */}
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 mb-1">File dipilih</p>
              <p className="text-sm font-semibold truncate max-w-[220px]">
                {file.name}
              </p>
            </div>

            <button
              onClick={() => setFile(null)}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
            >
              GANTI
            </button>
          </div>

          {/* Estimasi */}
          <div className="bg-slate-800 border border-cyan-400/20 rounded-[28px] p-6">

            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold mb-3">
              Estimasi Hasil
            </p>

            {isDropping || isEstimating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-semibold text-cyan-300">
                  Memproses ukuran...
                </span>
              </div>
            ) : (
              <div className="text-6xl font-black text-white">
                {estimatedSize}
              </div>
            )}

            <div className="mt-6">
              <input
                type="range"
                min="1"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex justify-between text-xs mt-2 text-zinc-400">
                <span>Kompresi rendah</span>
                <span className="font-bold text-cyan-300">
                  {sliderValue}% kualitas
                </span>
                <span>Kualitas tinggi</span>
              </div>
            </div>
          </div>

          {/* Format */}
          <div>
  <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2 block">
    Format Output
  </label>

  <select
    value={format}
    onChange={(e) => setFormat(e.target.value)}
    className="w-full p-4 rounded-2xl bg-zinc-900 border border-white/10 text-white text-sm font-semibold outline-none focus:border-cyan-400 transition-all"
  >
    <option value="webp" className="bg-zinc-900 text-white">
      WebP (ukuran lebih ringan)
    </option>

    <option value="jpeg" className="bg-zinc-900 text-white">
      JPG
    </option>

    <option value="png" className="bg-zinc-900 text-white">
      PNG (kualitas tinggi)
    </option>
  </select>
</div>
          {/* SEO / Trust Section */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800 border border-white/10 rounded-2xl p-3">
              <div className="text-xl mb-1">🔒</div>
              <p className="text-[11px] font-bold text-zinc-300">
                Aman
              </p>
            </div>

            <div className="bg-slate-800 border border-white/10 rounded-2xl p-3">
              <div className="text-xl mb-1">⚡</div>
              <p className="text-[11px] font-bold text-zinc-300">
                Cepat
              </p>
            </div>

            <div className="bg-slate-800 border border-white/10 rounded-2xl p-3">
              <div className="text-xl mb-1">🛡️</div>
              <p className="text-[11px] font-bold text-zinc-300">
                Privasi
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Download Hasil"}
          </button>
        </div>
      )}
    </div>
  </main>
);
}
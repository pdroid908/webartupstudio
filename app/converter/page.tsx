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
  <main className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
    {/* Ambient Glow Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none" />

    <div className="w-full max-w-md relative bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">
          Foto Converter<span className="text-indigo-500">.</span>
        </h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">Convert & Resize ukuran</p>
      </div>

      {!file ? (
        <label className="group flex flex-col items-center justify-center w-full h-56 border border-zinc-800 rounded-[2rem] cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <span className="text-4xl mb-3 opacity-50 group-hover:opacity-100 transition-opacity">📁</span>
          <span className="text-sm font-bold text-zinc-300">Pilih atau Drag Foto jpg, png, webp max (20mb)</span>
          <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group">
            <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-[9px] font-bold text-indigo-400 hover:text-white transition-colors">GANTI</button>
          </div>

          {/* Stats Card dengan Glow Effect */}
          {/* Ganti bagian estimasi di dalam JSX menjadi seperti ini */}
<div className="bg-zinc-950 p-6 rounded-[2rem] border border-zinc-800 relative overflow-hidden">
  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-bold">Hasil Estimasi</p>
  
  {isDropping || isEstimating ? (
    <div className="flex items-center gap-3 py-2">
      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-indigo-400 font-bold animate-pulse">Mohon tunggu...</span>
    </div>
  ) : (
    <div className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
      {estimatedSize}
    </div>
  )}
            
  <div className="mt-6 space-y-2">
    <input type="range" min="1" max="100" value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))} 
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
    <div className="text-[9px] text-right font-bold text-zinc-500 uppercase tracking-widest">{sliderValue}% Kualitas</div>
  </div>
</div>
          

          <select value={format} onChange={(e) => setFormat(e.target.value)} 
                  className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-all text-zinc-300 focus:text-white">
            <option value="webp">WebP (ringan)</option>
            <option value="jpeg">JPG</option>
            <option value="png">PNG(ukuran tetap)</option>
          </select>

          <button onClick={handleDownload} disabled={isLoading}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Memproses..." : "Download Hasil"}
          </button>
        </div>
      )}
    </div>
  </main>
);
}
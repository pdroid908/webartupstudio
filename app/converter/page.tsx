"use client";
import { useState, useEffect, useCallback } from "react";
export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [estimatedSize, setEstimatedSize] = useState("0 KB");
  const [sliderValue, setSliderValue] = useState(80);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const renderPreview = useCallback(async (currentQuality: number, currentFormat: string, currentFile: File) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", currentFile);
    fd.append("quality", currentQuality.toString());
    fd.append("format", currentFormat);

    try {
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal proses");

      const blob = await res.blob();
      setEstimatedSize(`${(blob.size / 1024).toFixed(2)} KB`);
      
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!file) return;
    const handler = setTimeout(() => {
      renderPreview(sliderValue, format, file);
    }, 500);
    return () => clearTimeout(handler);
  }, [sliderValue, format, file, renderPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) return alert("File > 20MB!");
    if (!f.type.startsWith("image/")) return alert("Hanya boleh masukan gambar!");
    
    setFile(f);
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `optimized.${format}`;
    a.click();
  };

  return (
  <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-black p-6 md:p-12 text-zinc-100 flex flex-col items-center justify-center font-sans relative overflow-hidden">
  
  {/* Grid Pattern Background agar tidak hampa */}
  <div className="absolute inset-0 opacity-[0.03]" 
       style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: "40px 40px" }}>
  </div>

  {/* Main Container dengan efek Glassmorphism lebih terang */}
  <div className="relative z-10 w-full max-w-xl bg-zinc-900/30 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)]">
    
    <div className="text-center mb-8">
      <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
       Foto Converter
      </h1>
      <p className="text-indigo-400 text-xs mt-2 tracking-[0.2em] uppercase font-bold">
        convert foto & resize 
      </p>
    </div>

    {/* Upload Area - Dibuat lebih terang agar kontras */}
    <div className="group relative border-2 border-dashed border-zinc-700 hover:border-indigo-400 transition-all rounded-3xl p-8 text-center cursor-pointer bg-white/5 hover:bg-white/10">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        accept="image/*" 
      />
      <div className="text-white font-bold text-lg">Pilih atau Tarik Foto</div>
      <div className="text-zinc-400 text-xs mt-1">PNG, JPG, WebP (Max 20MB)</div>
    </div>

    {file && (
      <div className="space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Quality Slider - Dibuat lebih "Techy" */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between mb-4 font-mono text-sm">
            <span className="text-zinc-300">Quality: <b className="text-white">{sliderValue}%</b></span>
            <span className="text-indigo-300 font-bold">{estimatedSize}</span>
          </div>
          <input 
            type="range" min="1" max="100" value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))} 
            className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-indigo-400" 
          />
        </div>

        {/* Format Select - Dibuat lebih premium */}
        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value)} 
          className="w-full p-4 bg-zinc-950 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer text-white"
        >
          <option value="jpeg">JPG - High Compatibility</option>
          <option value="png">PNG - Lossless Quality</option>
          <option value="webp">WebP - Next Gen</option>
        </select>

        {/* Preview Area */}
        <div className="relative flex items-center justify-center p-4 border border-white/10 rounded-2xl bg-black/20 min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 rounded-2xl">
              <div className="h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {previewUrl ? (
            <img src={previewUrl} className="max-w-full max-h-[250px] object-contain rounded-lg shadow-2xl" alt="preview" />
          ) : (
            <span className="text-zinc-500 italic text-sm">Preview akan muncul di sini</span>
          )}
        </div>

        {/* Download Button - Lebih berani */}
        <button 
          onClick={handleDownload} 
          className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          instant DOWNLOAD
        </button>
      </div>
    )}
  </div>
</main>
);
}
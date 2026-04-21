"use client";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

/**
 * ARTUP SECURITY - ULTIMATE PHISH SIMULATOR V4.1
 * Proyek: 5fase (Security Awareness)
 * Fokus: Deep Device Detection & Mobile Responsive
 */

export default function ArtupUltimateV4() {
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [step, setStep] = useState(1);
  const [userStatus, setUserStatus] = useState("Active");
  const [showTrap, setShowTrap] = useState(false);
  const [sysInfo, setSysInfo] = useState<any>({
    ip: "Scanning...",
    city: "...",
  });
  const [battery, setBattery] = useState({ level: "...", charging: false });
  const [hardware, setHardware] = useState<any>({});
  const [motion, setMotion] = useState({ x: 0, y: 0 });
  const [brand, setBrand] = useState("Detecting...");

  const reportRef = useRef<HTMLDivElement>(null);

  // --- 1. LOGGING SYSTEM ---
  const addLog = (msg: string) => {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 45),
    );
  };

  // --- 2. DETEKSI MEREK HP (ADVANCED) ---
  const getDeviceBrand = () => {
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) return "Apple (iPhone/iPad)";
    if (/samsung/i.test(ua)) return "Samsung Galaxy";
    if (/xiaomi/i.test(ua)) return "Xiaomi / Redmi";
    if (/oppo/i.test(ua)) return "OPPO Mobile";
    if (/vivo/i.test(ua)) return "Vivo Mobile";
    if (/huawei/i.test(ua)) return "Huawei";
    if (/pixel/i.test(ua)) return "Google Pixel";
    if (/android/i.test(ua)) return "Android Device";
    if (/windows/i.test(ua)) return "Windows PC";
    if (/macintosh/i.test(ua)) return "MacBook / iMac";
    return "Generic Device";
  };

  useEffect(() => {
    const handleVisibility = () => {
      const status = document.hidden ? "Away (Pindah Tab)" : "Active";
      setUserStatus(status);
      addLog(`📱 STATUS: User sedang ${status}`);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Cleanup agar tidak memory leak

    // --- 3. INITIAL DATA MINING ---
    setBrand(getDeviceBrand());
    addLog(`🔍 DEVICE_ID: ${getDeviceBrand()}`);

    // Geolocation API
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setSysInfo(data);
        addLog(`📍 TRACKING: ${data.city}, ${data.country_name} (${data.org})`);
      });

    // Gyroscope / Motion Sensor
    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        setMotion({
          x: Math.round(e.accelerationIncludingGravity.x || 0),
          y: Math.round(e.accelerationIncludingGravity.y || 0),
        });
      }
    };
    window.addEventListener("devicemotion", handleMotion);

    // Hardware & Network Fingerprinting
    const conn = (navigator as any).connection || {};
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    const debug = gl ? gl.getExtension("WEBGL_debug_renderer_info") : null;

    const info = {
      os: navigator.platform,
      cores: navigator.hardwareConcurrency || "N/A",
      ram: (navigator as any).deviceMemory || "N/A",
      gpu:
        gl && debug
          ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
          : "Software Renderer",
      downlink: conn.downlink || "Unknown",
      netType: conn.effectiveType || "Unknown",
      resolution: `${window.screen.width}x${window.screen.height}`,
    };
    setHardware(info);

    addLog(`🧠 CPU: ${info.cores} Cores | RAM: ~${info.ram}GB`);
    addLog(`📶 KONEKSI: ${info.netType} (${info.downlink} Mbps)`);

    // Battery API
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        const update = () =>
          setBattery({
            level: `${Math.round(b.level * 100)}%`,
            charging: b.charging,
          });
        update();
        b.onlevelchange = update;
        b.onchargingchange = update;
      });
    }

    addLog("🚀 SYSTEM_STABLE: Monitoring sensors...");
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("devicemotion", handleMotion);
    }; // <--- Pastikan ada tutup kurung kurawal ini
  }, []); //

  const handleKeylog = (val: string, type: "email" | "pass") => {
    // 1. Bersihkan karakter < > (Anti-XSS)
    // 2. Batasi hanya 50 karakter agar memori aman
    const cleanValue = val.replace(/[<>]/g, "").slice(0, 50);

    if (type === "email") {
      setEmail(cleanValue);
    } else {
      setPass(cleanValue);
    }

    // 3. Tambahkan log hanya jika ada perubahan signifikan
    if (val.length % 3 === 0 || val.length < 5) {
      addLog(`⌨️ CAPTURE [${type.toUpperCase()}]: ${cleanValue}`);
    }
  };

  const downloadEvidence = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const link = document.createElement("a");
      link.download = `Artup-Security-Evidence.png`;
      link.href = canvas.toDataURL();
      link.click();
      addLog("📸 EVIDENCE_SAVED: File PNG berhasil diunduh.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f0f2f5] font-sans overflow-x-hidden">
      {/* INTERNAL CSS AREA */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* --- GOOGLE STYLE AUTH (KIRI - Tetap) --- */
    .g-card { background: white; border-radius: 8px; width: 100%; max-width: 450px; padding: 48px 40px 36px; border: 1px solid #dadce0; }
    .g-input { width: 100%; border: 1px solid #dadce0; border-radius: 4px; padding: 13px 15px; font-size: 16px; color: #202124 !important; background: white !important; transition: border 0.2s; }
    .g-input:focus { border: 2px solid #1a73e8; outline: none; }
    .btn-blue { background: #1a73e8; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 500; cursor: pointer; transition: 0.2s; }
    .btn-blue:hover { background: #1765cc; }

    /* --- HACKER MONITOR PANEL (KANAN - UPGRADED) --- */
    .edu-panel { 
      background: #000000; /* Hitam pekat sempurna */
      color: #00ff41; 
      width: 100%; 
      padding: 40px; /* Padding lebih besar */
      font-family: 'JetBrains Mono', 'Fira Code', monospace; 
      border-top: 4px solid #00ff41; 
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 100px rgba(0, 255, 65, 0.1); /* Efek vignette hijau */
    }

    /* Efek Garis Monitor (Scanline - Lebih Tipis) */
    .edu-panel::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
      z-index: 10;
      background-size: 100% 2px;
      pointer-events: none;
      opacity: 0.15;
    }

    @media (min-width: 1024px) {
      .edu-panel { width: 550px; height: 100vh; border-top: none; border-left: 2px solid #00ff41; position: sticky; top: 0; }
    }

    /* --- GAYA TEKS BARU (LEBIH BESAR & BOLD) --- */
    
    .data-label { 
      color: #00ff41; /* Hijau neon terang */
      text-transform: uppercase; 
      font-size: 14px; /* Lebih besar */
      font-weight: 900; /* Sangat tebal */
      margin-bottom: 6px; 
      letter-spacing: 2px;
      opacity: 0.7; /* Sedikit pudar untuk label */
    }

    .val-text { 
      color: #ffffff !important; /* Putih murni */
      font-size: 24px; /* Sangat Besar */
      font-weight: 900; /* Sangat tebal */
      text-shadow: 0 0 15px rgba(0, 255, 65, 0.7), 0 0 5px #ffffff; /* Efek Glow Kuat */
      display: block;
      line-height: 1.1;
    }

    /* Sub-text untuk info tambahan */
    .sub-val-text {
      font-size: 12px;
      color: #00ff41;
      opacity: 0.5;
      font-weight: bold;
      margin-top: 2px;
    }

    /* Tanda Bahaya Berkedip (Lebih Intens) */
    .danger-val { 
      color: #ff0000 !important; 
      font-weight: 900; 
      text-shadow: 0 0 20px #ff0000, 0 0 5px #ffffff;
      animation: blink 0.5s infinite;
    }

    @keyframes blink {
      50% { opacity: 0.1; }
    }

    /* Scrollbar Hacker Style */
    .edu-panel::-webkit-scrollbar { width: 6px; }
    .edu-panel::-webkit-scrollbar-track { background: #000; }
    .edu-panel::-webkit-scrollbar-thumb { background: #004411; border-radius: 3px; }
    .edu-panel::-webkit-scrollbar-thumb:hover { background: #00ff41; }
  `,
        }}
      />

      {/* --- UI KIRI: TRAP (GOOGLE CLONE) --- */}
      <div className="flex-1 flex justify-center items-center p-4 min-h-screen">
        {/* min-h-screen memastikan form Google mengambil satu layar penuh */}

        <div className="g-card shadow-sm">
          <img
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
            alt="Google"
            style={{ width: "75px", margin: "0 auto 20px", display: "block" }}
          />
          <h1 className="text-center text-[24px] text-[#202124] mb-2">
            {step === 1 ? "Login" : "Selamat Datang"}
          </h1>
          <p className="text-center text-[16px] text-[#202124] mb-8">
            {step === 1 ? "Gunakan Akun Google Anda" : email}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              step === 1 ? setStep(2) : setShowTrap(true);
            }}
          >
            <div className="mb-8">
              {step === 1 ? (
                <input
                  type="email"
                  placeholder="Email atau ponsel"
                  className="g-input"
                  value={email} // Hubungkan ke state email
                  onChange={(e) => handleKeylog(e.target.value, "email")}
                  required
                  autoFocus
                  autoComplete="username"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Masukkan sandi"
                  className="g-input"
                  value={pass} // Hubungkan ke state pass agar tidak bocor dari email
                  onChange={(e) => handleKeylog(e.target.value, "pass")}
                  autoFocus
                  required
                  autoComplete="new-text" // Standar paling kuat agar tidak autofill
                />
              )}
            </div>
            <div className="flex justify-between items-center mt-10">
              <span className="text-[#1a73e8] font-bold text-sm cursor-pointer hover:underline">
                Buat akun
              </span>
              <button type="submit" className="btn-blue shadow-sm">
                Berikutnya
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- UI KANAN/BAWAH: PANEL MONITORING --- */}
      {/* --- UI KANAN/BAWAH: PANEL MONITORING --- */}
      <div className="edu-panel shadow-2xl order-1 lg:order-2">
        <div className="flex justify-between items-center mb-8 border-b border-[#00ff41]/30 pb-4">
          <div className="flex flex-col">
            <span className="text-[#00ff41] font-black text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
              CORE_XRAY_v4.1
            </span>
            <span className="text-[9px] text-[#008f11] font-bold tracking-widest">
              SYSTEM_STATUS: ENCRYPTED
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
              ● LIVE_FEED
            </span>
            <span className="text-[10px] text-white/40 mt-1 uppercase italic">
              {sysInfo.city || "Locating..."}
            </span>
          </div>
        </div>

        {/* Info Grid - Putih di atas Hitam = Sangat Jelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-3 border-l-2 border-[#00ff41]">
            <p className="data-label">Identity_Device</p>
            <p className="val-text">{brand}</p>
            <p className="text-[10px] text-white/50">
              {hardware.os || "Unknown OS"}
            </p>
          </div>

          <div className="bg-white/5 p-3 border-l-2 border-blue-500">
            <p className="data-label text-blue-500">Network_Address</p>
            {/* Tambahkan break-all agar IP panjang tidak memotong layar */}
            <p className="val-text text-blue-200 break-all">
              {sysInfo.ip || "Detecting..."}
            </p>
            <p className="text-[10px] text-blue-400/60 uppercase">
              {hardware.netType || "High Speed"}
            </p>
          </div>

          <div className="bg-white/5 p-3 border-l-2 border-yellow-500">
            <p className="data-label text-yellow-600">Motion_Sensor</p>
            <p className="val-text">
              X: {motion.x} Y: {motion.y}
            </p>
          </div>

          <div className="bg-white/5 p-3 border-l-2 border-green-500">
            <p className="data-label">Power_Source</p>
            <p className="val-text">
              {battery.level} {battery.charging ? "⚡" : "🔋"}
            </p>
          </div>
        </div>

        {/* Data Capture Area ( Credentials ) */}
        <div className="mb-8 p-5 bg-red-950/20 border border-red-500/30 rounded relative">
          <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-red-500 font-bold border border-red-500/30">
            SENSITIVE_DATA_EXFILTRATION
          </div>
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-[10px] text-red-900 font-bold uppercase mb-1">
                Target_Email:
              </p>
              <p className="text-white font-mono font-bold text-lg break-all">
                {email || "Waiting_Input..."}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-red-900 font-bold uppercase mb-1">
                Target_Password:
              </p>
              <p className="text-red-500 font-mono font-black text-2xl tracking-[0.3em] animate-pulse">
                {pass ? "*".repeat(pass.length) : "Locked..."}
              </p>
            </div>
          </div>
        </div>

        {/* Console Logs */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-[#008f11] text-[20px] mb-2 font-bold uppercase tracking-widest">
            Activity_Console:
          </p>
          <div className="h-[200px] overflow-y-auto scrollbar-hide">
            {logs.map((l, i) => (
              <div key={i} className="log-line">
                <span className="opacity-30 mr-2">{">"}</span> {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- EVIDENCE MODAL (FINAL TRAP) --- */}
      {showTrap && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
          <div
            ref={reportRef}
            className="bg-white rounded-2xl max-w-2xl w-full p-10 border-t-[15px] border-red-700 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <h2 className="text-4xl font-black text-red-700 mb-2 text-center uppercase italic">
              Security Alert!
            </h2>
            <p className="text-gray-500 text-center mb-10 font-medium">
              Data Exfiltrated via Artup Security Simulator
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                <p className="text-[11px] font-bold text-gray-400 mb-3 tracking-widest">
                  PRIVATE_KEYLOGS
                </p>
                <p className="text-black font-bold mb-1">
                  EMAIL: <span className="text-red-600 font-mono">{email}</span>
                </p>
                <p className="text-black font-bold">
                  PASSWORD:{" "}
                  <span className="text-red-600 font-mono">{pass}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                <p className="text-[11px] font-bold text-gray-400 mb-3 tracking-widest">
                  DEVICE_FINGERPRINT
                </p>
                <p className="text-black text-sm">
                  BRAND: <b>{brand}</b>
                </p>
                <p className="text-black text-sm">
                  IP ADDR: <b>{sysInfo.ip}</b>
                </p>
                <p className="text-black text-sm">
                  CORES: <b>{hardware.cores} CPU</b>
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-5 rounded-xl border border-red-100 mb-8">
              <p className="text-red-800 text-sm leading-relaxed text-center">
                <b>Pelajaran Penting:</b> Halaman ini hanyalah simulasi. Di
                dunia nyata, data di atas sudah terkirim ke server hacker{" "}
                <b>sebelum</b> Anda menekan tombol "Berikutnya".
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadEvidence}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg active:scale-95 transition"
              >
                📥 Download PNG Evidence
              </button>
              <button
                onClick={() => {
                  setShowTrap(false);
                  setStep(1);
                  setPass("");
                }}
                className="flex-1 bg-[#1a73e8] text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition"
              >
                Saya Mengerti Bahayanya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

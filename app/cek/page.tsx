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
        .g-card { background: white; border-radius: 8px; width: 100%; max-width: 450px; padding: 48px 40px 36px; border: 1px solid #dadce0; }
        .g-input { width: 100%; border: 1px solid #dadce0; border-radius: 4px; padding: 13px 15px; font-size: 16px; color: #202124 !important; background: white !important; transition: border 0.2s; }
        .g-input:focus { border: 2px solid #1a73e8; outline: none; }
        .btn-blue { background: #1a73e8; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .btn-blue:hover { background: #1765cc; }
        
        /* PANEL MONITOR: RESPONSIVE */
        .edu-panel { background: #080808; color: #00ff41; width: 100%; padding: 25px; font-family: 'Consolas', monospace; font-size: 11px; border-top: 4px solid #ff0000; }
        @media (min-width: 1024px) {
          .edu-panel { width: 450px; height: 100vh; border-top: none; border-left: 4px solid #ff0000; overflow-y: auto; position: sticky; top: 0; }
        }
        
        .log-line { margin-bottom: 4px; border-left: 2px solid #222; padding-left: 10px; line-height: 1.4; }
        .data-label { color: #888; text-transform: uppercase; font-size: 9px; margin-bottom: 2px; }
        .val-text { color: #fff; font-weight: bold; }
        .danger-val { color: #ff3333; font-weight: bold; }
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
                  onChange={(e) => handleKeylog(e.target.value, "email")}
                  required
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  placeholder="Masukkan sandi"
                  className="g-input"
                  onChange={(e) => handleKeylog(e.target.value, "pass")}
                  autoFocus
                  required
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
      <div className="edu-panel shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-red-600 font-black text-xl">
            ARTUP_XRAY_V4.1
          </span>
          <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[9px] animate-pulse">
            LIVE MONITOR
          </span>
        </div>

        {/* Device Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
          <div>
            <p className="data-label">Identity_Device</p>
            <p className="val-text text-yellow-400">{brand}</p>
            <p className="val-text text-[10px] opacity-70">{hardware.os}</p>
          </div>

          <div>
            <p className="text-gray-500 text-[9px]">USER_ACTIVITY</p>
            <p
              className={`val-text ${userStatus !== "Active" ? "text-red-500" : "text-green-400"}`}
            >
              {userStatus}
            </p>
          </div>

          <div>
            <p className="data-label">Network_Status</p>
            <p className="val-text">{sysInfo.ip}</p>
            <p className="val-text text-[10px] text-blue-400">
              {hardware.netType} Speed
            </p>
          </div>
          <div>
            <p className="data-label">Motion_Sensor</p>
            <p className="val-text">
              X: {motion.x} | Y: {motion.y}
            </p>
          </div>
          <div>
            <p className="data-label">Power_Source</p>
            <p className="val-text">
              {battery.level} {battery.charging ? "⚡" : "🔋"}
            </p>
          </div>
        </div>

        {/* Capture Output */}
        <div className="mb-6 p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
          <p className="data-label">Stolen_Credentials</p>
          <p className="val-text mb-1">
            USER: <span className="text-white">{email || "Waiting..."}</span>
          </p>
          <p className="val-text">
            PASS:{" "}
            <span className="danger-val">
              {pass ? "*".repeat(pass.length) : "Waiting..."}
            </span>
          </p>
        </div>

        {/* Console Logs */}
        <div className="text-gray-500 mb-2 font-bold border-b border-gray-800 pb-1">
          ACTIVITY_CONSOLE:
        </div>
        <div className="h-[250px] overflow-hidden">
          {logs.map((l, i) => (
            <div
              key={i}
              className="log-line text-[10px] opacity-70 hover:opacity-100 transition"
            >
              {l}
            </div>
          ))}
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

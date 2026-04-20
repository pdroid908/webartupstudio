"use client";
import { useState, useEffect, useRef } from "react";

export default function ArtupAggressivePhish() {
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [sysInfo, setSysInfo] = useState<any>({
    ip: "Loading...",
    city: "Searching...",
  });
  const [battery, setBattery] = useState("Checking...");
  const [showTrap, setShowTrap] = useState(false);
  const typingStart = useRef<number | null>(null);

  // Fungsi log harus di atas agar bisa dipanggil useEffect
  const addLog = (msg: string) => {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30),
    );
  };

  useEffect(() => {
    // 1. Ambil Data IP & Lokasi (Agar sysInfo tidak kosong)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setSysInfo(data);
        addLog(`📍 LOCATION_FOUND: ${data.city}, ${data.country_name}`);
      })
      .catch(() => addLog("⚠️ FAILED_TO_GET_IP"));

    // 2. Data Baterai
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBattery(`${Math.round(batt.level * 100)}%`);
        addLog(`🔋 BATTERY_STATUS: ${Math.round(batt.level * 100)}%`);
      });
    }

    // 3. Hardware Info
    addLog(`💻 OS: ${navigator.platform}`);
    addLog(`🧠 CPU: ${navigator.hardwareConcurrency} Cores`);
    addLog("🚀 SYSTEM_READY: Monitoring all inputs...");
  }, []);

  const handleKeylog = (val: string, type: "email" | "pass") => {
    if (!typingStart.current) typingStart.current = Date.now();
    if (type === "email") setEmail(val);
    else setPass(val);

    if (val.length % 5 === 0 && val.length > 0) {
      addLog(`⌨️ INTERCEPTED: User typing ${type}...`);
    }
  };

  const triggerTrap = (e: any) => {
    e.preventDefault();
    if (!email || !pass) return;
    addLog(`❌ [CRITICAL] DATA EXFILTRATED! E: ${email} | P: ${pass}`);
    setShowTrap(true);
  };

  return (
    <div className="artup-phish-root">
      {/* CSS internal kamu tetap sama */}
      <style
        dangerouslySetInnerHTML={{
          __html: `... (sama seperti kode lamamu) ...`,
        }}
      />

      <div className="wrapper">
        <div className="google-section">
          {/* UI Google Login kamu di sini */}
          <div className="g-card">
            <h1 className="g-title">Login</h1>
            <form onSubmit={triggerTrap}>
              <input
                type="email"
                className="g-input"
                placeholder="Email"
                onChange={(e) => handleKeylog(e.target.value, "email")}
              />
              <input
                type="password"
                className="g-input"
                placeholder="Sandi"
                onChange={(e) => handleKeylog(e.target.value, "pass")}
              />
              <button type="submit" className="btn-next">
                Berikutnya
              </button>
            </form>
          </div>
        </div>

        <div className="logger-section">
          <div className="logger-header">[ ARTUP SIMULATOR 5FASE ]</div>
          <div
            style={{
              background: "#272822",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <p>
              IP: <span style={{ color: "#f92672" }}>{sysInfo.ip}</span>
            </p>
            <p>
              USER: <span style={{ color: "#a6e22e" }}>{email || "..."}</span>
            </p>
            <p>
              PASS:{" "}
              <span style={{ color: "#a6e22e" }}>
                {pass ? "*".repeat(pass.length) : "..."}
              </span>
            </p>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="log-entry">
              {log}
            </div>
          ))}
        </div>
      </div>

      {showTrap && (
        <div className="trap-overlay">
          <div className="trap-card">
            <h2>⚠️ SIMULASI PENCURIAN DATA</h2>
            <p>IP: {sysInfo.ip}</p>
            <p>Kota: {sysInfo.city}</p>
            <p>Baterai: {battery}</p>
            <button onClick={() => setShowTrap(false)}>Saya Mengerti</button>
          </div>
        </div>
      )}
    </div>
  );
}

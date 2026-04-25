"use client";
import React, { useState, useEffect, useRef } from "react";
import Bird from "./Bird";
import { db } from "../../../../lib/firebase";
import {
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
  get,
  set as databaseSet,
} from "firebase/database";

const GameContainer = () => {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<
    "MENU" | "PLAYING" | "LEADERBOARD"
  >("MENU");
  const [birdPos, setBirdPos] = useState(300);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState<string>("");
  const [globalScores, setGlobalScores] = useState<any[]>([]);

  // SISTEM BARU: MENGGUNAKAN ARRAY UNTUK MULTI-OBSTACLE & KOIN
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [coinEffects, setCoinEffects] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [birdX, setBirdX] = useState(50);
  const [isEditing, setIsEditing] = useState(false);

  const birdPosRef = useRef<number>(300);
  const velocityRef = useRef<number>(0);
  const obstaclesRef = useRef<any[]>([]);
  const coinsRef = useRef<any[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const screenSizeRef = useRef({ width: 0, height: 0 });
  const scoreRef = useRef<number>(0);

  // KONFIGURASI GAME
  const GRAVITY = 0.15;
  const JUMP_FORCE = -5.5;
  const OBSTACLE_WIDTH = 120; // Lebih tipis agar muat banyak
  const OBSTACLE_GAP = 350; // Celah burung
  const OBSTACLE_SPEED = 3; // Kecepatan gerak
  const SPAWN_DISTANCE = 450; // Jarak antar pipa muncul

  const particles = useRef(
    [...Array(30)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    })),
  );

  const getTheme = () => {
    const level = Math.floor(score / 100);
    const themes = [
      {
        bg: ["#0f0c29", "#302b63", "#24243e"],
        pipe: "linear-gradient(#4facfe, #00f2fe)",
        coin: "#ffd700",
      },
      {
        bg: ["#134e5e", "#71b280", "#134e5e"],
        pipe: "linear-gradient(#a8ff78, #78ffd6)",
        coin: "#fff",
      },
      {
        bg: ["#8e2de2", "#4a00e0", "#8e2de2"],
        pipe: "linear-gradient(#f9d423, #ff4e50)",
        coin: "#00fff2",
      },
    ];
    return themes[level % themes.length];
  };
  const theme = getTheme();

 useEffect(() => {
   setMounted(true);

   // 1. Ambil Nama yang Tersimpan
   const savedName = localStorage.getItem("player_name");
   if (savedName) setPlayerName(savedName);

   // 2. LOGIKA ID UNIK (ANTI-REDUNDAN)
   // Cek apakah HP ini sudah punya ID tetap
   let id = localStorage.getItem("bird_player_id");
   if (!id) {
     // Jika belum ada, buat KTP Digital baru untuk HP ini
     id = "PLAYER-" + Math.random().toString(36).substr(2, 9).toUpperCase();
     localStorage.setItem("bird_player_id", id);
   }
   setPlayerId(id); // Masukkan ke state biar bisa dipakai simpan skor

   // 3. Logika Ukuran Layar
   const updateSize = () => {
     const w = window.innerWidth;
     const h = window.innerHeight;
     screenSizeRef.current = { width: w, height: h };

     // Responsif: Burung agak ke tengah kalau di Laptop, agak ke kiri kalau di HP
     setBirdX(w > 768 ? w * 0.25 : w * 0.15);
   };

   updateSize();
   window.addEventListener("resize", updateSize);

   // 4. Cleanup (Penting biar memori gak bocor)
   return () => window.removeEventListener("resize", updateSize);
 }, []);

  const animate = () => {
    if (gameState !== "PLAYING") return;

    velocityRef.current += GRAVITY;
    birdPosRef.current += velocityRef.current;
    const h = screenSizeRef.current.height;
    const w = screenSizeRef.current.width;

    if (birdPosRef.current >= h - 50) handleGameOver();
    if (birdPosRef.current <= 0) birdPosRef.current = 0;

    // 1. LOGIKA SPAWN PIPA (MUNCUL BERURUTAN)
    if (
      obstaclesRef.current.length === 0 ||
      obstaclesRef.current[obstaclesRef.current.length - 1].left <
        w - SPAWN_DISTANCE
    ) {
      // PILIH GAP SECARA ACAK DARI ARRAY
      const gapOptions = [200, 300, 350, 500, 400, 450, 250, 600];
      const randomGap =
        gapOptions[Math.floor(Math.random() * gapOptions.length)];

      // Tentukan tinggi pipa atas (disesuaikan agar pipa bawah tidak off-screen)
      const newHeight = Math.floor(Math.random() * (h - randomGap - 200)) + 100;
      const obsId = Date.now();

      obstaclesRef.current.push({
        id: obsId,
        left: w,
        height: newHeight,
        gap: randomGap, // Simpan gap unik untuk pipa ini
        passed: false,
      });

      // Spawn koin di antara pipa (50% peluang)
      if (Math.random() > 0.5) {
        coinsRef.current.push({
          id: obsId + 1,
          left: w + 200,
          top: newHeight + OBSTACLE_GAP / 2 - 15,
          collected: false,
        });
      }
    }

    // 2. UPDATE POSISI & COLLISION PIPA
    obstaclesRef.current = obstaclesRef.current.filter((obs) => {
      obs.left -= OBSTACLE_SPEED;

      // Skor lewat pipa
      if (!obs.passed && obs.left < birdX) {
        obs.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      // Tabrakan Pipa
      const bY = birdPosRef.current;
      if (birdX + 30 > obs.left && birdX < obs.left + OBSTACLE_WIDTH) {
        // Pakai obs.gap di sini:
        if (bY < obs.height || bY + 30 > obs.height + obs.gap) {
          handleGameOver();
        }
      }
      return obs.left > -OBSTACLE_WIDTH;
    });

    // 3. UPDATE POSISI & COLLISION KOIN
    coinsRef.current = coinsRef.current.filter((coin) => {
      coin.left -= OBSTACLE_SPEED;
      const bY = birdPosRef.current;

      // Ambil koin (Deteksi jarak)
      if (
        !coin.collected &&
        Math.abs(birdX - coin.left) < 60 &&
        Math.abs(bY - coin.top) < 60
      ) {
        // Ganti 50 jadi birdX {
        coin.collected = true;
        scoreRef.current += 5;
        setScore(scoreRef.current);

        // --- TAMBAHKAN LOGIKA EFEK PECAHAN DI SINI ---
        const particles = [...Array(8)].map((_, i) => ({
          id: Date.now() + i,
          left: coin.left,
          top: coin.top,
          vX: (Math.random() - 0.5) * 12, // Meledak ke samping
          vY: (Math.random() - 0.5) * 12, // Meledak ke atas/bawah
          life: 1.0,
        }));
        setCoinEffects((prev) => [...prev, ...particles]);
        // --------------------------------------------

        return false;
      }
      return coin.left > -50;
    });

    setCoinEffects((prev) =>
      prev
        .map((p) => ({
          ...p,
          left: p.left + p.vX,
          top: p.top + p.vY,
          vY: p.vY + 0.4, // Gravitasi agar pecahan jatuh
          life: p.life - 0.04, // Perlahan menghilang
        }))
        .filter((p) => p.life > 0),
    );

    setBirdPos(birdPosRef.current);
    setObstacles([...obstaclesRef.current]);
    setCoins([...coinsRef.current]);
    requestRef.current = requestAnimationFrame(animate);
  };

 const handleGameOver = async () => {
   // 1. Langsung kunci state agar tidak loop
   setGameState("MENU");

   // 2. Validasi: Jangan simpan kalau skor 0 atau nama kosong
   if (scoreRef.current <= 0 || !playerName) return;

   try {
     // Gunakan ref yang benar ke folder playerId
     const userScoreRef = ref(db, `leaderboard/${playerId}`);
     const snapshot = await get(userScoreRef);
     const currentData = snapshot.val();

     // 3. Hanya update jika ini adalah High Score baru
     if (!currentData || scoreRef.current > currentData.score) {
       await databaseSet(userScoreRef, {
         username: playerName,
         score: scoreRef.current, // Gunakan scoreRef agar akurat saat mati
         timestamp: Date.now(),
       });
       console.log("✅ High Score Disimpan!");
     }
   } catch (error) {
     console.error("❌ Gagal simpan ke Firebase:", error);
   }
 };

  const fetchLeaderboard = () => {
    setGameState("LEADERBOARD");
    onValue(
      query(ref(db, "leaderboard"), orderByChild("score"), limitToLast(10)),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const sorted = Object.values(data).sort(
            (a: any, b: any) => b.score - a.score,
          );
          setGlobalScores(sorted);
        }
      },
    );
  };

  useEffect(() => {
    let id = localStorage.getItem("bird_player_id");
    if (!id) {
      id = "PLAYER-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem("bird_player_id", id);
    }
    setPlayerId(id);
    
    
    
    if (gameState === "PLAYING") {
      birdPosRef.current = 300;
      velocityRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
      requestRef.current = requestAnimationFrame(animate);
      // NYALAKAN MUSIK DI SINI:
      audioRef.current?.play().catch(() => {});
    } else {
      // MATIKAN MUSIK DI SINI:
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  if (!mounted) return null;

  return (
    <div
      onPointerDown={() =>
        gameState === "PLAYING" && (velocityRef.current = JUMP_FORCE)
      }
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        background: `linear-gradient(to bottom, ${theme.bg[0]}, ${theme.bg[1]}, ${theme.bg[2]})`,
        transition: "background 1.5s",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <style>{`
        @keyframes coinRotate { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes float { from { transform: translate(0,0); } to { transform: translate(10px, -10px); } }
      `}</style>

      {/* BACKGROUND PARTICLES */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {particles.current.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: "white",
              borderRadius: "50%",
              opacity: 0.4,
              animation: `float ${p.duration}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* UI SCORE */}
      {gameState === "PLAYING" && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            top: "10%",
            fontSize: "6rem",
            fontWeight: "bold",
            color: "white",
            opacity: 0.2,
            zIndex: 0,
          }}
        >
          {score}
        </div>
      )}

      {/* GAME OBJECTS (PIPES & COINS) */}
      {gameState === "PLAYING" && (
        <>
          {obstacles.map((obs) => (
            <React.Fragment key={obs.id}>
              {/* Pipa Atas */}
              <div
                style={{
                  position: "absolute",
                  left: obs.left,
                  top: 0,
                  width: OBSTACLE_WIDTH,
                  height: obs.height,
                  background: theme.pipe,
                  borderRadius: "0 0 15px 15px",
                }}
              />

              {coinEffects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    left: p.left,
                    top: p.top,
                    width: "6px",
                    height: "6px",
                    background: "#ffd700",
                    borderRadius: "50%",
                    opacity: p.life,
                    boxShadow: "0 0 10px #ffd700",
                    pointerEvents: "none",
                    zIndex: 70,
                  }}
                />
              ))}

              {/* Pipa Bawah (Gunakan obs.gap di sini) */}
              <div
                style={{
                  position: "absolute",
                  left: obs.left,
                  top: obs.height + obs.gap, // <-- Ini kuncinya
                  width: OBSTACLE_WIDTH,
                  height: "100vh",
                  background: theme.pipe,
                  borderRadius: "15px 15px 0 0",
                }}
              />
            </React.Fragment>
          ))}

          {coins.map((coin) => (
            <div
              key={coin.id}
              style={{
                position: "absolute",
                left: coin.left,
                top: coin.top,
                width: "35px",
                height: "35px",
                background: "#ffd700",
                borderRadius: "50%",
                border: "4px solid #b8860b",
                boxShadow: "0 0 20px #ffd700",
                zIndex: 60,
                animation: "coinRotate 2s infinite linear",
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              left: birdX,
              top: birdPos,
              transform: `rotate(${velocityRef.current * 3}deg)`,
              zIndex: 100,
            }}
          >
            <Bird />
          </div>
        </>
      )}

      {/* MENU UTAMA */}
      {gameState === "MENU" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "clamp(2rem, 10vw, 4rem)",
              textShadow: "0 0 20px #4facfe",
              marginBottom: "30px",
            }}
          >
            BIRD MYSTERY
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            {!playerName || isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  placeholder="Ketik Nama..."
                  defaultValue={playerName}
                  onBlur={(e) => {
                    setPlayerName(e.target.value);
                    localStorage.setItem("player_name", e.target.value);
                  }}
                  style={{
                    padding: "15px",
                    borderRadius: "15px",
                    border: "2px solid #4facfe",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "12px",
                    borderRadius: "15px",
                    background: "#4facfe",
                    color: "white",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  OK SIMPAN
                </button>
              </div>
            ) : (
              <>
                <p
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    marginBottom: "5px",
                  }}
                >
                  Halo,{" "}
                  <span style={{ color: "#4facfe", fontWeight: "bold" }}>
                    {playerName}
                  </span>
                  !
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4facfe",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginBottom: "15px",
                  }}
                >
                  Ganti Nama
                </button>

                <button
                  onClick={() => setGameState("PLAYING")}
                  style={{
                    width: "100%",
                    padding: "18px",
                    borderRadius: "20px",
                    border: "none",
                    background: "linear-gradient(45deg, #4facfe, #00f2fe)",
                    color: "white",
                    fontWeight: "900",
                    fontSize: "20px",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(79, 172, 254, 0.4)",
                  }}
                >
                  MAIN SEKARANG
                </button>
              </>
            )}

            <button
              onClick={fetchLeaderboard}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "15px",
                border: "2px solid #4facfe",
                background: "none",
                color: "#4facfe",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              RANKING DUNIA
            </button>
          </div>
        </div>
      )}

      {/* LEADERBOARD (Sama seperti sebelumnya) */}
      {/* LEADERBOARD */}
      {gameState === "LEADERBOARD" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 300, background: "#0f0c29", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", padding: "20px" }}>
          <h2 style={{ fontSize: "2rem", color: "#4facfe", marginBottom: "20px", fontWeight: "900" }}>🏆 RANKING DUNIA</h2>
          <div style={{ width: "100%", maxWidth: "350px", height: "50vh", background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "24px", border: "1px solid rgba(79, 172, 254, 0.3)", overflowY: "auto" }}>
            {globalScores.length > 0 ? globalScores.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: i === 0 ? "rgba(79, 172, 254, 0.1)" : "none", borderRadius: "10px" }}>
                <span style={{ fontWeight: i < 3 ? "bold" : "normal" }}>{i + 1}. {s.username}</span>
                <span style={{ color: "#4facfe", fontWeight: "bold" }}>{s.score} PTS</span>
              </div>
            )) : <p style={{textAlign: 'center', opacity: 0.5}}>Memuat data...</p>}
          </div>
          <button
            onClick={() => setGameState("MENU")}
            style={{ marginTop: "30px", padding: "12px 40px", borderRadius: "15px", background: "white", color: "#0f0c29", fontWeight: "bold", border: "none", cursor: "pointer" }}
          >
            KEMBALI KE MENU
          </button>
        </div>
      )}
      
    </div>
  );
};

export default GameContainer;

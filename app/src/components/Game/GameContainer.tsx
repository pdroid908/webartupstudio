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
  const [isGameOverAnim, setIsGameOverAnim] = useState(false);
  const gameOverLockRef = useRef(false);
  const [isInvincible, setIsInvincible] = useState(false);

  // SISTEM BARU: MENGGUNAKAN ARRAY UNTUK MULTI-OBSTACLE & KOIN
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [coinEffects, setCoinEffects] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [birdX, setBirdX] = useState(10);
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
  const JUMP_FORCE = -3.5;
  const OBSTACLE_WIDTH = 80; // Lebih tipis agar muat banyak
  const OBSTACLE_GAP = 350; // Celah burung
  const OBSTACLE_SPEED = 4; // Kecepatan gerak
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
      // 1. FOREST MIST (Hijau Lumut & Kabut - Tenang & Alami)
      {
        bg: ["#0b2027", "#1f4a4a", "#40798c"],
        pipe: "linear-gradient(#71b280, #134e5e)",
        coin: "#f9d423",
      },

      // 2. CYBER NEON (Futuristik & High Contrast)
      {
        bg: ["#0d0221", "#0f0844", "#000000"],
        pipe: "linear-gradient(#00f2ff, #0061ff)",
        coin: "#ff00ff",
      },

      // 3. MIDNIGHT SKY (Biru Malam & Ungu Gelap - Misterius)
      {
        bg: ["#000000", "#1a1a2e", "#16213e"],
        pipe: "linear-gradient(#3c1053, #ad5389)",
        coin: "#ffffff",
      },

      // 4. VOLCANIC ASH (Agresif & Panas)
      {
        bg: ["#1a1a1a", "#434343", "#000000"],
        pipe: "linear-gradient(#ff416c, #ff4b2b)",
        coin: "#ffd700",
      },

      // 5. SOFT SUNSET (Oranye Lembut & Pink Pastel)
      {
        bg: ["#ff9a9e", "#fad0c4", "#ffdde1"],
        pipe: "linear-gradient(#ff758c, #ff7eb3)",
        coin: "#ffe4b5",
      },

      // 6. FROSTED NORTH (Dingin & Kristal)
      {
        bg: ["#2980b9", "#6dd5fa", "#ffffff"],
        pipe: "linear-gradient(#ffffff, #acb6e5)",
        coin: "#00d2ff",
      },

      // 7. TWILIGHT LAVENDER (Ungu Lembayung & Biru Senja)
      {
        bg: ["#a1c4fd", "#c2e9fb", "#d8bfd8"],
        pipe: "linear-gradient(#6a11cb, #2575fc)",
        coin: "#fafad2",
      },

      // 8. DEEP TOXIC (Misterius & Beracun)
      {
        bg: ["#000000", "#134e5e", "#71b280"],
        pipe: "linear-gradient(#a8ff78, #78ffd6)",
        coin: "#ffffff",
      },

      // 9. OCEAN BLISS (Biru Laut & Teal - Segar)
      {
        bg: ["#e0ffff", "#afeeee", "#40e0d0"],
        pipe: "linear-gradient(#00ced1, #1e90ff)",
        coin: "#ffffed",
      },

      // 10. GOLDEN NOIR (Mewah & Elegan)
      {
        bg: ["#000000", "#2c3e50", "#000000"],
        pipe: "linear-gradient(#bf953f, #fcf6ba, #b38728)",
        coin: "#ffffff",
      },

      // 11. EARTHY STONE (Coklat Tanah & Abu-abu)
      {
        bg: ["#d3b8ae", "#bcaaa4", "#a1887f"],
        pipe: "linear-gradient(#8d6e63, #5d4037)",
        coin: "#fff8dc",
      },

      // 12. RETRO VAPORWAVE (Gaya 80-an)
      {
        bg: ["#4a00e0", "#8e2de2", "#ff0099"],
        pipe: "linear-gradient(#00d2ff, #3a7bd5)",
        coin: "#ffff00",
      },
    ];

    return themes[level % themes.length];
  };
  const theme = getTheme();

  // --- PERCONST: HARD RESET MEMORY (ANTI-NEMPEL) ---
  // --- PERCONST: HARD RESET MEMORY (ANTI-NEMPEL) ---
  const hardResetGame = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }

    obstaclesRef.current = [];
    coinsRef.current = [];

    velocityRef.current = 0;
    birdPosRef.current = 300;

    // PERCONST: JANGAN RESET SCORE REF DI SINI
    setObstacles([]);
    setCoins([]);
    setIsInvincible(false);
    setBirdPos(300);
    setIsGameOverAnim(false);
  };

  // --- PERCONST: GAME LOOP MANAGER (ANTI-STUCK) ---
  // --- PERCONST: GAME LOOP & INVINCIBILITY MANAGER ---
  // --- PERCONST: FIX LAYAR KOSONG & MOUNTING ---
  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      screenSizeRef.current = { width: w, height: h };
      // Update birdX ke tengah setiap kali ukuran layar berubah
      setBirdX(w / 2 - 17);
    };

    // Jalankan saat pertama kali mount
    handleResize();

    // Tambahkan listener agar saat HP diputar (landscape/portrait) posisi tetap pas
    window.addEventListener("resize", handleResize);

    const id =
      localStorage.getItem("bird_player_id") ||
      "PLAYER-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);

    localStorage.setItem("bird_player_id", id);
    setPlayerId(id);
    setPlayerName(localStorage.getItem("player_name") || "");

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const animate = () => {
    // PROTEKSI: Jika state bukan playing atau array kosong, stop loop
    if (gameState !== "PLAYING" || isGameOverAnim) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    velocityRef.current += GRAVITY;
    birdPosRef.current += velocityRef.current;
    const w = screenSizeRef.current.width;
    const h = screenSizeRef.current.height;

    if (birdPosRef.current >= h - 50) {
      birdPosRef.current = h - 50;
      velocityRef.current = 0;
      handleGameOver();
    }
    if (birdPosRef.current <= 0) birdPosRef.current = 0;

    // LOGIKA SPAWN PIPA: Muncul tepat dari ujung kanan layar (w)
    if (
      obstaclesRef.current.length === 0 ||
      obstaclesRef.current[obstaclesRef.current.length - 1].left <
        w - SPAWN_DISTANCE
    ) {
      const gapOptions = [200, 250, 300, 350, 400];
      const randomGap =
        gapOptions[Math.floor(Math.random() * gapOptions.length)];
      const newHeight = Math.floor(Math.random() * (h - randomGap - 200)) + 100;

      const obsId = Date.now();

      obstaclesRef.current.push({
        id: obsId,
        left: w, // <--- MULAI DARI POJOK KANAN LAYAR
        height: newHeight,
        gap: randomGap,
        passed: false,
      });

      // Spawn koin disesuaikan dengan posisi w
      if (Math.random() > 0.5) {
        coinsRef.current.push({
          id: obsId + 1,
          left: w + SPAWN_DISTANCE / 2,
          top: newHeight + randomGap / 2 - 15,
          collected: false,
        });
      }
    }

    // 2. UPDATE POSISI & COLLISION PIPA
    // 2. UPDATE POSISI & COLLISION PIPA
    // --- PERCONST: UPDATE PIPA & CEK TABRAKAN (ANTI-NEMPEL & KEBAL) ---
    obstaclesRef.current = obstaclesRef.current.filter((obs) => {
      obs.left -= OBSTACLE_SPEED;

      // --- PERCONST: SYNC SKOR (VISUAL & DATABASE) ---
      // --- PERCONST: FIX SKOR SINKRON (ANTI-NOL) ---
      if (!obs.passed && obs.left < birdX) {
        obs.passed = true;

        // 1. UPDATE STATE (UNTUK TAMPILAN)
        // PERCONST: SAFE SCORE UPDATE (ANTI DOUBLE)
        const addScore = (amount: number = 1) => {
          scoreRef.current = scoreRef.current + amount;
          setScore(scoreRef.current);
        };

        addScore(1);

        console.log("🔥 SKOR BARU DI MEMORI:", scoreRef.current);
      }

      const bY = birdPosRef.current;
      const BIRD_W = 34;
      const BIRD_H = 20; // GAGAK GEPENG
      const PADDING_X = 4;
      const PADDING_Y = 2;

      // CEK TABRAKAN HANYA JIKA TIDAK SEDANG KEBAL
      if (!isInvincible) {
        if (
          birdX + BIRD_W - PADDING_X > obs.left &&
          birdX + PADDING_X < obs.left + OBSTACLE_WIDTH
        ) {
          if (
            bY + PADDING_Y < obs.height ||
            bY + BIRD_H - PADDING_Y > obs.height + obs.gap
          ) {
            handleGameOver();
          }
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

        console.log("🪙 COIN SCORE:", scoreRef.current);
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
  };;

  // --- PERCONST: LOGIKA MATI & KIRIM DATABASE ---
  // --- PERCONST: LOGIKA MATI & KIRIM SKOR ---
  // PERCONST: SAFE GAME OVER + FIREBASE SYNC FIX
  const handleGameOver = async () => {
    // 🔒 LOCK BIAR TIDAK KEPAKAI 2X
    if (gameOverLockRef.current) return;
    gameOverLockRef.current = true;

    console.log("💀 GAME OVER TRIGGERED");

    // STOP GAME LOOP
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }

    setIsGameOverAnim(true);

    const finalScore = scoreRef.current;

    const currentName = (
      playerName ||
      localStorage.getItem("player_name") ||
      ""
    ).trim();

    let currentId = localStorage.getItem("bird_player_id");

    if (!currentId) {
      currentId = "PLAYER-" + Date.now();
      localStorage.setItem("bird_player_id", currentId);
    }

    console.log("📊 GAME OVER DATA:", {
      name: currentName,
      finalScore,
      playerId: currentId,
    });

    try {
      if (!currentName) {
        console.log("⚠️ Nama kosong, skip save");
        gameOverLockRef.current = false;
        return;
      }

      const userScoreRef = ref(db, `leaderboard/${currentId}`);
      const snapshot = await get(userScoreRef);

      const oldScore = snapshot.val()?.score || 0;

      // 🔥 FIX UTAMA: AKUMULASI SCORE
      const totalScore = oldScore + finalScore;

      await databaseSet(userScoreRef, {
        username: currentName,
        score: totalScore,
        lastRunScore: finalScore,
        timestamp: Date.now(),
      });

      console.log("🔥 SCORE UPDATED SUCCESS:", {
        oldScore,
        finalScore,
        totalScore,
      });
    } catch (err) {
      console.error("❌ FIREBASE ERROR:", err);
    }

    // RESET KE MENU
    setTimeout(() => {
      setGameState("MENU");
      setIsGameOverAnim(false);
      gameOverLockRef.current = false;
    }, 300);
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

  // --- PERBAIKAN 1: SETUP AWAL & MOUNTING ---
  // --- PERCONST: SATU-SATUNYA GAME LOOP & INVINCIBILITY MANAGER ---
  // --- PERCONST: SATU KESATUAN MANAGER GAME (ANTI-BENTROK & ANTI-NEMPEL) ---
  // --- PERCONST: SATU KESATUAN MANAGER GAME (ANTI-BENTROK & ANTI-NEMPEL) ---
  useEffect(() => {
    let invincibleTimer: NodeJS.Timeout;

    if (gameState === "PLAYING") {
      // 1. BERSIHKAN TOTAL (Biar gak nempel pipa lama)
      hardResetGame();

      // 2. MODE KEBAL 3 DETIK (Permintaan Abang)
      setIsInvincible(true);
      invincibleTimer = setTimeout(() => {
        setIsInvincible(false);
      }, 3000);

      // 3. JALANKAN MESIN (Kasih jeda 50ms biar React gak kaget)
      const startTimer = setTimeout(() => {
        if (gameState === "PLAYING") {
          requestRef.current = requestAnimationFrame(animate);
          audioRef.current?.play().catch(() => {});
        }
      }, 50);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(invincibleTimer);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    } else {
      // Matikan mesin kalau di menu/leaderboard
      audioRef.current?.pause();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    }
  }, [gameState]);

  // --- PERBAIKAN 2: MONITORING LEADERBOARD (Realtime) ---
  useEffect(() => {
    const scoresRef = query(
      ref(db, "leaderboard"),
      orderByChild("score"),
      limitToLast(10),
    );
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sorted = Object.values(data).sort(
          (a: any, b: any) => b.score - a.score,
        );
        setGlobalScores(sorted);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- PERBAIKAN 3: GAME LOOP MANAGER (Anti-Stuck & Reset Pipa) ---
  useEffect(() => {
    if (gameState === "PLAYING") {
      // RESET TOTAL FISIK & DATA (Agar tidak langsung nabrak pipa lama)
      birdPosRef.current = birdPosRef.current;
      hardResetGame();

      setBirdPos(300);
      velocityRef.current = velocityRef.current;
      scoreRef.current = 0;
      setScore(0);

      // Bersihkan Pipa & Koin Sisa Ronde Sebelumnya
      obstaclesRef.current = [];
      coinsRef.current = [];
      setObstacles([]);
      setCoins([]);

      // Pastikan hanya ada 1 loop yang jalan
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(animate);

      audioRef.current?.play().catch(() => {});
    } else {
      // Hentikan suara dan loop saat di Menu atau Leaderboard
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
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
              // Efek visual kebal: Transparan & Berpendar
              opacity: isInvincible ? 0.5 : 1,
              filter: isInvincible ? "drop-shadow(0 0 10px cyan)" : "none",
              transition: "opacity 0.2s",
            }}
          >
            <Bird />
          </div>
        </>
      )}
      {/* GAME OBJECTS (PIPES & COINS) DST... */}

      {/* --- TARUH DI SINI: OVERLAY GAME OVER AESTHETIC --- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGameOverAnim ? "rgba(255, 0, 0, 0.2)" : "transparent", // Kilat merah tipis
          backdropFilter: isGameOverAnim ? "blur(8px)" : "none", // Efek blur estetik
          opacity: isGameOverAnim ? 1 : 0,
          transition: "all 0.4s ease-in-out",
          zIndex: 150, // Di atas pipa, di bawah menu
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isGameOverAnim && (
          <h1
            style={{
              color: "white",
              fontSize: "4rem",
              fontWeight: "900",
              textShadow: "0 0 20px red",
            }}
          >
            TERHEMPAS!
          </h1>
        )}
      </div>

      {/* MENU UTAMA DST... */}

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
                  // Gunakan value agar sinkron
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
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
                  onClick={() => {
                    if (playerName.trim() !== "") {
                      localStorage.setItem("player_name", playerName);
                      setIsEditing(false);
                    } else {
                      alert("Nama tidak boleh kosong!");
                    }
                  }}
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
                  onClick={() => {
                    // 1. Bersihkan semua sampah pipa hantu ronde sebelumnya
                    hardResetGame();

                    // 2. Beri jeda 30ms agar React selesai menghapus pipa dari layar (DOM)
                    setTimeout(() => {
                      setGameState("PLAYING");
                    }, 30);
                  }}
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 300,
            background: "#0f0c29",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "#4facfe",
              marginBottom: "20px",
              fontWeight: "900",
            }}
          >
            🏆 RANKING DUNIA
          </h2>
          <div
            style={{
              width: "100%",
              maxWidth: "350px",
              height: "50vh",
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "24px",
              border: "1px solid rgba(79, 172, 254, 0.3)",
              overflowY: "auto",
            }}
          >
            {globalScores.length > 0 ? (
              globalScores.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: i === 0 ? "rgba(79, 172, 254, 0.1)" : "none",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontWeight: i < 3 ? "bold" : "normal" }}>
                    {i + 1}. {s.username}
                  </span>
                  <span style={{ color: "#4facfe", fontWeight: "bold" }}>
                    {s.score} PTS
                  </span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", opacity: 0.5 }}>
                Memuat data...
              </p>
            )}
          </div>
          <button
            onClick={() => setGameState("MENU")}
            style={{
              marginTop: "30px",
              padding: "12px 40px",
              borderRadius: "15px",
              background: "white",
              color: "#0f0c29",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            KEMBALI KE MENU
          </button>
        </div>
      )}
    </div>
  );
};

export default GameContainer;

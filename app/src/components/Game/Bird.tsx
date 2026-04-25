"use client";
import React, { useState, useEffect } from "react";

const Bird = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cegah render di server untuk menghindari Hydration Error
  if (!mounted) {
    return <div style={{ width: "120px", height: "120px" }} />;
  }

  // --- CONFIG SPRITESHEET (4 Kolom, 3 Baris) ---
  const totalCols = 4;
  const totalRows = 3;

  return (
    <div style={{ position: "relative" }}>
      <style suppressHydrationWarning>{`
        @keyframes playCrow {
          from { background-position: 0% 0%; }
          /* 133.3% adalah angka ajaib untuk 4 kolom (100 * 4/3) */
          to { background-position: 133.33% 0%; } 
        }
        @keyframes witchFloat {
          0%, 100% { transform: scaleX(-1) translateY(0px); }
          50% { transform: scaleX(-1) translateY(-15px); }
        }
      `}</style>

      <div
        style={{
          width: "120px",
          height: "120px",
          backgroundImage: `url('/crow-witch.png')`,
          backgroundRepeat: "no-repeat",

          // UKURAN: 4 kolom (400%) dan 3 baris (300%)
          backgroundSize: "400% 300%",

          // ANIMASI: steps(4) karena ada 4 gambar ke kanan
          animation: `
            playCrow 0.5s steps(${totalCols}) infinite, 
            witchFloat 2s ease-in-out infinite
          `,

          // TRANSFORM: scaleX(-1) untuk hadap kanan
          transform: "scaleX(-1)",
          imageRendering: "pixelated",
          filter: "drop-shadow(0 0 10px rgba(52, 152, 219, 0.7))",
          display: "block",
        }}
      />
    </div>
  );
};

export default Bird;

// src/components/Game/Obstacle.tsx
"use client";
import React from "react";

// Kita kasih tau TypeScript kalau props ini tipenya angka & string
interface ObstacleProps {
  width: number;
  height: number;
  left: number;
  top: number;
  color?: string; // Tanda tanya berarti opsional
}

const Obstacle: React.FC<ObstacleProps> = ({
  width,
  height,
  left,
  top,
  color = "#2ecc71",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        left: `${left}px`,
        top: `${top}px`,
        border: `4px solid ${color === "#e74c3c" ? "#c0392b" : "#27ae60"}`,
        borderRadius: "10px",
        zIndex: 3,
        boxShadow:
          "inset 0 0 15px rgba(0,0,0,0.3), 3px 3px 5px rgba(0,0,0,0.3)",
      }}
    />
  );
};

export default Obstacle;

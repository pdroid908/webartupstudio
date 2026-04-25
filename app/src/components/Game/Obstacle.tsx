// src/components/Game/Obstacle.tsx
"use client";
import React from "react";

const Obstacle = ({ width, height, left, top, color = "#2ecc71" }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: width,
        height: height,
        backgroundColor: color,
        left: left,
        top: top,
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

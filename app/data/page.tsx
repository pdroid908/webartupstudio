"use client";

import React from "react";

export default function LockedPage() {
  return (
    <div style={styles.container}>
      {/* BIG DATA BACKGROUND */}
      <div style={styles.background}>
        <div style={styles.grid} />
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <div style={styles.glow3} />

        {/* fake data nodes */}
        <div style={styles.nodeA} />
        <div style={styles.nodeB} />
        <div style={styles.nodeC} />
        <div style={styles.nodeD} />
      </div>

      {/* DARK LAYER */}
      <div style={styles.overlay} />

      {/* CENTER LOCK CONTENT */}
      <div style={styles.center}>
        <div style={styles.lock}>🔒</div>

        <h1 style={styles.title}>Big Data Analysis Locked</h1>

        <p style={styles.subtitle}>
          Developer authorization required to access analytics engine,
          sentiment pipeline, and data visualization dashboard.
        </p>

        <div style={styles.panel}>
          <div>STATUS: <span style={{ color: "#ff4d4d" }}>RESTRICTED</span></div>
          <div>Chat: Mio for get dev contact</div>
          <div>ACCESS: DENIED</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: "sans-serif",
    color: "white",
    background: "#05070f",
  },

  /* BACKGROUND LAYER */
  background: {
    position: "absolute",
    inset: 0,
  },

  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    opacity: 0.4,
  },

  glow1: {
    position: "absolute",
    width: 400,
    height: 400,
    background: "radial-gradient(circle, rgba(0,255,200,0.25), transparent 60%)",
    top: "10%",
    left: "10%",
    filter: "blur(20px)",
  },

  glow2: {
    position: "absolute",
    width: 500,
    height: 500,
    background: "radial-gradient(circle, rgba(0,120,255,0.25), transparent 60%)",
    bottom: "10%",
    right: "10%",
    filter: "blur(25px)",
  },

  glow3: {
    position: "absolute",
    width: 300,
    height: 300,
    background: "radial-gradient(circle, rgba(255,0,200,0.15), transparent 60%)",
    top: "40%",
    left: "50%",
    filter: "blur(30px)",
  },

  nodeA: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#00ffd5",
    top: "20%",
    left: "30%",
    boxShadow: "0 0 20px #00ffd5",
  },

  nodeB: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4da3ff",
    top: "60%",
    left: "70%",
    boxShadow: "0 0 20px #4da3ff",
  },

  nodeC: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#ff4df0",
    top: "40%",
    left: "80%",
    boxShadow: "0 0 20px #ff4df0",
  },

  nodeD: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#ffd24d",
    top: "75%",
    left: "20%",
    boxShadow: "0 0 20px #ffd24d",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0.92))",
  },

  /* CENTER */
  center: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 20,
  },

  lock: {
    fontSize: 70,
    marginBottom: 10,
  },

  title: {
    fontSize: "2.4rem",
    fontWeight: 800,
    letterSpacing: 1,
    marginBottom: 10,
  },

  subtitle: {
    maxWidth: 500,
    opacity: 0.75,
    lineHeight: 1.6,
    marginBottom: 25,
  },

  panel: {
    padding: "14px 18px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    fontSize: 13,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    letterSpacing: 1,
  },
};
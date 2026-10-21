"use client";

import { useEffect, useState } from "react";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { soundEngine } from "@/engine/audio/AudioManager";
import { THEME } from "@/lib/theme";

export function HappyBirthdayModal() {
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);
  const closeMemory = useTransitionStore((s) => s.closeMemory);

  const isOpen = activeMemoryId === "happy-birthday-celebration";
  const [isPlaying, setIsPlaying] = useState(true);

  // Trigger Happy Birthday melody when opened
  useEffect(() => {
    if (isOpen) {
      soundEngine.playHappyBirthdayMelody();
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMemory();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMemory]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(6, 4, 3, 0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.3s ease-out",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMemory();
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #181410 0%, #120e0a 100%)",
          border: `2px solid ${THEME.evidence.primary}`,
          borderRadius: 8,
          boxShadow: `0 0 45px rgba(234, 179, 8, 0.28), 0 25px 50px rgba(0, 0, 0, 0.8)`,
          maxWidth: 640,
          width: "100%",
          padding: "clamp(1.4rem, 4vw, 2.2rem)",
          position: "relative",
          overflow: "hidden",
          color: "#fef3c7",
        }}
      >
        {/* Decorative Festive Top Ribbon */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #eab308, #f59e0b, #38bdf8, #eab308)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={closeMemory}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${THEME.folder.dark}`,
            borderRadius: "50%",
            width: 32,
            height: 32,
            color: "#e2d9cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = THEME.classified.stamp;
            e.currentTarget.style.borderColor = THEME.classified.bright;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = THEME.folder.dark;
          }}
        >
          ✕
        </button>

        {/* Archival Classification Stamp */}
        <div
          style={{
            display: "inline-block",
            padding: "0.25rem 0.6rem",
            background: "rgba(185, 28, 28, 0.2)",
            border: `1px solid ${THEME.classified.stamp}`,
            borderRadius: 3,
            color: THEME.classified.bright,
            fontSize: "0.62rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            marginBottom: "0.8rem",
          }}
        >
          TOP SECRET // SACRED CASE DOSSIER #1025
        </div>

        {/* Main Birthday Title */}
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.1rem)",
            fontWeight: 900,
            letterSpacing: "0.14em",
            color: "#fef08a",
            margin: "0 0 0.4rem 0",
            textShadow: "0 0 20px rgba(234, 179, 8, 0.5)",
          }}
        >
          ✦ HAPPY 23RD BIRTHDAY, ANSHIKA! ✦
        </h1>

        <div
          style={{
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            color: THEME.evidence.primary,
            fontWeight: 700,
            marginBottom: "1.4rem",
          }}
        >
          25 OCTOBER 2003 • 23 YEARS OF RADIANCE &amp; WONDER
        </div>

        {/* Heartfelt Birthday Message Letter */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(234, 179, 8, 0.18)",
            borderRadius: 6,
            padding: "1.1rem",
            fontSize: "0.86rem",
            lineHeight: 1.7,
            color: "#e2d9cc",
            marginBottom: "1.4rem",
          }}
        >
          <p style={{ margin: "0 0 0.8rem 0" }}>
            To the most incredible person in my universe:
          </p>
          <p style={{ margin: "0 0 0.8rem 0" }}>
            Happy 23rd Birthday! From the laughter and endless Scooty rides across Kanpur, to the quiet moments praying together at Lord Krishna&apos;s JK Temple, to every late night call bridging the 1,540 kilometers between Kanpur and your post at CDAC Bangalore — you have filled every chapter of my life with boundless joy.
          </p>
          <p style={{ margin: "0 0 0.8rem 0" }}>
            May this 23rd year bring you peace, triumph in all your studies, dreams turned into reality, and endless reasons to smile.
          </p>
          <p style={{ margin: 0, fontWeight: 700, color: THEME.evidence.primary }}>
            Always by your side, through every distance and every year,<br />
            — Arnav
          </p>
        </div>

        {/* Audio Player Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(234, 179, 8, 0.08)",
            border: `1px solid ${THEME.evidence.primary}44`,
            borderRadius: 6,
            padding: "0.75rem 1rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", animation: "pulse 1.5s infinite" }}>♫</span>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#fef08a", letterSpacing: "0.1em" }}>
                HAPPY BIRTHDAY MELODY
              </div>
              <div style={{ fontSize: "0.62rem", color: "#9c7a4c" }}>
                Authentic Celesta Chimes &amp; Music Box Waltz
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={() => {
                soundEngine.playHappyBirthdayMelody();
                setIsPlaying(true);
              }}
              style={{
                background: THEME.evidence.primary,
                border: "none",
                borderRadius: 4,
                padding: "0.35rem 0.75rem",
                color: "#120e0a",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              ↺ REPLAY
            </button>
            <button
              onClick={() => {
                soundEngine.togglePlayPause();
                setIsPlaying((p) => !p);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: `1px solid ${THEME.evidence.primary}66`,
                borderRadius: 4,
                padding: "0.35rem 0.65rem",
                color: "#fef3c7",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              {isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
            </button>
          </div>
        </div>

        {/* Footer Close Instruction */}
        <div
          style={{
            marginTop: "1.2rem",
            textAlign: "center",
            fontSize: "0.6rem",
            color: "#8a755d",
            letterSpacing: "0.2em",
          }}
        >
          PRESS [ESC] OR CLICK OUTSIDE TO RETURN TO THE ARCHIVE VAULT
        </div>
      </div>
    </div>
  );
}

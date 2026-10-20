"use client";

import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";

export function CinematicOverlay() {
  const cinematicMode = useAppStore((s) => s.cinematicMode);
  const exitCinematic = useTransitionStore((s) => s.exitCinematic);

  if (!cinematicMode) return null;

  return (
    <>
      {/* Top letterbox bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "10vh",
          background: "#050403",
          zIndex: 80,
          pointerEvents: "none",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Bottom letterbox bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10vh",
          background: "#050403",
          zIndex: 80,
          pointerEvents: "none",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Skip button (top-right) */}
      <button
        onClick={exitCinematic}
        style={{
          position: "fixed",
          top: "calc(10vh + 1rem)",
          right: "2rem",
          zIndex: 85,
          background: "rgba(10, 8, 6, 0.8)",
          border: "1px solid rgba(196, 163, 90, 0.4)",
          borderRadius: 2,
          padding: "0.5rem 1.2rem",
          color: "#c4a35a",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#c4a35a";
          e.currentTarget.style.background = "rgba(196, 163, 90, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(196, 163, 90, 0.4)";
          e.currentTarget.style.background = "rgba(10, 8, 6, 0.8)";
        }}
      >
        [ESC] SKIP
      </button>
    </>
  );
}

"use client";

import { useEffect } from "react";
import { THEME } from "@/lib/theme";

interface DistanceMap2DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DistanceMap2DModal — High-fidelity 2D archival schematic map modal.
 * Fulfills SPEC.md Section 52 fallback and provides an interactive technical map
 * of the 1,540 km flight arc between Kanpur and Bangalore.
 */
export function DistanceMap2DModal({ isOpen, onClose }: DistanceMap2DModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 6, 5, 0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "880px",
          background: "#120e0a",
          border: `2px solid ${THEME.folder.base}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.9), 0 0 40px rgba(234, 179, 8, 0.12)",
          padding: "1.75rem",
          color: "#e2d9cc",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${THEME.folder.dark}`,
            paddingBottom: "0.75rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                color: THEME.evidence.primary,
                letterSpacing: "0.25em",
                fontWeight: 700,
              }}
            >
              CLASSIFIED SPATIAL MATRIX // CASE FILE #004
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                color: "#fef3c7",
                letterSpacing: "0.1em",
              }}
            >
              2D TELEMETRIC MAP: KANPUR ◄——► BANGALORE
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${THEME.classified.bright}`,
              color: THEME.classified.bright,
              padding: "0.4rem 0.8rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.15em",
              transition: "all 0.15s ease",
            }}
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* Main Grid: SVG Map on Left, Telemetry Dossier on Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          {/* Animated SVG Schematic of Indian Subcontinent */}
          <div
            style={{
              position: "relative",
              background: "#080605",
              border: "1px solid #281e14",
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              viewBox="0 0 400 480"
              style={{ width: "100%", maxHeight: "380px" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Archival Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(45, 85, 125, 0.15)" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <rect width="400" height="480" fill="url(#grid)" />

              {/* Stylized India Subcontinent Polygon */}
              <path
                d="M 180 30 
                   L 210 50 
                   L 230 70 
                   L 260 85 
                   L 270 120 
                   L 330 110 
                   L 340 140 
                   L 300 160 
                   L 260 175 
                   L 255 210 
                   L 235 270 
                   L 210 330 
                   L 190 390 
                   L 180 430 
                   L 170 380 
                   L 145 320 
                   L 130 260 
                   L 115 220 
                   L 80 200 
                   L 95 160 
                   L 140 140 
                   L 155 70 Z"
                fill="#131c2a"
                stroke="#ca8a04"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Sri Lanka */}
              <path
                d="M 215 425 Q 225 440 215 450 Q 205 440 215 425 Z"
                fill="#131c2a"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />

              {/* Flight Trajectory Arc (Kanpur: 215, 155 -> Bangalore: 180, 325) */}
              <path
                d="M 215 155 Q 250 240 180 325"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="3"
                strokeDasharray="6,4"
              />

              {/* Distance Apex Tag */}
              <rect x="225" y="225" width="85" height="26" fill="#080605" stroke="#eab308" strokeWidth="1" />
              <text x="267" y="242" fill="#eab308" fontSize="12" fontWeight="bold" textAnchor="middle">
                1,540 KM
              </text>

              {/* Kanpur Origin Marker */}
              <circle cx="215" cy="155" r="14" fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="215" cy="155" r="5" fill="#eab308" />
              <text x="215" y="138" fill="#eab308" fontSize="12" fontWeight="bold" textAnchor="middle">
                KANPUR [ORIGIN]
              </text>
              <text x="215" y="124" fill="#fef3c7" fontSize="9" textAnchor="middle">
                25 OCT 2003 • 23 YRS
              </text>

              {/* Bangalore Station Marker */}
              <circle cx="180" cy="325" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="180" cy="325" r="5" fill="#38bdf8" />
              <text x="180" y="348" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                BANGALORE [STATION]
              </text>
              <text x="180" y="362" fill="#e2d9cc" fontSize="9" textAnchor="middle">
                CURRENT POST • ARNAV
              </text>

              {/* Animated Light Packet */}
              <circle r="4" fill="#ffffff">
                <animateMotion path="M 215 155 Q 250 240 180 325" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Telemetry Dossier Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div
              style={{
                background: "rgba(185, 28, 28, 0.15)",
                borderLeft: `3px solid ${THEME.classified.bright}`,
                padding: "0.6rem 0.8rem",
              }}
            >
              <div style={{ fontSize: "0.6rem", color: THEME.classified.bright, fontWeight: 700 }}>
                DECLASSIFIED SUMMARY
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fef3c7", marginTop: "0.2rem" }}>
                {"THAT'S THE DISTANCE."}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: THEME.evidence.primary }}>
                NOT THE FEELING.
              </div>
            </div>

            {/* Metrics Table */}
            <div
              style={{
                background: "#080605",
                border: "1px solid #281e14",
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Total Flight Distance:</span>
                <span style={{ color: THEME.evidence.primary, fontWeight: 700 }}>1,540 KM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Direct Flight Time:</span>
                <span style={{ color: "#fef3c7" }}>~2h 30m</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Express Train Time:</span>
                <span style={{ color: "#fef3c7" }}>~32h (Sampark Kranti)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Heartbeat Latency:</span>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>0.00 Seconds</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Sacred Synchronicity:</span>
                <span style={{ color: THEME.evidence.primary, fontWeight: 700 }}>11:11 Daily Sync</span>
              </div>
            </div>

            {/* Anshika Quote Box */}
            <div
              style={{
                background: "rgba(156, 122, 76, 0.1)",
                border: `1px dashed ${THEME.folder.dark}`,
                padding: "0.75rem",
                fontSize: "0.72rem",
                lineHeight: 1.5,
                color: "#e2d9cc",
                fontStyle: "italic",
              }}
            >
              {'“Why haven\'t you texted me for an hour?” • “Bahot busy hoge na” • “How much she misses Arnav everytime”'}
              <div style={{ marginTop: "0.4rem", fontStyle: "normal", color: "#9c7a4c", fontSize: "0.65rem" }}>
                No matter how many kilometers lie between Kanpur and Bangalore, every second counts down to celebrating you.
              </div>
            </div>

            {/* Birthday Vow Stamp */}
            <div
              style={{
                textAlign: "center",
                padding: "0.4rem",
                border: `1px solid ${THEME.classified.stamp}`,
                color: THEME.classified.stamp,
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
              }}
            >
              HAPPY 23RD BIRTHDAY, ANSHIKA • 25 OCTOBER 2003
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

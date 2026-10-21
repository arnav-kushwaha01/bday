"use client";

import { useEffect, useState } from "react";
import { THEME } from "@/lib/theme";

interface DistanceMap2DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActiveLocation = "ALL" | "HER_HOME" | "HIS_HOME" | "CDAC_BANGALORE";

/**
 * DistanceMap2DModal — High-fidelity 2D archival schematic map modal.
 * Fulfills SPEC.md Section 52 fallback and provides an interactive technical map
 * of the 1,540 km flight arc between Kanpur (Her Home & His Home) and CDAC Hostel (Bangalore).
 */
export function DistanceMap2DModal({ isOpen, onClose }: DistanceMap2DModalProps) {
  const [selectedLoc, setSelectedLoc] = useState<ActiveLocation>("ALL");

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
        background: "rgba(8, 6, 5, 0.94)",
        backdropFilter: "blur(14px)",
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
          maxWidth: "920px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#120e0a",
          border: `2px solid ${THEME.folder.base}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.9), 0 0 40px rgba(234, 179, 8, 0.15)",
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
              2D TELEMETRIC MAP: KANPUR (HOMES) ◄——► CDAC HOSTEL (BANGALORE)
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

        {/* Location Selector Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedLoc("ALL")}
            style={{
              background: selectedLoc === "ALL" ? "rgba(234, 179, 8, 0.2)" : "rgba(20, 16, 13, 0.8)",
              border: `1px solid ${selectedLoc === "ALL" ? THEME.evidence.primary : "#382c20"}`,
              color: selectedLoc === "ALL" ? "#fef08a" : "#a8947f",
              padding: "0.35rem 0.75rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            ✦ ALL VECTORS (1,540 KM)
          </button>
          <button
            onClick={() => setSelectedLoc("HER_HOME")}
            style={{
              background: selectedLoc === "HER_HOME" ? "rgba(234, 179, 8, 0.2)" : "rgba(20, 16, 13, 0.8)",
              border: `1px solid ${selectedLoc === "HER_HOME" ? "#eab308" : "#382c20"}`,
              color: selectedLoc === "HER_HOME" ? "#fef08a" : "#a8947f",
              padding: "0.35rem 0.75rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            HER HOME (KANPUR)
          </button>
          <button
            onClick={() => setSelectedLoc("HIS_HOME")}
            style={{
              background: selectedLoc === "HIS_HOME" ? "rgba(249, 115, 22, 0.2)" : "rgba(20, 16, 13, 0.8)",
              border: `1px solid ${selectedLoc === "HIS_HOME" ? "#f97316" : "#382c20"}`,
              color: selectedLoc === "HIS_HOME" ? "#fdba74" : "#a8947f",
              padding: "0.35rem 0.75rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            ARNAV&apos;S HOME (KANPUR)
          </button>
          <button
            onClick={() => setSelectedLoc("CDAC_BANGALORE")}
            style={{
              background: selectedLoc === "CDAC_BANGALORE" ? "rgba(56, 189, 248, 0.2)" : "rgba(20, 16, 13, 0.8)",
              border: `1px solid ${selectedLoc === "CDAC_BANGALORE" ? "#38bdf8" : "#382c20"}`,
              color: selectedLoc === "CDAC_BANGALORE" ? "#7dd3fc" : "#a8947f",
              padding: "0.35rem 0.75rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.12em",
            }}
          >
            CDAC HOSTEL (BANGALORE • 6-MO)
          </button>
        </div>

        {/* Main Grid: SVG Map on Left, Telemetry Dossier on Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "1.5rem",
            alignItems: "start",
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
              style={{ width: "100%", maxHeight: "400px" }}
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

              {/* Great-Circle Flight Trajectory Arc (Kanpur: 215, 150 -> CDAC Bangalore: 180, 335) */}
              <path
                d="M 215 150 Q 255 240 180 335"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="3.2"
                strokeDasharray="6,4"
              />

              {/* Local Kanpur Arc between Her Home (215, 150) and His Home (228, 160) */}
              <path
                d="M 215 150 Q 225 145 228 160"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="3,2"
              />

              {/* Distance Apex Tag */}
              <rect x="225" y="225" width="90" height="26" fill="#080605" stroke="#eab308" strokeWidth="1" />
              <text x="270" y="242" fill="#eab308" fontSize="12" fontWeight="bold" textAnchor="middle">
                1,540 KM
              </text>

              {/* Her Home Marker (Kanpur) */}
              <circle cx="215" cy="150" r="14" fill="none" stroke="#eab308" strokeWidth="1.5" opacity={selectedLoc === "HER_HOME" || selectedLoc === "ALL" ? "0.9" : "0.3"}>
                <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="215" cy="150" r="5" fill="#eab308" />
              <text x="200" y="134" fill="#eab308" fontSize="11" fontWeight="bold" textAnchor="end">
                HER HOME
              </text>
              <text x="200" y="146" fill="#fef3c7" fontSize="8.5" textAnchor="end">
                25.10.2003
              </text>

              {/* Arnav's Home Marker (Kanpur) */}
              <circle cx="228" cy="160" r="10" fill="none" stroke="#f97316" strokeWidth="1.2" opacity={selectedLoc === "HIS_HOME" || selectedLoc === "ALL" ? "0.8" : "0.3"}>
                <animate attributeName="r" values="6;14;6" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="228" cy="160" r="4" fill="#f97316" />
              <text x="242" y="164" fill="#f97316" fontSize="10" fontWeight="bold" textAnchor="start">
                ARNAV&apos;S HOME
              </text>

              {/* CDAC Bangalore Marker */}
              <circle cx="180" cy="335" r="16" fill="none" stroke="#38bdf8" strokeWidth="1.6" opacity={selectedLoc === "CDAC_BANGALORE" || selectedLoc === "ALL" ? "0.9" : "0.3"}>
                <animate attributeName="r" values="9;22;9" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="180" cy="335" r="6" fill="#38bdf8" />
              <text x="180" y="358" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                CDAC HOSTEL [BANGALORE]
              </text>
              <text x="180" y="372" fill="#7dd3fc" fontSize="9" textAnchor="middle">
                6-MONTH DIPLOMA POST
              </text>

              {/* Animated Light Packet traveling Kanpur -> Bangalore */}
              <circle r="4.5" fill="#ffffff">
                <animateMotion path="M 215 150 Q 255 240 180 335" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Telemetry Dossier Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
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

            {/* Dynamic Card depending on Selection */}
            {selectedLoc === "HER_HOME" && (
              <div style={{ background: "#181411", border: "1px solid #eab308", padding: "0.75rem", fontSize: "0.72rem" }}>
                <div style={{ color: "#eab308", fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                  HER HOME — KANPUR (UP)
                </div>
                <div style={{ color: "#fef3c7", lineHeight: 1.5 }}>
                  Coordinates: 26.4499° N, 80.3319° E. The sacred origin where Anshika was born on 25 October 2003. Where her room, books, and family are.
                </div>
              </div>
            )}

            {selectedLoc === "HIS_HOME" && (
              <div style={{ background: "#181411", border: "1px solid #f97316", padding: "0.75rem", fontSize: "0.72rem" }}>
                <div style={{ color: "#f97316", fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                  ARNAV&apos;S HOME — KANPUR (UP)
                </div>
                <div style={{ color: "#fef3c7", lineHeight: 1.5 }}>
                  Coordinates: 26.4473° N, 80.3503° E. Origin base for endless scooty rides, Kulhad78 visits, and our school afterparty memories in Kanpur.
                </div>
              </div>
            )}

            {selectedLoc === "CDAC_BANGALORE" && (
              <div style={{ background: "#181411", border: "1px solid #38bdf8", padding: "0.75rem", fontSize: "0.72rem" }}>
                <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                  CDAC HOSTEL — BANGALORE (CURRENT POST)
                </div>
                <div style={{ color: "#fef3c7", lineHeight: 1.5 }}>
                  Coordinates: 12.8500° N, 77.6600° E. Where Arnav is residing for his 6-month Advanced Computing diploma. Studying hard, missing her constantly, and counting down every day to return.
                </div>
              </div>
            )}

            {/* Metrics Table */}
            <div
              style={{
                background: "#080605",
                border: "1px solid #281e14",
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                fontSize: "0.73rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Origin Cluster:</span>
                <span style={{ color: "#eab308", fontWeight: 700 }}>Kanpur (Her Home &amp; His Home)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9c7a4c" }}>Destination Station:</span>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>CDAC Hostel, Bangalore (6-Mo Diploma)</span>
              </div>
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
              {'\u201cWhy haven\'t you texted me for an hour?\u201d • \u201cBahot busy hoge na\u201d • \u201cHow much she misses Arnav everytime\u201d'}
              <div style={{ marginTop: "0.4rem", fontStyle: "normal", color: "#9c7a4c", fontSize: "0.65rem" }}>
                A 6-month diploma is temporary. 1,540 kilometers is temporary. Arnav &amp; Anshika are permanent.
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

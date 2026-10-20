"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { THEME } from "@/lib/theme";

const LOADING_MESSAGES = [
  "LOCATING CASE DOSSIER: ANSHIKA...",
  "VERIFYING INVESTIGATOR CLEARANCE...",
  "UNSEALING EVIDENCE FILES...",
  "CROSS-EXAMINING RECORDED MEMORIES...",
  "CALIBRATING GEOGRAPHICAL COORDINATES...",
  "ANALYZING CLUES & EASTER EGGS...",
  "DECRYPTING RESTRICTED FINAL FILE...",
  "CASE DOSSIER READY FOR INSPECTION.",
];

/**
 * LoadingScreen — Murder/Mystery archive themed loading overlay.
 * Styled like a confidential dossier decryption sequence with brown, yellow, red, and noir black.
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 16 + 6;
        if (next >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 380);

    return () => clearInterval(interval);
  }, []);

  const messageIndex = Math.min(
    Math.floor((progress / 100) * LOADING_MESSAGES.length),
    LOADING_MESSAGES.length - 1
  );

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: THEME.noir.pitch,
        color: THEME.folder.light,
        fontFamily: "var(--font-geist-mono), monospace",
        transition: isComplete
          ? reducedMotion
            ? "none"
            : "opacity 0.8s ease-out"
          : "none",
        opacity: isComplete ? 0 : 1,
        pointerEvents: isComplete ? "none" : "auto",
      }}
    >
      {/* Classified Red Stamp Badge */}
      <div
        style={{
          border: `2px solid ${THEME.classified.stamp}`,
          color: THEME.classified.bright,
          padding: "0.3rem 1.2rem",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "1.5rem",
          transform: "rotate(-3deg)",
          boxShadow: `0 0 20px ${THEME.classified.dark}44`,
        }}
      >
        TOP SECRET // CLASSIFIED
      </div>

      {/* Case Dossier Title */}
      <div
        style={{
          fontSize: "2.2rem",
          letterSpacing: "0.35em",
          marginBottom: "0.25rem",
          color: THEME.folder.light,
          fontWeight: 400,
        }}
      >
        ANSHIKA
      </div>

      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.5em",
          marginBottom: "2.5rem",
          color: THEME.evidence.amber,
        }}
      >
        CASE FILE NO. 1025 • THE ARCHIVE
      </div>

      {/* Evidence Caution Progress Bar */}
      <div
        style={{
          width: "min(340px, 70vw)",
          height: 4,
          background: THEME.noir.stone,
          border: `1px solid ${THEME.folder.dark}66`,
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: "1.2rem",
        }}
      >
        <div
          style={{
            width: `${Math.min(progress, 100)}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${THEME.folder.base}, ${THEME.evidence.primary}, ${THEME.classified.bright})`,
            transition: reducedMotion ? "none" : "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Loading message */}
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color: THEME.evidence.primary,
          height: "1.4em",
          transition: reducedMotion ? "none" : "opacity 0.3s",
        }}
      >
        {LOADING_MESSAGES[messageIndex]}
      </div>

      {/* Progress percentage & clearance code */}
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          color: "#6b563d",
          marginTop: "0.8rem",
        }}
      >
        CLEARANCE LEVEL: MAXIMUM • {Math.round(Math.min(progress, 100))}%
      </div>
    </div>
  );
}

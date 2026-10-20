"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl, getAudioUrl } from "@/lib/assetManager";
import { soundEngine } from "@/engine/audio/AudioManager";

/**
 * EasterEggModals — Manages UI overlays and modals for the 3 Easter Eggs:
 * 1. ee-cake: The Secret 23rd Birthday Cake Concept Art
 * 2. ee-1111: The Sacred 11:11 Wish Ritual
 * 3. ee-annav: The "Annav" Key Sequence Playful Reaction
 * Also provides an Easter Egg Checklist for tracking secrets discovered (X / 3).
 */
export function EasterEggModals() {
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);
  const closeMemory = useTransitionStore((s) => s.closeMemory);

  const discoveredEasterEggs = useAppStore((s) => s.discoveredEasterEggs);
  const unlockEasterEgg = useAppStore((s) => s.unlockEasterEgg);

  // Modal active states
  const isCakeOpen = activeMemoryId === "ee-cake";
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [isAnnavOpen, setIsAnnavOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Audio ref for Annav reaction
  const annavAudioRef = useRef<HTMLAudioElement | null>(null);

  // ─── 1. Global Keyboard Listener for "Annav" ──────────────────────
  useEffect(() => {
    let keyBuffer = "";
    const targetWord = "annav";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs or when modal is open
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) {
        keyBuffer = keyBuffer.slice(-10);
      }

      if (keyBuffer.endsWith(targetWord)) {
        keyBuffer = "";
        unlockEasterEgg("ee-annav");
        setIsAnnavOpen(true);
        if (annavAudioRef.current) {
          annavAudioRef.current.currentTime = 0;
          annavAudioRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [unlockEasterEgg]);

  // ─── 2. Global Clock Check for 11:11 ──────────────────────────────
  const check1111 = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // 11:11 AM or 11:11 PM (23:11)
    if ((hours === 11 || hours === 23) && minutes === 11) {
      soundEngine.playWishStar();
      unlockEasterEgg("ee-1111");
      setIsWishOpen(true);
    }
  }, [unlockEasterEgg]);

  useEffect(() => {
    const timer = setInterval(check1111, 30000);
    return () => clearInterval(timer);
  }, [check1111]);

  // Escape key handler for all easter egg overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCakeOpen) closeMemory();
        if (isWishOpen) setIsWishOpen(false);
        if (isAnnavOpen) setIsAnnavOpen(false);
        if (isTrackerOpen) setIsTrackerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCakeOpen, isWishOpen, isAnnavOpen, isTrackerOpen, closeMemory]);

  const cakePhotoUrl = getPhotoUrl("cake-tease.jpg");
  const annavAudioUrl = getAudioUrl("cutely_calling_me_dumbo.ogg");

  return (
    <>
      {/* Audio element for Annav reaction */}
      <audio ref={annavAudioRef} src={annavAudioUrl} preload="auto" />

      {/* ─── HUD Tracker Button: [SECRETS: X/3] ─────────────────────── */}
      <button
        onClick={() => setIsTrackerOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "2rem",
          zIndex: 48,
          background: "rgba(18, 14, 10, 0.85)",
          border: `1.5px solid ${
            discoveredEasterEggs.length === 3 ? "#22c55e" : THEME.evidence.primary
          }`,
          color: discoveredEasterEggs.length === 3 ? "#86efac" : THEME.evidence.primary,
          padding: "0.45rem 0.9rem",
          fontSize: "0.62rem",
          fontWeight: 900,
          letterSpacing: "0.2em",
          fontFamily: "var(--font-geist-mono), monospace",
          borderRadius: "3px",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = THEME.folder.desk;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(18, 14, 10, 0.85)";
        }}
      >
        <span>★</span>
        <span>SECRETS: {discoveredEasterEggs.length} / 3</span>
      </button>

      {/* ─── 1. CAKE EASTER EGG MODAL (ee-cake) ────────────────────── */}
      {isCakeOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(8, 6, 5, 0.92)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "680px",
              background: THEME.folder.desk,
              border: `2px solid ${THEME.evidence.primary}`,
              borderRadius: "4px",
              boxShadow: `0 25px 50px rgba(0,0,0,0.8), 0 0 30px ${THEME.evidence.glow}`,
              padding: "1.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              fontFamily: "var(--font-geist-mono), monospace",
              color: "#e2d9cc",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1.5px solid ${THEME.evidence.primary}`,
                paddingBottom: "0.8rem",
              }}
            >
              <div>
                <span
                  style={{
                    background: THEME.classified.stamp,
                    color: "#fff",
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.58rem",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    borderRadius: "2px",
                    marginRight: "0.6rem",
                  }}
                >
                  SECRET UNLOCKED #01
                </span>
                <span
                  style={{
                    color: THEME.evidence.primary,
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                  }}
                >
                  THE 23RD BIRTHDAY CAKE CONFECTION
                </span>
              </div>
              <button
                onClick={closeMemory}
                style={{
                  background: "none",
                  border: `1px solid ${THEME.classified.stamp}`,
                  color: THEME.classified.bright,
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Cake Image Still */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                maxHeight: "340px",
                overflow: "hidden",
                border: "1.5px solid #2e2318",
                background: "#080605",
                borderRadius: "2px",
              }}
            >
              <Image
                src={cakePhotoUrl}
                alt="23rd Birthday Cake"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Cake Inscription Details */}
            <div
              style={{
                background: "#140f0b",
                padding: "1rem",
                borderRadius: "3px",
                border: "1px dashed rgba(234, 179, 8, 0.3)",
                fontSize: "0.78rem",
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  color: THEME.evidence.primary,
                  fontWeight: 900,
                  marginBottom: "0.4rem",
                  letterSpacing: "0.15em",
                }}
              >
                CLASSIFIED CONFECTION FILE // 25 OCTOBER 2026
              </div>
              <div>
                Ordered with immense love for Anshika&apos;s 23rd Birthday. A bespoke cake
                created to celebrate 23 years of sweetness, beauty, and mischief.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. 11:11 WISH RITUAL MODAL (ee-1111) ──────────────────── */}
      {isWishOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(6, 4, 10, 0.94)",
            backdropFilter: "blur(18px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              background: "#100d18",
              border: `2px solid ${THEME.evidence.primary}`,
              borderRadius: "6px",
              boxShadow: "0 0 50px rgba(234, 179, 8, 0.35)",
              padding: "2.5rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1.4rem",
              color: "#fef3c7",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            <div style={{ fontSize: "3rem" }}>✨ 11:11 ✨</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: THEME.evidence.primary,
                letterSpacing: "0.2em",
              }}
            >
              MAKE A WISH, ANSHIKA
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "#e2d9cc",
                lineHeight: 1.8,
                maxWidth: "480px",
                margin: "0 auto",
                fontStyle: "italic",
              }}
            >
              &quot;She never misses 11:11. Always praying, always hoping with pure, genuine belief.
              May every single wish you ever made at 11:11 come true this 23rd year.&quot;
            </div>

            {/* Glowing Inscription Box */}
            <div
              style={{
                background: "rgba(234, 179, 8, 0.08)",
                border: `1px solid ${THEME.evidence.primary}`,
                borderRadius: "4px",
                padding: "0.8rem",
                fontSize: "0.72rem",
                color: THEME.evidence.primary,
                letterSpacing: "0.15em",
                fontWeight: 800,
              }}
            >
              ★ SACRED 11:11 BIRTHDAY WISH VERIFIED & STORED IN ARCHIVE ★
            </div>

            <button
              onClick={() => {
                soundEngine.playWishStar();
                setIsWishOpen(false);
              }}
              style={{
                alignSelf: "center",
                background: THEME.evidence.primary,
                color: "#080605",
                border: "none",
                padding: "0.6rem 1.6rem",
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              SEAL MY WISH
            </button>
          </div>
        </div>
      )}

      {/* ─── 3. ANNAV KEYBOARD EASTER EGG MODAL (ee-annav) ─────────── */}
      {isAnnavOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(10, 6, 8, 0.92)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "540px",
              background: "#1c1214",
              border: `2px solid ${THEME.classified.stamp}`,
              borderRadius: "6px",
              boxShadow: "0 0 45px rgba(185, 28, 28, 0.4)",
              padding: "2.2rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              color: "#f5ece1",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            <div style={{ fontSize: "2.8rem" }}>🧸</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                color: THEME.classified.bright,
                letterSpacing: "0.15em",
              }}
            >
              &quot;ANNAV!&quot;
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#fef3c7",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              &quot;The way you say &apos;Annav&apos; — cutely mispronounced, completely adorable,
              and etched into sacred memory forever.&quot;
            </div>

            <div
              style={{
                background: "rgba(185, 28, 28, 0.15)",
                border: `1px dashed ${THEME.classified.bright}`,
                borderRadius: "4px",
                padding: "0.7rem",
                fontSize: "0.68rem",
                color: THEME.classified.bright,
                letterSpacing: "0.15em",
                fontWeight: 800,
              }}
            >
              ★ SECRET KEYWORD UNLOCKED: 100% CUTE & SIGNATURE QUIRK ★
            </div>

            <button
              onClick={() => setIsAnnavOpen(false)}
              style={{
                alignSelf: "center",
                background: THEME.classified.stamp,
                color: "#ffffff",
                border: "none",
                padding: "0.55rem 1.4rem",
                fontSize: "0.7rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              [ESC] CLOSE
            </button>
          </div>
        </div>
      )}

      {/* ─── 4. EASTER EGG TRACKER DOSSIER MODAL ───────────────────── */}
      {isTrackerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(8, 6, 5, 0.92)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              background: THEME.folder.desk,
              border: `2px solid ${THEME.evidence.primary}`,
              borderRadius: "4px",
              padding: "1.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              fontFamily: "var(--font-geist-mono), monospace",
              color: "#e2d9cc",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1.5px solid ${THEME.evidence.primary}`,
                paddingBottom: "0.8rem",
              }}
            >
              <div
                style={{
                  color: THEME.evidence.primary,
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                }}
              >
                ★ ARCHIVAL EASTER EGGS DOSSIER ★
              </div>
              <button
                onClick={() => setIsTrackerOpen(false)}
                style={{
                  background: "none",
                  border: `1px solid ${THEME.classified.stamp}`,
                  color: THEME.classified.bright,
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                [ESC] CLOSE
              </button>
            </div>

            {/* Checklist of the 3 secrets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Egg 1: The Cake */}
              <div
                style={{
                  background: "#140f0b",
                  border: "1px solid #2e2318",
                  padding: "0.9rem",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.78rem", color: THEME.evidence.primary }}>
                    #01: THE 23RD BIRTHDAY CAKE
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9c7a4c", marginTop: "0.2rem" }}>
                    {discoveredEasterEggs.includes("ee-cake")
                      ? "Discovered! Inspectable in the Archive Vault back safe."
                      : "Clue: A secret safe is concealed along the back wall of the Archive Vault."}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    color: discoveredEasterEggs.includes("ee-cake") ? "#22c55e" : "#eab308",
                  }}
                >
                  {discoveredEasterEggs.includes("ee-cake") ? "✓ SOLVED" : "LOCKED"}
                </span>
              </div>

              {/* Egg 2: 11:11 Wish */}
              <div
                style={{
                  background: "#140f0b",
                  border: "1px solid #2e2318",
                  padding: "0.9rem",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.78rem", color: THEME.evidence.primary }}>
                    #02: 11:11 WISH RITUAL
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9c7a4c", marginTop: "0.2rem" }}>
                    {discoveredEasterEggs.includes("ee-1111")
                      ? "Discovered! The sacred 11:11 ritual was triggered."
                      : "Clue: Visit the archive at 11:11, or click the [MAKE 11:11 WISH] button below."}
                  </div>
                </div>
                <button
                  onClick={() => {
                    unlockEasterEgg("ee-1111");
                    setIsWishOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: `1px solid ${THEME.evidence.primary}`,
                    color: THEME.evidence.primary,
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.6rem",
                    cursor: "pointer",
                    borderRadius: "2px",
                    fontWeight: 700,
                  }}
                >
                  {discoveredEasterEggs.includes("ee-1111") ? "REPLAY WISH" : "TRIGGER WISH"}
                </button>
              </div>

              {/* Egg 3: Annav */}
              <div
                style={{
                  background: "#140f0b",
                  border: "1px solid #2e2318",
                  padding: "0.9rem",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.78rem", color: THEME.evidence.primary }}>
                    #03: &quot;ANNAV&quot; KEYBOARD PHONETICS
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#9c7a4c", marginTop: "0.2rem" }}>
                    {discoveredEasterEggs.includes("ee-annav")
                      ? "Discovered! The signature pronunciation was keyed in."
                      : "Clue: Type the letters A-N-N-A-V on your keyboard anywhere in the archive."}
                  </div>
                </div>
                <button
                  onClick={() => {
                    unlockEasterEgg("ee-annav");
                    setIsAnnavOpen(true);
                    if (annavAudioRef.current) {
                      annavAudioRef.current.currentTime = 0;
                      annavAudioRef.current.play().catch(() => {});
                    }
                  }}
                  style={{
                    background: "none",
                    border: `1px solid ${THEME.evidence.primary}`,
                    color: THEME.evidence.primary,
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.6rem",
                    cursor: "pointer",
                    borderRadius: "2px",
                    fontWeight: 700,
                  }}
                >
                  {discoveredEasterEggs.includes("ee-annav") ? "REPLAY" : "TRY NOW"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

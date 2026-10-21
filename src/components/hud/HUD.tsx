"use client";

import { useState, useEffect } from "react";
import { useAppStore, type RoomState } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { InteractionPrompt } from "./InteractionPrompt";
import { MobileControls } from "./MobileControls";
import { CinematicOverlay } from "./CinematicOverlay";
import { EvidenceModal } from "./EvidenceModal";
import { FinalFileModal } from "./FinalFileModal";
import { HappyBirthdayModal } from "./HappyBirthdayModal";
import { EasterEggModals } from "@/components/easter-eggs/EasterEggModals";
import { DistanceMap2DModal } from "@/components/rooms/distance/DistanceMap2DModal";
import { usePlayerStore } from "@/engine/player/playerStore";
import { THEME } from "@/lib/theme";
import { useAudioSync } from "@/engine/audio/useAudioSync";
import { AudioCassetteModal } from "./AudioCassetteModal";
import { soundEngine } from "@/engine/audio/AudioManager";

/**
 * HUD — heads-up display overlay showing current room, settings, navigation,
 * controls hint, interaction prompts, and mobile controls.
 * Styled in the murder/mystery archive theme: Manila brown, yellow, red, black.
 */
export function HUD() {
  useAudioSync();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isTapeDeckOpen, setIsTapeDeckOpen] = useState(false);
  const currentRoom = useAppStore((s) => s.currentRoom);
  const cinematicMode = useAppStore((s) => s.cinematicMode);
  const audioEnabled = useAppStore((s) => s.settings.audioEnabled);
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled);
  const quality = useAppStore((s) => s.settings.quality);
  const setExperienceMode = useAppStore((s) => s.setExperienceMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const discoveredEvidence = useAppStore((s) => s.discoveredEvidence);
  const lightingMode = useAppStore((s) => s.lightingMode);
  const toggleLightingMode = useAppStore((s) => s.toggleLightingMode);

  const isInspectMode = usePlayerStore((s) => s.isInspectMode);
  const toggleInspectMode = usePlayerStore((s) => s.toggleInspectMode);

  const enterRoom = useTransitionStore((s) => s.enterRoom);
  const exitRoom = useTransitionStore((s) => s.exitRoom);
  const isTouchDevice = usePlayerStore((s) => s.isTouchDevice);

  // Keyboard shortcut for [L] (Lighting toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "l" || e.key === "L") {
        toggleLightingMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleLightingMode]);

  // Toggle 2D schematic map with [M] key when in DISTANCE room
  useEffect(() => {
    if (currentRoom !== "DISTANCE") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "m" || e.key === "M") {
        setIsMapOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRoom]);

  const ROOM_LABELS: Record<string, string> = {
    HUB: "THE ARCHIVE VAULT",
    HER_GALLERY: "HER GALLERY // EVIDENCE 01",
    VERSIONS: "VERSIONS OF HER // EVIDENCE 02",
    EVIDENCE: "EVIDENCE ROOM // EVIDENCE 03",
    DISTANCE: "THE DISTANCE // EVIDENCE 04",
    LITTLE_THINGS: "LITTLE THINGS // EVIDENCE 05",
    MAIN_CHARACTER: "MAIN CHARACTER // EVIDENCE 06",
    FUTURE: "UNWRITTEN CHAPTERS // EVIDENCE 07",
    FINAL: "THE FINAL FILE // CLASSIFIED",
  };

  return (
    <>
      {/* Cinematic overlay (visible when cinematicMode is true) */}
      <CinematicOverlay />

      {/* Main HUD overlay — hidden in cinematic mode or final room */}
      {!cinematicMode && currentRoom !== "FINAL" && (
        <>
          {/* Header Bar */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              pointerEvents: "none",
              padding: "max(0.75rem, env(safe-area-inset-top, 0.75rem)) max(0.75rem, env(safe-area-inset-right, 0.75rem)) 0.4rem max(0.75rem, env(safe-area-inset-left, 0.75rem))",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "0.5rem",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {/* Case File & Room Name */}
            <div style={{ pointerEvents: "none", minWidth: 0, flexShrink: 1 }}>
              <div
                style={{
                  fontSize: "clamp(0.46rem, 1.6vw, 0.54rem)",
                  letterSpacing: "0.22em",
                  color: THEME.classified.bright,
                  fontWeight: 700,
                  marginBottom: "0.15rem",
                  whiteSpace: "nowrap",
                }}
              >
                <span>CASE FILE #1025</span>
                <span className="hidden sm:inline"> • SUBJECT: ANSHIKA</span>
              </div>
              <div
                style={{
                  fontSize: "clamp(0.72rem, 2.4vw, 0.9rem)",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: THEME.evidence.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ROOM_LABELS[currentRoom] || currentRoom}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.44rem, 1.4vw, 0.5rem)",
                  letterSpacing: "0.18em",
                  color: THEME.folder.light,
                  marginTop: "0.12rem",
                }}
              >
                EVIDENCE: {discoveredEvidence.length} / 12
              </div>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                maxWidth: "min(100%, 540px)",
                pointerEvents: "auto",
              }}
            >
              {/* Audio quick toggle */}
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                style={{
                  background: "rgba(16, 13, 11, 0.85)",
                  border: `1px solid ${audioEnabled ? THEME.evidence.primary : THEME.folder.dark}`,
                  borderRadius: 2,
                  padding: "clamp(0.26rem, 1.2vw, 0.38rem) clamp(0.4rem, 1.6vw, 0.65rem)",
                  color: audioEnabled ? THEME.evidence.primary : "#6b563d",
                  fontSize: "clamp(0.5rem, 1.4vw, 0.58rem)",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                title={audioEnabled ? "Mute audio" : "Enable audio"}
              >
                {audioEnabled ? "♪ ON" : "♪ MUTED"}
              </button>

              {/* Lighting Mode toggle: Normal Light vs Eerie Dark Mode */}
              <button
                onClick={toggleLightingMode}
                style={{
                  background: "rgba(16, 13, 11, 0.85)",
                  border: `1px solid ${lightingMode === "normal" ? "#facc15" : THEME.folder.dark}`,
                  borderRadius: 2,
                  padding: "clamp(0.26rem, 1.2vw, 0.38rem) clamp(0.4rem, 1.6vw, 0.65rem)",
                  color: lightingMode === "normal" ? "#facc15" : "#a8a29e",
                  fontSize: "clamp(0.5rem, 1.4vw, 0.58rem)",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                title="Toggle Lighting Mode: Normal-Light vs Eerie Dark [L]"
              >
                {lightingMode === "normal" ? "☀️ LIGHT" : "🌙 DARK"}
              </button>

              {/* Inspect Mode (Flying 3D) toggle */}
              <button
                onClick={toggleInspectMode}
                style={{
                  background: isInspectMode ? "rgba(56, 189, 248, 0.2)" : "rgba(16, 13, 11, 0.85)",
                  border: `1px solid ${isInspectMode ? "#38bdf8" : THEME.folder.dark}`,
                  borderRadius: 2,
                  padding: "clamp(0.26rem, 1.2vw, 0.38rem) clamp(0.4rem, 1.6vw, 0.65rem)",
                  color: isInspectMode ? "#38bdf8" : THEME.folder.light,
                  fontSize: "clamp(0.5rem, 1.4vw, 0.58rem)",
                  fontWeight: isInspectMode ? 700 : 500,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                title="Toggle Inspect / Flying 3D Mode [Y]"
              >
                {isInspectMode ? "✈ FLYING [Y]" : "✈ INSPECT [Y]"}
              </button>

              {/* Tape Deck / Love Playlist Modal Trigger */}
              <button
                onClick={() => setIsTapeDeckOpen(true)}
                style={{
                  background: "rgba(16, 13, 11, 0.85)",
                  border: `1px solid ${THEME.evidence.primary}88`,
                  borderRadius: 2,
                  padding: "clamp(0.26rem, 1.2vw, 0.38rem) clamp(0.4rem, 1.6vw, 0.65rem)",
                  color: THEME.evidence.bright,
                  fontSize: "clamp(0.5rem, 1.4vw, 0.58rem)",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  whiteSpace: "nowrap",
                }}
                title="Open Tape Deck & Love Playlist (Ed Sheeran, Navjot Ahuja)"
              >
                <span>♫</span>
                <span>TAPE DECK</span>
              </button>

              {/* Quality indicator (hidden on very narrow mobile phones) */}
              <div
                className="hidden sm:block"
                style={{
                  fontSize: "clamp(0.45rem, 1.5vw, 0.5rem)",
                  letterSpacing: "0.15em",
                  color: THEME.folder.light,
                  padding: "clamp(0.26rem, 1.2vw, 0.38rem) clamp(0.4rem, 1.6vw, 0.6rem)",
                  background: "rgba(16, 13, 11, 0.8)",
                  border: `1px solid ${THEME.folder.dark}66`,
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {quality}
              </div>

              {/* 2D Classified Dossier Mode Toggle */}
              <button
                onClick={() => {
                  soundEngine.playPaperRustle();
                  setViewMode("2d");
                }}
                style={{
                  background: "rgba(16, 13, 11, 0.85)",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 2,
                  padding: "clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.45rem, 2vw, 0.7rem)",
                  color: THEME.folder.light,
                  fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                title="Switch to 2D Classified Dossier (Mobile & Low-WebGL Optimized)"
              >
                2D DOSSIER
              </button>

              {/* 2D Schematic Map toggle (Distance room only) */}
              {currentRoom === "DISTANCE" && (
                <button
                  onClick={() => setIsMapOpen(true)}
                  style={{
                    background: "rgba(16, 13, 11, 0.85)",
                    border: `1px solid ${THEME.evidence.primary}`,
                    borderRadius: 2,
                    padding: "clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.45rem, 2vw, 0.7rem)",
                    color: THEME.evidence.primary,
                    fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = THEME.evidence.primary;
                    e.currentTarget.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(16, 13, 11, 0.85)";
                    e.currentTarget.style.color = THEME.evidence.primary;
                  }}
                  title="View 2D schematic map"
                >
                  MAP [M]
                </button>
              )}

              {/* Archive Room Navigation Dropdown */}
              <select
                value={currentRoom}
                onChange={(e) => enterRoom(e.target.value as RoomState)}
                style={{
                  background: "rgba(16, 13, 11, 0.9)",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 2,
                  padding: "clamp(0.28rem, 1.4vw, 0.35rem) clamp(0.35rem, 1.6vw, 0.6rem)",
                  color: THEME.evidence.primary,
                  fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                  pointerEvents: "auto",
                  maxWidth: "clamp(120px, 32vw, 190px)",
                  textOverflow: "ellipsis",
                }}
                title="Navigate between archive vault rooms"
              >
                <option value="HUB">[00] ARCHIVE VAULT</option>
                <option value="HER_GALLERY">[01] HER GALLERY</option>
                <option value="VERSIONS">[02] VERSIONS OF HER</option>
                <option value="EVIDENCE">[03] EVIDENCE ROOM</option>
                <option value="DISTANCE">[04] THE DISTANCE</option>
                <option value="LITTLE_THINGS">[05] LITTLE THINGS</option>
                <option value="MAIN_CHARACTER">[06] MAIN CHARACTER</option>
                <option value="FUTURE">[07] UNWRITTEN CHAPTERS</option>
                <option value="FINAL">[08] THE FINAL FILE</option>
              </select>

              {/* View 3D Dossier Button */}
              <button
                onClick={() => setExperienceMode("menu")}
                style={{
                  background: "rgba(16, 13, 11, 0.8)",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 2,
                  padding: "clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.45rem, 2vw, 0.7rem)",
                  color: THEME.folder.light,
                  fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = THEME.evidence.primary;
                  e.currentTarget.style.color = THEME.evidence.bright;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = THEME.folder.base;
                  e.currentTarget.style.color = THEME.folder.light;
                }}
                title="View the 3D case dossier"
              >
                DOSSIER
              </button>

              {/* Back to archive vault */}
              {currentRoom !== "HUB" && (
                <button
                  onClick={exitRoom}
                  style={{
                    background: "rgba(16, 13, 11, 0.9)",
                    border: `1px solid ${THEME.classified.stamp}`,
                    borderRadius: 2,
                    padding: "clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.5rem, 2vw, 0.8rem)",
                    color: THEME.classified.bright,
                    fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = THEME.classified.stamp;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(16, 13, 11, 0.9)";
                    e.currentTarget.style.color = THEME.classified.bright;
                  }}
                >
                  ← VAULT
                </button>
              )}
            </div>
          </div>

          {/* Floating Inspect Flying Mode Active Indicator */}
          {isInspectMode && (
            <div
              style={{
                position: "fixed",
                top: "4.8rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 60,
                background: "rgba(8, 14, 24, 0.94)",
                border: "1px solid #38bdf8",
                boxShadow: "0 0 24px rgba(56, 189, 248, 0.35)",
                borderRadius: 4,
                padding: "0.45rem 1rem",
                color: "#38bdf8",
                fontFamily: "var(--font-geist-mono), monospace",
                textAlign: "center",
                pointerEvents: "auto",
              }}
            >
              <div style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.16em" }}>
                ✈ INSPECT / FLYING MODE ACTIVE • 6-AXIS MOVEMENT
              </div>
              <div style={{ fontSize: "0.52rem", color: "#e0f2fe", letterSpacing: "0.1em", marginTop: "0.12rem" }}>
                [WASD] Fly in look angle • [SPACE / E] Ascend • [Q / C] Descend • [SHIFT] Turbo • [Y] Exit to FPP
              </div>
            </div>
          )}

          {/* Distance Room Globe Zoom Controls */}
          {currentRoom === "DISTANCE" && (
            <div
              style={{
                position: "fixed",
                bottom: "1.4rem",
                right: "1.4rem",
                zIndex: 50,
                display: "flex",
                gap: "0.35rem",
                alignItems: "center",
                fontFamily: "var(--font-geist-mono), monospace",
                pointerEvents: "auto",
              }}
            >
              <button
                onClick={() => (window as unknown as { __ZOOM_GLOBE_IN__?: () => void }).__ZOOM_GLOBE_IN__?.()}
                style={{
                  background: "rgba(16, 13, 11, 0.9)",
                  border: `1px solid ${THEME.evidence.primary}`,
                  borderRadius: 2,
                  padding: "0.35rem 0.65rem",
                  color: THEME.evidence.primary,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                title="Zoom in Earth Globe"
              >
                + ZOOM IN
              </button>
              <button
                onClick={() => (window as unknown as { __ZOOM_GLOBE_OUT__?: () => void }).__ZOOM_GLOBE_OUT__?.()}
                style={{
                  background: "rgba(16, 13, 11, 0.9)",
                  border: `1px solid ${THEME.evidence.primary}`,
                  borderRadius: 2,
                  padding: "0.35rem 0.65rem",
                  color: THEME.evidence.primary,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                title="Zoom out Earth Globe"
              >
                - ZOOM OUT
              </button>
              <button
                onClick={() => (window as unknown as { __RESET_GLOBE_ZOOM__?: () => void }).__RESET_GLOBE_ZOOM__?.()}
                style={{
                  background: "rgba(16, 13, 11, 0.8)",
                  border: `1px solid ${THEME.folder.dark}`,
                  borderRadius: 2,
                  padding: "0.35rem 0.55rem",
                  color: THEME.folder.light,
                  fontSize: "0.58rem",
                  cursor: "pointer",
                }}
                title="Reset Globe Zoom to 100%"
              >
                ↺ 100%
              </button>
            </div>
          )}

          {/* Desktop Controls Hint (subtle typewriter font, bottom left) */}
          {!isTouchDevice && (
            <div
              style={{
                position: "fixed",
                bottom: "1.5rem",
                left: "2rem",
                zIndex: 45,
                pointerEvents: "none",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: "#8a755d",
                lineHeight: 1.8,
              }}
            >
              <div>[W A S D] MOVE • [DRAG] LOOK • [Y] INSPECT / FLY</div>
              <div>
                [SHIFT] SPRINT • [E] INSPECT • [L] LIGHT/DARK • [ESC] BACK
                {currentRoom === "DISTANCE" ? " • [M] 2D MAP • [WHEEL] ZOOM GLOBE" : ""}
              </div>
            </div>
          )}

          {/* 2D Distance Schematic Map Modal */}
          <DistanceMap2DModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
        </>
      )}

      {/* Active Interaction Prompts and Modals (Active across all rooms including FINAL) */}
      {!cinematicMode && (
        <>
          {/* Active Interaction Prompt */}
          <InteractionPrompt />

          {/* Forensic Evidence Dossier Modal */}
          <EvidenceModal />

          {/* Happy Birthday Special Celebration Modal */}
          <HappyBirthdayModal />

          {/* Final Case File Modal (Room 8 Climax) */}
          <FinalFileModal />

          {/* Easter Egg Modals (Cake, 11:11 Wish, Annav) & Secrets Tracker */}
          <EasterEggModals />

          {/* Archival Tape Deck & Love Songs Playlist Modal */}
          <AudioCassetteModal
            isOpen={isTapeDeckOpen}
            onClose={() => setIsTapeDeckOpen(false)}
          />

          {/* Mobile Joystick & Interact FAB */}
          <MobileControls />
        </>
      )}
    </>
  );
}

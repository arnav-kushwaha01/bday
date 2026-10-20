"use client";

import { useCallback, useEffect, lazy, Suspense } from "react";
import { HUD } from "@/components/hud/HUD";
import { useAppStore, isWebGLAvailable } from "@/store/useAppStore";
import { THEME } from "@/lib/theme";
import { soundEngine } from "@/engine/audio/AudioManager";
import { FallbackArchive2D } from "@/components/fallback/FallbackArchive2D";
import { WebGLErrorBoundary } from "@/components/canvas/WebGLErrorBoundary";

// Dynamic import with ssr: false — Canvas must never render on server
const ArchiveScene = lazy(() => import("@/components/canvas/ArchiveScene"));

/**
 * ArchiveExperience — Top-level client component managing the experience lifecycle.
 * The entry point is an actual 3D Manila Archive Dossier on a detective's desk.
 */
export default function ArchiveExperience() {
  const experienceMode = useAppStore((s) => s.experienceMode);
  const setExperienceMode = useAppStore((s) => s.setExperienceMode);
  const isDossierOpen = useAppStore((s) => s.isDossierOpen);
  const setDossierOpen = useAppStore((s) => s.setDossierOpen);
  const restartExperience = useAppStore((s) => s.restartExperience);
  const discoveredEvidence = useAppStore((s) => s.discoveredEvidence);
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  // Automatically switch to 2D Fallback on devices where WebGL is unsupported or disabled
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setViewMode("2d");
    }
  }, [setViewMode]);

  const handleEnterArchive = useCallback(() => {
    soundEngine.init();
    soundEngine.playDoorLatch();
    setDossierOpen(true);
    setExperienceMode("active");
  }, [setDossierOpen, setExperienceMode]);

  const handleRestart = useCallback(() => {
    restartExperience();
  }, [restartExperience]);

  // If in 2D Fallback mode, render the high-end 2D classified dossier
  if (viewMode === "2d") {
    return <FallbackArchive2D />;
  }

  return (
    <>
      {/* 1. Single 3D Canvas with WebGL Error Boundary */}
      <WebGLErrorBoundary fallback={<FallbackArchive2D />}>
            <Suspense
              fallback={
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: THEME.noir.pitch,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: THEME.folder.light,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                  }}
                >
                  UNSEALING ARCHIVE VAULT...
                </div>
              }
            >
              <ArchiveScene />
            </Suspense>
          </WebGLErrorBoundary>

          {/* 3. Initial 3D Dossier HUD (Menu Mode) */}
          {experienceMode === "menu" ? (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "max(1rem, env(safe-area-inset-top, 1rem)) max(1rem, env(safe-area-inset-right, 1rem)) max(1rem, env(safe-area-inset-bottom, 1rem)) max(1rem, env(safe-area-inset-left, 1rem))",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              {/* Header Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div>
                  <div
                    style={{
                      border: `1px solid ${THEME.classified.stamp}`,
                      background: "rgba(185, 28, 28, 0.15)",
                      color: THEME.classified.bright,
                      padding: "0.25rem 0.6rem",
                      fontSize: "clamp(0.5rem, 1.8vw, 0.6rem)",
                      letterSpacing: "0.25em",
                      fontWeight: 700,
                      display: "inline-block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    RESTRICTED ARCHIVE // CASE NO. 1025
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
                      color: THEME.folder.light,
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                    }}
                  >
                    SUBJECT: ANSHIKA
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 13, 11, 0.85)",
                    border: `1px solid ${THEME.evidence.primary}44`,
                    padding: "0.35rem 0.65rem",
                    borderRadius: 2,
                    color: THEME.evidence.primary,
                    fontSize: "clamp(0.48rem, 1.6vw, 0.55rem)",
                    letterSpacing: "0.15em",
                    whiteSpace: "nowrap",
                  }}
                >
                  CLASSIFIED DOSSIER
                </div>
              </div>

              {/* Bottom Case Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  pointerEvents: "auto",
                }}
              >
                {/* Instruction tip */}
                <div
                  style={{
                    fontSize: "clamp(0.5rem, 1.8vw, 0.55rem)",
                    letterSpacing: "0.2em",
                    color: THEME.evidence.amber,
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                    textAlign: "center",
                  }}
                >
                  {isDossierOpen
                    ? "DOSSIER UNSEALED • PROCEED INTO ARCHIVE"
                    : "CLICK FOLDER OR BUTTON TO UNSEAL DOSSIER"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "96vw",
                  }}
                >
                  {/* Toggle Folder Open / Close */}
                  <button
                    onClick={() => {
                      soundEngine.playPaperRustle();
                      setDossierOpen(!isDossierOpen);
                    }}
                    style={{
                      background: "rgba(16, 13, 11, 0.9)",
                      border: `1px solid ${THEME.folder.base}`,
                      borderRadius: 2,
                      padding: "clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 2.5vw, 1.8rem)",
                      color: THEME.folder.light,
                      fontSize: "clamp(0.58rem, 1.8vw, 0.65rem)",
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.25s",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = THEME.evidence.primary;
                      e.currentTarget.style.color = THEME.evidence.bright;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = THEME.folder.base;
                      e.currentTarget.style.color = THEME.folder.light;
                    }}
                  >
                    {isDossierOpen ? "CLOSE DOSSIER" : "UNSEAL DOSSIER"}
                  </button>

                  {/* 2D Dossier Mode Switch */}
                  <button
                    onClick={() => {
                      soundEngine.playPaperRustle();
                      setViewMode("2d");
                    }}
                    style={{
                      background: "rgba(16, 13, 11, 0.9)",
                      border: `1px solid ${THEME.evidence.primary}88`,
                      borderRadius: 2,
                      padding: "clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 2.5vw, 1.6rem)",
                      color: THEME.evidence.bright,
                      fontSize: "clamp(0.58rem, 1.8vw, 0.65rem)",
                      letterSpacing: "0.18em",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.25s",
                      backdropFilter: "blur(8px)",
                    }}
                    title="Switch to 2D Classified Dossier (Mobile & Low-Power Optimized)"
                  >
                    2D DOSSIER MODE
                  </button>

                  {/* Enter Archive Vault */}
                  <button
                    onClick={handleEnterArchive}
                    style={{
                      background: `linear-gradient(135deg, ${THEME.classified.stamp}, ${THEME.folder.dark})`,
                      border: `1px solid ${THEME.evidence.primary}`,
                      borderRadius: 2,
                      padding: "clamp(0.6rem, 2vw, 0.75rem) clamp(1.2rem, 3vw, 2.2rem)",
                      color: "#fff8e7",
                      fontSize: "clamp(0.6rem, 2vw, 0.68rem)",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.25s",
                      boxShadow: `0 4px 20px ${THEME.classified.dark}66`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 6px 24px ${THEME.evidence.primary}88`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 4px 20px ${THEME.classified.dark}66`;
                    }}
                  >
                    {discoveredEvidence.length > 0
                      ? "RESUME INVESTIGATION"
                      : "ENTER THE ARCHIVE"}
                  </button>

                  {discoveredEvidence.length > 0 && (
                    <button
                      onClick={handleRestart}
                      style={{
                        background: "none",
                        border: `1px solid ${THEME.noir.stone}`,
                        borderRadius: 2,
                        padding: "0.75rem 1.4rem",
                        color: "#6b563d",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = THEME.classified.bright;
                        e.currentTarget.style.borderColor = THEME.classified.stamp;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#6b563d";
                        e.currentTarget.style.borderColor = THEME.noir.stone;
                      }}
                    >
                      RESTART CASE
                    </button>
                  )}
                </div>

                {discoveredEvidence.length > 0 && (
                  <div
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "0.3em",
                      color: THEME.evidence.primary,
                      marginTop: "0.5rem",
                    }}
                  >
                    {discoveredEvidence.length} / 12 PIECES OF EVIDENCE RECOVERED
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 4. Active Exploration HUD */
            <HUD />
          )}
    </>
  );
}

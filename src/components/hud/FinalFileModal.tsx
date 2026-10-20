"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";
import { getAudioUrl } from "@/lib/assetManager";

/**
 * FinalFileModal — The culminating classified case file experience for Room 8.
 *
 * Implements SPEC.md requirements:
 * - Opens when interacting with the FINAL FILE object in Room 8.
 * - Custom audio/voice note player with play, pause, volume, seek, close (NO AUTOPLAY).
 * - Full emotional handwritten message from Arnav.
 * - Ends with "ARCHIVE STATUS: COMPLETE." and "HAPPY 23RD BIRTHDAY, ANSHIKA."
 */
export function FinalFileModal() {
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);
  const closeMemory = useTransitionStore((s) => s.closeMemory);
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  const isOpen = activeMemoryId === "final-file";

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const voiceNoteUrl = getAudioUrl(
    "her_telling_me_how_much_and_deeply_she_loves_me.ogg"
  );

  // Keyboard navigation: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        closeMemory();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMemory]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(8, 6, 5, 0.94)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "max(0.5rem, env(safe-area-inset-top, 0.5rem)) max(0.5rem, env(safe-area-inset-right, 0.5rem)) max(0.5rem, env(safe-area-inset-bottom, 0.5rem)) max(0.5rem, env(safe-area-inset-left, 0.5rem))",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Hidden audio element (Strictly NO AUTOPLAY) */}
      <audio
        ref={audioRef}
        src={voiceNoteUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Dossier Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "94dvh",
          display: "flex",
          flexDirection: "column",
          background: THEME.folder.desk,
          border: `2px solid ${THEME.evidence.primary}`,
          borderRadius: "4px",
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px ${THEME.evidence.glow}`,
          overflow: "hidden",
          color: "#e2d9cc",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        {/* Top Manila Folder Tab & Caution Tape */}
        <div
          style={{
            background: THEME.folder.base,
            borderBottom: `2px solid ${THEME.evidence.primary}`,
            padding: "0.8rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span
              style={{
                background: THEME.classified.stamp,
                color: "#ffffff",
                padding: "0.25rem 0.6rem",
                fontSize: "0.6rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                borderRadius: "2px",
              }}
            >
              ★ CLASSIFIED DOSSIER #1025 ★
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: THEME.evidence.primary,
                fontWeight: 700,
              }}
            >
              SUBJECT: ANSHIKA BAJPAI • THE FINAL FILE
            </span>
          </div>

          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlaying(false);
              closeMemory();
            }}
            style={{
              background: "none",
              border: `1px solid ${THEME.classified.stamp}`,
              color: THEME.classified.bright,
              padding: "0.35rem 0.9rem",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "inherit",
              borderRadius: "2px",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.classified.stamp;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = THEME.classified.bright;
            }}
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* Scrollable Letter & Media Content */}
        <div
          className="touch-scroll"
          style={{
            padding: "clamp(0.85rem, 2.5vw, 2rem)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.8rem",
            background: "#120e0a",
          }}
        >
          {/* Audio Wire Intercept Player Bar */}
          <div
            style={{
              background: "#1c1610",
              border: `1.5px solid ${THEME.evidence.primary}`,
              borderRadius: "4px",
              padding: "1rem 1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎙️</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    color: THEME.evidence.primary,
                    fontWeight: 800,
                  }}
                >
                  VOICE NOTE ARCHIVE // HER WORDS (UNEDITED)
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "#9c7a4c",
                  letterSpacing: "0.1em",
                }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Controls Bar: Play, Seek, Volume */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                style={{
                  background: isPlaying ? THEME.classified.stamp : THEME.evidence.primary,
                  color: isPlaying ? "#fff" : "#080605",
                  border: "none",
                  padding: "0.45rem 1rem",
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s",
                }}
              >
                {isPlaying ? "❚❚ PAUSE" : "▶ PLAY VOICE NOTE"}
              </button>

              {/* Seek Bar */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  accentColor: THEME.evidence.primary,
                  cursor: "pointer",
                }}
              />

              {/* Volume & Mute */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  onClick={toggleMute}
                  style={{
                    background: "none",
                    border: "none",
                    color: THEME.evidence.primary,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: "70px",
                    accentColor: THEME.evidence.primary,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Aged Parchment Letter Container */}
          <div
            style={{
              background: "#18130e",
              border: `1px solid ${THEME.folder.light}`,
              padding: "2.2rem 2.5rem",
              borderRadius: "3px",
              boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              gap: "1.4rem",
              lineHeight: 1.85,
              fontSize: "0.85rem",
              color: "#f5ece1",
            }}
          >
            {/* Letter Date Stamp */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px dashed rgba(234, 179, 8, 0.3)",
                paddingBottom: "0.8rem",
              }}
            >
              <span
                style={{
                  color: THEME.evidence.primary,
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  fontSize: "0.75rem",
                }}
              >
                KANPUR ─── BANGALORE • 25 OCTOBER 2026
              </span>
              <span
                style={{
                  color: THEME.classified.bright,
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                }}
              >
                RESTRICTED // SACRED EVIDENCE
              </span>
            </div>

            {/* Letter Body */}
            <div
              style={{
                whiteSpace: "pre-line",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.84rem",
                letterSpacing: "0.03em",
                color: "#e8ded2",
              }}
            >
              {anshikaData.finalMessage}
            </div>

            {/* Signature & Wax Seal Graphic */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "1.5rem",
                paddingTop: "1.2rem",
                borderTop: "1px dashed rgba(234, 179, 8, 0.3)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    color: THEME.evidence.primary,
                  }}
                >
                  ARNAV
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#9c7a4c",
                    letterSpacing: "0.15em",
                  }}
                >
                  CO-AUTHOR OF THE ARCHIVE • 25 OCTOBER 2026
                </div>
              </div>

              {/* Crimson Wax Seal */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: THEME.classified.stamp,
                  border: "2px solid #ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "0.55rem",
                  textAlign: "center",
                  letterSpacing: "0.1em",
                  boxShadow: "0 0 16px rgba(185, 28, 28, 0.6)",
                  transform: "rotate(-12deg)",
                }}
              >
                23 YEARS
                <br />
                ETERNAL
              </div>
            </div>
          </div>

          {/* Grand Birthday Completion Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #1c140c 0%, #2e0909 100%)",
              border: `2px solid ${THEME.evidence.primary}`,
              borderRadius: "4px",
              padding: "1.8rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              alignItems: "center",
              boxShadow: "0 8px 32px rgba(234, 179, 8, 0.15)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: THEME.evidence.amber,
                fontWeight: 900,
                letterSpacing: "0.3em",
              }}
            >
              ★ ARCHIVE STATUS: COMPLETE ★
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                color: THEME.evidence.primary,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
              }}
            >
              HAPPY 23RD BIRTHDAY, ANSHIKA!
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#e2d9cc",
                letterSpacing: "0.15em",
                fontStyle: "italic",
              }}
            >
              25 OCTOBER 2003 ─── 25 OCTOBER 2026 • 23 YEARS OF PURE MAGIC
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.2rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  closeMemory();
                  enterRoom("HUB");
                }}
                style={{
                  background: THEME.evidence.primary,
                  color: "#080605",
                  border: "none",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                }}
              >
                RETURN TO ARCHIVE VAULT
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  closeMemory();
                }}
                style={{
                  background: "transparent",
                  color: THEME.evidence.primary,
                  border: `1px solid ${THEME.evidence.primary}`,
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.18em",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                }}
              >
                STAY IN FINAL ROOM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

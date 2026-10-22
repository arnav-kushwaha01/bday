"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { THEME } from "@/lib/theme";
import {
  soundEngine,
  LOVE_SONGS_PLAYLIST,
  AudioPlayMode,
} from "@/engine/audio/AudioManager";
import { useAppStore } from "@/store/useAppStore";

interface AudioCassetteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioCassetteModal({ isOpen, onClose }: AudioCassetteModalProps) {
  // Sync with soundEngine singleton
  useSyncExternalStore(
    (cb) => soundEngine.subscribe(cb),
    () => soundEngine.getCurrentTrackIndex()
  );

  const audioEnabled = useAppStore((s) => s.settings.audioEnabled);
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled);
  const setStoreVolume = useAppStore((s) => s.setVolume);

  const [playMode, setPlayMode] = useState<AudioPlayMode>(soundEngine.getPlayMode());
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsPlaying());
  const [masterVol, setMasterVol] = useState<number>(soundEngine.getMasterVolume());
  const [ambienceVol, setAmbienceVol] = useState<number>(soundEngine.getAmbienceVolume());
  const [sfxVol, setSfxVol] = useState<number>(soundEngine.getSfxVolume());

  // Reel rotation animation state
  const [reelAngle, setReelAngle] = useState(0);

  // Sync state when modal opens or soundEngine updates
  useEffect(() => {
    const unsub = soundEngine.subscribe(() => {
      setPlayMode(soundEngine.getPlayMode());
      setIsPlaying(soundEngine.getIsPlaying());
      setMasterVol(soundEngine.getMasterVolume());
      setAmbienceVol(soundEngine.getAmbienceVolume());
      setSfxVol(soundEngine.getSfxVolume());
    });
    return unsub;
  }, []);

  // Spin reels when audio is actively playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setReelAngle((prev) => (prev + 5) % 360);
    }, 50);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        soundEngine.playTapeClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTrack = soundEngine.getCurrentTrack();
  const currentIdx = soundEngine.getCurrentTrackIndex();

  const handleTogglePlay = () => {
    soundEngine.playTapeClick();
    if (!audioEnabled || soundEngine.getIsMuted()) {
      setAudioEnabled(true);
      soundEngine.setMuted(false);
    }
    soundEngine.togglePlayPause();
    setIsPlaying(soundEngine.getIsPlaying());
  };

  const handlePrev = () => {
    soundEngine.playTapeClick();
    if (!audioEnabled || soundEngine.getIsMuted()) {
      setAudioEnabled(true);
      soundEngine.setMuted(false);
    }
    soundEngine.previousTrack();
  };

  const handleNext = () => {
    soundEngine.playTapeClick();
    if (!audioEnabled || soundEngine.getIsMuted()) {
      setAudioEnabled(true);
      soundEngine.setMuted(false);
    }
    soundEngine.nextTrack();
  };

  const handleModeChange = (mode: AudioPlayMode) => {
    soundEngine.playTapeClick();
    if (!audioEnabled || soundEngine.getIsMuted()) {
      setAudioEnabled(true);
      soundEngine.setMuted(false);
    }
    soundEngine.setPlayMode(mode);
    setPlayMode(mode);
  };

  const handleMasterVolChange = (v: number) => {
    setMasterVol(v);
    soundEngine.setMasterVolume(v);
    setStoreVolume(v);
    if (v > 0 && soundEngine.getIsMuted()) {
      soundEngine.setMuted(false);
      setAudioEnabled(true);
    }
  };

  const handleAmbienceVolChange = (v: number) => {
    setAmbienceVol(v);
    soundEngine.setAmbienceVolume(v);
    if (v > 0 && soundEngine.getIsMuted()) {
      soundEngine.setMuted(false);
      setAudioEnabled(true);
    }
  };

  const handleSfxVolChange = (v: number) => {
    setSfxVol(v);
    soundEngine.setSfxVolume(v);
    if (v > 0 && soundEngine.getIsMuted()) {
      soundEngine.setMuted(false);
      setAudioEnabled(true);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5, 4, 3, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "1rem",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playTapeClick();
          onClose();
        }
      }}
    >
      {/* Tape Deck Chassis */}
      <div
        className="touch-scroll"
        style={{
          width: "100%",
          maxWidth: 620,
          maxHeight: "94dvh",
          overflowY: "auto",
          background: "linear-gradient(145deg, #181411 0%, #0d0a08 100%)",
          border: `2px solid ${THEME.folder.base}`,
          borderRadius: 6,
          boxShadow: `0 25px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)`,
          padding: "clamp(0.85rem, 2.5vw, 1.75rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          position: "relative",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${THEME.folder.dark}66`,
            paddingBottom: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                padding: "0.2rem 0.5rem",
                background: "rgba(234, 179, 8, 0.15)",
                border: `1px solid ${THEME.evidence.primary}`,
                color: THEME.evidence.primary,
                fontWeight: 700,
              }}
            >
              WIRETAP AUDIO DECK // DEPT-1025
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                color: THEME.folder.light,
              }}
            >
              ARCHIVAL TAPE RECORDER & LOVE PLAYLIST
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playTapeClick();
              onClose();
            }}
            style={{
              background: "rgba(185, 28, 28, 0.2)",
              border: `1px solid ${THEME.classified.stamp}`,
              color: THEME.classified.bright,
              padding: "0.4rem 0.8rem",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              cursor: "pointer",
              borderRadius: 2,
              transition: "all 0.2s",
            }}
            title="Eject / Close Deck"
          >
            [EJECT ⏏]
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => handleModeChange("ROOM_SYNC")}
            style={{
              flex: 1,
              padding: "0.6rem",
              background:
                playMode === "ROOM_SYNC"
                  ? "rgba(234, 179, 8, 0.18)"
                  : "rgba(16, 13, 11, 0.8)",
              border: `1px solid ${
                playMode === "ROOM_SYNC" ? THEME.evidence.primary : THEME.folder.dark
              }`,
              color: playMode === "ROOM_SYNC" ? THEME.evidence.primary : THEME.folder.light,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              borderRadius: 2,
              fontWeight: playMode === "ROOM_SYNC" ? 700 : 400,
              transition: "all 0.2s",
            }}
          >
            📻 ROOM AMBIENCE (AUTO-SYNC)
          </button>

          <button
            onClick={() => handleModeChange("LOVE_SONGS")}
            style={{
              flex: 1,
              padding: "0.6rem",
              background:
                playMode === "LOVE_SONGS"
                  ? "rgba(185, 28, 28, 0.2)"
                  : "rgba(16, 13, 11, 0.8)",
              border: `1px solid ${
                playMode === "LOVE_SONGS" ? THEME.classified.stamp : THEME.folder.dark
              }`,
              color: playMode === "LOVE_SONGS" ? THEME.classified.bright : THEME.folder.light,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              borderRadius: 2,
              fontWeight: playMode === "LOVE_SONGS" ? 700 : 400,
              transition: "all 0.2s",
            }}
          >
            💖 LOVE SONGS TAPE DECK
          </button>
        </div>

        {/* Vintage Cassette Cassette Body Display */}
        <div
          style={{
            background: "linear-gradient(180deg, #1a1613 0%, #120f0c 100%)",
            border: `1px solid ${THEME.folder.base}88`,
            borderRadius: 4,
            padding: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cassette Tape Spools Window */}
          <div
            style={{
              background: "#080605",
              border: `1px solid ${THEME.folder.dark}`,
              borderRadius: 4,
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Left Spool */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: `3px solid ${THEME.folder.light}66`,
                  background: "radial-gradient(circle, #2a2018 30%, #100d0b 70%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `rotate(${reelAngle}deg)`,
                  transition: isPlaying ? "none" : "transform 0.5s ease-out",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)",
                }}
              >
                {/* Spool Teeth */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: THEME.evidence.primary,
                    border: "2px solid #000",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.45rem", letterSpacing: "0.2em", color: "#6b563d" }}>
                SUPPLY REEL
              </span>
            </div>

            {/* Center Tape Window & VU meter */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                flex: 1,
                padding: "0 1.5rem",
              }}
            >
              {/* Tape ribbon line */}
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: isPlaying ? THEME.evidence.amber : "#3a2e22",
                  boxShadow: isPlaying ? `0 0 6px ${THEME.evidence.amber}` : "none",
                  transition: "all 0.2s",
                }}
              />

              {/* VU meter bars */}
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 20 }}>
                {[0.4, 0.7, 0.9, 0.5, 0.8, 1.0, 0.6, 0.85, 0.45, 0.75].map((scale, i) => {
                  const dynamicFactor = 0.6 + Math.sin((reelAngle + i * 40) * (Math.PI / 180)) * 0.35;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: isPlaying ? `${Math.max(4, scale * 18 * dynamicFactor)}px` : "4px",
                        background:
                          i > 7
                            ? THEME.classified.bright
                            : i > 4
                            ? THEME.evidence.primary
                            : "#4a7c59",
                        borderRadius: 1,
                        transition: "height 0.1s ease",
                      }}
                    />
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  color: isPlaying ? THEME.evidence.bright : "#6b563d",
                }}
              >
                {isPlaying ? "● PLAYING • 44.1kHz • STEREO" : "■ STOPPED"}
              </div>
            </div>

            {/* Right Spool */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: `3px solid ${THEME.folder.light}66`,
                  background: "radial-gradient(circle, #2a2018 30%, #100d0b 70%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `rotate(${reelAngle}deg)`,
                  transition: isPlaying ? "none" : "transform 0.5s ease-out",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: THEME.evidence.primary,
                    border: "2px solid #000",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.45rem", letterSpacing: "0.2em", color: "#6b563d" }}>
                TAKE-UP REEL
              </span>
            </div>
          </div>

          {/* LCD Track Information */}
          <div
            style={{
              background: "#050906",
              border: `1px solid #1a3a22`,
              borderRadius: 3,
              padding: "0.75rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "#4ade80",
                  fontWeight: 700,
                }}
              >
                {playMode === "LOVE_SONGS"
                  ? `TRACK [0${currentIdx + 1} / 0${LOVE_SONGS_PLAYLIST.length}]`
                  : "CURRENT AUDIO FEED"}
              </span>
              <span style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "#34d399" }}>
                {playMode === "LOVE_SONGS" ? "ACOUSTIC MASTER" : "LIVE SPATIAL FEED"}
              </span>
            </div>

            <div
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.12em",
                color: "#86efac",
                fontWeight: 700,
              }}
            >
              {playMode === "LOVE_SONGS"
                ? `"${currentTrack.title.toUpperCase()}" — ${currentTrack.artist.toUpperCase()}`
                : "ARCHIVE ROOM TONE // ADAPTIVE ACOUSTIC FIELD"}
            </div>

            <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "#6ee7b7" }}>
              {playMode === "LOVE_SONGS"
                ? currentTrack.subtitle
                : "Dynamic ambient resonance shifting as you explore the 7 wings."}
            </div>
          </div>

          {/* Cassette Mechanical Control Buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "0.25rem",
            }}
          >
            {playMode === "LOVE_SONGS" && (
              <button
                onClick={handlePrev}
                style={{
                  background: "rgba(16, 13, 11, 0.9)",
                  border: `1px solid ${THEME.folder.dark}`,
                  color: THEME.folder.light,
                  padding: "0.55rem 1rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
                title="Previous Track"
              >
                ⏮ PREV
              </button>
            )}

            <button
              onClick={handleTogglePlay}
              style={{
                background: isPlaying
                  ? `linear-gradient(135deg, ${THEME.classified.stamp}, #7f1d1d)`
                  : `linear-gradient(135deg, ${THEME.evidence.amber}, ${THEME.evidence.primary})`,
                border: "none",
                color: isPlaying ? "#fff8e7" : "#080605",
                padding: "0.6rem 2.2rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                cursor: "pointer",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                transition: "all 0.2s",
              }}
            >
              {isPlaying ? "❚❚ PAUSE TAPE" : "► PLAY TAPE"}
            </button>

            {playMode === "LOVE_SONGS" && (
              <button
                onClick={handleNext}
                style={{
                  background: "rgba(16, 13, 11, 0.9)",
                  border: `1px solid ${THEME.folder.dark}`,
                  color: THEME.folder.light,
                  padding: "0.55rem 1rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
                title="Next Track"
              >
                NEXT ⏭
              </button>
            )}
          </div>
        </div>

        {/* Volume Sliders Console */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            background: "rgba(16, 13, 11, 0.6)",
            border: `1px solid ${THEME.folder.dark}66`,
            borderRadius: 3,
            padding: "0.9rem",
          }}
        >
          {/* Master Volume */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem" }}>
              <span style={{ color: THEME.folder.light, letterSpacing: "0.15em" }}>MASTER VOL</span>
              <span style={{ color: THEME.evidence.primary }}>{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={masterVol}
              onChange={(e) => handleMasterVolChange(parseFloat(e.target.value))}
              style={{ accentColor: THEME.evidence.primary, cursor: "pointer", width: "100%" }}
            />
          </div>

          {/* Ambience Volume */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem" }}>
              <span style={{ color: THEME.folder.light, letterSpacing: "0.15em" }}>AMBIENCE</span>
              <span style={{ color: THEME.evidence.primary }}>{Math.round(ambienceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={ambienceVol}
              onChange={(e) => handleAmbienceVolChange(parseFloat(e.target.value))}
              style={{ accentColor: THEME.evidence.primary, cursor: "pointer", width: "100%" }}
            />
          </div>

          {/* SFX Volume */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem" }}>
              <span style={{ color: THEME.folder.light, letterSpacing: "0.15em" }}>EFFECTS (SFX)</span>
              <span style={{ color: THEME.evidence.primary }}>{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={sfxVol}
              onChange={(e) => handleSfxVolChange(parseFloat(e.target.value))}
              style={{ accentColor: THEME.evidence.primary, cursor: "pointer", width: "100%" }}
            />
          </div>
        </div>

        {/* Playlist Quick Select Drawer (When in Love Songs mode) */}
        {playMode === "LOVE_SONGS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: THEME.evidence.amber,
              }}
            >
              CASSETTE SELECTION // SELECT TRACK:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {LOVE_SONGS_PLAYLIST.map((track, idx) => {
                const isSelected = idx === currentIdx;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      soundEngine.playTapeClick();
                      if (!audioEnabled || soundEngine.getIsMuted()) {
                        setAudioEnabled(true);
                        soundEngine.setMuted(false);
                      }
                      soundEngine.setTrackIndex(idx);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.45rem 0.75rem",
                      background: isSelected
                        ? "rgba(234, 179, 8, 0.15)"
                        : "rgba(16, 13, 11, 0.6)",
                      border: `1px solid ${
                        isSelected ? THEME.evidence.primary : THEME.folder.dark + "55"
                      }`,
                      borderRadius: 2,
                      color: isSelected ? THEME.evidence.bright : THEME.folder.light,
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>
                      {isSelected ? "▶ " : "  "}
                      <strong>{track.title}</strong> — {track.artist}
                    </span>
                    <span style={{ fontSize: "0.5rem", color: "#8a755d" }}>
                      {track.id === "perfect" || track.id === "rut" ? "★ LOVE SONG" : "INSTRUMENTAL"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Note regarding Custom MP3s and Apple Music */}
        <div
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: "#8a755d",
            borderTop: `1px solid ${THEME.folder.dark}44`,
            paddingTop: "0.6rem",
            lineHeight: 1.4,
          }}
        >
          TIP: High-fidelity procedural acoustic arrangements are generated in real-time. To play your official studio master recordings, place <code>perfect.mp3</code> or <code>rut.mp3</code> into <code>/public/media/audio/songs/</code>.
        </div>
      </div>
    </div>
  );
}

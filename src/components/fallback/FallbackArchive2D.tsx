"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";
import { getPhotoUrl, getVideoUrl, getAudioUrl } from "@/lib/assetManager";
import { useAppStore, isWebGLAvailable } from "@/store/useAppStore";
import { soundEngine } from "@/engine/audio/AudioManager";
import { useAudioSync } from "@/engine/audio/useAudioSync";
import { AudioCassetteModal } from "@/components/hud/AudioCassetteModal";
import { EasterEggModals } from "@/components/easter-eggs/EasterEggModals";

type FallbackTab =
  | "OVERVIEW"
  | "GALLERY"
  | "VERSIONS"
  | "EVIDENCE"
  | "DISTANCE"
  | "LITTLE_THINGS"
  | "MAIN_CHARACTER"
  | "FUTURE"
  | "FINAL"
  | "SECRETS";

export function FallbackArchive2D() {
  useAudioSync();

  const [activeTab, setActiveTab] = useState<FallbackTab>("OVERVIEW");
  const [isTapeDeckOpen, setIsTapeDeckOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; desc?: string } | null>(null);

  // Final room voice note state
  const [isPlayingFinalVoice, setIsPlayingFinalVoice] = useState(false);
  const [finalAudioProgress, setFinalAudioProgress] = useState(0);
  const finalAudioRef = useRef<HTMLAudioElement | null>(null);

  const audioEnabled = useAppStore((s) => s.settings.audioEnabled);
  const setAudioEnabled = useAppStore((s) => s.setAudioEnabled);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const discoveredEvidence = useAppStore((s) => s.discoveredEvidence);
  const discoveredEasterEggs = useAppStore((s) => s.discoveredEasterEggs);

  const webGLSupported = isWebGLAvailable();

  // Photo splits
  const galleryPhotos = useMemo(
    () => anshikaData.photos.filter((p) => p.room === "HER_GALLERY" || p.room === "gallery"),
    []
  );

  const versionPhotos = useMemo(
    () => anshikaData.photos.filter((p) => p.room === "VERSIONS"),
    []
  );

  const handleTabChange = (tab: FallbackTab) => {
    soundEngine.playPaperRustle();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFinalVoice = () => {
    soundEngine.playTapeClick();
    if (!finalAudioRef.current) return;
    if (isPlayingFinalVoice) {
      finalAudioRef.current.pause();
      setIsPlayingFinalVoice(false);
    } else {
      finalAudioRef.current.play().catch(() => {});
      setIsPlayingFinalVoice(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080605",
        color: "#f5ece1",
        fontFamily: "var(--font-geist-mono), monospace",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "env(safe-area-inset-bottom, 2rem)",
      }}
    >
      {/* ─── 1. TOP CLASSIFIED HEADER (Mobile & Desktop Responsive) ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(16, 13, 11, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `2px solid ${THEME.folder.dark}`,
          padding: "0.75rem 1rem",
          paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {/* Title & Case Stamp */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  background: "rgba(185, 28, 28, 0.2)",
                  border: `1px solid ${THEME.classified.stamp}`,
                  color: THEME.classified.bright,
                  padding: "0.15rem 0.45rem",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                }}
              >
                RESTRICTED // CASE NO. 1025
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  color: THEME.evidence.primary,
                }}
              >
                23RD BIRTHDAY ARCHIVE
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.1rem",
                letterSpacing: "0.15em",
                margin: 0,
                color: THEME.folder.light,
                fontWeight: 700,
              }}
            >
              ANSHIKA — THE ARCHIVE (2D DOSSIER)
            </h1>
          </div>

          {/* Controls Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Audio Toggle */}
            <button
              onClick={() => {
                soundEngine.playTapeClick();
                setAudioEnabled(!audioEnabled);
              }}
              style={{
                background: "rgba(24, 20, 17, 0.9)",
                border: `1px solid ${audioEnabled ? THEME.evidence.primary : THEME.folder.dark}`,
                color: audioEnabled ? THEME.evidence.primary : "#8a755d",
                padding: "0.4rem 0.65rem",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                borderRadius: 2,
              }}
              title={audioEnabled ? "Mute Audio" : "Enable Audio"}
            >
              {audioEnabled ? "♪ AUDIO: ON" : "♪ AUDIO: OFF"}
            </button>

            {/* Tape Deck / Love Songs Modal */}
            <button
              onClick={() => {
                soundEngine.playTapeClick();
                setIsTapeDeckOpen(true);
              }}
              style={{
                background: "rgba(24, 20, 17, 0.9)",
                border: `1px solid ${THEME.evidence.primary}88`,
                color: THEME.evidence.bright,
                padding: "0.4rem 0.65rem",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
              title="Open Archival Tape Deck (Love Songs: Perfect, Rut)"
            >
              <span>♫</span>
              <span>TAPE DECK</span>
            </button>

            {/* Switch to 3D Vault (if WebGL available) */}
            {webGLSupported && (
              <button
                onClick={() => {
                  soundEngine.playDoorLatch();
                  setViewMode("3d");
                }}
                style={{
                  background: `linear-gradient(135deg, ${THEME.folder.base}, ${THEME.folder.dark})`,
                  border: `1px solid ${THEME.evidence.primary}`,
                  color: "#fff8e7",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
                title="Enter 3D Interactive Archive Vault"
              >
                ↻ ENTER 3D VAULT
              </button>
            )}

            {/* Evidence Counter */}
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: THEME.evidence.amber,
                padding: "0.4rem 0.6rem",
                background: "rgba(234, 179, 8, 0.1)",
                border: `1px solid ${THEME.evidence.primary}44`,
                borderRadius: 2,
              }}
            >
              EVIDENCE: {discoveredEvidence.length} / 12
            </div>
          </div>
        </div>

        {/* ─── HORIZONTAL SCROLLABLE TAB BAR ─── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0.6rem auto 0",
            display: "flex",
            gap: "0.4rem",
            overflowX: "auto",
            paddingBottom: "0.3rem",
            scrollbarWidth: "none",
          }}
        >
          {[
            { id: "OVERVIEW", label: "🏛️ OVERVIEW" },
            { id: "GALLERY", label: "🖼️ 1. HER GALLERY" },
            { id: "VERSIONS", label: "👑 2. VERSIONS" },
            { id: "EVIDENCE", label: "🕵️ 3. EVIDENCE" },
            { id: "DISTANCE", label: "🌍 4. DISTANCE" },
            { id: "LITTLE_THINGS", label: "📖 5. LITTLE THINGS" },
            { id: "MAIN_CHARACTER", label: "🌟 6. MAIN CHARACTER" },
            { id: "FUTURE", label: "🔮 7. UNWRITTEN" },
            { id: "FINAL", label: "💌 8. THE FINAL FILE" },
            { id: "SECRETS", label: `🧸 SECRETS (${discoveredEasterEggs.length}/3)` },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as FallbackTab)}
                style={{
                  padding: "0.45rem 0.85rem",
                  background: isCurrent
                    ? `linear-gradient(135deg, ${THEME.folder.base}, ${THEME.folder.dark})`
                    : "rgba(24, 20, 17, 0.7)",
                  border: `1px solid ${isCurrent ? THEME.evidence.primary : THEME.folder.dark}`,
                  color: isCurrent ? THEME.evidence.bright : THEME.folder.light,
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  fontWeight: isCurrent ? 700 : 400,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  borderRadius: 2,
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── 2. TAB CONTENT PANELS ─── */}
      <main
        style={{
          flex: 1,
          maxWidth: 1100,
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem 1rem 3rem",
        }}
      >
        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === "OVERVIEW" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Birthday Dossier Header Card */}
            <div
              style={{
                background: "linear-gradient(145deg, #181411 0%, #0e0c0a 100%)",
                border: `2px solid ${THEME.folder.base}`,
                borderRadius: 6,
                padding: "1.75rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  border: `2px solid ${THEME.classified.stamp}`,
                  color: THEME.classified.bright,
                  padding: "0.3rem 0.8rem",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  letterSpacing: "0.25em",
                  transform: "rotate(-4deg)",
                  background: "rgba(185, 28, 28, 0.1)",
                }}
              >
                TOP CLASSIFIED // 23 YEARS
              </div>

              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                SUBJECT DOSSIER // DEPT OF MEMORIES
              </div>
              <h2
                style={{
                  fontSize: "2rem",
                  letterSpacing: "0.15em",
                  color: THEME.folder.light,
                  margin: "0.4rem 0 1rem",
                }}
              >
                ANSHIKA BAJPAI
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1rem",
                  borderTop: `1px solid ${THEME.folder.dark}66`,
                  paddingTop: "1rem",
                  fontSize: "0.7rem",
                  lineHeight: 1.6,
                }}
              >
                <div>
                  <span style={{ color: "#8a755d" }}>DATE OF BIRTH: </span>
                  <strong style={{ color: THEME.evidence.primary }}>
                    25 OCTOBER 2003 (23 YEARS TODAY)
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#8a755d" }}>ARCHETYPES: </span>
                  <strong style={{ color: THEME.folder.light }}>
                    {anshikaData.personal.traits.join(" • ")}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#8a755d" }}>CHIEF ARCHIVIST: </span>
                  <strong style={{ color: THEME.evidence.bright }}>Arnav</strong>
                </div>
                <div>
                  <span style={{ color: "#8a755d" }}>ARCHIVE STATUS: </span>
                  <strong style={{ color: "#4ade80" }}>100% UNLOCKED & CELEBRATED</strong>
                </div>
              </div>
            </div>

            {/* Personal Profile Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {/* Things She Says */}
              <div
                style={{
                  background: "rgba(20, 16, 13, 0.8)",
                  border: `1px solid ${THEME.folder.dark}`,
                  borderRadius: 4,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: THEME.evidence.primary,
                    marginBottom: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  INTERCEPTED PHRASES // &quot;THINGS SHE SAYS&quot;
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {anshikaData.personal.thingsShesSays.map((quote, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "rgba(10, 8, 7, 0.6)",
                        borderLeft: `3px solid ${THEME.classified.stamp}`,
                        fontSize: "0.72rem",
                        fontStyle: "italic",
                        color: "#fef3c7",
                      }}
                    >
                      &quot;{quote}&quot;
                    </div>
                  ))}
                </div>
              </div>

              {/* Things She Loves */}
              <div
                style={{
                  background: "rgba(20, 16, 13, 0.8)",
                  border: `1px solid ${THEME.folder.dark}`,
                  borderRadius: 4,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: THEME.evidence.primary,
                    marginBottom: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  CONFIDENTIAL DOSSIER // &quot;THINGS SHE LOVES&quot;
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {anshikaData.personal.thingsSheLoves.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "0.35rem 0.7rem",
                        background: "rgba(234, 179, 8, 0.12)",
                        border: `1px solid ${THEME.evidence.primary}66`,
                        color: THEME.evidence.bright,
                        fontSize: "0.68rem",
                        borderRadius: 2,
                      }}
                    >
                      ★ {item}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: THEME.classified.bright,
                    marginTop: "1.25rem",
                    marginBottom: "0.5rem",
                    fontWeight: 700,
                  }}
                >
                  KNOWN DISLIKES // CAUTION
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {anshikaData.personal.thingsSheDislikes.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "0.25rem 0.55rem",
                        background: "rgba(185, 28, 28, 0.15)",
                        border: `1px solid ${THEME.classified.stamp}`,
                        color: "#fca5a5",
                        fontSize: "0.62rem",
                        borderRadius: 2,
                      }}
                    >
                      ✕ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links to Wings */}
            <div
              style={{
                background: "rgba(16, 13, 11, 0.9)",
                border: `1px solid ${THEME.folder.base}66`,
                borderRadius: 4,
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: THEME.evidence.amber,
                  marginBottom: "1rem",
                }}
              >
                DIRECTORY OF THE 8 ARCHIVAL WINGS // TAP TO EXPLORE:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {[
                  { tab: "GALLERY", title: "1. Her Gallery", desc: "Photographic Evidence" },
                  { tab: "VERSIONS", title: "2. Versions of Her", desc: "23rd Birthday Dais" },
                  { tab: "EVIDENCE", title: "3. Evidence Room", desc: "12 Forensic Exhibits" },
                  { tab: "DISTANCE", title: "4. The Distance", desc: "Delhi ↔ Pilani Map" },
                  { tab: "LITTLE_THINGS", title: "5. Little Things", desc: "10 Symbolic Artifacts" },
                  { tab: "MAIN_CHARACTER", title: "6. Main Character", desc: "Screening Lounge" },
                  { tab: "FUTURE", title: "7. Unwritten Chapters", desc: "9 Future Horizons" },
                  { tab: "FINAL", title: "8. The Final File", desc: "Letter & Voice Note" },
                ].map((wing) => (
                  <button
                    key={wing.tab}
                    onClick={() => handleTabChange(wing.tab as FallbackTab)}
                    style={{
                      background: "rgba(24, 20, 17, 0.8)",
                      border: `1px solid ${THEME.folder.dark}`,
                      borderRadius: 2,
                      padding: "0.75rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: THEME.evidence.primary,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {wing.title}
                    </div>
                    <div style={{ fontSize: "0.58rem", color: "#8a755d" }}>{wing.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: HER GALLERY ─── */}
        {activeTab === "GALLERY" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                ROOM 1 // PHOTOGRAPHIC EVIDENCE
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                HER GALLERY
              </h2>
              <p style={{ fontSize: "0.68rem", color: "#8a755d", maxWidth: 600 }}>
                Every photo cataloged and preserved in vintage Polaroid archival mounts. Tap any image to inspect.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {(galleryPhotos.length > 0 ? galleryPhotos : anshikaData.photos.slice(0, 10)).map((item, idx) => {
                const photoUrl = getPhotoUrl(item.filename);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playInspect();
                      setSelectedPhoto({ url: photoUrl, title: item.title, desc: item.description });
                    }}
                    style={{
                      background: "#181411",
                      border: `1px solid ${THEME.folder.base}88`,
                      borderRadius: 4,
                      padding: "0.85rem",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                      cursor: "pointer",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 280,
                        background: "#080605",
                        borderRadius: 2,
                        overflow: "hidden",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Image
                        src={photoUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "0.55rem",
                          letterSpacing: "0.2em",
                          color: THEME.evidence.primary,
                          fontWeight: 700,
                        }}
                      >
                        EXHIBIT #{String(idx + 1).padStart(2, "0")}
                      </span>
                      {item.approximateDate && (
                        <span style={{ fontSize: "0.5rem", color: "#8a755d" }}>{item.approximateDate}</span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: THEME.folder.light,
                        marginTop: "0.4rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.title}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#c2b6a7",
                          marginTop: "0.2rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 3: VERSIONS OF HER ─── */}
        {activeTab === "VERSIONS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Dais Hero Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(185,28,28,0.15))",
                border: `2px solid ${THEME.evidence.primary}`,
                borderRadius: 6,
                padding: "1.75rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: THEME.evidence.primary,
                  fontWeight: 900,
                }}
              >
                CENTRAL CORONATION DAIS // 23 YEARS
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  letterSpacing: "0.2em",
                  color: THEME.folder.light,
                  margin: "0.5rem 0",
                }}
              >
                THE MANY SIDES OF ANSHIKA
              </h2>
              <div style={{ fontSize: "0.75rem", color: "#fef3c7", maxWidth: 650, margin: "0 auto" }}>
                &quot;Childhood diva, school topper, 2020 glow-up, sleepy baby, master chef, and absolute rockstar.
                Every single version of you is celebrated today.&quot;
              </div>
            </div>

            {/* Versions Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {(versionPhotos.length > 0 ? versionPhotos : anshikaData.photos.slice(0, 8)).map((photo, idx) => {
                const photoUrl = getPhotoUrl(photo.filename);
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      soundEngine.playInspect();
                      setSelectedPhoto({ url: photoUrl, title: photo.title, desc: photo.description });
                    }}
                    style={{
                      background: "rgba(20, 16, 13, 0.85)",
                      border: `1px solid ${THEME.folder.dark}`,
                      borderRadius: 4,
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "0.55rem",
                          letterSpacing: "0.2em",
                          color: THEME.evidence.primary,
                          fontWeight: 700,
                        }}
                      >
                        TIMELINE NODE 0{idx + 1}
                      </span>
                      {photo.approximateDate && (
                        <span style={{ fontSize: "0.52rem", color: "#8a755d" }}>{photo.approximateDate}</span>
                      )}
                    </div>

                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 220,
                        background: "#080605",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={photoUrl}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <h3
                      style={{
                        fontSize: "1rem",
                        letterSpacing: "0.12em",
                        color: THEME.folder.light,
                        margin: 0,
                      }}
                    >
                      {photo.title}
                    </h3>

                    <p style={{ fontSize: "0.7rem", color: "#d1c7bc", lineHeight: 1.5, margin: 0 }}>
                      {photo.description}
                    </p>

                    {photo.memory && (
                      <div
                        style={{
                          padding: "0.5rem 0.75rem",
                          background: "rgba(10, 8, 7, 0.6)",
                          borderLeft: `2px solid ${THEME.classified.stamp}`,
                          fontSize: "0.65rem",
                          fontStyle: "italic",
                          color: "#fef3c7",
                        }}
                      >
                        &quot;{photo.memory}&quot;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 4: EVIDENCE ROOM ─── */}
        {activeTab === "EVIDENCE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                ROOM 3 // FORENSIC DOSSIERS
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                THE EVIDENCE CLUE BOARD
              </h2>
              <p style={{ fontSize: "0.68rem", color: "#8a755d", maxWidth: 600 }}>
                12 cataloged pieces of undeniable proof that she is the only one.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {anshikaData.evidence.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(20, 16, 13, 0.9)",
                    border: `1px solid ${THEME.folder.base}`,
                    borderRadius: 4,
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.25em",
                        color: THEME.evidence.primary,
                        fontWeight: 700,
                        background: "rgba(234, 179, 8, 0.15)",
                        padding: "0.15rem 0.45rem",
                        borderRadius: 2,
                      }}
                    >
                      EVIDENCE #{String(idx + 1).padStart(3, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.5rem",
                        letterSpacing: "0.15em",
                        color: THEME.classified.bright,
                        fontWeight: 700,
                      }}
                    >
                      {item.presentation.toUpperCase()}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.1rem",
                      letterSpacing: "0.12em",
                      color: THEME.folder.light,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ fontSize: "0.72rem", color: "#d1c7bc", lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>

                  <div
                    style={{
                      padding: "0.5rem",
                      background: "rgba(10, 8, 7, 0.6)",
                      borderLeft: `2px solid ${THEME.evidence.primary}`,
                      fontSize: "0.65rem",
                      color: THEME.evidence.bright,
                    }}
                  >
                    <strong>UNLOCKED:</strong> {item.unlockedMessage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 5: THE DISTANCE TRAJECTORY ─── */}
        {activeTab === "DISTANCE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                ROOM 4 // SPATIAL TRAJECTORY
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                THE DISTANCE TRAJECTORY
              </h2>
            </div>

            {/* 2D Interactive SVG Map */}
            <div
              style={{
                background: "#080605",
                border: `2px solid ${THEME.evidence.primary}66`,
                borderRadius: 6,
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            >
              <svg viewBox="0 0 800 400" style={{ width: "100%", maxHeight: 350, display: "block" }}>
                <defs>
                  <linearGradient id="distGrad2D" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={THEME.classified.bright} />
                    <stop offset="100%" stopColor={THEME.evidence.primary} />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={i}
                    x1={i * 100}
                    y1={0}
                    x2={i * 100}
                    y2={400}
                    stroke="#1c1917"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={i * 100}
                    x2={800}
                    y2={i * 100}
                    stroke="#1c1917"
                    strokeWidth="1"
                  />
                ))}

                {/* Animated Trajectory Arc */}
                <path
                  d="M 180 280 Q 400 80 620 280"
                  fill="none"
                  stroke="url(#distGrad2D)"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                />

                {/* Delhi Node */}
                <circle cx="180" cy="280" r="8" fill={THEME.classified.bright} />
                <circle cx="180" cy="280" r="16" fill="none" stroke={THEME.classified.bright} strokeWidth="1" opacity="0.6" />
                <text x="180" y="320" fill={THEME.folder.light} fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  DELHI // HER CITY
                </text>
                <text x="180" y="340" fill="#8a755d" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  28.6139° N, 77.2090° E
                </text>

                {/* Pilani Node */}
                <circle cx="620" cy="280" r="8" fill={THEME.evidence.primary} />
                <circle cx="620" cy="280" r="16" fill="none" stroke={THEME.evidence.primary} strokeWidth="1" opacity="0.6" />
                <text x="620" y="320" fill={THEME.folder.light} fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  PILANI // HIS COLLEGE
                </text>
                <text x="620" y="340" fill="#8a755d" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  28.3639° N, 75.6000° E
                </text>

                {/* Midpoint Distance Badge */}
                <rect x="330" y="140" width="140" height="34" rx="4" fill="#181411" stroke={THEME.evidence.primary} strokeWidth="1" />
                <text x="400" y="162" fill={THEME.evidence.primary} fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  ~180 KM
                </text>
              </svg>

              {/* Inscriptions */}
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    color: THEME.evidence.primary,
                  }}
                >
                  THAT&apos;S THE DISTANCE.
                </div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    color: THEME.folder.light,
                  }}
                >
                  NOT THE FEELING.
                </div>
                <div style={{ fontSize: "0.72rem", color: "#8a755d", maxWidth: 500, margin: "0.5rem auto 0" }}>
                  180 kilometers of highway, night train routes, and late-night calls. Zero distance in the heart.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 6: LITTLE THINGS ─── */}
        {activeTab === "LITTLE_THINGS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                ROOM 5 // CASE LEDGER & ARCHIVAL STUDY
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                THE LITTLE THINGS I NOTICE
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {anshikaData.littleThings.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(20, 16, 13, 0.85)",
                    border: `1px solid ${THEME.folder.dark}`,
                    borderRadius: 4,
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        color: THEME.evidence.primary,
                        fontWeight: 700,
                      }}
                    >
                      ARTIFACT #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "1.1rem" }}>
                      {item.icon || "✨"}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "0.75rem",
                      background: "rgba(10, 8, 7, 0.7)",
                      borderLeft: `2px solid ${THEME.folder.base}`,
                      fontSize: "0.75rem",
                      color: "#fef3c7",
                      lineHeight: 1.6,
                      marginTop: "0.3rem",
                    }}
                  >
                    &quot;{item.content}&quot;
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 7: MAIN CHARACTER ─── */}
        {activeTab === "MAIN_CHARACTER" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Marquee Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(185,28,28,0.25), rgba(234,179,8,0.2))",
                border: `2px solid ${THEME.classified.stamp}`,
                borderRadius: 6,
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  color: THEME.classified.bright,
                  fontWeight: 900,
                }}
              >
                PROSCENIUM STAGE // 35MM CINEMA ARCHIVE
              </div>
              <h2
                style={{
                  fontSize: "1.6rem",
                  letterSpacing: "0.15em",
                  color: THEME.folder.light,
                  margin: "0.4rem 0",
                }}
              >
                SHE WAS NEVER THE SIDE CHARACTER
              </h2>
              <div style={{ fontSize: "0.75rem", color: THEME.evidence.primary, fontWeight: 700 }}>
                23 YEARS OF STEALING EVERY SCENE
              </div>
            </div>

            {/* Video Screening Lounge */}
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: THEME.evidence.amber,
                  marginBottom: "0.75rem",
                }}
              >
                35MM MOTION PICTURE SCREENING LOUNGE // FEATURE FILMS
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Video 1: News Anchor */}
                <div
                  style={{
                    background: "#181411",
                    border: `1px solid ${THEME.folder.base}`,
                    borderRadius: 4,
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: THEME.evidence.primary,
                      marginBottom: "0.5rem",
                      fontWeight: 700,
                    }}
                  >
                    FEATURE 01: HER AS A NEWS ANCHOR
                  </div>
                  <video
                    src={getVideoUrl("her_as_a_news_anchor(audio necessary).mp4")}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      borderRadius: 3,
                      maxHeight: 260,
                      background: "#000",
                    }}
                  />
                  <div style={{ fontSize: "0.62rem", color: "#8a755d", marginTop: "0.5rem" }}>
                    &quot;Audio is necessary for this one. Unfiltered star power and prime-time charisma.&quot;
                  </div>
                </div>

                {/* Video 2: Diva in the Wind */}
                <div
                  style={{
                    background: "#181411",
                    border: `1px solid ${THEME.folder.base}`,
                    borderRadius: 4,
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: THEME.evidence.primary,
                      marginBottom: "0.5rem",
                      fontWeight: 700,
                    }}
                  >
                    FEATURE 02: DIVA IN THE WIND
                  </div>
                  <video
                    src={getVideoUrl("diva_in_the_wind.mp4")}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      borderRadius: 3,
                      maxHeight: 260,
                      background: "#000",
                    }}
                  />
                  <div style={{ fontSize: "0.62rem", color: "#8a755d", marginTop: "0.5rem" }}>
                    &quot;Cinematic slow-motion main character energy.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 8: UNWRITTEN CHAPTERS ─── */}
        {activeTab === "FUTURE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                ROOM 7 // CELESTIAL OBSERVATORY
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                UNWRITTEN CHAPTERS
              </h2>
              <p style={{ fontSize: "0.68rem", color: "#8a755d", maxWidth: 600 }}>
                9 architectural portals looking forward into Anshika&apos;s wildest dreams, ambitions, and adventures.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {anshikaData.unwrittenChapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  style={{
                    background: "rgba(20, 16, 13, 0.85)",
                    border: `1px solid ${THEME.folder.dark}`,
                    borderRadius: 4,
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        color: THEME.evidence.primary,
                        fontWeight: 700,
                      }}
                    >
                      PORTAL 0{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        color: "#8a755d",
                        background: "rgba(255,255,255,0.05)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: 2,
                      }}
                    >
                      {(ch.symbol || "HORIZON").toUpperCase()}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.1rem",
                      letterSpacing: "0.12em",
                      color: THEME.folder.light,
                      margin: 0,
                    }}
                  >
                    {ch.title}
                  </h3>

                  <p style={{ fontSize: "0.72rem", color: "#d1c7bc", lineHeight: 1.5, margin: 0 }}>
                    {ch.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 9: THE FINAL FILE (Room 8 Climax) ─── */}
        {activeTab === "FINAL" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Confidential Envelope Presentation */}
            <div
              style={{
                background: "linear-gradient(145deg, #181411 0%, #0d0a08 100%)",
                border: `2px solid ${THEME.folder.base}`,
                borderRadius: 6,
                padding: "2rem",
                boxShadow: "0 15px 50px rgba(0,0,0,0.9)",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Header Inscriptions */}
              <div style={{ textAlign: "center", borderBottom: `1px solid ${THEME.folder.dark}66`, paddingBottom: "1.25rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    color: THEME.classified.bright,
                    fontWeight: 900,
                  }}
                >
                  CONFIDENTIAL CASE CLOSURE // FINAL OBJECT
                </div>
                <h2
                  style={{
                    fontSize: "2rem",
                    letterSpacing: "0.2em",
                    color: THEME.folder.light,
                    margin: "0.4rem 0",
                  }}
                >
                  THE FINAL FILE
                </h2>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: THEME.evidence.primary }}>
                  INSCRIPTION: 25 OCTOBER 2003 • ANSHIKA BAJPAI
                </div>
              </div>

              {/* Unedited Voice Note Player */}
              <div
                style={{
                  background: "#080605",
                  border: `1px solid ${THEME.evidence.primary}88`,
                  borderRadius: 4,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: THEME.evidence.primary, fontWeight: 700 }}>
                    🎙️ UNEDITED AUDIO RECORDING
                  </span>
                  <span style={{ fontSize: "0.55rem", color: "#8a755d" }}>
                    &quot;her_telling_me_how_much_and_deeply_she_loves_me.ogg&quot;
                  </span>
                </div>

                <audio
                  ref={finalAudioRef}
                  src={getAudioUrl("her_telling_me_how_much_and_deeply_she_loves_me.ogg")}
                  onTimeUpdate={() => {
                    if (finalAudioRef.current) {
                      const cur = finalAudioRef.current.currentTime;
                      const dur = finalAudioRef.current.duration || 1;
                      setFinalAudioProgress(cur / dur);
                    }
                  }}
                  onEnded={() => setIsPlayingFinalVoice(false)}
                />

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    background: "#2a2018",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    if (finalAudioRef.current && finalAudioRef.current.duration) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      finalAudioRef.current.currentTime = ratio * finalAudioRef.current.duration;
                    }
                  }}
                >
                  <div
                    style={{
                      width: `${finalAudioProgress * 100}%`,
                      height: "100%",
                      background: THEME.evidence.primary,
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>

                {/* Controls */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.25rem" }}>
                  <button
                    onClick={handleToggleFinalVoice}
                    style={{
                      background: isPlayingFinalVoice
                        ? `linear-gradient(135deg, ${THEME.classified.stamp}, #7f1d1d)`
                        : `linear-gradient(135deg, ${THEME.evidence.amber}, ${THEME.evidence.primary})`,
                      color: isPlayingFinalVoice ? "#fff8e7" : "#080605",
                      border: "none",
                      padding: "0.55rem 2rem",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      borderRadius: 2,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                    }}
                  >
                    {isPlayingFinalVoice ? "❚❚ PAUSE VOICE NOTE" : "► PLAY HER VOICE NOTE"}
                  </button>
                </div>
              </div>

              {/* Arnav's Complete Handwritten Letter */}
              <div
                style={{
                  background: "rgba(10, 8, 7, 0.7)",
                  borderLeft: `4px solid ${THEME.evidence.primary}`,
                  borderRadius: 4,
                  padding: "1.5rem",
                  fontSize: "0.85rem",
                  lineHeight: 1.8,
                  color: "#fef3c7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {anshikaData.finalMessage}
              </div>

              {/* Grand Completion Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(234,179,8,0.2), rgba(185,28,28,0.25))",
                  border: `2px solid ${THEME.evidence.primary}`,
                  borderRadius: 4,
                  padding: "1.5rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    color: THEME.evidence.primary,
                    fontWeight: 900,
                  }}
                >
                  ARCHIVE STATUS: COMPLETE
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    color: "#fff8e7",
                  }}
                >
                  HAPPY 23RD BIRTHDAY, ANSHIKA!
                </div>
                <div style={{ fontSize: "0.75rem", color: "#fef3c7" }}>
                  Every memory cataloged. Every moment cherished. Forever yours, Arnav.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 10: SECRETS & EASTER EGGS ─── */}
        {activeTab === "SECRETS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: THEME.evidence.amber }}>
                CLASSIFIED VAULT // OPTIONAL SECRETS
              </div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "0.15em", color: THEME.folder.light, margin: "0.2rem 0" }}>
                EASTER EGGS & HIDDEN FILES
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Secret 1: The Birthday Cake */}
              <div
                style={{
                  background: "#181411",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 4,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6rem", color: THEME.evidence.primary, fontWeight: 700 }}>
                    SECRET 01: THE 23RD BIRTHDAY CAKE
                  </span>
                  <span style={{ fontSize: "0.55rem", color: "#4ade80" }}>★ UNLOCKED</span>
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 220,
                    background: "#080605",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={getPhotoUrl("cake-tease.jpg")}
                    alt="23rd Birthday Cake Concept Art"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ fontSize: "0.68rem", color: "#d1c7bc" }}>
                  Classified custom cake design prepared exclusively for her 23rd birthday.
                </div>
              </div>

              {/* Secret 2: 11:11 Ritual */}
              <div
                style={{
                  background: "#181411",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 4,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6rem", color: THEME.evidence.primary, fontWeight: 700 }}>
                    SECRET 02: THE SACRED 11:11 WISH
                  </span>
                  <span style={{ fontSize: "0.55rem", color: THEME.evidence.amber }}>✨ 11:11 ✨</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#fef3c7", fontStyle: "italic", lineHeight: 1.6 }}>
                  &quot;She never misses 11:11. Always praying, always hoping with pure, genuine belief.
                  May every single wish you ever made come true this 23rd year.&quot;
                </div>
                <button
                  onClick={() => {
                    soundEngine.playWishStar();
                  }}
                  style={{
                    alignSelf: "flex-start",
                    background: THEME.evidence.primary,
                    color: "#080605",
                    border: "none",
                    padding: "0.45rem 1rem",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  ★ MAKE A 11:11 WISH
                </button>
              </div>

              {/* Secret 3: "Annav" Signature Quirk */}
              <div
                style={{
                  background: "#181411",
                  border: `1px solid ${THEME.folder.base}`,
                  borderRadius: 4,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6rem", color: THEME.classified.bright, fontWeight: 700 }}>
                    SECRET 03: &quot;ANNAV&quot; QUIRK
                  </span>
                  <span style={{ fontSize: "0.55rem", color: "#fca5a5" }}>🧸 SIGNATURE</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#fef3c7", fontStyle: "italic", lineHeight: 1.6 }}>
                  &quot;The way you say &apos;Annav&apos; — cutely mispronounced, completely adorable,
                  and etched into sacred memory forever.&quot;
                </div>
                <button
                  onClick={() => {
                    const audio = new Audio(getAudioUrl("cutely_calling_me_dumbo.ogg"));
                    audio.play().catch(() => {});
                  }}
                  style={{
                    alignSelf: "flex-start",
                    background: THEME.classified.stamp,
                    color: "#ffffff",
                    border: "none",
                    padding: "0.45rem 1rem",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  ▶ LISTEN TO &quot;ANNAV&quot; REACTION
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── 3. PHOTO INSPECT MODAL ─── */}
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(5, 4, 3, 0.92)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              background: "#181411",
              border: `2px solid ${THEME.folder.base}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "65vh",
                background: "#000",
              }}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#100d0b",
                borderTop: `1px solid ${THEME.folder.dark}`,
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: THEME.folder.light, fontWeight: 700 }}>
                  {selectedPhoto.title}
                </div>
                {selectedPhoto.desc && (
                  <div style={{ fontSize: "0.68rem", color: "#c2b6a7", marginTop: "0.2rem" }}>
                    {selectedPhoto.desc}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: THEME.folder.dark,
                  border: `1px solid ${THEME.folder.base}`,
                  color: "#fff8e7",
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.62rem",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                [ESC] CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. TAPE DECK / LOVE SONGS PLAYLIST MODAL ─── */}
      <AudioCassetteModal
        isOpen={isTapeDeckOpen}
        onClose={() => setIsTapeDeckOpen(false)}
      />

      {/* ─── 5. EASTER EGGS MODALS ─── */}
      <EasterEggModals />
    </div>
  );
}

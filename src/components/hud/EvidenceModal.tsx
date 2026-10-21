"use client";

import { useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { useAppStore } from "@/store/useAppStore";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";
import { getPhotoUrl, getVideoUrl, getAudioUrl } from "@/lib/assetManager";

/**
 * EvidenceModal — Forensic Case Dossier view for inspecting photos, evidence items, and mystery clues.
 * Matches the murder/mystery archive aesthetic: Manila folder Kraft brown, yellow evidence tape,
 * classified red stamps, and noir shadows.
 */
export function EvidenceModal() {
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);
  const closeMemory = useTransitionStore((s) => s.closeMemory);
  const openMemory = useTransitionStore((s) => s.openMemory);
  const currentRoom = useAppStore((s) => s.currentRoom);
  const unlockEvidence = useAppStore((s) => s.unlockEvidence);

  // Distance Room Dossiers
  const DISTANCE_DOSSIERS = useMemo(
    () => [
      {
        id: "dist-telemetry",
        title: "CASE FILE #004: SPATIAL SEPARATION MATRIX",
        description:
          "Geodesic flight vector mapping between Kanpur (26.4499° N, 80.3319° E) and Bangalore (12.9716° N, 77.5946° E).",
        memory:
          "1,540 KM ACROSS THE CONTINENT.\n\nFlight: ~2h 30m • Train: ~32h • Latency between hearts: 0.00s.\n\nEvery single day at 11:11, regardless of city or coordinate, our thoughts converge in exact alignment. She often asks 'Why haven't you texted me for an hour?' or 'Bahot busy hoge na', but every mile between us is proof that love isn't measured in geography.",
        approximateDate: "SPATIAL TELEMETRY",
        filename: "",
        room: "DISTANCE",
        tag: "CASE FILE #004",
        isClue: false,
      },
      {
        id: "dist-kanpur",
        title: "ORIGIN RECORD: ANSHIKA'S HOME (KANPUR)",
        description:
          "Coordinates: 26.4499° N, 80.3319° E • Where Anshika's story began on 25 October 2003.",
        memory:
          "Kanpur is where she grew up, where our school days happened, where we shared our first photo at Kulhad78, where Scooty rides felt endless, and where Lord Krishna's JK Temple watched over our bond. The city that holds her roots and her 23rd birthday.",
        approximateDate: "25 OCTOBER 2003 • ORIGIN",
        filename: "our-first-photo.jpeg",
        room: "DISTANCE",
        tag: "HER HOME",
        isClue: false,
      },
      {
        id: "dist-arnav-home",
        title: "BASE RECORD: ARNAV'S HOME (KANPUR)",
        description:
          "Coordinates: 26.4473° N, 80.3503° E • Origin base for our date rides and memories.",
        memory:
          "Arnav's childhood home in Kanpur. The launchpad for every date, every afterparty, every late evening Scooty ride, and every memory that made us who we are today.",
        approximateDate: "ORIGIN BASE • KANPUR",
        filename: "our photo in our school afterparty.jpeg",
        room: "DISTANCE",
        tag: "ARNAV'S HOME",
        isClue: false,
      },
      {
        id: "dist-bangalore",
        title: "STATION RECORD: CDAC HOSTEL, BANGALORE (6-MONTH DIPLOMA)",
        description:
          "Coordinates: 12.8500° N, 77.6600° E • CDAC Knowledge Park / Electronics City, Bangalore.",
        memory:
          "Where Arnav is currently staying for his 6-month Advanced Computing diploma. 1,540 km away across India, studying hard, missing her intensely every second, and counting down every single day until he returns home to her. Temporary distance, eternal love.",
        approximateDate: "6-MONTH DIPLOMA POST",
        filename: "her_looking_beautiful_on_our_last_date_before_i_went_to_banglore.jpeg",
        room: "DISTANCE",
        tag: "CDAC HOSTEL",
        isClue: false,
      },
      {
        id: "dist-milestone-21",
        title: "THE 23RD BIRTHDAY VOW: 25 OCTOBER",
        description:
          "23rd Birthday Milestone — 1,540 km between us, infinite devotion for you.",
        memory:
          "THAT'S THE DISTANCE. NOT THE FEELING.\n\nNo number of kilometers, no train tracks, no flight paths can ever diminish the love, pride, and admiration held for you. Happy 23rd Birthday, Anshika!",
        approximateDate: "25 OCTOBER 2026",
        filename: "her on her birthday.jpeg",
        room: "DISTANCE",
        tag: "23RD BIRTHDAY",
        isClue: false,
      },
    ],
    []
  );

  // Pool of inspectable items in the current room for prev/next browsing
  const roomItems = useMemo(() => {
    if (currentRoom === "DISTANCE") {
      return DISTANCE_DOSSIERS;
    }
    if (currentRoom === "LITTLE_THINGS") {
      const items = anshikaData.littleThings.map((lt, idx) => ({
        id: lt.id,
        title: `THE LITTLE THING I NOTICE ABOUT YOU (#${(idx + 1).toString().padStart(2, "0")})`,
        description: lt.content,
        memory: `CASE FILE #005 • SUBTLE OBSERVATION DETAIL #${(idx + 1).toString().padStart(2, "0")}: Every quirk, expression, and habit of Anshika Bajpai observed, cherished, and filed under sacred memory.`,
        approximateDate: "DAILY OBSERVATION",
        filename: idx === 0 ? "her_on_arnav's_last_birthday.jpeg" : "",
        room: "LITTLE_THINGS",
        tag: "LITTLE THING",
      }));
      const bdayPhoto = anshikaData.photos.find((p) => p.id === "ph-arnav-bday");
      if (bdayPhoto) {
        items.push({
          id: bdayPhoto.id,
          title: bdayPhoto.title,
          description: bdayPhoto.description,
          memory: bdayPhoto.memory || "",
          approximateDate: bdayPhoto.approximateDate || "ARNAV'S BIRTHDAY",
          filename: bdayPhoto.filename,
          room: "LITTLE_THINGS",
          tag: "HERO RECORD",
        });
      }
      items.push({
        id: "lt-ledger",
        title: "CASE LEDGER: THE ANNOTATED HABITS OF ANSHIKA",
        description:
          "Comprehensive psychological & affection profile of Subject Anshika Bajpai.",
        memory: `Documented Traits: ${anshikaData.personal.traits.join(", ")}.\n\nDocumented Quirks: ${anshikaData.personal.quirks.join(", ")}.\n\nThings She Loves: ${anshikaData.personal.thingsSheLoves.join(", ")}.\n\nThings She Dislikes: ${anshikaData.personal.thingsSheDislikes.join(", ")}.\n\nConclusion: An irresistible combination of mischief, beauty, fierce loyalty, and boundless love. Celebrating 23 years of her.`,
        approximateDate: "25 OCTOBER 2026",
        filename: "",
        room: "LITTLE_THINGS",
        tag: "FORENSIC LEDGER",
      });
      return items;
    }
    if (currentRoom === "EVIDENCE") {
      return anshikaData.evidence.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        memory: e.unlockedMessage,
        approximateDate: "CASE EVIDENCE #1025",
        filename: e.associatedMedia || "",
        room: "EVIDENCE",
        tag: "FORENSIC PROOF",
      }));
    }
    if (currentRoom === "MAIN_CHARACTER") {
      const items: Array<{
        id: string;
        title: string;
        description: string;
        memory: string;
        approximateDate: string;
        filename: string;
        room: string;
        tag: string;
      }> = [];

      // 1. Hero and featured photos
      anshikaData.photos
        .filter((p) => p.room === "MAIN_CHARACTER")
        .forEach((p) => {
          items.push({
            id: p.id,
            title: p.title,
            description: p.description,
            memory: p.memory || "ARCHIVAL STILL: She was never the side character. She is the star of every scene.",
            approximateDate: p.approximateDate || "ARCHIVED STILL",
            filename: p.filename,
            room: p.room,
            tag: p.importance ? p.importance.toUpperCase() : "HERO SCENE",
          });
        });

      // 2. Cinematic video reels
      anshikaData.videos
        .filter((v) => v.room === "MAIN_CHARACTER")
        .forEach((v) => {
          items.push({
            id: v.id,
            title: v.title,
            description: v.description,
            memory: v.meaning || `ARCHIVAL VIDEO REEL: ${v.title}. Undeniable main character charisma.`,
            approximateDate: "RECORDED REEL",
            filename: v.filename,
            room: v.room,
            tag: "CINEMATIC REEL",
          });
        });

      // 3. Audio intercepts
      anshikaData.audio
        .filter((a) => a.room === "MAIN_CHARACTER")
        .forEach((a) => {
          items.push({
            id: a.id,
            title: "AUDIO INTERCEPT: UNSTOPPABLE ENERGY",
            description: a.purpose,
            memory: `FORENSIC AUDIO INTERCEPT: ${a.purpose}. Pure, unfiltered passion and determination.`,
            approximateDate: "VOICE INTERCEPT",
            filename: a.filename,
            room: a.room,
            tag: "AUDIO WIRE",
          });
        });

      return items;
    }
    if (currentRoom === "FUTURE") {
      return anshikaData.unwrittenChapters.map((uc, idx) => ({
        id: uc.id,
        title: `UNWRITTEN CHAPTER #${(idx + 1).toString().padStart(2, "0")}: ${uc.title}`,
        description: uc.description,
        memory: `FORENSIC VISION FOR THE FUTURE: ${uc.description}\n\nSymbolic Emblem: [${(uc.symbol || "HORIZON").toUpperCase()}]. A promise waiting beyond the horizon. 23 years of her story written, and the best chapters are yet to begin.`,
        approximateDate: "THE UNWRITTEN HORIZON",
        filename: "",
        room: "FUTURE",
        tag: "FUTURE CHAPTER",
      }));
    }
    const photos = anshikaData.photos.filter((p) => p.room === currentRoom);
    const list = photos.length > 0 ? photos : anshikaData.photos;
    return list.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      memory: p.memory,
      approximateDate: p.approximateDate || "ARCHIVED",
      filename: p.filename,
      room: p.room,
      tag: p.importance ? p.importance.toUpperCase() : "RECORD",
    }));
  }, [currentRoom, DISTANCE_DOSSIERS]);

  // Current active item (photo, evidence, or clue)
  const item = useMemo(() => {
    if (!activeMemoryId) return null;

    // 0. Distance dossiers lookup
    const dist = DISTANCE_DOSSIERS.find((d) => d.id === activeMemoryId);
    if (dist) return dist;

    // 1. Little Things lookup
    const lt = anshikaData.littleThings.find((l) => l.id === activeMemoryId);
    if (lt) {
      const idx = anshikaData.littleThings.findIndex((l) => l.id === activeMemoryId);
      return {
        id: lt.id,
        title: `THE LITTLE THING I NOTICE ABOUT YOU (#${(idx + 1).toString().padStart(2, "0")})`,
        description: lt.content,
        memory: `CASE FILE #005 • SUBTLE OBSERVATION DETAIL #${(idx + 1).toString().padStart(2, "0")}: Every quirk, expression, and habit of Anshika Bajpai observed, cherished, and filed under sacred memory.`,
        approximateDate: "DAILY OBSERVATION",
        filename: idx === 0 ? "her_on_arnav's_last_birthday.jpeg" : "",
        room: "LITTLE_THINGS",
        tag: "LITTLE THING",
        isClue: false,
      };
    }

    if (activeMemoryId === "lt-ledger") {
      return {
        id: "lt-ledger",
        title: "CASE LEDGER: THE ANNOTATED HABITS OF ANSHIKA",
        description:
          "Comprehensive psychological & affection profile of Subject Anshika Bajpai.",
        memory: `Documented Traits: ${anshikaData.personal.traits.join(", ")}.\n\nDocumented Quirks: ${anshikaData.personal.quirks.join(", ")}.\n\nThings She Loves: ${anshikaData.personal.thingsSheLoves.join(", ")}.\n\nThings She Dislikes: ${anshikaData.personal.thingsSheDislikes.join(", ")}.\n\nConclusion: An irresistible combination of mischief, beauty, fierce loyalty, and boundless love. Celebrating 23 years of her.`,
        approximateDate: "25 OCTOBER 2026",
        filename: "",
        room: "LITTLE_THINGS",
        tag: "FORENSIC LEDGER",
        isClue: false,
      };
    }

    // 2. Photo lookup
    const p = anshikaData.photos.find((p) => p.id === activeMemoryId);
    if (p) {
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        memory: p.memory,
        approximateDate: p.approximateDate || "ARCHIVED",
        filename: p.filename,
        room: p.room,
        tag: p.importance ? p.importance.toUpperCase() : "RECORD",
        isClue: false,
      };
    }

    // 2. Evidence lookup
    const ev = anshikaData.evidence.find((e) => e.id === activeMemoryId);
    if (ev) {
      return {
        id: ev.id,
        title: ev.title,
        description: ev.description,
        memory: ev.unlockedMessage,
        approximateDate: "CASE EVIDENCE #1025",
        filename: ev.associatedMedia || "",
        room: "EVIDENCE",
        tag: "FORENSIC PROOF",
        isClue: false,
      };
    }

    // 3. Video reel lookup
    const vid = anshikaData.videos.find((v) => v.id === activeMemoryId);
    if (vid) {
      return {
        id: vid.id,
        title: vid.title,
        description: vid.description,
        memory: vid.meaning || `ARCHIVAL VIDEO REEL: ${vid.title}. Undeniable main character charisma.`,
        approximateDate: "RECORDED REEL",
        filename: vid.filename,
        room: vid.room,
        tag: "CINEMATIC REEL",
        isClue: false,
      };
    }

    // 4. Audio intercept lookup
    const aud = anshikaData.audio.find((a) => a.id === activeMemoryId);
    if (aud) {
      return {
        id: aud.id,
        title: "AUDIO INTERCEPT: UNSTOPPABLE ENERGY",
        description: aud.purpose,
        memory: `FORENSIC AUDIO INTERCEPT: ${aud.purpose}. Pure, unfiltered passion and determination.`,
        approximateDate: "VOICE INTERCEPT",
        filename: aud.filename,
        room: aud.room,
        tag: "AUDIO WIRE",
        isClue: false,
      };
    }

    // 5. Mystery Clue lookup
    const mc = anshikaData.mysteryClues.find((c) => c.id === activeMemoryId);
    if (mc) {
      return {
        id: mc.id,
        title: "MYSTERY CLUE",
        description: mc.clue,
        memory: `FORENSIC HINT: ${mc.hint}`,
        approximateDate: "INVESTIGATIVE LEAD",
        filename: "",
        room: "EVIDENCE",
        tag: "MYSTERY CLUE",
        isClue: true,
      };
    }

    // 6. Unwritten Chapters lookup
    const uc = anshikaData.unwrittenChapters.find((c) => c.id === activeMemoryId);
    if (uc) {
      const idx = anshikaData.unwrittenChapters.findIndex((c) => c.id === activeMemoryId);
      return {
        id: uc.id,
        title: `UNWRITTEN CHAPTER #${(idx + 1).toString().padStart(2, "0")}: ${uc.title}`,
        description: uc.description,
        memory: `FORENSIC VISION FOR THE FUTURE: ${uc.description}\n\nSymbolic Emblem: [${(uc.symbol || "HORIZON").toUpperCase()}]. A promise waiting beyond the horizon. 23 years of her story written, and the best chapters are yet to begin.`,
        approximateDate: "THE UNWRITTEN HORIZON",
        filename: "",
        room: "FUTURE",
        tag: "FUTURE CHAPTER",
        isClue: false,
      };
    }

    return null;
  }, [activeMemoryId, DISTANCE_DOSSIERS]);

  const currentIndex = useMemo(() => {
    if (!item) return -1;
    return roomItems.findIndex((r) => r.id === item.id);
  }, [item, roomItems]);

  // Automatically record this evidence as unlocked
  useEffect(() => {
    if (activeMemoryId) {
      unlockEvidence(activeMemoryId);
    }
  }, [activeMemoryId, unlockEvidence]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return;
    const prev = roomItems[currentIndex - 1];
    if (prev) openMemory(prev.id);
  }, [currentIndex, roomItems, openMemory]);

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= roomItems.length - 1) return;
    const next = roomItems[currentIndex + 1];
    if (next) openMemory(next.id);
  }, [currentIndex, roomItems, openMemory]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeMemoryId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMemory();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMemoryId, closeMemory, handlePrev, handleNext]);

  if (!activeMemoryId || !item) return null;

  const isVideo = Boolean(
    item.filename && (item.filename.endsWith(".mp4") || item.filename.endsWith(".webm"))
  );
  const isAudio = Boolean(
    item.filename && (item.filename.endsWith(".ogg") || item.filename.endsWith(".mp3") || item.filename.endsWith(".wav"))
  );
  const photoUrl = !isVideo && !isAudio && item.filename ? getPhotoUrl(item.filename) : "";
  const exhibitNum = currentIndex >= 0 ? String(currentIndex + 1).padStart(2, "0") : "??";
  const totalExhibits = String(roomItems.length).padStart(2, "0");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(8, 6, 5, 0.92)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "max(0.5rem, env(safe-area-inset-top, 0.5rem)) max(0.5rem, env(safe-area-inset-right, 0.5rem)) max(0.5rem, env(safe-area-inset-bottom, 0.5rem)) max(0.5rem, env(safe-area-inset-left, 0.5rem))",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
      onClick={closeMemory}
    >
      {/* Dossier Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "820px",
          maxHeight: "94dvh",
          background: THEME.folder.dark,
          border: `2px solid ${THEME.folder.base}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 30px ${THEME.evidence.primary}22`,
          borderRadius: "3px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top Case Tape / Header */}
        <div
          style={{
            background: THEME.noir.surface,
            borderBottom: `2px solid ${THEME.evidence.primary}`,
            padding: "clamp(0.5rem, 1.8vw, 0.8rem) clamp(0.75rem, 2.5vw, 1.4rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
            <span
              style={{
                background: THEME.evidence.primary,
                color: THEME.noir.pitch,
                padding: "0.2rem 0.45rem",
                fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
                fontWeight: 900,
                letterSpacing: "0.15em",
                borderRadius: "2px",
                whiteSpace: "nowrap",
              }}
            >
              {item.isClue ? "CLUE" : `EXHIBIT #${exhibitNum}`}
            </span>
            <span
              style={{
                fontSize: "clamp(0.48rem, 1.5vw, 0.6rem)",
                letterSpacing: "0.15em",
                color: THEME.folder.light,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              CASE #1025 • {currentIndex >= 0 ? `${currentIndex + 1}/${totalExhibits}` : "VERIFIED"}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={closeMemory}
            style={{
              background: "none",
              border: `1px solid ${THEME.classified.stamp}`,
              color: THEME.classified.bright,
              padding: "0.25rem 0.6rem",
              fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
              letterSpacing: "0.15em",
              cursor: "pointer",
              fontFamily: "inherit",
              borderRadius: "2px",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
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
            ✕ CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div
          className="touch-scroll"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "1.2rem",
            padding: "clamp(0.75rem, 2.5vw, 1.5rem)",
            overflowY: "auto",
            alignItems: "center",
          }}
        >
          {/* Left Visual Area (Photo or Archival Case File) */}
          <div
            style={{
              position: "relative",
              background: "#120e0a",
              border: `1px solid ${THEME.folder.base}`,
              padding: "0.75rem 0.75rem 1.5rem 0.75rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "260px",
              justifyContent: "center",
            }}
          >
            {/* Classified Stamp Badge */}
            <div
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                zIndex: 10,
                border: `1.5px solid ${THEME.classified.stamp}`,
                color: THEME.classified.stamp,
                padding: "0.2rem 0.6rem",
                fontSize: "0.5rem",
                fontWeight: 900,
                letterSpacing: "0.25em",
                transform: "rotate(6deg)",
                background: "rgba(10, 8, 7, 0.85)",
                pointerEvents: "none",
              }}
            >
              CONFIDENTIAL
            </div>

            {isVideo ? (
              /* Video Player */
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxHeight: "340px",
                  overflow: "hidden",
                  background: "#080605",
                  border: `1.5px solid ${THEME.evidence.primary}`,
                  borderRadius: "2px",
                  boxShadow: "0 0 25px rgba(234, 179, 8, 0.15)",
                }}
              >
                <video
                  src={getVideoUrl(item.filename)}
                  controls
                  playsInline
                  autoPlay
                  style={{
                    width: "100%",
                    maxHeight: "340px",
                    display: "block",
                    background: "#000",
                  }}
                />
              </div>
            ) : isAudio ? (
              /* Audio Wire Intercept Player */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem 1rem",
                  width: "100%",
                  background: "#0d0a07",
                  border: `1.5px dashed ${THEME.evidence.amber}`,
                  borderRadius: "4px",
                  gap: "1.2rem",
                }}
              >
                <div style={{ fontSize: "2.8rem" }}>🎙️</div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.25em",
                    color: THEME.evidence.primary,
                    fontWeight: 700,
                  }}
                >
                  CLASSIFIED WIRE INTERCEPT RECORDING
                </div>
                <audio
                  src={getAudioUrl(item.filename)}
                  controls
                  autoPlay
                  style={{ width: "92%", filter: "sepia(0.3)" }}
                />
              </div>
            ) : photoUrl ? (
              /* Photo Image */
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  maxHeight: "340px",
                  overflow: "hidden",
                  background: "#080605",
                  border: "1px solid #231c15",
                }}
              >
                <Image
                  src={photoUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: "contain" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              /* Text Evidence Case Sheet */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: `2px dashed ${THEME.evidence.primary}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: THEME.evidence.primary,
                    fontSize: "1.2rem",
                  }}
                >
                  🔍
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    color: THEME.evidence.amber,
                  }}
                >
                  FORENSIC RECORD FILED
                </div>
                <div
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    color: THEME.folder.light,
                  }}
                >
                  PHYSICAL ARTIFACT ARCHIVED IN VAULT
                </div>
              </div>
            )}

            {/* Polaroid / Document caption */}
            <div
              style={{
                marginTop: "0.8rem",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: THEME.folder.light,
                textAlign: "center",
              }}
            >
              {`DATE: ${item.approximateDate}`}
            </div>
          </div>

          {/* Forensic Notes & Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: THEME.folder.light,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  color: THEME.evidence.amber,
                  marginBottom: "0.25rem",
                }}
              >
                EVIDENCE RECORD
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  letterSpacing: "0.1em",
                  color: "#fff8e7",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {item.title}
              </h2>
            </div>

            {/* Description */}
            <div
              style={{
                background: "rgba(10, 8, 7, 0.6)",
                borderLeft: `2px solid ${THEME.evidence.primary}`,
                padding: "0.8rem",
                fontSize: "0.75rem",
                lineHeight: "1.5",
                color: "#e8dcce",
              }}
            >
              {item.description}
            </div>

            {/* Personal Memory / Investigator's Note */}
            {item.memory && (
              <div>
                <div
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    color: THEME.classified.bright,
                    marginBottom: "0.25rem",
                  }}
                >
                  INVESTIGATOR NOTE
                </div>
                <div
                  style={{
                    fontStyle: "italic",
                    fontSize: "0.72rem",
                    lineHeight: "1.5",
                    color: THEME.folder.light,
                    background: "rgba(185, 28, 28, 0.08)",
                    border: `1px dashed ${THEME.classified.stamp}66`,
                    padding: "0.75rem",
                    borderRadius: "2px",
                  }}
                >
                  &ldquo;{item.memory}&rdquo;
                </div>
              </div>
            )}

            {/* Meta Tags */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <span
                style={{
                  background: "rgba(234, 179, 8, 0.1)",
                  border: `1px solid ${THEME.evidence.primary}44`,
                  color: THEME.evidence.primary,
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                }}
              >
                ROOM: {item.room}
              </span>
              <span
                style={{
                  background: "rgba(185, 28, 28, 0.1)",
                  border: `1px solid ${THEME.classified.stamp}44`,
                  color: THEME.classified.bright,
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                }}
              >
                STATUS: UNLOCKED
              </span>
              <span
                style={{
                  background: "rgba(156, 122, 76, 0.15)",
                  border: `1px solid ${THEME.folder.base}44`,
                  color: THEME.folder.light,
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                }}
              >
                {item.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            background: THEME.noir.surface,
            borderTop: `1px solid ${THEME.folder.base}`,
            padding: "clamp(0.5rem, 1.8vw, 0.8rem) clamp(0.75rem, 2.5vw, 1.4rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            style={{
              background: "none",
              border: `1px solid ${currentIndex <= 0 ? "#3a3028" : THEME.evidence.primary}`,
              color: currentIndex <= 0 ? "#5a4d3f" : THEME.evidence.primary,
              padding: "0.35rem clamp(0.5rem, 2vw, 1rem)",
              fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
              letterSpacing: "0.15em",
              cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}
          >
            ◄ PREV
          </button>

          <span
            style={{
              fontSize: "clamp(0.48rem, 1.5vw, 0.55rem)",
              letterSpacing: "0.2em",
              color: THEME.folder.light,
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentIndex >= 0 ? `${currentIndex + 1} / ${totalExhibits}` : "EVIDENCE DOSSIER"}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex >= roomItems.length - 1}
            style={{
              background: "none",
              border: `1px solid ${
                currentIndex >= roomItems.length - 1 ? "#3a3028" : THEME.evidence.primary
              }`,
              color: currentIndex >= roomItems.length - 1 ? "#5a4d3f" : THEME.evidence.primary,
              padding: "0.35rem clamp(0.5rem, 2vw, 1rem)",
              fontSize: "clamp(0.52rem, 1.6vw, 0.6rem)",
              letterSpacing: "0.15em",
              cursor: currentIndex >= roomItems.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}
          >
            NEXT ►
          </button>
        </div>
      </div>
    </div>
  );
}

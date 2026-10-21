"use client";

import { useEffect, useRef, useState } from "react";
import { THEME } from "@/lib/theme";
import { getPhotoUrl, getAudioUrl } from "@/lib/assetManager";

interface Obstacle {
  x: number; // -1 (left lane) to 1 (right lane)
  z: number; // distance along track
  label: string;
  width: number;
}

interface Collectible {
  x: number;
  z: number;
  type: "heart" | "star";
  collected: boolean;
}

interface Billboard {
  x: number; // -1.6 (left side) or 1.6 (right side)
  z: number;
  photoUrl: string;
  title: string;
  cheerText: string;
}

export function MidnightCarRacer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);

  const TARGET_DISTANCE = 2300; // 2,300 meters for 23rd birthday
  const playerPos = useRef({ x: 0, z: 0 }); // x in [-0.9, 0.9]
  const playerSpeed = useRef(0);
  const keys = useRef({ left: false, right: false, up: false, down: false });
  const animFrameId = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preloaded billboard images
  const billboardImages = useRef<Map<string, HTMLImageElement>>(new Map());

  const SAMPLE_PHOTOS = [
    { file: "our_classic_heart_shaped_photo.jpeg", title: "HER & ARNAV", cheer: "GO ANSHIKA!" },
    { file: "her on her birthday.jpeg", title: "BIRTHDAY QUEEN", cheer: "HAPPY 23RD BDAY!" },
    { file: "anshika_on_our_last_anniversary.jpeg", title: "ANNIVERSARY", cheer: "FOREVER TOGETHER!" },
    { file: "her cute photo.jpeg", title: "CUTE DIVA", cheer: "SLAYYY ROCKSTAR!" },
    { file: "looking_hottest_on_her_2023_birthday.jpeg", title: "HOTTEST EVER", cheer: "THE QUEEN OF KANPUR!" },
  ];

  // Initialize track billboards & obstacles
  const billboardsRef = useRef<Billboard[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);

  useEffect(() => {
    // Preload billboard images
    SAMPLE_PHOTOS.forEach((p) => {
      const url = getPhotoUrl(p.file);
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      billboardImages.current.set(url, img);
    });

    // Generate billboards along 2300m track
    const bbs: Billboard[] = [];
    for (let z = 120; z < TARGET_DISTANCE; z += 180) {
      const side = Math.random() > 0.5 ? 1.65 : -1.65;
      const sample = SAMPLE_PHOTOS[Math.floor(Math.random() * SAMPLE_PHOTOS.length)];
      bbs.push({
        x: side,
        z,
        photoUrl: getPhotoUrl(sample.file),
        title: sample.title,
        cheerText: sample.cheer,
      });
    }
    billboardsRef.current = bbs;

    // Generate obstacles along track
    const obs: Obstacle[] = [];
    const OBSTACLE_LABELS = [
      "1,540 KM DISTANCE",
      "HOSTEL CURFEW",
      "BUSY SCHEDULE",
      "CDAC EXAM",
      "SLOW TRAFFIC",
    ];
    for (let z = 150; z < TARGET_DISTANCE - 100; z += 75) {
      const lane = (Math.random() - 0.5) * 1.5;
      obs.push({
        x: lane,
        z,
        label: OBSTACLE_LABELS[Math.floor(Math.random() * OBSTACLE_LABELS.length)],
        width: 0.38,
      });
    }
    obstaclesRef.current = obs;

    // Generate heart & star collectibles
    const coll: Collectible[] = [];
    for (let z = 80; z < TARGET_DISTANCE; z += 45) {
      const lane = (Math.random() - 0.5) * 1.4;
      coll.push({
        x: lane,
        z,
        type: Math.random() > 0.3 ? "heart" : "star",
        collected: false,
      });
    }
    collectiblesRef.current = coll;
  }, []);

  const resetRace = () => {
    playerPos.current = { x: 0, z: 0 };
    playerSpeed.current = 0;
    setDistance(0);
    setSpeed(0);
    setFuel(100);
    setScore(0);
    setIsGameOver(false);
    setIsVictory(false);
    setCheerNotice(null);
    collectiblesRef.current.forEach((c) => (c.collected = false));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S" || e.code === "Space") keys.current.down = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S" || e.code === "Space") keys.current.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isGameOver && !isVictory) {
        // Player acceleration / braking
        const maxSpeed = keys.current.up ? 130 : 90;
        const accel = keys.current.up ? 45 : 25;
        const friction = 20;

        if (keys.current.up) {
          playerSpeed.current = Math.min(maxSpeed, playerSpeed.current + accel * dt);
        } else if (keys.current.down) {
          playerSpeed.current = Math.max(0, playerSpeed.current - 70 * dt);
        } else {
          playerSpeed.current = Math.max(0, playerSpeed.current - friction * dt);
        }

        // Steer
        if (playerSpeed.current > 5) {
          const steerSpeed = 1.35 * (playerSpeed.current / maxSpeed);
          if (keys.current.left) playerPos.current.x = Math.max(-0.85, playerPos.current.x - steerSpeed * dt);
          if (keys.current.right) playerPos.current.x = Math.min(0.85, playerPos.current.x + steerSpeed * dt);
        }

        // Advance distance
        playerPos.current.z += playerSpeed.current * dt * 2.2;
        setDistance(Math.floor(playerPos.current.z));
        setSpeed(Math.floor(playerSpeed.current));

        // Fuel drain
        if (playerSpeed.current > 0) {
          setFuel((f) => {
            const next = Math.max(0, f - dt * 1.8);
            if (next <= 0) setIsGameOver(true);
            return next;
          });
        }

        // Check victory
        if (playerPos.current.z >= TARGET_DISTANCE) {
          setIsVictory(true);
          playerSpeed.current = 0;
          if (!audioRef.current) {
            const aud = new Audio(getAudioUrl("so_adorable_while_calling_me_cute_and_telling_me_that_i_am_proud_of_my_cuteness.ogg"));
            aud.play().catch(() => {});
            audioRef.current = aud;
          }
        }

        // Check obstacle collisions
        for (const obs of obstaclesRef.current) {
          const distZ = obs.z - playerPos.current.z;
          if (distZ > 0 && distZ < 6) {
            const distX = Math.abs(obs.x - playerPos.current.x);
            if (distX < obs.width + 0.15) {
              // Crash penalty
              playerSpeed.current = Math.max(10, playerSpeed.current * 0.3);
              setFuel((f) => Math.max(0, f - 12));
            }
          }
        }

        // Check collectible pickups
        for (const c of collectiblesRef.current) {
          if (c.collected) continue;
          const distZ = c.z - playerPos.current.z;
          if (distZ > -2 && distZ < 6) {
            const distX = Math.abs(c.x - playerPos.current.x);
            if (distX < 0.28) {
              c.collected = true;
              if (c.type === "heart") {
                setFuel((f) => Math.min(100, f + 15));
                setScore((s) => s + 100);
              } else {
                setScore((s) => s + 250);
              }
            }
          }
        }

        // Check billboard cheering notice
        for (const b of billboardsRef.current) {
          const distZ = b.z - playerPos.current.z;
          if (distZ > 0 && distZ < 25) {
            setCheerNotice(b.cheerText);
            break;
          }
        }
      }

      // ─── Render Scene ───
      // 1. Sky & Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
      skyGrad.addColorStop(0, "#080509");
      skyGrad.addColorStop(0.5, "#1e0b1c");
      skyGrad.addColorStop(1, "#3b112c");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      // Distant stadium city lights & bleachers
      ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
      ctx.fillRect(0, height * 0.48, width, height * 0.07);

      // Cheering crowds silhouettes on stadium fences
      ctx.fillStyle = "#110b14";
      for (let i = 0; i < width; i += 18) {
        const crowdH = 12 + Math.sin(now * 0.008 + i) * 6;
        ctx.fillRect(i, height * 0.55 - crowdH, 12, crowdH);
      }

      // 2. Ground & Highway Road (Pseudo-3D Projection)
      const horizonY = height * 0.55;
      const roadBottomW = width * 0.85;
      const roadTopW = width * 0.06;

      // Grass / stadium field
      ctx.fillStyle = "#090d0b";
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Road asphalt polygon
      ctx.beginPath();
      ctx.moveTo(width / 2 - roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 + roadTopW / 2, horizonY);
      ctx.lineTo(width / 2 + roadBottomW / 2, height);
      ctx.lineTo(width / 2 - roadBottomW / 2, height);
      ctx.closePath();
      ctx.fillStyle = "#161318";
      ctx.fill();

      // Road curbs (crimson & gold alternating)
      const curbStrips = 18;
      for (let i = 0; i < curbStrips; i++) {
        const p1 = i / curbStrips;
        const p2 = (i + 1) / curbStrips;
        const y1 = horizonY + (height - horizonY) * Math.pow(p1, 2.2);
        const y2 = horizonY + (height - horizonY) * Math.pow(p2, 2.2);
        const w1 = roadTopW + (roadBottomW - roadTopW) * p1;
        const w2 = roadTopW + (roadBottomW - roadTopW) * p2;

        const isOdd = Math.floor(playerPos.current.z * 0.1 + i) % 2 === 0;
        ctx.fillStyle = isOdd ? "#e11d48" : "#fef08a";

        // Left curb
        ctx.beginPath();
        ctx.moveTo(width / 2 - w1 / 2 - 14 * p1, y1);
        ctx.lineTo(width / 2 - w1 / 2, y1);
        ctx.lineTo(width / 2 - w2 / 2, y2);
        ctx.lineTo(width / 2 - w2 / 2 - 14 * p2, y2);
        ctx.closePath();
        ctx.fill();

        // Right curb
        ctx.beginPath();
        ctx.moveTo(width / 2 + w1 / 2, y1);
        ctx.lineTo(width / 2 + w1 / 2 + 14 * p1, y1);
        ctx.lineTo(width / 2 + w2 / 2 + 14 * p2, y2);
        ctx.lineTo(width / 2 + w2 / 2, y2);
        ctx.closePath();
        ctx.fill();
      }

      // Center dashed lines
      for (let i = 0; i < curbStrips; i++) {
        const p1 = i / curbStrips;
        const p2 = (i + 0.5) / curbStrips;
        const isDashed = Math.floor(playerPos.current.z * 0.15 + i) % 2 === 0;
        if (!isDashed) continue;

        const y1 = horizonY + (height - horizonY) * Math.pow(p1, 2.2);
        const y2 = horizonY + (height - horizonY) * Math.pow(p2, 2.2);
        const lineWidth = Math.max(2, 6 * p1);

        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(width / 2, y1);
        ctx.lineTo(width / 2, y2);
        ctx.stroke();
      }

      // 3. Render Billboards with Anshika's Genuine Photos
      const visibleZ = 160;
      for (const bb of billboardsRef.current) {
        const relZ = bb.z - playerPos.current.z;
        if (relZ <= 2 || relZ > visibleZ) continue;

        const scale = 1 - relZ / visibleZ;
        const pers = Math.pow(scale, 2.2);
        const screenY = horizonY + (height - horizonY) * pers;
        const roadW = roadTopW + (roadBottomW - roadTopW) * scale;
        const screenX = width / 2 + (bb.x * (roadW / 2)) * 1.35;

        const bbW = 120 * scale;
        const bbH = 90 * scale;

        // Billboard Frame
        ctx.save();
        ctx.translate(screenX - bbW / 2, screenY - bbH - 20 * scale);

        // Stand pole
        ctx.fillStyle = "#33221a";
        ctx.fillRect(bbW / 2 - 3 * scale, bbH, 6 * scale, 24 * scale);

        // Neon Glow border
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 12 * scale;
        ctx.fillStyle = "#1e111a";
        ctx.fillRect(0, 0, bbW, bbH);
        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(0, 0, bbW, bbH);

        // Photo thumbnail
        const img = billboardImages.current.get(bb.photoUrl);
        if (img && img.complete) {
          ctx.drawImage(img, 4 * scale, 4 * scale, bbW - 8 * scale, bbH - 22 * scale);
        } else {
          ctx.fillStyle = "#0a0a0c";
          ctx.fillRect(4 * scale, 4 * scale, bbW - 8 * scale, bbH - 22 * scale);
        }

        // Cheering title banner on billboard bottom
        ctx.fillStyle = "#fef08a";
        ctx.font = `bold ${Math.max(7, Math.floor(9 * scale))}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(bb.cheerText, bbW / 2, bbH - 6 * scale);

        ctx.restore();
      }

      // 4. Render Obstacles
      for (const obs of obstaclesRef.current) {
        const relZ = obs.z - playerPos.current.z;
        if (relZ <= 1 || relZ > visibleZ) continue;

        const scale = 1 - relZ / visibleZ;
        const pers = Math.pow(scale, 2.2);
        const screenY = horizonY + (height - horizonY) * pers;
        const roadW = roadTopW + (roadBottomW - roadTopW) * scale;
        const screenX = width / 2 + obs.x * (roadW / 2);

        const obsW = 55 * scale;
        const obsH = 34 * scale;

        ctx.save();
        ctx.translate(screenX - obsW / 2, screenY - obsH);

        // Orange road barrier
        ctx.fillStyle = "#f97316";
        ctx.fillRect(0, 0, obsW, obsH);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(0, 0, obsW, obsH);

        // Striped hazard pattern
        ctx.fillStyle = "#000000";
        ctx.fillRect(obsW * 0.25, 0, obsW * 0.2, obsH);
        ctx.fillRect(obsW * 0.65, 0, obsW * 0.2, obsH);

        // Obstacle text tag
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(6, Math.floor(7 * scale))}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(obs.label, obsW / 2, -4 * scale);

        ctx.restore();
      }

      // 5. Render Collectibles (Hearts & Stars)
      for (const c of collectiblesRef.current) {
        if (c.collected) continue;
        const relZ = c.z - playerPos.current.z;
        if (relZ <= 1 || relZ > visibleZ) continue;

        const scale = 1 - relZ / visibleZ;
        const pers = Math.pow(scale, 2.2);
        const screenY = horizonY + (height - horizonY) * pers;
        const roadW = roadTopW + (roadBottomW - roadTopW) * scale;
        const screenX = width / 2 + c.x * (roadW / 2);

        const sz = 24 * scale;
        ctx.save();
        ctx.translate(screenX, screenY - sz);
        ctx.font = `${Math.max(10, Math.floor(sz))}px sans-serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = c.type === "heart" ? "#f43f5e" : "#fef08a";
        ctx.shadowBlur = 12 * scale;
        ctx.fillText(c.type === "heart" ? "♥" : "✦", 0, 0);
        ctx.restore();
      }

      // 6. Render Player Car / Scooty
      const carW = 86;
      const carH = 48;
      const playerScreenX = width / 2 + playerPos.current.x * (roadBottomW / 2);
      const playerScreenY = height - 50;

      ctx.save();
      ctx.translate(playerScreenX, playerScreenY);

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(0, 16, carW * 0.55, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Body (Midnight Magenta sports car with gold trims)
      ctx.fillStyle = "#be123c";
      ctx.beginPath();
      ctx.roundRect(-carW / 2, -carH / 2, carW, carH, 10);
      ctx.fill();

      // Roof / Cabin
      ctx.fillStyle = "#1e1018";
      ctx.beginPath();
      ctx.roundRect(-carW * 0.35, -carH * 0.65, carW * 0.7, carH * 0.45, 6);
      ctx.fill();

      // Windshield reflection
      ctx.fillStyle = "rgba(254, 240, 138, 0.65)";
      ctx.fillRect(-carW * 0.28, -carH * 0.6, carW * 0.56, carH * 0.22);

      // Glowing Taillights
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 16;
      ctx.fillRect(-carW / 2 + 6, carH * 0.15, 14, 8);
      ctx.fillRect(carW / 2 - 20, carH * 0.15, 14, 8);

      // License Plate: "ANSHIKA 23"
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-18, carH * 0.18, 36, 12);
      ctx.fillStyle = "#000";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ANSHIKA 23", 0, carH * 0.38);

      ctx.restore();

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isGameOver, isVictory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Top HUD: Speed, Distance, Fuel, Stadium Cheer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.55rem 1rem",
          background: "rgba(18, 14, 20, 0.95)",
          borderBottom: "1px solid rgba(244, 63, 94, 0.3)",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ color: THEME.evidence.primary, fontSize: "0.78rem", fontWeight: 700 }}>
            DISTANCE: <span style={{ color: "#fff", fontSize: "0.95rem" }}>{distance}m</span> / {TARGET_DISTANCE}m
          </div>
          <div style={{ color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}>
            SPEED: <span style={{ color: "#fff" }}>{speed}</span> KM/H
          </div>
        </div>

        {/* Stadium cheering crowd marquee */}
        {cheerNotice && (
          <div
            style={{
              color: "#fef08a",
              fontWeight: 900,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              background: "rgba(244, 63, 94, 0.25)",
              padding: "0.2rem 0.6rem",
              borderRadius: 3,
              border: "1px solid #f43f5e",
              animation: "bounce 0.8s infinite",
            }}
          >
            📣 CROWD: &quot;{cheerNotice}&quot;
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* Fuel gauge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.72rem", color: fuel < 25 ? "#ef4444" : "#22c55e", fontWeight: 700 }}>
              FUEL:
            </span>
            <div style={{ width: 60, height: 10, background: "#33222a", borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  width: `${fuel}%`,
                  height: "100%",
                  background: fuel < 25 ? "#ef4444" : "#22c55e",
                  transition: "width 0.1s",
                }}
              />
            </div>
          </div>
          <button
            onClick={resetRace}
            style={{
              background: "rgba(30, 20, 26, 0.8)",
              border: "1px solid #78350f",
              borderRadius: 3,
              color: THEME.folder.light,
              fontSize: "0.62rem",
              padding: "0.25rem 0.6rem",
              cursor: "pointer",
            }}
          >
            ↺ RESTART
          </button>
        </div>
      </div>

      {/* Main Racer Canvas */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* Victory Screen */}
        {isVictory && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 5, 12, 0.94)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              textAlign: "center",
              zIndex: 30,
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.4rem" }}>🏁 🏎 👑</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: THEME.evidence.primary,
                textShadow: "0 0 20px rgba(234, 179, 8, 0.6)",
              }}
            >
              FINISH LINE CROSSED: 23RD BIRTHDAY GRAND PRIX!
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#e2e8f0",
                maxWidth: 480,
                marginTop: "0.6rem",
                lineHeight: 1.5,
              }}
            >
              You dodged all the obstacles, crossed 2,300 meters, and took 1st place in your 23rd Birthday Grand Prix! The crowd is cheering for you!
            </div>
            <div
              style={{
                marginTop: "1.2rem",
                padding: "0.8rem 1.4rem",
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid #f43f5e",
                borderRadius: 6,
                fontSize: "0.78rem",
                color: "#fef08a",
                fontWeight: 700,
              }}
            >
              ★ GRAND PRIX TROPHY AWARDED: ARNAV&apos;S PROUDEST FANBOY AWARD ★
            </div>
            <button
              onClick={resetRace}
              style={{
                marginTop: "1.5rem",
                background: THEME.evidence.primary,
                color: "#080605",
                fontWeight: 800,
                border: "none",
                borderRadius: 4,
                padding: "0.55rem 1.4rem",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              RACE AGAIN
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 5, 8, 0.94)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              textAlign: "center",
              zIndex: 30,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>⛽ 💔</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>
              OUT OF FUEL AT {distance} METERS!
            </div>
            <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: "0.4rem" }}>
              Pick up floating hearts ♥ along the road to replenish fuel!
            </div>
            <button
              onClick={resetRace}
              style={{
                marginTop: "1.2rem",
                background: "#e11d48",
                color: "#fff",
                fontWeight: 800,
                border: "none",
                borderRadius: 4,
                padding: "0.55rem 1.4rem",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Steering Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          background: "rgba(14, 10, 16, 0.95)",
          borderTop: "1px solid rgba(244, 63, 94, 0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onPointerDown={() => (keys.current.left = true)}
            onPointerUp={() => (keys.current.left = false)}
            style={{
              background: "rgba(244, 63, 94, 0.2)",
              border: "1px solid #f43f5e",
              borderRadius: 4,
              color: "#fff",
              fontSize: "1.1rem",
              padding: "0.4rem 1.2rem",
              cursor: "pointer",
            }}
          >
            ◀ LEFT
          </button>
          <button
            onPointerDown={() => (keys.current.right = true)}
            onPointerUp={() => (keys.current.right = false)}
            style={{
              background: "rgba(244, 63, 94, 0.2)",
              border: "1px solid #f43f5e",
              borderRadius: 4,
              color: "#fff",
              fontSize: "1.1rem",
              padding: "0.4rem 1.2rem",
              cursor: "pointer",
            }}
          >
            RIGHT ▶
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onPointerDown={() => (keys.current.down = true)}
            onPointerUp={() => (keys.current.down = false)}
            style={{
              background: "rgba(100, 116, 139, 0.2)",
              border: "1px solid #64748b",
              borderRadius: 4,
              color: "#94a3b8",
              fontSize: "0.85rem",
              padding: "0.4rem 1rem",
              cursor: "pointer",
            }}
          >
            BRAKE
          </button>
          <button
            onPointerDown={() => (keys.current.up = true)}
            onPointerUp={() => (keys.current.up = false)}
            style={{
              background: "#e11d48",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.85rem",
              padding: "0.4rem 1.4rem",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(225, 29, 72, 0.6)",
            }}
          >
            ⚡ BOOST
          </button>
        </div>
      </div>
    </div>
  );
}

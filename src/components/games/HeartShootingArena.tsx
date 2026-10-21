"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { THEME } from "@/lib/theme";
import { getAudioUrl } from "@/lib/assetManager";

interface HeartTarget {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  isGolden: boolean;
  popped: boolean;
  popProgress: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

export function HeartShootingArena() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [heartsShot, setHeartsShot] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const TARGET_HEARTS = 23;
  const heartsRef = useRef<HeartTarget[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextHeartId = useRef(1);
  const lastSpawnTime = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // Play confidential love voicenote on victory
  const playSecretVoicenote = () => {
    if (!audioRef.current) {
      const audio = new Audio(getAudioUrl("her_telling_me_how_much_and_deeply_she_loves_me.ogg"));
      audio.volume = 0.95;
      audio.onended = () => setIsPlayingAudio(false);
      audioRef.current = audio;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
  };

  const spawnHeart = useCallback((canvasWidth: number, canvasHeight: number) => {
    const isGolden = Math.random() < 0.22;
    const size = isGolden ? 32 + Math.random() * 12 : 24 + Math.random() * 16;
    const x = size + Math.random() * (canvasWidth - size * 2);
    const y = canvasHeight + size;
    const vx = (Math.random() - 0.5) * 1.8;
    const vy = -(1.2 + Math.random() * 2.2);
    const hue = isGolden ? 45 : 340 + Math.random() * 30;

    heartsRef.current.push({
      id: nextHeartId.current++,
      x,
      y,
      vx,
      vy,
      size,
      hue,
      isGolden,
      popped: false,
      popProgress: 0,
    });
  }, []);

  const shootAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    let hit = false;
    for (let i = heartsRef.current.length - 1; i >= 0; i--) {
      const h = heartsRef.current[i];
      if (h.popped) continue;

      const dist = Math.hypot(clickX - h.x, clickY - h.y);
      if (dist < h.size * 1.15) {
        hit = true;
        h.popped = true;

        // Spawn sparkling burst particles
        const particleCount = h.isGolden ? 30 : 18;
        for (let p = 0; p < particleCount; p++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 5.0;
          particlesRef.current.push({
            x: h.x,
            y: h.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: h.isGolden ? "#fef08a" : "#f43f5e",
            size: 2.5 + Math.random() * 3.5,
            alpha: 1,
            life: 1,
          });
        }

        setScore((prev) => prev + (h.isGolden ? 250 : 100) * (combo + 1));
        setHeartsShot((prev) => {
          const next = prev + 1;
          if (next >= TARGET_HEARTS && !isVictory) {
            setIsVictory(true);
            playSecretVoicenote();
          }
          return next;
        });
        setCombo((prev) => prev + 1);
        break;
      }
    }

    if (!hit) {
      setCombo(0);
      // Spawn subtle miss ripple
      for (let p = 0; p < 6; p++) {
        const angle = Math.random() * Math.PI * 2;
        particlesRef.current.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.5,
          color: "rgba(255, 255, 255, 0.4)",
          size: 1.5,
          alpha: 0.6,
          life: 0.6,
        });
      }
    }
  };

  const resetGame = () => {
    heartsRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setHeartsShot(0);
    setCombo(0);
    setIsVictory(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

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

    const drawHeartPath = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.8, 0, size);
      c.bezierCurveTo(0, size * 0.8, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.restore();
    };

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Clear with sleek dark vignette gradient
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, width, height);

      // Cyber grid lines
      ctx.strokeStyle = "rgba(225, 29, 72, 0.08)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Spawn new hearts
      if (now - lastSpawnTime.current > 750 && heartsRef.current.length < 14) {
        spawnHeart(width, height);
        lastSpawnTime.current = now;
      }

      // Update and draw hearts
      for (let i = heartsRef.current.length - 1; i >= 0; i--) {
        const h = heartsRef.current[i];
        if (h.popped) {
          h.popProgress += dt * 4;
          if (h.popProgress >= 1) {
            heartsRef.current.splice(i, 1);
            continue;
          }
        } else {
          h.x += h.vx;
          h.y += h.vy;
          // Bounce off left/right
          if (h.x - h.size < 0) {
            h.x = h.size;
            h.vx = Math.abs(h.vx);
          } else if (h.x + h.size > width) {
            h.x = width - h.size;
            h.vx = -Math.abs(h.vx);
          }
          if (h.y + h.size < -50) {
            heartsRef.current.splice(i, 1);
            continue;
          }
        }

        // Draw Heart
        ctx.save();
        const scale = h.popped ? 1 + h.popProgress * 0.8 : 1 + Math.sin(now * 0.005 + h.id) * 0.08;
        const alpha = h.popped ? 1 - h.popProgress : 0.95;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.translate(h.x, h.y - h.size / 2);
        ctx.scale(scale, scale);

        ctx.shadowColor = h.isGolden ? "rgba(250, 204, 21, 0.7)" : "rgba(244, 63, 94, 0.6)";
        ctx.shadowBlur = h.isGolden ? 18 : 12;

        ctx.fillStyle = h.isGolden
          ? "linear-gradient(45deg, #eab308, #fef08a)"
          : `hsl(${h.hue}, 90%, 55%)`;
        drawHeartPath(ctx, 0, 0, h.size);
        ctx.fill();

        // Shimmer shine reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(-h.size * 0.22, h.size * 0.32, h.size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += dt * 3.5; // gentle gravity
        p.life -= dt * 1.8;
        p.alpha = Math.max(0, p.life);

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [spawnHeart, combo, isVictory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Top Arcade Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.6rem 1rem",
          background: "rgba(18, 14, 12, 0.95)",
          borderBottom: "1px solid rgba(225, 29, 72, 0.3)",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ color: THEME.evidence.primary, fontSize: "0.78rem", fontWeight: 700 }}>
            TARGET: <span style={{ color: "#fff", fontSize: "0.95rem" }}>{heartsShot}</span> / {TARGET_HEARTS} HEARTS
          </div>
          {combo > 1 && (
            <div
              style={{
                color: "#f43f5e",
                fontWeight: 900,
                fontSize: "0.78rem",
                animation: "pulse 0.5s infinite",
              }}
            >
              🔥 {combo}X COMBO!
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <div style={{ color: THEME.evidence.amber, fontSize: "0.82rem", fontWeight: 700 }}>
            SCORE: <span style={{ color: "#fff" }}>{score.toLocaleString()}</span>
          </div>
          <button
            onClick={resetGame}
            style={{
              background: "rgba(30, 20, 16, 0.8)",
              border: "1px solid #78350f",
              borderRadius: 3,
              color: THEME.folder.light,
              fontSize: "0.62rem",
              padding: "0.25rem 0.6rem",
              cursor: "pointer",
            }}
          >
            ↺ RESET
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div style={{ flex: 1, position: "relative", cursor: "crosshair", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
          onPointerDown={(e) => shootAt(e.clientX, e.clientY)}
        />

        {/* Victory Overlay Modal */}
        {isVictory && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 5, 8, 0.92)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              textAlign: "center",
              zIndex: 20,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div style={{ fontSize: "2.8rem", marginBottom: "0.4rem" }}>👑 ♥ ✦</div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: THEME.evidence.primary,
                textShadow: "0 0 20px rgba(234, 179, 8, 0.6)",
              }}
            >
              ARENA CLEARED: 23 HEARTS SHOT!
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
              You shot 23 hearts for your 23rd birthday! Classified Wiretap unlocked: Anshika&apos;s Deep Love Voice Tape.
            </div>

            {/* Audio player card */}
            <div
              style={{
                marginTop: "1.2rem",
                padding: "0.8rem 1.4rem",
                background: "rgba(244, 63, 94, 0.12)",
                border: "1px solid #f43f5e",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <button
                onClick={playSecretVoicenote}
                style={{
                  background: "#e11d48",
                  border: "none",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  color: "#fff",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(225, 29, 72, 0.6)",
                }}
              >
                {isPlayingAudio ? "❚❚" : "▶"}
              </button>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff" }}>
                  CLASSIFIED TAPE: HER DEEP LOVE CONFESSION
                </div>
                <div style={{ fontSize: "0.65rem", color: "#fda4af" }}>
                  Authentic Audio • Recorded with all her heart
                </div>
              </div>
            </div>

            <button
              onClick={resetGame}
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
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

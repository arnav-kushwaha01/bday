"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { soundEngine } from "@/engine/audio/AudioManager";
import { getPhotoUrl } from "@/lib/assetManager";
import { ANSHIKA_CELEBRATION_PHOTOS } from "@/data/anshikaPhotos";

interface PoppedImageReveal {
  id: string;
  position: [number, number, number];
  photoUrl: string;
  startTime: number;
}

interface HeartDef {
  id: string;
  basePos: [number, number, number];
  floatSpeed: number;
  rotSpeed: number;
  phase: number;
  scale: number;
  color: string;
}

// Romantic celebratory palette of shiny opaque ruby, rose, and pink lacquer
const SHINY_HEART_COLORS = [
  "#f43f5e", // Rose ruby
  "#fb7185", // Light rose
  "#ec4899", // Hot pink
  "#e11d48", // Deep crimson ruby
  "#f472b6", // Magenta blossom
  "#fda4af", // Soft rose quartz
];

/**
 * Creates a lightweight, optimized 3D Extruded Heart Geometry
 * Low polygon count & 1 bevel segment for ultra-fast 60fps rendering.
 */
function createOptimizedHeartGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;

  // Smooth heart curve
  shape.moveTo(x, y + 0.25);
  shape.bezierCurveTo(x, y + 0.45, x - 0.2, y + 0.65, x - 0.48, y + 0.65);
  shape.bezierCurveTo(x - 0.78, y + 0.65, x - 0.78, y + 0.3, x - 0.78, y + 0.3);
  shape.bezierCurveTo(x - 0.78, y + 0.05, x - 0.45, y - 0.3, x, y - 0.68);
  shape.bezierCurveTo(x + 0.45, y - 0.3, x + 0.78, y + 0.05, x + 0.78, y + 0.3);
  shape.bezierCurveTo(x + 0.78, y + 0.3, x + 0.78, y + 0.65, x + 0.48, y + 0.65);
  shape.bezierCurveTo(x + 0.2, y + 0.65, x, y + 0.45, x, y + 0.25);

  const extrudeSettings = {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 1, // Ultra-optimized
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center(); // Center around centroid
  return geom;
}

/**
 * HubBirthdayCelebration — fills the main room with 3D floating shiny opaque hearts,
 * celebratory sparkles, and interactive heart-pop reveals showing Anshika's photos.
 * 
 * Rules:
 * 1. ONLY active after clicking center platform and AFTER closing the birthday message modal ("after going outside").
 * 2. Ultra-optimized: Opaque shiny lacquer material, no heavy transmission, no per-mesh point lights, silky smooth 60fps.
 * 3. Smaller hearts that gently float and pop to reveal random photos of Anshika for 2 seconds.
 */
export function HubBirthdayCelebration() {
  const isBirthdayCelebrationActive = useAppStore((s) => s.isBirthdayCelebrationActive);
  const currentRoom = useAppStore((s) => s.currentRoom);
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);

  const [poppedHeartIds, setPoppedHeartIds] = useState<Set<string>>(new Set());
  const [activeReveals, setActiveReveals] = useState<PoppedImageReveal[]>([]);

  // Memoized shared geometry (1 instance for all hearts)
  const heartGeometry = useMemo(() => createOptimizedHeartGeometry(), []);

  // 20 Floating Hearts well-distributed around the Hub room
  const hearts = useMemo<HeartDef[]>(() => {
    const list: HeartDef[] = [];
    const positions: Array<[number, number, number]> = [
      // Near center dais
      [-1.5, 2.0, -1.0],
      [1.5, 2.2, -1.0],
      [-1.2, 3.0, -2.4],
      [1.2, 2.8, -2.4],
      [0.0, 3.6, -1.6],
      [-2.2, 1.6, -1.8],
      [2.2, 1.8, -1.8],
      // Mid-radius
      [-3.2, 2.4, -3.2],
      [3.2, 2.6, -3.2],
      [-3.5, 3.2, 0.2],
      [3.5, 3.1, 0.2],
      [-2.2, 4.0, -0.6],
      [2.2, 3.8, -0.6],
      // Outer perimeter
      [-4.6, 2.2, -2.0],
      [4.6, 2.3, -2.0],
      [-4.2, 3.4, 1.8],
      [4.2, 3.3, 1.8],
      [-2.0, 2.6, 3.2],
      [2.0, 2.7, 3.2],
      [0.0, 3.2, 3.8],
    ];

    positions.forEach((pos, i) => {
      list.push({
        id: `bday-heart-${i}`,
        basePos: pos,
        floatSpeed: 0.9 + ((i * 7) % 5) * 0.12,
        rotSpeed: 0.7 + ((i * 3) % 4) * 0.15,
        phase: (i * Math.PI) / 4,
        scale: 0.17 + ((i * 3) % 4) * 0.02, // Smaller, cute & delicate
        color: SHINY_HEART_COLORS[i % SHINY_HEART_COLORS.length],
      });
    });

    return list;
  }, []);

  // Lightweight Confetti (60 points)
  const confettiCount = 60;
  const confettiGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(confettiCount * 3);
    const col = new Float32Array(confettiCount * 3);
    const c1 = new THREE.Color("#fb7185");
    const c2 = new THREE.Color("#facc15");
    const c3 = new THREE.Color("#38bdf8");

    for (let i = 0; i < confettiCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 5.0 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const pick = i % 3;
      const c = pick === 0 ? c1 : pick === 1 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return geom;
  }, []);

  const confettiRef = useRef<THREE.Points>(null);
  const heartGroupRefs = useRef<Map<string, THREE.Group>>(new Map());

  // Check and purge expired reveals (exactly 2000ms duration)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setActiveReveals((prev) => prev.filter((r) => now - r.startTime < 2000));
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  // Pop a heart: play chime SFX, reveal random photo of Anshika for 2 seconds
  const popHeart = (heart: HeartDef) => {
    soundEngine.playWishStar();

    // Mark heart popped
    setPoppedHeartIds((prev) => new Set(prev).add(heart.id));

    // Get current position
    const grp = heartGroupRefs.current.get(heart.id);
    const curPos: [number, number, number] = grp
      ? [grp.position.x, grp.position.y, grp.position.z]
      : heart.basePos;

    // Pick random photo of Anshika
    const randomPhoto =
      ANSHIKA_CELEBRATION_PHOTOS[
        Math.floor(Math.random() * ANSHIKA_CELEBRATION_PHOTOS.length)
      ];
    const photoUrl = getPhotoUrl(randomPhoto);

    // Create 2-second reveal
    const reveal: PoppedImageReveal = {
      id: `reveal-${Date.now()}-${Math.random()}`,
      position: curPos,
      photoUrl,
      startTime: Date.now(),
    };
    setActiveReveals((prev) => [...prev, reveal]);

    // Respawn heart after 7 seconds so fun continues
    window.setTimeout(() => {
      setPoppedHeartIds((prev) => {
        const next = new Set(prev);
        next.delete(heart.id);
        return next;
      });
    }, 7000);
  };

  // Lightweight frame animation: gentle bobbing and confetti drift
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Animate hearts
    hearts.forEach((h) => {
      if (poppedHeartIds.has(h.id)) return;
      const grp = heartGroupRefs.current.get(h.id);
      if (grp) {
        // Smooth bobbing
        grp.position.y =
          h.basePos[1] + Math.sin(t * h.floatSpeed + h.phase) * 0.18;
        grp.position.x =
          h.basePos[0] + Math.cos(t * (h.floatSpeed * 0.7) + h.phase) * 0.08;

        // Shiny rotation to catch highlights
        grp.rotation.y = t * h.rotSpeed + h.phase;
        grp.rotation.z = Math.sin(t * 1.1 + h.phase) * 0.12;
      }
    });

    // Animate confetti
    if (confettiRef.current) {
      const posAttr = confettiRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < confettiCount; i++) {
        array[i * 3 + 1] -= delta * 0.35;
        if (array[i * 3 + 1] < 0.2) {
          array[i * 3 + 1] = 5.2;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  // Strict Condition:
  // 1. Birthday celebration must be active
  // 2. Room must be HUB
  // 3. User MUST have closed the initial birthday message modal ("after going outside")
  const isBirthdayModalOpen = activeMemoryId === "happy-birthday-celebration";
  if (!isBirthdayCelebrationActive || currentRoom !== "HUB" || isBirthdayModalOpen) {
    return null;
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ── Single Warm Festive Light (Zero GPU Overhead) ── */}
      <pointLight position={[0, 3.8, -1.8]} intensity={1.6} distance={14} color="#fda4af" />

      {/* ── Floating Celebration Banner ── */}
      <group position={[0, 4.4, -1.8]}>
        <Billboard follow={true}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.8, 0.46]} />
            <meshBasicMaterial color="#0c0709" transparent opacity={0.90} />
          </mesh>
          <mesh position={[0, 0, -0.019]}>
            <planeGeometry args={[3.84, 0.50]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.65} />
          </mesh>
          <Text
            position={[0, 0.08, 0]}
            fontSize={0.095}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.16}
          >
            ✦ 23RD BIRTHDAY CELEBRATION ✦
          </Text>
          <Text
            position={[0, -0.09, 0]}
            fontSize={0.065}
            color="#fda4af"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
            letterSpacing={0.12}
          >
            POP ANY SHINY HEART TO REVEAL HER PHOTO FOR 2 SECONDS
          </Text>
        </Billboard>
      </group>

      {/* ── 3D Floating Shiny Opaque Hearts (Fast 60fps) ── */}
      {hearts.map((h) => {
        const isPopped = poppedHeartIds.has(h.id);
        if (isPopped) return null;

        return (
          <group
            key={h.id}
            ref={(el) => {
              if (el) heartGroupRefs.current.set(h.id, el);
              else heartGroupRefs.current.delete(h.id);
            }}
            position={h.basePos}
            scale={[h.scale, h.scale, h.scale]}
            onClick={(e) => {
              e.stopPropagation();
              popHeart(h);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            {/* Opaque Shiny Candy-Lacquer Heart */}
            <mesh geometry={heartGeometry} castShadow>
              <meshStandardMaterial
                color={h.color}
                roughness={0.12}
                metalness={0.25}
                emissive={h.color}
                emissiveIntensity={0.28}
              />
            </mesh>
          </group>
        );
      })}

      {/* ── Active Photo Reveals (Fade out after 2000ms) ── */}
      {activeReveals.map((rev) => {
        const elapsed = (Date.now() - rev.startTime) / 1000;
        // 0 to 1.5s: opacity 1, 1.5 to 2.0s: smooth fade to 0
        const opacity = elapsed < 1.5 ? 1 : Math.max(0, 1 - (elapsed - 1.5) / 0.5);

        return (
          <group key={rev.id} position={rev.position}>
            <Billboard follow={true}>
              <Html center pointerEvents="none">
                <div
                  style={{
                    opacity,
                    transform: `scale(${Math.min(1, 0.4 + elapsed * 3)}) translateY(-${elapsed * 12}px)`,
                    transition: "opacity 0.15s ease-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(18, 12, 14, 0.95)",
                    border: "2px solid #f43f5e",
                    boxShadow: "0 0 25px rgba(244, 63, 94, 0.6), 0 15px 30px rgba(0,0,0,0.8)",
                    borderRadius: 10,
                    padding: "6px 6px 10px 6px",
                    width: 190,
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  {/* Photo Frame */}
                  <div
                    style={{
                      position: "relative",
                      width: 178,
                      height: 178,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "#0a0608",
                      border: "1px solid rgba(251, 113, 133, 0.4)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.photoUrl}
                      alt="Anshika Memory"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "rgba(225, 29, 72, 0.9)",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#fff",
                      }}
                    >
                      ♥
                    </div>
                  </div>

                  {/* Caption */}
                  <div
                    style={{
                      marginTop: 6,
                      textAlign: "center",
                      color: "#fef08a",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                    }}
                  >
                    ✦ ANSHIKA // 23 YEARS ✦
                  </div>
                </div>
              </Html>
            </Billboard>
          </group>
        );
      })}

      {/* ── Lightweight Confetti Rain (60 points) ── */}
      <points ref={confettiRef} geometry={confettiGeometry}>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
}

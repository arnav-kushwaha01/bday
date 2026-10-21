"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { soundEngine } from "@/engine/audio/AudioManager";
import { getPhotoUrl } from "@/lib/assetManager";
import { ANSHIKA_CELEBRATION_PHOTOS } from "@/data/anshikaPhotos";

interface PoppedImageReveal {
  id: string;
  position: [number, number, number];
  photoUrl: string;
  startTime: number;
}

interface ParticleBurst {
  id: string;
  origin: [number, number, number];
  particles: Array<{
    dir: [number, number, number];
    speed: number;
    color: string;
  }>;
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

// Romantic celebratory palette of ruby, rose quartz, and champagne gold
const HEART_COLORS = [
  "#f43f5e", // Rose
  "#fb7185", // Light rose
  "#ec4899", // Pink
  "#f472b6", // Soft magenta
  "#fda4af", // Soft blossom
  "#e11d48", // Deep ruby
  "#f59e0b", // Warm gold
];

/**
 * Creates a procedural 3D Extruded Heart Geometry
 */
function createHeartGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;

  // Symmetrical parametric heart curve
  shape.moveTo(x, y + 0.28);
  shape.bezierCurveTo(x, y + 0.48, x - 0.22, y + 0.68, x - 0.52, y + 0.68);
  shape.bezierCurveTo(x - 0.82, y + 0.68, x - 0.82, y + 0.32, x - 0.82, y + 0.32);
  shape.bezierCurveTo(x - 0.82, y + 0.05, x - 0.5, y - 0.32, x, y - 0.72);
  shape.bezierCurveTo(x + 0.5, y - 0.32, x + 0.82, y + 0.05, x + 0.82, y + 0.32);
  shape.bezierCurveTo(x + 0.82, y + 0.32, x + 0.82, y + 0.68, x + 0.52, y + 0.68);
  shape.bezierCurveTo(x + 0.22, y + 0.68, x, y + 0.48, x, y + 0.28);

  const extrudeSettings = {
    depth: 0.22,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center(); // Center around centroid for natural wobble & rotation
  return geom;
}

/**
 * HubBirthdayCelebration — fills the main room with 3D floating glassy hearts,
 * celebratory confetti, and interactive heart-pop reveals showing Anshika's photos.
 * Active strictly when birthday celebration is triggered and birthday music is playing.
 */
export function HubBirthdayCelebration() {
  const isBirthdayCelebrationActive = useAppStore((s) => s.isBirthdayCelebrationActive);
  const currentRoom = useAppStore((s) => s.currentRoom);

  const [poppedHeartIds, setPoppedHeartIds] = useState<Set<string>>(new Set());
  const [activeReveals, setActiveReveals] = useState<PoppedImageReveal[]>([]);
  const [activeBursts, setActiveBursts] = useState<ParticleBurst[]>([]);

  // Procedural Heart Geometry
  const heartGeometry = useMemo(() => createHeartGeometry(), []);

  // 36 Floating Heart Definitions distributed gracefully across Hub Room
  const hearts = useMemo<HeartDef[]>(() => {
    const list: HeartDef[] = [];
    const positions: Array<[number, number, number]> = [
      // Orbiting around center platform
      [-1.8, 2.2, -1.2],
      [1.8, 2.4, -1.2],
      [-1.4, 3.4, -2.6],
      [1.4, 3.2, -2.6],
      [0.0, 4.2, -1.8],
      [-2.6, 1.8, -1.8],
      [2.6, 2.0, -1.8],
      [0.0, 1.8, -0.4],
      // Mid-radius spread
      [-3.8, 2.6, -3.8],
      [3.8, 2.8, -3.8],
      [-4.2, 3.5, 0.4],
      [4.2, 3.6, 0.4],
      [-2.8, 4.4, -0.8],
      [2.8, 4.2, -0.8],
      [-3.2, 1.9, -4.8],
      [3.2, 2.1, -4.8],
      [-1.2, 4.6, -3.8],
      [1.2, 4.8, -3.8],
      // Outer perimeter near portals
      [-5.5, 2.4, -2.5],
      [5.5, 2.5, -2.5],
      [-5.2, 3.8, 1.5],
      [5.2, 3.7, 1.5],
      [-4.8, 2.0, 3.2],
      [4.8, 2.2, 3.2],
      [-2.2, 2.8, 4.2],
      [2.2, 2.9, 4.2],
      [0.0, 3.6, 4.8],
      [-6.2, 3.2, -0.5],
      [6.2, 3.1, -0.5],
      [-1.5, 5.2, 1.2],
      [1.5, 5.4, 1.2],
      [-3.6, 4.8, 2.8],
      [3.6, 4.9, 2.8],
      [-0.8, 2.2, 2.8],
      [0.8, 2.3, 2.8],
      [0.0, 5.6, -1.8],
    ];

    positions.forEach((pos, i) => {
      list.push({
        id: `bday-heart-${i}`,
        basePos: pos,
        floatSpeed: 0.8 + ((i * 7) % 11) * 0.08,
        rotSpeed: 0.6 + ((i * 5) % 9) * 0.1,
        phase: (i * Math.PI) / 6,
        scale: 0.38 + ((i * 3) % 5) * 0.05,
        color: HEART_COLORS[i % HEART_COLORS.length],
      });
    });

    return list;
  }, []);

  // Confetti particles
  const confettiCount = 140;
  const confettiGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(confettiCount * 3);
    const col = new Float32Array(confettiCount * 3);
    const c1 = new THREE.Color("#fb7185");
    const c2 = new THREE.Color("#facc15");
    const c3 = new THREE.Color("#38bdf8");

    for (let i = 0; i < confettiCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5.8 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;

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

  // Group references for animated hearts
  const heartGroupRefs = useRef<Map<string, THREE.Group>>(new Map());

  // Check and purge expired reveals & bursts (after 2000ms)
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setActiveReveals((prev) => prev.filter((r) => now - r.startTime < 2000));
      setActiveBursts((prev) => prev.filter((b) => now - b.startTime < 1200));
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  // Pop a heart: play chime SFX, create burst, reveal random photo for 2 seconds
  const popHeart = (heart: HeartDef) => {
    soundEngine.playWishStar();

    // Mark heart popped
    setPoppedHeartIds((prev) => new Set(prev).add(heart.id));

    // Get current animated position
    const grp = heartGroupRefs.current.get(heart.id);
    const curPos: [number, number, number] = grp
      ? [grp.position.x, grp.position.y, grp.position.z]
      : heart.basePos;

    // Pick random photo of Anshika from catalog
    const randomPhoto =
      ANSHIKA_CELEBRATION_PHOTOS[
        Math.floor(Math.random() * ANSHIKA_CELEBRATION_PHOTOS.length)
      ];
    const photoUrl = getPhotoUrl(randomPhoto);

    // Create reveal item
    const reveal: PoppedImageReveal = {
      id: `reveal-${Date.now()}-${Math.random()}`,
      position: curPos,
      photoUrl,
      startTime: Date.now(),
    };
    setActiveReveals((prev) => [...prev, reveal]);

    // Create particle burst
    const burstParticles = [];
    for (let p = 0; p < 14; p++) {
      const theta = (p / 14) * Math.PI * 2 + Math.random() * 0.2;
      const phi = (Math.random() - 0.5) * Math.PI;
      burstParticles.push({
        dir: [
          Math.cos(phi) * Math.cos(theta),
          Math.sin(phi),
          Math.cos(phi) * Math.sin(theta),
        ] as [number, number, number],
        speed: 1.2 + Math.random() * 1.5,
        color: HEART_COLORS[p % HEART_COLORS.length],
      });
    }

    const burst: ParticleBurst = {
      id: `burst-${Date.now()}-${Math.random()}`,
      origin: curPos,
      particles: burstParticles,
      startTime: Date.now(),
    };
    setActiveBursts((prev) => [...prev, burst]);

    // Respawn heart after 6 seconds so celebration can continue indefinitely
    window.setTimeout(() => {
      setPoppedHeartIds((prev) => {
        const next = new Set(prev);
        next.delete(heart.id);
        return next;
      });
    }, 6000);
  };

  // Frame animations: gently float hearts and drift confetti
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Animate hearts
    hearts.forEach((h) => {
      if (poppedHeartIds.has(h.id)) return;
      const grp = heartGroupRefs.current.get(h.id);
      if (grp) {
        // Floating bobbing
        grp.position.y =
          h.basePos[1] + Math.sin(t * h.floatSpeed + h.phase) * 0.28;
        grp.position.x =
          h.basePos[0] + Math.cos(t * (h.floatSpeed * 0.6) + h.phase) * 0.15;
        grp.position.z =
          h.basePos[2] + Math.sin(t * (h.floatSpeed * 0.7) + h.phase) * 0.15;

        // Smooth rotation
        grp.rotation.y = t * h.rotSpeed + h.phase;
        grp.rotation.z = Math.sin(t * 1.2 + h.phase) * 0.18;
      }
    });

    // Animate confetti drift
    if (confettiRef.current) {
      const posAttr = confettiRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < confettiCount; i++) {
        array[i * 3 + 1] -= delta * 0.45;
        array[i * 3] += Math.sin(t + i) * delta * 0.2;
        if (array[i * 3 + 1] < 0.2) {
          array[i * 3 + 1] = 5.8;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  // Only active when birthday music is playing after center platform click in HUB
  if (!isBirthdayCelebrationActive || currentRoom !== "HUB") {
    return null;
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ── Festive Ambient Light Wash (Warm Romantic Glow) ── */}
      <pointLight position={[0, 3.5, -1.8]} intensity={2.8} distance={18} color="#fda4af" />
      <pointLight position={[0, 1.2, -1.8]} intensity={1.8} distance={8} color="#f43f5e" />

      {/* ── Floating Celebration Banner ── */}
      <group position={[0, 4.6, -1.8]}>
        <Billboard follow={true}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[4.8, 0.58]} />
            <meshBasicMaterial color="#0c0709" transparent opacity={0.92} />
          </mesh>
          <mesh position={[0, 0, -0.019]}>
            <planeGeometry args={[4.84, 0.62]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.65} />
          </mesh>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.11}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.18}
          >
            ✦ 23RD BIRTHDAY CELEBRATION ACTIVE ✦
          </Text>
          <Text
            position={[0, -0.11, 0]}
            fontSize={0.075}
            color="#fda4af"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
            letterSpacing={0.14}
          >
            POP ANY GLASS HEART TO REVEAL HER PHOTO FOR 2 SECONDS
          </Text>
        </Billboard>
      </group>

      {/* ── Floating 3D Glassy Hearts ── */}
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
            {/* 3D Glassy Translucent Heart Mesh */}
            <mesh geometry={heartGeometry} castShadow>
              <meshPhysicalMaterial
                color={h.color}
                emissive={h.color}
                emissiveIntensity={0.42}
                roughness={0.14}
                metalness={0.06}
                transmission={0.86}
                ior={1.48}
                thickness={0.55}
                transparent={true}
                opacity={0.92}
                reflectivity={0.9}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
              />
            </mesh>

            {/* Glowing inner core point light for radiant crystal effect */}
            <pointLight color={h.color} intensity={0.6} distance={1.2} />
          </group>
        );
      })}

      {/* ── Active Photo Reveals (Fade out after 2000ms) ── */}
      {activeReveals.map((rev) => {
        const elapsed = (Date.now() - rev.startTime) / 1000;
        // 0 to 1.4s: opacity 1, 1.4 to 2.0s: fade to 0
        const opacity = elapsed < 1.4 ? 1 : Math.max(0, 1 - (elapsed - 1.4) / 0.6);

        return (
          <group key={rev.id} position={rev.position}>
            <Billboard follow={true}>
              <Html center pointerEvents="none">
                <div
                  style={{
                    opacity,
                    transform: `scale(${Math.min(1, 0.4 + elapsed * 3)}) translateY(-${elapsed * 18}px)`,
                    transition: "opacity 0.15s ease-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(18, 12, 14, 0.94)",
                    border: "2px solid #f43f5e",
                    boxShadow: "0 0 35px rgba(244, 63, 94, 0.65), 0 20px 40px rgba(0,0,0,0.8)",
                    borderRadius: 12,
                    padding: "8px 8px 12px 8px",
                    width: 220,
                    animation: "heartPopBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  {/* Photo Frame */}
                  <div
                    style={{
                      position: "relative",
                      width: 204,
                      height: 204,
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "#0a0608",
                      border: "1px solid rgba(251, 113, 133, 0.4)",
                    }}
                  >
                    {/* Next.js standard img with object-cover */}
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
                    {/* Festive Heart Corner Stamp */}
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(225, 29, 72, 0.85)",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(225, 29, 72, 0.8)",
                      }}
                    >
                      ♥
                    </div>
                  </div>

                  {/* Archival Caption */}
                  <div
                    style={{
                      marginTop: 8,
                      textAlign: "center",
                      color: "#fef08a",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    ✦ ANSHIKA // 23 YEARS ✦
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      textAlign: "center",
                      color: "#fda4af",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                    }}
                  >
                    MEMORY UNLOCKED
                  </div>
                </div>
              </Html>
            </Billboard>
          </group>
        );
      })}

      {/* ── Celebratory Confetti Rain ── */}
      <points ref={confettiRef} geometry={confettiGeometry}>
        <pointsMaterial
          size={0.085}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

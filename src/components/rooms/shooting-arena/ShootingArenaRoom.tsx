"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell, Door, WestworldEdisonBulb } from "../RoomPrimitives";
import { soundEngine } from "@/engine/audio/AudioManager";
import { THEME } from "@/lib/theme";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { getAudioUrl } from "@/lib/assetManager";

// ─── Cute 3D Procedural Target Components ──────────────────────────

/**
 * 3D Procedural Teddy Bear Target
 * Detailed with round ears, pink inner ear pads, snout with shiny black nose,
 * button eyes with white catchlight, honey caramel body, and bright red bow tie.
 */
function TeddyBearTarget({
  isPopped,
  onHit,
}: {
  isPopped: boolean;
  onHit: (e: { stopPropagation: () => void }) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isPopped) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.25;
    groupRef.current.rotation.z = Math.cos(t * 2) * 0.08;
  });

  if (isPopped) return null;

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
    >
      {/* Hitbox expander for easy clicking */}
      <mesh visible={false}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Main Body (Honey Caramel) */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Cream Tummy Patch */}
      <mesh position={[0, -0.08, 0.24]} scale={[1, 1.1, 0.4]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Red Festive Bow Tie */}
      <group position={[0, 0.16, 0.26]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.08, 0.14, 8]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <coneGeometry args={[0.08, 0.14, 8]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#fb7185" roughness={0.3} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Left Ear */}
      <mesh position={[-0.2, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
      {/* Left Inner Pink Ear */}
      <mesh position={[-0.2, 0.58, 0.08]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.055, 12]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>

      {/* Right Ear */}
      <mesh position={[0.2, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
      {/* Right Inner Pink Ear */}
      <mesh position={[0.2, 0.58, 0.08]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.055, 12]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>

      {/* Snout (Cream Oval) */}
      <mesh position={[0, 0.34, 0.2]} scale={[1.2, 0.85, 1]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Shiny Black Nose */}
      <mesh position={[0, 0.38, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1c1917" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Left Button Eye */}
      <mesh position={[-0.09, 0.44, 0.22]}>
        <sphereGeometry args={[0.034, 8, 8]} />
        <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.455, 0.25]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Right Button Eye */}
      <mesh position={[0.09, 0.44, 0.22]}>
        <sphereGeometry args={[0.034, 8, 8]} />
        <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.455, 0.25]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cute Arms */}
      <mesh position={[-0.32, -0.05, 0.06]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
      <mesh position={[0.32, -0.05, 0.06]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Cute Paws */}
      <mesh position={[-0.18, -0.4, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
      <mesh position={[0.18, -0.4, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * 3D Procedural Birthday Cupcake Target
 * Ribbed cupcake wrapper, strawberry frosting swirls, sprinkles, and a burning candle!
 */
function CupcakeTarget({
  isPopped,
  onHit,
}: {
  isPopped: boolean;
  onHit: (e: { stopPropagation: () => void }) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isPopped) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 1.2;
    groupRef.current.position.y = Math.sin(t * 3) * 0.08;
  });

  if (isPopped) return null;

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
    >
      <mesh visible={false}>
        <cylinderGeometry args={[0.5, 0.5, 0.9, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Cupcake Liner Base */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.32, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.5} />
      </mesh>

      {/* Frosting Base Swirl */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#fb7185" roughness={0.3} />
      </mesh>

      {/* Frosting Upper Swirl */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color="#fda4af" roughness={0.3} />
      </mesh>

      {/* Birthday Candle */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.24, 8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.2} />
      </mesh>

      {/* Candle Flame with Glow */}
      <mesh position={[0, 0.58, 0]}>
        <coneGeometry args={[0.04, 0.1, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <pointLight position={[0, 0.6, 0]} color="#f59e0b" intensity={0.6} distance={1.8} />

      {/* Sprinkles */}
      {[-0.12, 0.1, -0.05, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.16 + (i % 2) * 0.08, 0.18]} rotation={[0, 0, i * 0.6]}>
          <boxGeometry args={[0.025, 0.06, 0.02]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#a855f7" : "#22c55e"} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 3D Procedural Glossy Crystal Heart Target
 */
function GlossyHeartTarget({
  isPopped,
  onHit,
}: {
  isPopped: boolean;
  onHit: (e: { stopPropagation: () => void }) => void;
}) {
  const heartRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!heartRef.current || isPopped) return;
    const t = clock.getElapsedTime();
    heartRef.current.rotation.y = t * 1.8;
    const pulse = 1 + Math.sin(t * 5) * 0.1;
    heartRef.current.scale.set(pulse, pulse, pulse);
  });

  if (isPopped) return null;

  return (
    <group
      ref={heartRef}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Left lobe */}
      <mesh position={[-0.14, 0.14, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#f43f5e"
          roughness={0.15}
          metalness={0.4}
          emissive="#e11d48"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Right lobe */}
      <mesh position={[0.14, 0.14, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#f43f5e"
          roughness={0.15}
          metalness={0.4}
          emissive="#e11d48"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Bottom tapered cone */}
      <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.27, 0.44, 16]} />
        <meshStandardMaterial
          color="#e11d48"
          roughness={0.15}
          metalness={0.4}
          emissive="#be123c"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

/**
 * 3D Procedural 11:11 Wishing Star Target
 */
function WishingStarTarget({
  isPopped,
  onHit,
}: {
  isPopped: boolean;
  onHit: (e: { stopPropagation: () => void }) => void;
}) {
  const starRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!starRef.current || isPopped) return;
    const t = clock.getElapsedTime();
    starRef.current.rotation.z = t * 1.5;
    starRef.current.rotation.y = Math.sin(t * 2) * 0.4;
  });

  if (isPopped) return null;

  return (
    <group
      ref={starRef}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* 5-pointed procedural star using rotated diamond cones */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, 0, (i * Math.PI * 2) / 5]}
        >
          <coneGeometry args={[0.12, 0.45, 4]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#ca8a04"
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      ))}

      {/* Glowing center jewel */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
}

/**
 * 3D Procedural Birthday Gift Box Target
 */
function GiftBoxTarget({
  isPopped,
  onHit,
}: {
  isPopped: boolean;
  onHit: (e: { stopPropagation: () => void }) => void;
}) {
  const boxRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!boxRef.current || isPopped) return;
    const t = clock.getElapsedTime();
    boxRef.current.rotation.y = t * 0.9;
    boxRef.current.rotation.x = Math.sin(t * 2) * 0.1;
  });

  if (isPopped) return null;

  return (
    <group
      ref={boxRef}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
    >
      <mesh visible={false}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial />
      </mesh>

      {/* Main Box */}
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.4} />
      </mesh>

      {/* Ribbon Horizontal */}
      <mesh>
        <boxGeometry args={[0.44, 0.1, 0.44]} />
        <meshStandardMaterial color="#fde047" roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Ribbon Vertical */}
      <mesh>
        <boxGeometry args={[0.1, 0.44, 0.44]} />
        <meshStandardMaterial color="#fde047" roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Bow knot on top */}
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#fde047" roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Burst Sparkle Particle Group for Target Pops ───────────────────
interface PopParticle {
  id: number;
  position: [number, number, number];
  color: string;
}

function BurstParticles({ particles }: { particles: PopParticle[] }) {
  return (
    <>
      {particles.map((p) => (
        <group key={p.id} position={p.position}>
          <pointLight color={p.color} intensity={1.5} distance={2.5} />
          {[-0.2, 0, 0.2].map((ox, i) => (
            <mesh key={i} position={[ox, (i % 2) * 0.15, (i - 1) * 0.15]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={p.color} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

// ─── Main 3D Shooting Arena Room ────────────────────────────────────

interface TargetSlot {
  id: number;
  type: "teddy" | "cupcake" | "heart" | "star" | "gift";
  basePos: [number, number, number];
  speed: number;
  amplitude: number;
  offset: number;
  scoreValue: number;
  label: string;
}

export default function ShootingArenaRoom() {
  const [targetsHit, setTargetsHit] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [poppedIds, setPoppedIds] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<PopParticle[]>([]);
  const [combo, setCombo] = useState<number>(1);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [secretTapePlaying, setSecretTapePlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const exitRoom = useTransitionStore((s) => s.exitRoom);
  const openMemory = useTransitionStore((s) => s.openMemory);

  // 12 Target slots positioned across carnival tiers and heights
  const targetSlots: TargetSlot[] = useMemo(
    () => [
      // Back Tier (Z = -5.8) — High Value Targets (Teddy Bears & Cupcakes)
      { id: 1, type: "teddy", basePos: [-4.2, 2.8, -5.8], speed: 1.2, amplitude: 0.8, offset: 0, scoreValue: 200, label: "TEDDY BEAR" },
      { id: 2, type: "cupcake", basePos: [-2.1, 3.2, -5.8], speed: 1.6, amplitude: 0.6, offset: 1.2, scoreValue: 150, label: "CUPCAKE" },
      { id: 3, type: "teddy", basePos: [0, 3.6, -5.8], speed: 1.0, amplitude: 1.0, offset: 2.5, scoreValue: 250, label: "KING TEDDY" },
      { id: 4, type: "cupcake", basePos: [2.1, 3.2, -5.8], speed: 1.5, amplitude: 0.6, offset: 3.8, scoreValue: 150, label: "CUPCAKE" },
      { id: 5, type: "teddy", basePos: [4.2, 2.8, -5.8], speed: 1.1, amplitude: 0.8, offset: 4.2, scoreValue: 200, label: "TEDDY BEAR" },

      // Middle Tier (Z = -3.5) — Glowing Hearts & 11:11 Stars
      { id: 6, type: "heart", basePos: [-3.5, 1.9, -3.5], speed: 2.0, amplitude: 1.2, offset: 0.5, scoreValue: 120, label: "CRYSTAL HEART" },
      { id: 7, type: "star", basePos: [-1.2, 2.3, -3.5], speed: 2.2, amplitude: 0.9, offset: 2.0, scoreValue: 220, label: "11:11 STAR" },
      { id: 8, type: "star", basePos: [1.2, 2.3, -3.5], speed: 2.2, amplitude: 0.9, offset: 3.5, scoreValue: 220, label: "11:11 STAR" },
      { id: 9, type: "heart", basePos: [3.5, 1.9, -3.5], speed: 1.9, amplitude: 1.2, offset: 4.8, scoreValue: 120, label: "CRYSTAL HEART" },

      // Front Floating Tier (Z = -1.2) — Fast Gift Boxes & Teddy Companion
      { id: 10, type: "gift", basePos: [-2.4, 1.4, -1.2], speed: 2.5, amplitude: 1.4, offset: 1.0, scoreValue: 180, label: "GIFT BOX" },
      { id: 11, type: "teddy", basePos: [0, 1.5, -1.2], speed: 1.8, amplitude: 0.7, offset: 3.0, scoreValue: 200, label: "SWEET TEDDY" },
      { id: 12, type: "gift", basePos: [2.4, 1.4, -1.2], speed: 2.6, amplitude: 1.4, offset: 5.0, scoreValue: 180, label: "GIFT BOX" },
    ],
    []
  );

  // Dynamic moving group refs for targets
  const slotGroups = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    targetSlots.forEach((slot, index) => {
      const g = slotGroups.current[index];
      if (!g) return;
      // Sideways gliding wave motion
      g.position.x = slot.basePos[0] + Math.sin(t * slot.speed + slot.offset) * slot.amplitude;
      g.position.y = slot.basePos[1] + Math.cos(t * (slot.speed * 1.5) + slot.offset) * 0.25;
      g.position.z = slot.basePos[2];
    });
  });

  // Handle target hit
  const handleHitTarget = useCallback(
    (slot: TargetSlot, index: number) => {
      if (poppedIds.has(slot.id)) return;

      // Play cute target pop sound
      soundEngine.playTargetPop();

      // Get target current 3D position
      const g = slotGroups.current[index];
      const pos: [number, number, number] = g
        ? [g.position.x, g.position.y, g.position.z]
        : slot.basePos;

      // Add burst particles
      const colors = ["#f43f5e", "#facc15", "#38bdf8", "#ec4899", "#a855f7"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const particleId = Date.now();
      setParticles((prev) => [...prev, { id: particleId, position: pos, color: randomColor }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particleId));
      }, 700);

      // Increment stats
      const points = slot.scoreValue * combo;
      setScore((s) => s + points);
      setCombo((c) => Math.min(c + 1, 5));

      setTargetsHit((count) => {
        const next = count + 1;
        // Trigger 23rd birthday milestone celebration
        if (next >= 23 && !hasCelebrated) {
          setHasCelebrated(true);
          soundEngine.playHappyBirthdayMelody();
          soundEngine.playCrowdCheer();
          // Auto trigger love voicenote audio
          if (typeof window !== "undefined") {
            const secretAudio = new Audio(
              getAudioUrl("her_telling_me_how_much_and_deeply_she_loves_me.ogg")
            );
            audioRef.current = secretAudio;
            secretAudio.play().then(() => setSecretTapePlaying(true)).catch(() => {});
          }
        }
        return next;
      });

      // Mark as popped
      setPoppedIds((prev) => new Set([...prev, slot.id]));

      // Respawn target after 2.8 seconds
      setTimeout(() => {
        setPoppedIds((prev) => {
          const next = new Set(prev);
          next.delete(slot.id);
          return next;
        });
      }, 2800);
    },
    [combo, hasCelebrated, poppedIds]
  );

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <RoomShell width={18} depth={20} height={7}>
      {/* ── Carnival Festive Lighting ── */}
      <ambientLight intensity={0.8} color="#fef08a" />
      <pointLight position={[0, 6, 0]} intensity={2.0} color="#f43f5e" distance={18} />
      <pointLight position={[-6, 4.5, -4]} intensity={1.8} color="#38bdf8" distance={15} />
      <pointLight position={[6, 4.5, -4]} intensity={1.8} color="#facc15" distance={15} />

      {/* Overhead Westworld Filament Bulbs */}
      <WestworldEdisonBulb position={[-4, 4.8, 1]} cordLength={1.5} />
      <WestworldEdisonBulb position={[4, 4.8, 1]} cordLength={1.5} />
      <WestworldEdisonBulb position={[0, 4.8, 3]} cordLength={1.5} />

      {/* ── Neon Room Header on Back Wall ── */}
      <group position={[0, 5.8, -9.8]}>
        <Text
          fontSize={0.65}
          color="#f43f5e"
          anchorX="center"
          letterSpacing={0.2}
          fontWeight={900}
        >
          ★ ANSHIKA CUTE SHOOTING GALLERY ★
        </Text>
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.24}
          color="#fde047"
          anchorX="center"
          letterSpacing={0.25}
          fontWeight={700}
        >
          {`POP 23 CUTE TARGETS TO UNLOCK HER SECRET LOVE TAPE`}
        </Text>
      </group>

      {/* ── 3D Holographic Scoreboard ── */}
      <group position={[0, 4.5, -7]}>
        <mesh>
          <boxGeometry args={[6.4, 0.9, 0.15]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.7} />
        </mesh>
        <Text
          position={[0, 0.16, 0.1]}
          fontSize={0.32}
          color={targetsHit >= 23 ? "#4ade80" : "#f43f5e"}
          fontWeight={900}
          anchorX="center"
        >
          {`TARGETS POPPED: ${targetsHit} / 23`}
        </Text>
        <Text
          position={[0, -0.22, 0.1]}
          fontSize={0.2}
          color="#facc15"
          fontWeight={700}
          anchorX="center"
        >
          {`SCORE: ${score.toLocaleString()}  •  COMBO: ${combo}x`}
        </Text>
      </group>

      {/* ── Target Rails / Carnival Shelves ── */}
      {/* Tier 1 (Back) */}
      <mesh position={[0, 1.8, -5.8]} receiveShadow>
        <boxGeometry args={[14, 0.15, 0.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Tier 2 (Middle) */}
      <mesh position={[0, 1.1, -3.5]} receiveShadow>
        <boxGeometry args={[12, 0.15, 0.6]} />
        <meshStandardMaterial color="#881337" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Carnival Booth Counter (Front) */}
      <mesh position={[0, 0.5, 0.2]} receiveShadow>
        <boxGeometry args={[15, 1.0, 0.8]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.02, 0.2]}>
        <boxGeometry args={[15.4, 0.08, 0.95]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* ── Active 3D Targets ── */}
      {targetSlots.map((slot, index) => (
        <group
          key={slot.id}
          ref={(el) => {
            slotGroups.current[index] = el;
          }}
          position={slot.basePos}
        >
          {slot.type === "teddy" && (
            <TeddyBearTarget
              isPopped={poppedIds.has(slot.id)}
              onHit={() => handleHitTarget(slot, index)}
            />
          )}
          {slot.type === "cupcake" && (
            <CupcakeTarget
              isPopped={poppedIds.has(slot.id)}
              onHit={() => handleHitTarget(slot, index)}
            />
          )}
          {slot.type === "heart" && (
            <GlossyHeartTarget
              isPopped={poppedIds.has(slot.id)}
              onHit={() => handleHitTarget(slot, index)}
            />
          )}
          {slot.type === "star" && (
            <WishingStarTarget
              isPopped={poppedIds.has(slot.id)}
              onHit={() => handleHitTarget(slot, index)}
            />
          )}
          {slot.type === "gift" && (
            <GiftBoxTarget
              isPopped={poppedIds.has(slot.id)}
              onHit={() => handleHitTarget(slot, index)}
            />
          )}
        </group>
      ))}

      {/* ── Popping Sparkle Particle Bursts ── */}
      <BurstParticles particles={particles} />

      {/* ── Grand Celebration Hologram (Active when >= 23 targets hit) ── */}
      {targetsHit >= 23 && (
        <group position={[0, 3.2, -2.5]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.48}
              color="#fde047"
              fontWeight={900}
              anchorX="center"
            >
              🎉 HAPPY 23RD BIRTHDAY ANSHIKA! 🎉
            </Text>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.24}
              color="#38bdf8"
              fontWeight={700}
              anchorX="center"
            >
              SECRET LOVE TAPE UNLOCKED & PLAYING!
            </Text>
          </Float>
        </group>
      )}

      {/* ── Return Door leading back to Archive Hub ── */}
      <Door
        position={[0, 1.6, 9.6]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

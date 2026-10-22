"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Door } from "../RoomPrimitives";
import { soundEngine } from "@/engine/audio/AudioManager";
import { THEME } from "@/lib/theme";
import { getAudioUrl } from "@/lib/assetManager";
import { useTransitionStore } from "@/engine/transitions/transitionStore";

// ─── 3D Cute Villain Models ─────────────────────────────────────────

/**
 * 1. "The Overthinking Goblin" (Flying Mischievous Sprite)
 * Purple body, cute demon horns, flapping bat wings, cartoon eyes, curly tail.
 */
function OverthinkingGoblin({
  position,
  isDefeated,
  onHit,
}: {
  position: [number, number, number];
  isDefeated: boolean;
  onHit: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isDefeated) return;
    const t = clock.getElapsedTime() * 3;
    // Wing flapping
    if (leftWing.current) leftWing.current.rotation.y = Math.sin(t * 4) * 0.5;
    if (rightWing.current) rightWing.current.rotation.y = -Math.sin(t * 4) * 0.5;
    // Hover bob
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.35;
  });

  if (isDefeated) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit();
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Main Chubby Body (Vibrant Violet) */}
      <mesh castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.4} />
      </mesh>

      {/* Cute Demon Horns */}
      <mesh position={[-0.22, 0.42, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.09, 0.28, 8]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.42, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.09, 0.28, 8]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.3} />
      </mesh>

      {/* Big Cartoon Eyes */}
      <mesh position={[-0.14, 0.12, 0.36]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.14, 0.12, 0.43]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      <mesh position={[0.14, 0.12, 0.36]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.14, 0.12, 0.43]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>

      {/* Pouting Grumpy Mouth */}
      <mesh position={[0, -0.08, 0.38]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.02, 6, 12, Math.PI]} />
        <meshBasicMaterial color="#4c1d95" />
      </mesh>

      {/* Cute Flapping Bat Wings */}
      <mesh ref={leftWing} position={[-0.45, 0.15, -0.1]}>
        <boxGeometry args={[0.45, 0.25, 0.04]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.5} />
      </mesh>
      <mesh ref={rightWing} position={[0.45, 0.15, -0.1]}>
        <boxGeometry args={[0.45, 0.25, 0.04]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.5} />
      </mesh>

      {/* Name Tag */}
      <Text
        position={[0, 0.72, 0]}
        fontSize={0.16}
        color="#c4b5fd"
        fontWeight={800}
        anchorX="center"
      >
        OVERTHINKER 😈
      </Text>
    </group>
  );
}

/**
 * 2. "Angry Birdie" (Anshika's famous nickname!)
 * Plump red sphere bird, fierce eyebrows, golden beak, white tummy, bouncy feathers.
 */
function AngryBirdieVillain({
  position,
  isDefeated,
  onHit,
}: {
  position: [number, number, number];
  isDefeated: boolean;
  onHit: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isDefeated) return;
    const t = clock.getElapsedTime() * 4;
    // Energetic hopping animation
    groupRef.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.4;
    groupRef.current.rotation.z = Math.sin(t) * 0.08;
  });

  if (isDefeated) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit();
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Plump Red Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>

      {/* Cream Tummy Patch */}
      <mesh position={[0, -0.12, 0.32]} scale={[1, 0.9, 0.4]}>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} />
      </mesh>

      {/* Angry V-Eyebrows */}
      <mesh position={[-0.12, 0.22, 0.4]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.18, 0.05, 0.03]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      <mesh position={[0.12, 0.22, 0.4]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.18, 0.05, 0.03]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>

      {/* Fierce Eyes */}
      <mesh position={[-0.12, 0.12, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.11, 0.12, 0.44]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      <mesh position={[0.12, 0.12, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.11, 0.12, 0.44]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>

      {/* Golden Cone Beak */}
      <mesh position={[0, 0.02, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.22, 8]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} />
      </mesh>

      {/* Top Feather Crest */}
      <mesh position={[0, 0.48, -0.05]} rotation={[-0.4, 0, 0]}>
        <coneGeometry args={[0.08, 0.26, 8]} />
        <meshStandardMaterial color="#be123c" roughness={0.3} />
      </mesh>

      {/* Name Tag */}
      <Text
        position={[0, 0.76, 0]}
        fontSize={0.16}
        color="#fda4af"
        fontWeight={800}
        anchorX="center"
      >
        ANGRY BIRDIE 🐦
      </Text>
    </group>
  );
}

/**
 * 3. "Mischievous Bandit Teddy"
 * Fluffy brown teddy bear wearing a black bandit Zorro mask and red bandana.
 */
function BanditTeddyVillain({
  position,
  isDefeated,
  onHit,
}: {
  position: [number, number, number];
  isDefeated: boolean;
  onHit: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isDefeated) return;
    const t = clock.getElapsedTime() * 2;
    groupRef.current.rotation.y = Math.sin(t) * 0.35;
  });

  if (isDefeated) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit();
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Teddy Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Teddy Head */}
      <mesh castShadow position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Ears with Pink Insets */}
      <mesh position={[-0.26, 0.78, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0.26, 0.78, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* Bandit Zorro Eye Mask */}
      <mesh position={[0, 0.56, 0.28]}>
        <boxGeometry args={[0.48, 0.14, 0.08]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      {/* Eye cutouts */}
      <mesh position={[-0.12, 0.56, 0.33]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 0.56, 0.33]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Red Bandit Bandana */}
      <mesh position={[0, 0.32, 0.18]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.16, 0.28, 4]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* Snout & Nose */}
      <mesh position={[0, 0.44, 0.28]} scale={[1.2, 0.8, 1]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 0.47, 0.38]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>

      {/* Name Tag */}
      <Text
        position={[0, 1.05, 0]}
        fontSize={0.16}
        color="#fef08a"
        fontWeight={800}
        anchorX="center"
      >
        BANDIT TEDDY 🧸
      </Text>
    </group>
  );
}

/**
 * 4. "Distance Phantom" (Cute Ghost holding 1,540 KM ruler)
 */
function DistancePhantomVillain({
  position,
  isDefeated,
  onHit,
}: {
  position: [number, number, number];
  isDefeated: boolean;
  onHit: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || isDefeated) return;
    const t = clock.getElapsedTime() * 2;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.5;
    groupRef.current.rotation.y = t * 0.8;
  });

  if (isDefeated) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onHit();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit();
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Ghostly Dome Head */}
      <mesh castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.2}
          emissive="#0284c7"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Flowing Skirt */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.45, 16, 1, true]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Big Cute Eyes */}
      <mesh position={[-0.14, 0.08, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      <mesh position={[0.14, 0.08, 0.38]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>

      {/* The 1,540 KM Broken Ruler */}
      <group position={[0.42, -0.1, 0.2]} rotation={[0, 0, 0.4]}>
        <mesh>
          <boxGeometry args={[0.1, 0.7, 0.02]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.065}
          color="#09090b"
          fontWeight={900}
          rotation={[0, 0, -Math.PI / 2]}
        >
          1540 KM
        </Text>
      </group>

      {/* Name Tag */}
      <Text
        position={[0, 0.68, 0]}
        fontSize={0.16}
        color="#7dd3fc"
        fontWeight={800}
        anchorX="center"
      >
        DISTANCE GHOST 👻
      </Text>
    </group>
  );
}

// ─── Secret Evidence Clue Pedestal ───────────────────────────────────

interface SecretClueItem {
  id: number;
  title: string;
  memory: string;
  pos: [number, number, number];
}

function SecretCluePedestal({
  clue,
  isFound,
  onDiscover,
}: {
  clue: SecretClueItem;
  isFound: boolean;
  onDiscover: () => void;
}) {
  return (
    <group
      position={clue.pos}
      onClick={(e) => {
        e.stopPropagation();
        onDiscover();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onDiscover();
      }}
    >
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 1.0, 16]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>

      {/* Golden Clue Envelope / Folder */}
      <group position={[0, 1.15, 0]}>
        <Float speed={3} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.48, 0.08]} />
            <meshStandardMaterial
              color={isFound ? "#4ade80" : "#f59e0b"}
              metalness={0.7}
              roughness={0.2}
              emissive={isFound ? "#22c55e" : "#d97706"}
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.075}
            color="#09090b"
            fontWeight={900}
            anchorX="center"
          >
            {isFound ? "✓ CLUE FOUND" : "★ SECRET CLUE"}
          </Text>
        </Float>
      </group>

      {/* Pulsing Light Aura */}
      <pointLight
        position={[0, 1.2, 0]}
        color={isFound ? "#4ade80" : "#f59e0b"}
        intensity={1.5}
        distance={4}
      />
    </group>
  );
}

// ─── 3D First-Person Love Laser Blaster Model ───────────────────────

function FirstPersonBlaster({
  isFiring,
}: {
  isFiring: boolean;
}) {
  const blasterGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!blasterGroup.current) return;
    // Weapon sway & recoil animation
    if (isFiring) {
      blasterGroup.current.position.z = THREE.MathUtils.lerp(
        blasterGroup.current.position.z,
        -0.85,
        delta * 30
      );
      blasterGroup.current.rotation.x = THREE.MathUtils.lerp(
        blasterGroup.current.rotation.x,
        0.18,
        delta * 30
      );
    } else {
      blasterGroup.current.position.z = THREE.MathUtils.lerp(
        blasterGroup.current.position.z,
        -1.0,
        delta * 12
      );
      blasterGroup.current.rotation.x = THREE.MathUtils.lerp(
        blasterGroup.current.rotation.x,
        0,
        delta * 12
      );
    }
  });

  return (
    <group ref={blasterGroup} position={[0.32, -0.28, -1.0]}>
      {/* Sleek Blaster Body (Obsidian & Metallic Rose Gold) */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.18, 0.65]} />
        <meshStandardMaterial color="#881337" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Laser Barrel */}
      <mesh position={[0, 0.04, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.35, 12]} />
        <meshStandardMaterial color="#f43f5e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Energy Core Battery */}
      <mesh position={[0, 0.08, -0.05]}>
        <boxGeometry args={[0.1, 0.08, 0.28]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Ergonomic Grip */}
      <mesh position={[0, -0.16, 0.12]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.08, 0.22, 0.12]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>

      {/* Muzzle Flash Light when firing */}
      {isFiring && (
        <pointLight position={[0, 0.04, -0.65]} color="#f43f5e" intensity={4} distance={8} />
      )}
    </group>
  );
}

// ─── Main 3D Shooting Game Room ─────────────────────────────────────

interface ArenaVillain {
  id: number;
  type: "goblin" | "birdie" | "teddy" | "phantom";
  pos: [number, number, number];
}

export default function ShootingArenaRoom() {
  const { camera } = useThree();
  const [villainsDefeated, setVillainsDefeated] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [ammo, setAmmo] = useState<number>(12);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [defeatedIds, setDefeatedIds] = useState<Set<number>>(new Set());
  const [foundClueIds, setFoundClueIds] = useState<Set<number>>(new Set());
  const [activeCluePopup, setActiveCluePopup] = useState<SecretClueItem | null>(null);
  const [hitPopups, setHitPopups] = useState<{ id: number; text: string; pos: [number, number, number] }[]>([]);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 6 Nostalgic Investigation Clues across the Large 50m Arena
  const clues: SecretClueItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "CLUE #01: THE 1,540 KM TRUTH",
        memory: "Distance only proves how deep love is. 1,540 km between Kanpur and Bengaluru means nothing.",
        pos: [0, 0, 15],
      },
      {
        id: 2,
        title: "CLUE #02: PAUL SIR'S CLASS 9TH CLASSROOM",
        memory: "Two kids in the same tuition room who had no idea they'd become each other's entire universe.",
        pos: [18, 0, 12],
      },
      {
        id: 3,
        title: "CLUE #03: MIDNIGHT SCOOTY RIDES",
        memory: "The cold wind in her hair, holding onto Arnav tight, laughing under the streetlamps.",
        pos: [-18, 0, 12],
      },
      {
        id: 4,
        title: "CLUE #04: KULHAD78 CAFÉ FIRST PHOTO",
        memory: "Our first photo together as shy awkward friends. Look at us now, four years later.",
        pos: [18, 0, -15],
      },
      {
        id: 5,
        title: "CLUE #05: THE SACRED 11:11 WISH",
        memory: "Whenever the phone says 11:11, you whisper a wish for us.",
        pos: [-18, 0, -15],
      },
      {
        id: 6,
        title: "CLUE #06: OCTOBER 25TH 2003",
        memory: "The greatest day in history — Anshika Bajpai was born to light up the whole world.",
        pos: [0, 0, -20],
      },
    ],
    []
  );

  // 14 Roaming Cute Villains scattered across the vast 50m arena
  const villains: ArenaVillain[] = useMemo(
    () => [
      { id: 1, type: "goblin", pos: [-12, 3.2, -10] },
      { id: 2, type: "birdie", pos: [-6, 0.5, -8] },
      { id: 3, type: "teddy", pos: [0, 0.5, -12] },
      { id: 4, type: "phantom", pos: [8, 3.5, -14] },
      { id: 5, type: "goblin", pos: [14, 3.0, -8] },

      { id: 6, type: "birdie", pos: [-15, 0.5, 2] },
      { id: 7, type: "teddy", pos: [-8, 0.5, 5] },
      { id: 8, type: "phantom", pos: [0, 3.8, 4] },
      { id: 9, type: "birdie", pos: [8, 0.5, 6] },
      { id: 10, type: "goblin", pos: [16, 3.2, 2] },

      { id: 11, type: "teddy", pos: [-14, 0.5, 16] },
      { id: 12, type: "birdie", pos: [-5, 0.5, 18] },
      { id: 13, type: "phantom", pos: [6, 3.5, 18] },
      { id: 14, type: "goblin", pos: [14, 3.2, 16] },
    ],
    []
  );

  // Shoot Laser Function
  const handleShoot = useCallback(() => {
    if (ammo <= 0) {
      soundEngine.playTapeClick();
      // Auto-reload
      setTimeout(() => setAmmo(12), 800);
      return;
    }

    setAmmo((a) => a - 1);
    setIsFiring(true);
    soundEngine.playTargetPop();
    setTimeout(() => setIsFiring(false), 90);
  }, [ammo]);

  // Handle Clicking on Screen to Shoot
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't capture clicks on HUD UI buttons or modals
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("select") || target.closest("input")) return;
      handleShoot();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [handleShoot]);

  // Reload with [R] key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        soundEngine.playTapeClick();
        setAmmo(12);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Handle Hitting a Cute Villain
  const handleHitVillain = useCallback(
    (villain: ArenaVillain) => {
      if (defeatedIds.has(villain.id)) return;

      soundEngine.playTargetPop();

      // Floating hit text
      const phrases = ["POW! 💖", "AWWW! 🥺", "SLAYYY! ✨", "HEART! ♥", "CUTE! 👑"];
      const text = phrases[Math.floor(Math.random() * phrases.length)];
      const popupId = Date.now();
      setHitPopups((prev) => [...prev, { id: popupId, text, pos: villain.pos }]);
      setTimeout(() => {
        setHitPopups((prev) => prev.filter((p) => p.id !== popupId));
      }, 900);

      setScore((s) => s + 250);
      setVillainsDefeated((count) => {
        const next = count + 1;
        if (next >= 23 && !hasCelebrated) {
          setHasCelebrated(true);
          soundEngine.playCrowdCheer();
          soundEngine.playHappyBirthdayMelody();
          if (typeof window !== "undefined") {
            const secretAudio = new Audio(
              getAudioUrl("her_telling_me_how_much_and_deeply_she_loves_me.ogg")
            );
            audioRef.current = secretAudio;
            secretAudio.play().catch(() => {});
          }
        }
        return next;
      });

      // Mark defeated
      setDefeatedIds((prev) => new Set([...prev, villain.id]));

      // Respawn villain after 3.5 seconds so game is constantly lively
      setTimeout(() => {
        setDefeatedIds((prev) => {
          const next = new Set(prev);
          next.delete(villain.id);
          return next;
        });
      }, 3500);
    },
    [defeatedIds, hasCelebrated]
  );

  // Handle Discovering Clue
  const handleDiscoverClue = useCallback(
    (clue: SecretClueItem) => {
      if (!foundClueIds.has(clue.id)) {
        soundEngine.playWishStar();
        setScore((s) => s + 500);
        setFoundClueIds((prev) => new Set([...prev, clue.id]));
      }
      setActiveCluePopup(clue);
    },
    [foundClueIds]
  );

  return (
    <group>
      {/* ── Atmospheric Carnival & Noir Lighting ── */}
      <ambientLight intensity={0.9} color="#ede9fe" />
      <directionalLight position={[0, 30, 0]} intensity={1.5} color="#fffbeb" />

      {/* Colored Mood Spotlights */}
      <spotLight position={[-20, 18, -20]} intensity={2.5} color="#8b5cf6" distance={60} />
      <spotLight position={[20, 18, -20]} intensity={2.5} color="#f43f5e" distance={60} />
      <spotLight position={[0, 18, 20]} intensity={2.5} color="#facc15" distance={60} />

      {/* ── Vast 50m x 50m Arena Floor (Polished Noir Cobblestone) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[52, 52]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* ── Outer Perimeter Walls with Neon Arcades ── */}
      {/* Back Wall */}
      <mesh position={[0, 6, -26]}>
        <boxGeometry args={[52, 12, 1.0]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 6, 26]}>
        <boxGeometry args={[52, 12, 1.0]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-26, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[52, 12, 1.0]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[26, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[52, 12, 1.0]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
      </mesh>

      {/* ── Giant Neon Header Sign on Back Wall ── */}
      <group position={[0, 10.5, -25.4]}>
        <Text
          fontSize={1.2}
          color="#f43f5e"
          fontWeight={900}
          letterSpacing={0.2}
          anchorX="center"
        >
          🎯 CUTE TARGET CARNIVAL // HUNT 23 VILLAINS
        </Text>
        <Text
          position={[0, -1.1, 0]}
          fontSize={0.45}
          color="#fde047"
          fontWeight={800}
          anchorX="center"
        >
          {`VILLAINS DEFEATED: ${villainsDefeated} / 23 • CLUES FOUND: ${foundClueIds.size} / ${clues.length} • SCORE: ${score}`}
        </Text>
      </group>

      {/* ── Central Investigation Gazebo & Elevated Walkways ── */}
      {/* Central Platform */}
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[5.5, 6.0, 0.7, 24]} />
        <meshStandardMaterial color="#312e81" roughness={0.6} />
      </mesh>
      {/* Gazebo Roof */}
      <mesh position={[0, 4.8, 0]}>
        <coneGeometry args={[6.2, 2.2, 8]} />
        <meshStandardMaterial color="#e11d48" roughness={0.4} />
      </mesh>
      {/* Gazebo Pillars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const rad = (i * Math.PI * 2) / 8;
        return (
          <mesh key={i} position={[Math.sin(rad) * 4.8, 2.4, Math.cos(rad) * 4.8]}>
            <cylinderGeometry args={[0.15, 0.18, 4.5, 10]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} />
          </mesh>
        );
      })}

      {/* ── Multi-Level Walkways & Elevated Sniper Ramps ── */}
      {/* North Elevated Skywalk */}
      <mesh position={[0, 3.2, -18]}>
        <boxGeometry args={[26, 0.3, 4.2]} />
        <meshStandardMaterial color="#4338ca" roughness={0.6} />
      </mesh>
      {/* East Elevated Skywalk */}
      <mesh position={[18, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[26, 0.3, 4.2]} />
        <meshStandardMaterial color="#4338ca" roughness={0.6} />
      </mesh>
      {/* West Elevated Skywalk */}
      <mesh position={[-18, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[26, 0.3, 4.2]} />
        <meshStandardMaterial color="#4338ca" roughness={0.6} />
      </mesh>

      {/* ── 3D Cute Villains ── */}
      {villains.map((v) => {
        const isDef = defeatedIds.has(v.id);
        if (v.type === "goblin") {
          return (
            <OverthinkingGoblin
              key={v.id}
              position={v.pos}
              isDefeated={isDef}
              onHit={() => handleHitVillain(v)}
            />
          );
        }
        if (v.type === "birdie") {
          return (
            <AngryBirdieVillain
              key={v.id}
              position={v.pos}
              isDefeated={isDef}
              onHit={() => handleHitVillain(v)}
            />
          );
        }
        if (v.type === "teddy") {
          return (
            <BanditTeddyVillain
              key={v.id}
              position={v.pos}
              isDefeated={isDef}
              onHit={() => handleHitVillain(v)}
            />
          );
        }
        return (
          <DistancePhantomVillain
            key={v.id}
            position={v.pos}
            isDefeated={isDef}
            onHit={() => handleHitVillain(v)}
          />
        );
      })}

      {/* ── 6 Secret Clue Pedestals ── */}
      {clues.map((clue) => (
        <SecretCluePedestal
          key={clue.id}
          clue={clue}
          isFound={foundClueIds.has(clue.id)}
          onDiscover={() => handleDiscoverClue(clue)}
        />
      ))}

      {/* ── Floating Hit Popups ("POW!", "HEART!") ── */}
      {hitPopups.map((p) => (
        <group key={p.id} position={[p.pos[0], p.pos[1] + 1.2, p.pos[2]]}>
          <Float speed={4} floatIntensity={1.2}>
            <Text
              fontSize={0.42}
              color="#fde047"
              fontWeight={900}
              anchorX="center"
            >
              {p.text}
            </Text>
          </Float>
        </group>
      ))}

      {/* ── Grand Celebration Victory Banner ── */}
      {villainsDefeated >= 23 && (
        <group position={[0, 6.5, 0]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.9}
              color="#fde047"
              fontWeight={900}
              anchorX="center"
            >
              🎉 23 VILLAINS DEFEATED! YOU WON! 🎉
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.42}
              color="#38bdf8"
              fontWeight={700}
              anchorX="center"
            >
              SECRET LOVE AUDIO TAPE UNLOCKED & PLAYING!
            </Text>
          </Float>
        </group>
      )}

      {/* ── First-Person Weapon attached to Camera View ── */}
      <FirstPersonBlaster isFiring={isFiring} />

      {/* ── Return Door leading back to Archive Hub ── */}
      <Door
        position={[0, 1.6, 24.5]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </group>
  );
}

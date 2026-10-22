"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Html } from "@react-three/drei";
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
  const recoilOffset = useRef(0);
  const recoilAngle = useRef(0);

  useFrame(({ camera }, delta) => {
    if (!blasterGroup.current) return;

    // Recoil kickback recovery
    if (isFiring) {
      recoilOffset.current = 0.12;
      recoilAngle.current = 0.15;
    } else {
      recoilOffset.current = THREE.MathUtils.lerp(recoilOffset.current, 0, delta * 16);
      recoilAngle.current = THREE.MathUtils.lerp(recoilAngle.current, 0, delta * 16);
    }

    // Attach blaster to camera position and orientation in real-time
    blasterGroup.current.position.copy(camera.position);
    blasterGroup.current.quaternion.copy(camera.quaternion);

    // Local FPS offset relative to camera
    blasterGroup.current.translateZ(-0.75 + recoilOffset.current);
    blasterGroup.current.translateX(0.3);
    blasterGroup.current.translateY(-0.24);
    blasterGroup.current.rotateX(recoilAngle.current);
  });

  return (
    <group ref={blasterGroup}>
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
  const { camera, gl } = useThree();
  const [villainsDefeated, setVillainsDefeated] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [ammo, setAmmo] = useState<number>(12);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [defeatedIds, setDefeatedIds] = useState<Set<number>>(new Set());
  const [foundClueIds, setFoundClueIds] = useState<Set<number>>(new Set());
  const [activeCluePopup, setActiveCluePopup] = useState<SecretClueItem | null>(null);
  const [hitPopups, setHitPopups] = useState<{ id: number; text: string; pos: [number, number, number] }[]>([]);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [hitMarkerActive, setHitMarkerActive] = useState<boolean>(false);
  const [anshikaVoiceSubtitle, setAnshikaVoiceSubtitle] = useState<string | null>(null);

  const playerRadarRef = useRef<SVGGElement>(null);
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

  // Sync Pointer Lock State
  useEffect(() => {
    const handleLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === gl.domElement);
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, [gl]);

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

  // Handle Hitting a Cute Villain
  const handleHitVillain = useCallback(
    (villain: ArenaVillain) => {
      if (defeatedIds.has(villain.id)) return;

      soundEngine.playVillainDefeated();

      // Trigger authentic cute voice note from Anshika!
      soundEngine.playRandomCuteVoiceNote((subtitle) => {
        setAnshikaVoiceSubtitle(subtitle);
        setTimeout(() => {
          setAnshikaVoiceSubtitle((prev) => (prev === subtitle ? null : prev));
        }, 3600);
      });

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

  // Shoot Laser Function with First-Person Center Raycasting
  const handleShoot = useCallback(() => {
    if (ammo <= 0) {
      soundEngine.playTapeClick();
      // Auto-reload
      setTimeout(() => setAmmo(12), 800);
      return;
    }

    setAmmo((a) => a - 1);
    setIsFiring(true);
    soundEngine.playLaserBlaster();
    setTimeout(() => setIsFiring(false), 90);

    // ── 3D FPS Crosshair Raycast Aiming ──
    const camPos = camera.position;
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.normalize();

    // 1. Raycast Cute Villains
    let hitVillain: ArenaVillain | null = null;
    let closestDist = 52;

    villains.forEach((v) => {
      if (defeatedIds.has(v.id)) return;
      const vPos = new THREE.Vector3(...v.pos);
      const toV = vPos.clone().sub(camPos);
      const proj = toV.dot(camDir);
      if (proj > 0.4 && proj < closestDist) {
        const closestPoint = camPos.clone().add(camDir.clone().multiplyScalar(proj));
        // Generous, satisfying 1.45m aim cone
        if (closestPoint.distanceTo(vPos) < 1.45) {
          closestDist = proj;
          hitVillain = v;
        }
      }
    });

    if (hitVillain) {
      handleHitVillain(hitVillain);
      setHitMarkerActive(true);
      setTimeout(() => setHitMarkerActive(false), 160);
      return;
    }

    // 2. Raycast Secret Clue Pedestals
    clues.forEach((clue) => {
      const cPos = new THREE.Vector3(...clue.pos);
      const toC = cPos.clone().sub(camPos);
      const proj = toC.dot(camDir);
      if (proj > 0.4 && proj < 35) {
        const closestPoint = camPos.clone().add(camDir.clone().multiplyScalar(proj));
        if (closestPoint.distanceTo(cPos) < 1.8) {
          handleDiscoverClue(clue);
        }
      }
    });
  }, [ammo, camera, villains, defeatedIds, clues, handleHitVillain, handleDiscoverClue]);

  // Handle Clicking on Screen to Lock Pointer & Shoot
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("select") ||
        target.closest("input") ||
        target.closest(".no-lock")
      ) {
        return;
      }

      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      } else {
        handleShoot();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [gl, handleShoot]);

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

  // Update Mini-Map Radar Player Marker every frame with zero React re-render overhead
  useFrame(() => {
    if (playerRadarRef.current) {
      const rx = 90 + (camera.position.x / 26) * 72;
      const ry = 90 + (camera.position.z / 26) * 72;
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const deg = Math.atan2(dir.x, -dir.z) * (180 / Math.PI);
      playerRadarRef.current.setAttribute(
        "transform",
        `translate(${rx.toFixed(1)}, ${ry.toFixed(1)}) rotate(${deg.toFixed(1)})`
      );
    }
  });

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

      {/* ── 3D FPS Crosshair, Voice Note Subtitles, and 52m Tactical Radar ── */}
      <Html fullscreen style={{ pointerEvents: "none" }}>
        {/* 1. Tactical FPS Crosshair (Always Centered) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isFiring ? 46 : 32,
            height: isFiring ? 46 : 32,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.08s ease, height 0.08s ease",
            zIndex: 40,
          }}
        >
          {/* Outer Crosshair Ticks */}
          <div
            style={{
              position: "absolute",
              top: 0,
              width: 2,
              height: 8,
              background: hitMarkerActive ? "#ef4444" : "#f43f5e",
              boxShadow: hitMarkerActive ? "0 0 8px #ef4444" : "0 0 6px #f43f5e",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: 2,
              height: 8,
              background: hitMarkerActive ? "#ef4444" : "#f43f5e",
              boxShadow: hitMarkerActive ? "0 0 8px #ef4444" : "0 0 6px #f43f5e",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              height: 2,
              width: 8,
              background: hitMarkerActive ? "#ef4444" : "#f43f5e",
              boxShadow: hitMarkerActive ? "0 0 8px #ef4444" : "0 0 6px #f43f5e",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              height: 2,
              width: 8,
              background: hitMarkerActive ? "#ef4444" : "#f43f5e",
              boxShadow: hitMarkerActive ? "0 0 8px #ef4444" : "0 0 6px #f43f5e",
            }}
          />
          {/* Center Precision Aim Dot */}
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: hitMarkerActive ? "#ffffff" : "#fde047",
              boxShadow: hitMarkerActive ? "0 0 8px #ffffff" : "0 0 4px #fde047",
            }}
          />

          {/* Hitmarker Flash X */}
          {hitMarkerActive && (
            <div
              style={{
                position: "absolute",
                fontSize: "1.1rem",
                color: "#ef4444",
                fontWeight: 900,
                textShadow: "0 0 10px #ef4444",
                animation: "pulse 0.15s ease-out",
              }}
            >
              ✕
            </div>
          )}
        </div>

        {/* 2. Authentic Voice Note Subtitle Speech Toast (Top Center) */}
        {anshikaVoiceSubtitle && (
          <div
            style={{
              position: "absolute",
              top: "4.8rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.65rem 1.4rem",
              background: "rgba(136, 19, 55, 0.92)",
              border: `1.5px solid #f43f5e`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 18px rgba(244,63,94,0.4)",
              borderRadius: 8,
              backdropFilter: "blur(10px)",
              fontFamily: "var(--font-geist-mono), monospace",
              zIndex: 65,
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>💖</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#fecdd3",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  fontWeight: 800,
                }}
              >
                ANSHIKA VOICE NOTE // ARCHIVE MEMORY
              </span>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {anshikaVoiceSubtitle}
              </span>
            </div>
          </div>
        )}

        {/* 3. Pointer Lock Status & Mouse Aim Hint */}
        {!isPointerLocked && (
          <div
            style={{
              position: "absolute",
              top: "7.8rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(9, 9, 15, 0.85)",
              border: `1px solid ${THEME.evidence.primary}`,
              borderRadius: 6,
              padding: "0.45rem 1rem",
              fontSize: "0.62rem",
              color: THEME.evidence.primary,
              letterSpacing: "0.14em",
              fontWeight: 800,
              zIndex: 40,
              backdropFilter: "blur(8px)",
              pointerEvents: "none",
            }}
          >
            🎯 CLICK SCREEN TO LOCK MOUSE AIM // [ESC] TO UNLOCK
          </div>
        )}

        {/* 4. Tactical Arena Radar Mini-Map (Bottom Left) */}
        <div
          style={{
            position: "absolute",
            bottom: "1.2rem",
            left: "1.2rem",
            background: "rgba(9, 9, 15, 0.92)",
            border: `1.5px solid ${THEME.evidence.primary}99`,
            borderRadius: 8,
            boxShadow: "0 12px 36px rgba(0,0,0,0.85), inset 0 0 12px rgba(250,204,21,0.06)",
            backdropFilter: "blur(10px)",
            padding: "0.65rem 0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            zIndex: 50,
            fontFamily: "var(--font-geist-mono), monospace",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.55rem" }}>
            <span style={{ color: THEME.evidence.primary, fontWeight: 800, letterSpacing: "0.15em" }}>
              ARENA RADAR // 50M
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.5rem", fontWeight: 700 }}>● SCAN ACTIVE</span>
          </div>

          {/* SVG Radar Map */}
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ background: "#050508", borderRadius: 4 }}>
            {/* Radar Grid Circles */}
            <circle cx="90" cy="90" r="82" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="90" cy="90" r="54" fill="none" stroke="#18181b" strokeWidth="1" />
            <circle cx="90" cy="90" r="26" fill="none" stroke="#18181b" strokeWidth="1" />
            <line x1="90" y1="8" x2="90" y2="172" stroke="#18181b" strokeWidth="1" />
            <line x1="8" y1="90" x2="172" y2="90" stroke="#18181b" strokeWidth="1" />

            {/* Arena Outer Boundary Perimeter (52m x 52m) */}
            <rect x="18" y="18" width="144" height="144" fill="none" stroke="#4338ca" strokeWidth="1.5" />

            {/* Central Gazebo */}
            <circle cx="90" cy="90" r="15" fill="#312e81" stroke="#f59e0b" strokeWidth="1" fillOpacity="0.6" />

            {/* Skywalks */}
            <rect x="54" y="38" width="72" height="10" fill="#4338ca" fillOpacity="0.4" />
            <rect x="134" y="54" width="10" height="72" fill="#4338ca" fillOpacity="0.4" />
            <rect x="36" y="54" width="10" height="72" fill="#4338ca" fillOpacity="0.4" />

            {/* 6 Clue Pedestals (Stars) */}
            {clues.map((c) => {
              const cx = 90 + (c.pos[0] / 26) * 72;
              const cy = 90 + (c.pos[2] / 26) * 72;
              const isFound = foundClueIds.has(c.id);
              return (
                <circle
                  key={c.id}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill={isFound ? "#4ade80" : "#f59e0b"}
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}

            {/* 14 Cute Villains as Radar Blips */}
            {villains.map((v) => {
              if (defeatedIds.has(v.id)) return null;
              const vx = 90 + (v.pos[0] / 26) * 72;
              const vy = 90 + (v.pos[2] / 26) * 72;
              const col =
                v.type === "goblin"
                  ? "#a855f7"
                  : v.type === "birdie"
                  ? "#f43f5e"
                  : v.type === "teddy"
                  ? "#f59e0b"
                  : "#38bdf8";
              return <circle key={v.id} cx={vx} cy={vy} r="2.8" fill={col} />;
            })}

            {/* Real-time Player Position & View Cone */}
            <g ref={playerRadarRef} transform="translate(90, 90)">
              <polygon points="0,-18 10,-30 -10,-30" fill="#facc15" fillOpacity="0.2" />
              <circle r="5" fill="#facc15" />
              <polygon points="0,-8 3,3 0,1 -3,3" fill="#ffffff" />
            </g>
          </svg>

          {/* Telemetry Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.52rem", color: "#a1a1aa" }}>
            <span>
              AMMO: <strong style={{ color: "#38bdf8" }}>{ammo} / 12</strong>
            </span>
            <span>
              VILLAINS: <strong style={{ color: "#f43f5e" }}>{villainsDefeated} / 23</strong>
            </span>
            <span>
              CLUES: <strong style={{ color: "#4ade80" }}>{foundClueIds.size} / 6</strong>
            </span>
          </div>
        </div>
      </Html>

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

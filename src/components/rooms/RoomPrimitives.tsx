"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { RoomState } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { THEME } from "@/lib/theme";

// ─── Shared materials (Murder/Mystery archive theme) ─────────────
const STONE_COLOR = new THREE.Color(THEME.noir.surface);
const WOOD_COLOR = new THREE.Color(THEME.folder.desk);
const WARM_LIGHT = new THREE.Color("#fef3c7");
const ACCENT_GOLD = new THREE.Color(THEME.evidence.primary);
const CLASSIFIED_RED = new THREE.Color(THEME.classified.stamp);

/**
 * Procedural room base — dark detective stone floor, walls, and warm ambient lighting.
 * Every room extends this with its own props and interactables.
 */
export function RoomShell({
  children,
  width = 16,
  depth = 16,
  height = 6,
}: {
  children?: React.ReactNode;
  width?: number;
  depth?: number;
  height?: number;
}) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={STONE_COLOR}
          roughness={0.95}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Warm ambient detective / Westworld saloon illumination (bright & atmospheric) */}
      <ambientLight intensity={0.72} color="#fff0db" />

      {/* Key light — warm directional sunlight / overhead lantern */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.15}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Warm Golden Fill light */}
      <pointLight position={[0, 4.5, 0]} intensity={0.8} color="#ffb35a" distance={24} />

      {/* Westworld Wall Sconces with flickering candle lanterns along side walls */}
      <WestworldWallSconce
        position={[-width / 2 + 0.08, 2.8, -depth / 4]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WestworldWallSconce
        position={[-width / 2 + 0.08, 2.8, depth / 4]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WestworldWallSconce
        position={[width / 2 - 0.08, 2.8, -depth / 4]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <WestworldWallSconce
        position={[width / 2 - 0.08, 2.8, depth / 4]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {children}
    </group>
  );
}

/**
 * WestworldEdisonBulb — Vintage hanging tungsten filament bulb with brass cage.
 */
export function WestworldEdisonBulb({
  position,
  cordLength = 1.4,
}: {
  position: [number, number, number];
  cordLength?: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 4 + position[0]) * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Hanging Cord from above */}
      <mesh position={[0, cordLength / 2, 0]}>
        <cylinderGeometry args={[0.007, 0.007, cordLength, 8]} />
        <meshStandardMaterial color="#1a140f" roughness={0.9} />
      </mesh>
      {/* Vintage Brass Socket */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.14, 16]} />
        <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Teardrop Glass Bulb */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshPhysicalMaterial
          color="#fff8e7"
          transmission={0.9}
          opacity={0.35}
          transparent
          roughness={0.06}
          ior={1.5}
        />
      </mesh>
      {/* Glowing Tungsten Coil */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
        <meshBasicMaterial color="#ff9922" />
      </mesh>
      {/* Protective Brass Cage Wireframe */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[0, -0.05, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.18, 6]} />
          <meshStandardMaterial color="#9c7a38" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Tungsten Warm Glow Light */}
      <pointLight
        ref={lightRef}
        position={[0, -0.06, 0]}
        intensity={1.5}
        color="#ffab3d"
        distance={7}
        decay={2}
      />
    </group>
  );
}

/**
 * WestworldCandleLantern — Ivory beeswax candle inside blown glass hurricane shade.
 */
export function WestworldCandleLantern({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 3.14;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 14) * 0.18;
      flameRef.current.scale.x = 1 + Math.cos(t * 22) * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 + Math.sin(t * 12) * 0.25 + Math.cos(t * 24) * 0.12;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Antique Brass Base Dish */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.04, 20]} />
        <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Hurricane Glass Cylinder */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          opacity={0.3}
          transparent
          roughness={0.08}
          ior={1.48}
        />
      </mesh>
      {/* Ivory Beeswax Candle Pillar */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.075, 0.26, 16]} />
        <meshStandardMaterial color="#fffbe8" roughness={0.6} />
      </mesh>
      {/* Candle Wick */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
        <meshStandardMaterial color="#1a140f" roughness={0.9} />
      </mesh>
      {/* Glowing Teardrop Flame */}
      <mesh ref={flameRef} position={[0, 0.37, 0]}>
        <coneGeometry args={[0.028, 0.08, 12]} />
        <meshBasicMaterial color="#ff9e22" />
      </mesh>
      {/* Warm Flickering Candle Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.38, 0]}
        intensity={1.6}
        color="#ffa336"
        distance={6}
        decay={2}
      />
    </group>
  );
}

/**
 * WestworldWallSconce — Cast iron wall bracket holding a hurricane candle lantern.
 */
export function WestworldWallSconce({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cast Iron Wall Mounting Plate */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.14, 0.36, 0.03]} />
        <meshStandardMaterial color="#1c1611" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Forged Iron Curved Arm projecting outward */}
      <mesh position={[0, -0.06, 0.15]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#1c1611" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Candle Lantern seated on sconce bracket */}
      <WestworldCandleLantern position={[0, 0.05, 0.26]} scale={0.8} />
    </group>
  );
}

/**
 * Door — procedural archive vault entrance with evidence yellow plaque and classified red stamp.
 */
export function Door({
  position,
  rotation = [0, 0, 0],
  label,
  targetRoom,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  targetRoom: RoomState;
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    glowRef.current += delta;
    const emissiveIntensity = 0.08 + Math.sin(glowRef.current * 2) * 0.04;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = emissiveIntensity;
  });

  return (
    <InteractableObject
      id={`door-${targetRoom}`}
      type="door"
      position={position}
      interactionPrompt={`ENTER ${label}`}
      onInteract={() => enterRoom(targetRoom)}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Door frame — heavy dark mahogany */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 3.2, 0.2]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Door opening (dark noir mystery portal) */}
        <mesh ref={meshRef} position={[0, 0, 0.05]}>
          <boxGeometry args={[1.4, 2.8, 0.15]} />
          <meshStandardMaterial
            color={THEME.noir.pitch}
            roughness={0.95}
            emissive={CLASSIFIED_RED}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Evidence Caution Yellow Header Plaque */}
        <mesh position={[0, 1.88, 0.12]}>
          <planeGeometry args={[1.65, 0.38]} />
          <meshStandardMaterial
            color={THEME.evidence.primary}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 1.88, 0.13]}
          fontSize={0.12}
          color="#080605"
          fontWeight={700}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          maxWidth={1.5}
        >
          {label}
        </Text>

        {/* Red Classified Stamp on door lintel */}
        <Text
          position={[0, 1.5, 0.11]}
          fontSize={0.065}
          color={THEME.classified.bright}
          fontWeight={700}
          anchorX="center"
          letterSpacing={0.25}
        >
          RESTRICTED ARCHIVE
        </Text>

        {/* Warm light above door */}
        <pointLight
          position={[0, 1.6, 0.5]}
          intensity={0.4}
          color={WARM_LIGHT}
          distance={5}
          decay={2}
        />
      </group>
    </InteractableObject>
  );
}

/**
 * Pedestal — a display stand for evidence artifacts.
 */
export function Pedestal({
  position,
  children,
}: {
  position: [number, number, number];
  children?: React.ReactNode;
}) {
  return (
    <group position={position}>
      {/* Heavy stone base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 8]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Manila/Wood Top platform */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 8]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Content above pedestal */}
      <group position={[0, 1.0, 0]}>{children}</group>
    </group>
  );
}

/**
 * EvidenceMarker — Crime scene style yellow A-frame numbered marker.
 */
export function EvidenceMarker({
  number,
  position,
  rotation = [0, 0, 0],
}: {
  number: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Yellow A-frame marker tent body */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <coneGeometry args={[0.18, 0.28, 4]} />
        <meshStandardMaterial
          color={THEME.evidence.primary}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Front Face Number */}
      <Text
        position={[0, 0.12, 0.11]}
        rotation={[-0.32, 0, 0]}
        fontSize={0.11}
        color="#080605"
        fontWeight={800}
        anchorX="center"
        anchorY="middle"
      >
        {number}
      </Text>
      {/* Back Face Number */}
      <Text
        position={[0, 0.12, -0.11]}
        rotation={[0.32, Math.PI, 0]}
        fontSize={0.11}
        color="#080605"
        fontWeight={800}
        anchorX="center"
        anchorY="middle"
      >
        {number}
      </Text>
    </group>
  );
}

export {
  STONE_COLOR,
  WOOD_COLOR,
  WARM_LIGHT,
  ACCENT_GOLD,
  CLASSIFIED_RED,
};

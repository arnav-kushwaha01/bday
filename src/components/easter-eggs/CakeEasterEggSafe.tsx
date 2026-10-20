"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { soundEngine } from "@/engine/audio/AudioManager";

const STEEL_DARK = new THREE.Color("#1c1917");
const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const CAUTION_YELLOW = THEME.evidence.primary;

/**
 * CakeEasterEggSafe — A secret archival evidence safe in the Hub Room.
 * Houses Easter Egg #1: "THE CAKE" (ee-cake).
 */
export function CakeEasterEggSafe({
  position = [0, 0, -9.4],
}: {
  position?: [number, number, number];
}) {
  const dialRef = useRef<THREE.Group>(null);
  const unlockEasterEgg = useAppStore((s) => s.unlockEasterEgg);
  const openMemory = useTransitionStore((s) => s.openMemory);
  const isDiscovered = useAppStore((s) => s.discoveredEasterEggs.includes("ee-cake"));

  useFrame(({ clock }) => {
    if (dialRef.current) {
      // Subtle rotation tick of the combination dial
      dialRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.3;
    }
  });

  const handleInteract = () => {
    soundEngine.playSafeUnlock();
    unlockEasterEgg("ee-cake");
    openMemory("ee-cake");
  };

  return (
    <group position={position}>
      {/* Heavy Steel Archival Safe Body */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.4, 0.65]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.65} metalness={0.6} />
      </mesh>

      {/* Heavy Beveled Door Frame */}
      <mesh position={[0, 0.7, 0.33]} castShadow>
        <boxGeometry args={[0.95, 1.25, 0.04]} />
        <meshStandardMaterial color="#14110e" roughness={0.7} metalness={0.7} />
      </mesh>

      {/* Brass Hinges */}
      {[-0.45, 0.45].map((y, idx) => (
        <mesh key={idx} position={[-0.46, 0.7 + y, 0.34]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
      ))}

      {/* Combination Dial Assembly */}
      <group position={[0.08, 0.75, 0.36]} ref={dialRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.04, 24]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#080605" roughness={0.5} />
        </mesh>
      </group>

      {/* Heavy T-Bar Locking Handle */}
      <group position={[0.08, 0.5, 0.37]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Diagonal Caution / Classified Tape across door */}
      <mesh position={[0, 0.7, 0.355]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[1.3, 0.08]} />
        <meshStandardMaterial
          color={isDiscovered ? "#22c55e" : CAUTION_YELLOW}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, 0.7, 0.36]}
        rotation={[0, 0, 0.4]}
        fontSize={0.042}
        color="#080605"
        fontWeight={900}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {isDiscovered ? "UNLOCKED // 23RD BIRTHDAY CAKE" : "CONFIDENTIAL // RESTRICTED ACCESS"}
      </Text>

      {/* Small Evidence Marker Beside Safe */}
      <group position={[0.75, 0, 0.2]}>
        <mesh position={[0, 0.12, 0]} rotation={[0, -0.3, 0]} castShadow>
          <coneGeometry args={[0.1, 0.24, 3]} />
          <meshStandardMaterial color={CAUTION_YELLOW} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 0.12, 0.08]}
          rotation={[0, -0.3, 0]}
          fontSize={0.065}
          color="#080605"
          fontWeight={900}
          anchorX="center"
          anchorY="middle"
        >
          ?
        </Text>
      </group>

      {/* Warm Glow Light */}
      <pointLight
        position={[0, 0.8, 0.6]}
        intensity={0.4}
        color={isDiscovered ? "#86efac" : "#fde047"}
        distance={2.5}
      />

      {/* Interactable Safe Object */}
      <InteractableObject
        id="ee-cake"
        type="object"
        position={[0, 0.7, 0.35]}
        interactionPrompt={
          isDiscovered
            ? "[E] VIEW 23RD BIRTHDAY CAKE DOSSIER"
            : "[E] UNLOCK SECRET ARCHIVE SAFE"
        }
        onInteract={handleInteract}
        radius={2.8}
        showMarker={true}
      >
        <mesh visible={false}>
          <boxGeometry args={[1.2, 1.5, 0.8]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </InteractableObject>
    </group>
  );
}

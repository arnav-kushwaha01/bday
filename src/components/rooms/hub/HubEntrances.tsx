"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { THEME } from "@/lib/theme";

// Shared materials for architectural entrances
const BRASS_GOLD = new THREE.Color("#c4a35a");
const DARK_STEEL = new THREE.Color("#161413");
const MAHOGANY_WOOD = new THREE.Color(THEME.folder.desk);
const WARM_LAMP = new THREE.Color("#fef3c7");

// ─────────────────────────────────────────────────────────────────
// 1. ARCHED CORRIDOR ENTRANCE — Leading to HER GALLERY
// ─────────────────────────────────────────────────────────────────
export function CorridorEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-her-gallery"
      type="door"
      position={position}
      interactionPrompt="ENTER HER GALLERY [CORRIDOR]"
      onInteract={() => enterRoom("HER_GALLERY")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Outer Stone Archway */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.2, 3.6, 0.3]} />
          <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.7} />
        </mesh>

        {/* Recessed Corridor Tunnel Segments (giving deep perspective) */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 1.6, -0.4 - i * 0.7]}>
            {/* Arch ribs */}
            <mesh>
              <boxGeometry args={[1.7 - i * 0.05, 3.1 - i * 0.05, 0.1]} />
              <meshStandardMaterial color="#0d0b0a" roughness={0.9} />
            </mesh>
            {/* Wall sconce lights along corridor */}
            <pointLight
              position={[0.7, 0.4, 0]}
              intensity={0.25}
              color={WARM_LAMP}
              distance={2}
            />
            <pointLight
              position={[-0.7, 0.4, 0]}
              intensity={0.25}
              color={WARM_LAMP}
              distance={2}
            />
          </group>
        ))}

        {/* Corridor End Darkness with subtle warm haze */}
        <mesh position={[0, 1.5, -2.5]}>
          <planeGeometry args={[1.5, 2.8]} />
          <meshStandardMaterial
            color="#050403"
            emissive={THEME.evidence.primary}
            emissiveIntensity={0.06}
          />
        </mesh>

        {/* Evidence Yellow Plaque */}
        <mesh position={[0, 2.1, 0.16]}>
          <planeGeometry args={[1.8, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 2.1, 0.17]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          [01] HER GALLERY
        </Text>
        <Text
          position={[0, 1.7, 0.16]}
          fontSize={0.06}
          color={THEME.classified.bright}
          fontWeight={700}
          anchorX="center"
          letterSpacing={0.25}
        >
          MEMORIAL CORRIDOR
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 2. VINTAGE CAGE ELEVATOR — Leading to VERSIONS OF HER
// ─────────────────────────────────────────────────────────────────
export function ElevatorEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);
  const arrowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (arrowRef.current) {
      arrowRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.35;
    }
  });

  return (
    <InteractableObject
      id="entrance-versions"
      type="door"
      position={position}
      interactionPrompt="ENTER ELEVATOR [VERSIONS OF HER]"
      onInteract={() => enterRoom("VERSIONS")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Elevator Exterior Frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.2, 3.6, 0.25]} />
          <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.6} />
        </mesh>

        {/* Vintage Brass Floor Indicator Dial (Semicircle above cage) */}
        <group position={[0, 3.2, 0.14]}>
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 0.04, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0.18, 0.03]}
            fontSize={0.065}
            color="#080605"
            fontWeight={800}
            letterSpacing={0.15}
          >
            B2 • B1 • G • 1 • 2
          </Text>
          {/* Dial Needle */}
          <mesh ref={arrowRef} position={[0, 0, 0.035]}>
            <boxGeometry args={[0.02, 0.25, 0.01]} />
            <meshStandardMaterial color={THEME.classified.stamp} />
          </mesh>
        </group>

        {/* Scissor Gate Grille / Vertical Brass Bars */}
        {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 1.5, 0.08]}>
            <cylinderGeometry args={[0.015, 0.015, 2.6, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Elevator Interior Chamber */}
        <mesh position={[0, 1.5, -0.6]}>
          <boxGeometry args={[1.6, 2.8, 1.2]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.9} />
        </mesh>
        {/* Overhead amber cage bulb */}
        <pointLight position={[0, 2.6, -0.4]} intensity={0.45} color={WARM_LAMP} distance={4} />

        {/* Yellow Plaque */}
        <mesh position={[0, 2.1, 0.16]}>
          <planeGeometry args={[1.8, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 2.1, 0.17]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          [02] VERSIONS OF HER
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 3. HEAVY STEEL VAULT DOOR — Leading to EVIDENCE ROOM
// ─────────────────────────────────────────────────────────────────
export function VaultDoorEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = Math.sin(Date.now() * 0.0006) * 0.2;
    }
  });

  return (
    <InteractableObject
      id="entrance-evidence"
      type="door"
      position={position}
      interactionPrompt="UNSEAL EVIDENCE VAULT"
      onInteract={() => enterRoom("EVIDENCE")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Reinforced Vault Wall Frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.4, 3.6, 0.35]} />
          <meshStandardMaterial color={DARK_STEEL} metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Circular Heavy Vault Door */}
        <mesh position={[0, 1.6, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 32]} />
          <meshStandardMaterial color="#262220" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Combination Spoke Wheel */}
        <group ref={wheelRef} position={[0, 1.6, 0.24]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Spoke handles */}
          {[0, 1, 2, 3].map((s) => (
            <mesh key={s} rotation={[0, 0, (s * Math.PI) / 4]}>
              <boxGeometry args={[0.7, 0.04, 0.04]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Yellow Caution Tape Stencil */}
        <mesh position={[0, 1.6, 0.22]} rotation={[0, 0, -0.4]}>
          <planeGeometry args={[1.4, 0.2]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.5} />
        </mesh>
        <Text
          position={[0, 1.6, 0.23]}
          rotation={[0, 0, -0.4]}
          fontSize={0.065}
          color="#080605"
          fontWeight={800}
          letterSpacing={0.2}
        >
          EVIDENCE ROOM // EYES ONLY
        </Text>

        {/* Yellow Plaque */}
        <mesh position={[0, 3.2, 0.2]}>
          <planeGeometry args={[1.9, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 3.2, 0.21]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.15}
        >
          [03] EVIDENCE ROOM
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 4. PANORAMIC OBSERVATION WINDOW — Leading to THE DISTANCE
// ─────────────────────────────────────────────────────────────────
export function WindowPortalEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-distance"
      type="door"
      position={position}
      interactionPrompt="LOOK THROUGH WINDOW [THE DISTANCE]"
      onInteract={() => enterRoom("DISTANCE")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Stone Arch Window Casing */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.4, 3.6, 0.3]} />
          <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.7} />
        </mesh>

        {/* Deep Bay Sill */}
        <mesh position={[0, 0.6, 0.2]} castShadow>
          <boxGeometry args={[2.2, 0.2, 0.6]} />
          <meshStandardMaterial color="#1f1a16" roughness={0.6} />
        </mesh>

        {/* Starry Night Sky Horizon (View into deep space/distance) */}
        <mesh position={[0, 1.9, -0.2]}>
          <planeGeometry args={[1.8, 2.5]} />
          <meshStandardMaterial
            color="#05070c"
            emissive="#1e3a8a"
            emissiveIntensity={0.25}
            roughness={0.2}
          />
        </mesh>

        {/* Window Mullions / Grids */}
        <mesh position={[0, 1.9, -0.18]}>
          <boxGeometry args={[0.04, 2.5, 0.04]} />
          <meshStandardMaterial color="#14110f" />
        </mesh>
        <mesh position={[0, 1.9, -0.18]}>
          <boxGeometry args={[1.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#14110f" />
        </mesh>

        {/* Distance Coordinates Inscription */}
        <Text
          position={[0, 0.72, 0.4]}
          rotation={[-0.4, 0, 0]}
          fontSize={0.06}
          color={THEME.evidence.primary}
          fontWeight={700}
          letterSpacing={0.25}
        >
          GLOBAL DISTANCE OBSERVATORY
        </Text>

        {/* Yellow Plaque */}
        <mesh position={[0, 3.25, 0.16]}>
          <planeGeometry args={[1.8, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 3.25, 0.17]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.15}
        >
          [04] THE DISTANCE
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 5. SECRET ARCHIVE BOOKCASE — Leading to LITTLE THINGS
// ─────────────────────────────────────────────────────────────────
export function BookcaseEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-little-things"
      type="door"
      position={position}
      interactionPrompt="REVOLVE SECRET BOOKCASE [LITTLE THINGS]"
      onInteract={() => enterRoom("LITTLE_THINGS")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Bookcase Outer Frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.2, 3.6, 0.45]} />
          <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.6} />
        </mesh>

        {/* 3 Shelves of Manila Folders and Investigation Binders */}
        {[0.8, 1.5, 2.2].map((y, shelfIdx) => (
          <group key={shelfIdx} position={[0, y, 0.15]}>
            {/* Shelf board */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.9, 0.05, 0.35]} />
              <meshStandardMaterial color="#1a120c" />
            </mesh>
            {/* Rows of colored dossier binders (brown, black, yellow, red) */}
            {[-0.7, -0.4, -0.1, 0.2, 0.5].map((bx, bi) => {
              const colors = [
                THEME.folder.base,
                THEME.folder.dark,
                THEME.classified.dark,
                THEME.evidence.amber,
                THEME.noir.surface,
              ];
              return (
                <mesh key={bi} position={[bx, 0.25, 0]}>
                  <boxGeometry args={[0.22, 0.45, 0.28]} />
                  <meshStandardMaterial color={colors[(bi + shelfIdx) % colors.length]} />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Yellow Plaque */}
        <mesh position={[0, 3.2, 0.24]}>
          <planeGeometry args={[1.9, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 3.2, 0.25]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.15}
        >
          [05] LITTLE THINGS
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 6. DOUBLE FROSTED OFFICE DOORS — Leading to MAIN CHARACTER
// ─────────────────────────────────────────────────────────────────
export function FrostedOfficeDoorEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-main-character"
      type="door"
      position={position}
      interactionPrompt="ENTER DETECTIVE SUITE [MAIN CHARACTER]"
      onInteract={() => enterRoom("MAIN_CHARACTER")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Double Door Frame */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.3, 3.6, 0.25]} />
          <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.6} />
        </mesh>

        {/* Left Door */}
        <group position={[-0.52, 1.5, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.95, 2.7, 0.08]} />
            <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.7} />
          </mesh>
          {/* Frosted Glass Window */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.7, 1.4, 0.09]} />
            <meshStandardMaterial color="#c5d3df" roughness={0.2} transparent opacity={0.65} />
          </mesh>
          {/* Brass Latch */}
          <mesh position={[0.38, 0, 0.06]}>
            <boxGeometry args={[0.04, 0.2, 0.08]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
          </mesh>
        </group>

        {/* Right Door */}
        <group position={[0.52, 1.5, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.95, 2.7, 0.08]} />
            <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.7} />
          </mesh>
          {/* Frosted Glass Window */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.7, 1.4, 0.09]} />
            <meshStandardMaterial color="#c5d3df" roughness={0.2} transparent opacity={0.65} />
          </mesh>
          {/* Brass Latch */}
          <mesh position={[-0.38, 0, 0.06]}>
            <boxGeometry args={[0.04, 0.2, 0.08]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
          </mesh>
        </group>

        {/* Stenciled Black Text across frosted glass */}
        <Text
          position={[0, 1.8, 0.11]}
          fontSize={0.065}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.25}
        >
          MAIN CHARACTER // INVESTIGATION
        </Text>

        {/* Yellow Plaque */}
        <mesh position={[0, 3.2, 0.16]}>
          <planeGeometry args={[1.9, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 3.2, 0.17]}
          fontSize={0.12}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.15}
        >
          [06] MAIN CHARACTER
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 7. DESCENDING STONE STAIRCASE — Leading to UNWRITTEN CHAPTERS
// ─────────────────────────────────────────────────────────────────
export function StaircaseDescentEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-future"
      type="door"
      position={position}
      interactionPrompt="DESCEND ARCHIVE STAIRCASE [UNWRITTEN CHAPTERS]"
      onInteract={() => enterRoom("FUTURE")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Stone Archway Portal */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.2, 3.6, 0.3]} />
          <meshStandardMaterial color={DARK_STEEL} roughness={0.8} />
        </mesh>

        {/* Steps descending downward into darkness */}
        {[0, 1, 2, 3].map((step) => (
          <mesh
            key={step}
            position={[0, -step * 0.18, -step * 0.35 - 0.2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1.7, 0.18, 0.35]} />
            <meshStandardMaterial color="#1a1614" roughness={0.8} />
          </mesh>
        ))}

        {/* Lantern light from below */}
        <pointLight position={[0, 0.5, -1.2]} intensity={0.4} color={WARM_LAMP} distance={4} />

        {/* Yellow Plaque */}
        <mesh position={[0, 2.2, 0.16]}>
          <planeGeometry args={[2.1, 0.38]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 2.2, 0.17]}
          fontSize={0.11}
          color="#080605"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.12}
        >
          [07] UNWRITTEN CHAPTERS
        </Text>
        <Text
          position={[0, 1.8, 0.16]}
          fontSize={0.065}
          color={THEME.classified.bright}
          fontWeight={700}
          anchorX="center"
          letterSpacing={0.25}
        >
          VAULT DESCENT
        </Text>
      </group>
    </InteractableObject>
  );
}

// ─────────────────────────────────────────────────────────────────
// 8. GRAND ELEVATED STAIRCASE PORTAL — Leading to THE FINAL FILE
// ─────────────────────────────────────────────────────────────────
export function GrandFinalPortalEntrance({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const enterRoom = useTransitionStore((s) => s.enterRoom);

  return (
    <InteractableObject
      id="entrance-final"
      type="door"
      position={position}
      interactionPrompt="ASCEND TO THE FINAL FILE"
      onInteract={() => enterRoom("FINAL")}
      showMarker={true}
    >
      <group rotation={rotation}>
        {/* Stone Steps Leading Upward */}
        {[0, 1, 2, 3].map((step) => (
          <mesh
            key={step}
            position={[0, step * 0.18, step * -0.35]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2.5, 0.18, 0.35]} />
            <meshStandardMaterial color={MAHOGANY_WOOD} roughness={0.7} metalness={0.2} />
          </mesh>
        ))}

        {/* Brass Stanchions with Crimson Velvet Rope */}
        {[-1.1, 1.1].map((x, i) => (
          <group key={i} position={[x, 0.6, 0.1]}>
            <mesh>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Velvet Rope */}
        <mesh position={[0, 0.95, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 2.1, 12]} />
          <meshStandardMaterial color={THEME.classified.wax} roughness={0.8} />
        </mesh>

        {/* Elevated Portal Frame */}
        <mesh position={[0, 2.2, -1.2]} castShadow>
          <boxGeometry args={[2.2, 3.4, 0.3]} />
          <meshStandardMaterial color={DARK_STEEL} metalness={0.5} roughness={0.6} />
        </mesh>

        {/* Glowing Solemn Black Portal */}
        <mesh position={[0, 2.1, -1.04]}>
          <planeGeometry args={[1.6, 2.8]} />
          <meshStandardMaterial
            color="#080605"
            emissive={THEME.classified.stamp}
            emissiveIntensity={0.12}
          />
        </mesh>

        {/* Crimson Classified Seal */}
        <mesh position={[0, 3.4, -0.98]}>
          <planeGeometry args={[1.8, 0.38]} />
          <meshStandardMaterial color={THEME.classified.stamp} roughness={0.5} />
        </mesh>
        <Text
          position={[0, 3.4, -0.97]}
          fontSize={0.11}
          color="#ffffff"
          fontWeight={800}
          anchorX="center"
          letterSpacing={0.2}
        >
          [FINAL] THE FINAL FILE
        </Text>
      </group>
    </InteractableObject>
  );
}

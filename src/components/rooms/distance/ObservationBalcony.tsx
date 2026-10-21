"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const STONE_FLOOR = new THREE.Color(THEME.noir.surface);
const WALNUT_WOOD = new THREE.Color(THEME.folder.desk);
const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const CRT_GREEN = "#22c55e";

/**
 * ObservationBalcony — The cantilevered observation overlook perched above the celestial void.
 * Holds the central mahogany telemetry desk, the brass celestial telescope, the navigational
 * sextant, and the monumental floating typography ("THAT'S THE DISTANCE." / "NOT THE FEELING.").
 */
export function ObservationBalcony() {
  const radarSweepRef = useRef<THREE.Mesh>(null);
  const openMemory = useTransitionStore((s) => s.openMemory);
  const focusObject = useTransitionStore((s) => s.focusObject);

  // Rotate the radar sweep line inside the CRT screen
  useFrame((_, delta) => {
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.z -= delta * 2.2;
    }
  });

  return (
    <group>
      {/* ─── Balcony Floor (Cantilevered over the stars) ─────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 1.1]}
        receiveShadow
      >
        <planeGeometry args={[7.2, 1.6]} />
        <meshStandardMaterial color={STONE_FLOOR} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Brass Edge Curb along front of balcony */}
      <mesh position={[0, 0.04, 0.35]}>
        <boxGeometry args={[7.2, 0.08, 0.1]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ─── Heavy Brass Observation Handrail ───────────────────── */}
      <group position={[0, 0, 0.38]}>
        {/* Top Handrail Bar (Horizontal) */}
        <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 7.2, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Lower Safety Rail */}
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 7.2, 12]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Baluster Posts along the rail */}
        {[-3.4, -2.4, -1.4, -0.4, 0.4, 1.4, 2.4, 3.4].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0.525, 0]}>
            <cylinderGeometry args={[0.028, 0.035, 1.05, 12]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ─── Central Telemetry Console Desk (Mahogany & Brass) ─── */}
      <group position={[0, 0, 1.0]}>
        {/* Desk Base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.9, 0.8]} />
          <meshStandardMaterial color={WALNUT_WOOD} roughness={0.7} />
        </mesh>

        {/* Desk Brass Corner Trim */}
        <mesh position={[0, 0.91, 0]}>
          <boxGeometry args={[1.64, 0.04, 0.84]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.35} metalness={0.75} />
        </mesh>

        {/* CRT Radar Screen Chassis */}
        <group position={[-0.35, 1.15, -0.05]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.55, 0.42, 0.35]} />
            <meshStandardMaterial color="#1a140f" roughness={0.8} />
          </mesh>
          {/* Glowing Green CRT Display */}
          <mesh position={[0, 0.02, 0.16]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.44, 0.32]} />
            <meshBasicMaterial color="#052e16" />
          </mesh>
          {/* Radar Reticle Rings on Screen */}
          <group position={[0, 0.02, 0.162]} rotation={[0.2, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.1, 0.105, 32]} />
              <meshBasicMaterial color={CRT_GREEN} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.04, 0.045, 24]} />
              <meshBasicMaterial color={CRT_GREEN} />
            </mesh>
            {/* Rotating Radar Sweep Arm */}
            <mesh ref={radarSweepRef}>
              <planeGeometry args={[0.12, 0.006]} />
              <meshBasicMaterial color="#86efac" />
            </mesh>
          </group>
        </group>

        {/* Navigational Dials & Gauges */}
        <group position={[0.4, 1.02, -0.05]}>
          {/* Dial 1: Distance Metric */}
          <mesh position={[-0.15, 0, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Dial 2: Coordinate Lock */}
          <mesh position={[0.15, 0, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
          </mesh>
        </group>

        {/* Classified Case File #004 (Manila Folder) on Desk */}
        <group position={[0.05, 0.94, 0.12]} rotation={[0, 0.12, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.42, 0.02, 0.32]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.85} />
          </mesh>
          {/* Red Classified Stamp */}
          <mesh position={[0, 0.012, 0]}>
            <planeGeometry args={[0.24, 0.08]} />
            <meshBasicMaterial color={THEME.classified.stamp} />
          </mesh>
          <Text
            position={[0, 0.015, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.035}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.15}
          >
            CONFIDENTIAL // #004
          </Text>
        </group>

        {/* Warm Lamp above desk */}
        <pointLight position={[0, 1.5, 0.1]} intensity={0.7} color="#fef3c7" distance={3} />

        {/* Interactable Telemetry Console Object */}
        <InteractableObject
          id="dist-telemetry-console"
          type="evidence"
          position={[0, 1.05, 1.0]}
          interactionPrompt="UNSEAL CASE FILE #004: SPATIAL SEPARATION MATRIX"
          onInteract={() => openMemory("dist-telemetry")}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.6, 1.0, 0.8]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Left Brass Celestial Telescope on Tripod ─────────── */}
      <group position={[-2.2, 0, 0.9]}>
        {/* Tripod Legs */}
        <mesh position={[-0.18, 0.55, 0.1]} rotation={[0.1, 0, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.55, 0.1]} rotation={[0.1, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, -0.2]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Telescope Barrel angled toward the Earth globe */}
        <group position={[0, 1.15, 0]} rotation={[0.18, 0.25, 0]}>
          <mesh position={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.05, 0.07, 0.9, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.035, 0.035, 0.25, 12]} />
            <meshStandardMaterial color="#1a140f" roughness={0.4} />
          </mesh>
        </group>

        {/* Interactable Telescope Viewfinder */}
        <InteractableObject
          id="dist-telescope"
          type="evidence"
          position={[-2.2, 1.2, 0.9]}
          interactionPrompt="PEER THROUGH CELESTIAL VIEWFINDER"
          onInteract={() =>
            focusObject({
              id: "globe-focus",
              position: [0, 2.4, -2.0],
              lookAt: [0, 2.4, -5.0],
              duration: 1.8,
            })
          }
          showMarker={true}
        >
          <mesh visible={false}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Right Sextant & Milestone Record Station ──────────── */}
      <group position={[2.2, 0, 0.9]}>
        {/* Brass Pedestal */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 1.0, 16]} />
          <meshStandardMaterial color="#1a140f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Navigational Brass Sextant */}
        <group position={[0, 1.12, 0]} rotation={[0.3, -0.4, 0]}>
          <mesh>
            <torusGeometry args={[0.12, 0.015, 8, 24, Math.PI / 1.5]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
        </group>

        {/* Interactable Sextant Object */}
        <InteractableObject
          id="dist-milestone-desk"
          type="evidence"
          position={[2.2, 1.05, 0.9]}
          interactionPrompt="UNSEAL 23RD BIRTHDAY VOW RECORD [25 OCT]"
          onInteract={() => openMemory("dist-milestone-21")}
          showMarker={true}
        >
          <mesh visible={false}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Monumental Floating Typography Suspended in Space ──── */}
      {/* Above Globe */}
      <group position={[0, 5.2, -4.5]}>
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.22}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.25}
        >
          CASE FILE #004 // THE DISTANCE
        </Text>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.11}
          color="#9c7a4c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          KANPUR (HOMES) ◄—— 1,540 KM ——► CDAC HOSTEL, BANGALORE (6-MO DIPLOMA)
        </Text>
      </group>

      {/* Below Globe — Core Reveal Lines per SPEC */}
      <group position={[0, -0.4, -4.0]}>
        <Text
          position={[0, 0.65, 0]}
          fontSize={0.32}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.18}
        >
          {"THAT'S THE DISTANCE."}
        </Text>

        <Text
          position={[0, 0.25, 0]}
          fontSize={0.38}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.2}
        >
          NOT THE FEELING.
        </Text>

        <Text
          position={[0, -0.15, 0]}
          fontSize={0.12}
          color="#9c7a4c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          fontStyle="italic"
        >
          1,540 km between Kanpur and CDAC Bangalore. Zero miles between our hearts.
        </Text>

        <Text
          position={[0, -0.42, 0]}
          fontSize={0.13}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
          letterSpacing={0.25}
        >
          HAPPY 23RD BIRTHDAY, ANSHIKA • 25 OCTOBER 2003
        </Text>
      </group>
    </group>
  );
}

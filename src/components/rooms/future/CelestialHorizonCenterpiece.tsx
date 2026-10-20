"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const OBSIDIAN_STONE = new THREE.Color("#0d0b09");
const WARM_LIGHT = "#fef3c7";

/**
 * CelestialHorizonCenterpiece — The observatory center of Room 7.
 * Features an elevated circular dais, rotating brass celestial armillary rings,
 * radiant sun core, and monumental 23rd birthday horizon typography.
 */
export function CelestialHorizonCenterpiece({
  position = [0, 0, -1.0],
}: {
  position?: [number, number, number];
}) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.25;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.35;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.2;
  });

  return (
    <group position={position}>
      {/* ─── Circular Marble Dais Base ────────────────────────────── */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.2, 36]} />
        <meshStandardMaterial color={OBSIDIAN_STONE} roughness={0.7} />
      </mesh>
      {/* Outer Brass Perimeter Rim */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.8, 0.03, 8, 36]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Radial Brass Rays on Floor to the 9 Portals */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const angle = (i / 8) * Math.PI * 1.5 - Math.PI * 0.75;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0, 0.005, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.04, 3.8]} />
              <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* ─── Inlaid Dais Typography ───────────────────────────────── */}
      <group position={[0, 0.22, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.11}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.2}
        >
          ✦ THE CELESTIAL HORIZON • UNWRITTEN CHAPTERS ✦
        </Text>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.075}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.15}
        >
          23 YEARS WRITTEN • THE GREATEST ADVENTURES ARE STILL WAITING
        </Text>
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.06}
          color="#9c7a4c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fontStyle="italic"
        >
          {`"Every dream, every country, every summit — yours to conquer."`}
        </Text>
      </group>

      {/* ─── Pedestal Column for Armillary Sphere ──────────────────── */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.1, 16]} />
        <meshStandardMaterial color="#1a140f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <cylinderGeometry args={[0.48, 0.4, 0.06, 24]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* ─── Grand Armillary Celestial Sphere ──────────────────────── */}
      <group position={[0, 2.2, 0]}>
        {/* Outer Ring (Y Rotation) */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[0.85, 0.03, 8, 36]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Middle Ring (X Rotation) */}
        <group ref={ring2Ref}>
          <mesh>
            <torusGeometry args={[0.72, 0.025, 8, 36]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Inner Ring (Z Rotation) */}
        <group ref={ring3Ref}>
          <mesh>
            <torusGeometry args={[0.58, 0.02, 8, 36]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Radiant Celestial Sun Core */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Core Warm Radiant Light */}
        <pointLight
          position={[0, 0, 0]}
          intensity={1.4}
          color={WARM_LIGHT}
          distance={8}
          decay={2}
          castShadow
        />
      </group>
    </group>
  );
}

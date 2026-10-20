"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell, Door } from "../RoomPrimitives";
import { FuturePortal } from "./FuturePortal";
import { CelestialHorizonCenterpiece } from "./CelestialHorizonCenterpiece";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const WARM_LIGHT = "#fef3c7";

/**
 * FutureRoom — Room 7: The Celestial Horizon & Unwritten Chapters.
 *
 * Implements SPEC.md requirements:
 * - Dreams, places, ambitions — symbolic doors and miniature environments.
 * - Not about marriage or relationship milestones (focused purely on her dreams,
 *   adventures, passions, and achievements).
 * - 9 bespoke architectural portals with procedural 3D dioramas:
 *   1. The World Map (globe)
 *   2. The Adrenaline File (lightning)
 *   3. Master of All Trades (star)
 *   4. The Mountains (mountain)
 *   5. The Coastlines (wave)
 *   6. New York (city)
 *   7. The Career Arc (rocket)
 *   8. The House with Dogs (home)
 *   9. What She Deserves (sun)
 * - Central rotating celestial armillary sphere dais with 23rd birthday tributes.
 * - Return door to the Archive Vault (Hub Room).
 */
export default function FutureRoom() {
  // Precompute 9 portal positions in a majestic semi-circular celestial colonnade
  const portals = useMemo(() => {
    const radius = 7.4;
    const centerZ = -1.0;
    const total = anshikaData.unwrittenChapters.length;

    return anshikaData.unwrittenChapters.map((chapter, i) => {
      // Span across an arc of 210 degrees (-105 to +105)
      const angle = (i / (total - 1)) * (Math.PI * 1.16) - Math.PI * 0.58;
      const x = Math.sin(angle) * radius;
      const z = centerZ - Math.cos(angle) * radius;
      // Portal rotates to face inward toward center dais
      const rotationY = -angle;

      return {
        ...chapter,
        index: i,
        position: [x, 0, z] as [number, number, number],
        rotationY,
      };
    });
  }, []);

  return (
    <RoomShell width={20} depth={20} height={8.5}>
      {/* ─── Celestial Starfield Ceiling Points ───────────────────── */}
      <group position={[0, 8.2, 0]}>
        {[-8, -5, -2, 2, 5, 8].map((x) =>
          [-8, -5, -2, 2, 5, 8].map((z) => (
            <mesh key={`${x}-${z}`} position={[x + (Math.sin(x * 7) * 0.8), 0, z + (Math.cos(z * 5) * 0.8)]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))
        )}
      </group>

      {/* ─── Overhead Celestial Observatory Chandelier ──────────── */}
      <group position={[0, 6.2, -1.0]}>
        {/* Suspension Rod from Ceiling (y = 8.5 down to 6.2) */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.3, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Outer Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.035, 8, 36]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Middle Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.025, 8, 24]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Amber Bulbs */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => {
          const bAngle = (b / 8) * Math.PI * 2;
          return (
            <group
              key={b}
              position={[Math.cos(bAngle) * 1.4, 0.06, Math.sin(bAngle) * 1.4]}
            >
              <mesh>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color={WARM_LIGHT}
                  emissive={WARM_LIGHT}
                  emissiveIntensity={1.3}
                />
              </mesh>
            </group>
          );
        })}
        <pointLight intensity={1.2} color={WARM_LIGHT} distance={12} decay={2} castShadow />
      </group>

      {/* ─── Back Wall Architectural Inscription ─────────────────── */}
      <group position={[0, 7.2, -9.6]}>
        <Text
          position={[0, 0.22, 0]}
          fontSize={0.25}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.25}
        >
          CASE FILE #007 // THE CELESTIAL HORIZON
        </Text>
        <Text
          position={[0, -0.08, 0]}
          fontSize={0.12}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.2}
        >
          UNWRITTEN CHAPTERS • 23 YEARS OF PROMISE, AMBITION & MAGIC
        </Text>
        <Text
          position={[0, -0.32, 0]}
          fontSize={0.08}
          color="#9c7a4c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fontStyle="italic"
        >
          Not a single word of your future is ordinary. Every dream is waiting for you.
        </Text>
      </group>

      {/* ─── Centerpiece: Celestial Armillary Dais ───────────────── */}
      <CelestialHorizonCenterpiece position={[0, 0, -1.0]} />

      {/* ─── 9 Bespoke Architectural Future Portals ──────────────── */}
      {portals.map((portal) => (
        <FuturePortal
          key={portal.id}
          id={portal.id}
          index={portal.index}
          title={portal.title}
          description={portal.description}
          symbol={portal.symbol || "sun"}
          position={portal.position}
          rotationY={portal.rotationY}
        />
      ))}

      {/* ─── Return Door to Archive Vault (Hub Room) ───────────── */}
      <Door
        position={[0, 1.6, 8.8]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

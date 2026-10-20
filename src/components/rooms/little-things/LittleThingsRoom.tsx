"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell, Door } from "../RoomPrimitives";
import { LibraryShelves } from "./LibraryShelves";
import { StudyCenterpiece } from "./StudyCenterpiece";
import { LittleThingArtifact } from "./LittleThingArtifact";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const WARM_AMBER = "#fef3c7";

/**
 * LittleThingsRoom — Room 5: The Secret Study of Little Things.
 *
 * Implements SPEC.md requirements:
 * - Instanced/procedural floating objects that brighten on approach.
 * - Each reveals "THE LITTLE THING I NOTICE ABOUT YOU:" plus real content from anshikaData.
 * - 10 unique procedural 3D symbolic memory artifacts (rotary phone, drama masks,
 *   pocket watch, magnifying glass, 11:11 obelisks, teardrop prism, boots,
 *   wax-sealed letter, library books & spectacles, cloche rose).
 * - Central antique partner's desk with emerald banker's lamp, framed photo of Anshika
 *   on Arnav's last birthday, and the open Case Ledger of her habits.
 * - Perimeter dark walnut detective bookcases with brass shelf rails and archival banners.
 * - Return door to Archive Vault (Hub Room).
 */
export default function LittleThingsRoom() {
  // Precompute 10 pedestal positions along a grand elliptical study gallery orbit
  const artifacts = useMemo(() => {
    const rx = 4.8;
    const rz = 4.2;
    const centerZ = -0.5;

    return anshikaData.littleThings.map((thing, i) => {
      // Offset by (i + 0.5) so there is a wide central entrance aisle from door
      const angle = ((i + 0.5) / anshikaData.littleThings.length) * Math.PI * 2;
      const x = Math.sin(angle) * rx;
      const z = centerZ + Math.cos(angle) * rz;
      return {
        ...thing,
        index: i,
        position: [x, 0, z] as [number, number, number],
      };
    });
  }, []);

  return (
    <RoomShell width={16} depth={16} height={7}>
      {/* ─── Grand Archival Chandelier (Overhead Central Desk) ──── */}
      <group position={[0, 4.2, -0.5]}>
        {/* Suspension Rod from Ceiling (y = 7.0 down to 4.2) */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Brass Chandelier Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.04, 8, 24]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 6 Amber Bulbs on Ring */}
        {[0, 1, 2, 3, 4, 5].map((b) => {
          const bAngle = (b / 6) * Math.PI * 2;
          return (
            <group
              key={b}
              position={[Math.cos(bAngle) * 0.9, 0.08, Math.sin(bAngle) * 0.9]}
            >
              <mesh>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color={WARM_AMBER}
                  emissive={WARM_AMBER}
                  emissiveIntensity={1.2}
                />
              </mesh>
            </group>
          );
        })}
        {/* Chandelier Main Light */}
        <pointLight
          intensity={1.2}
          color={WARM_AMBER}
          distance={10}
          decay={2}
          castShadow
        />
      </group>

      {/* ─── Inlaid Brass Orbit Ring on Floor ──────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.5]}>
        <ringGeometry args={[4.45, 4.55, 64]} />
        <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.35} />
      </mesh>

      {/* Floor Compass Header */}
      <group position={[0, 0.004, 3.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.11}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          fontWeight={800}
        >
          ✦ THE GALLERY OF ANNOTATED HABITS • 10 FORENSIC QUIRKS ✦
        </Text>
      </group>

      {/* ─── Perimeter Detective Bookcases & Wainscoting ───────── */}
      <LibraryShelves />

      {/* ─── Central Study Desk & Case Ledger Station ──────────── */}
      <StudyCenterpiece position={[0, 0, -0.5]} />

      {/* ─── 10 Floating Little Things Artifacts ───────────────── */}
      {artifacts.map((artifact) => (
        <LittleThingArtifact
          key={artifact.id}
          id={artifact.id}
          index={artifact.index}
          content={artifact.content}
          position={artifact.position}
        />
      ))}

      {/* ─── Return Door to Archive Vault (Hub Room) ───────────── */}
      <Door
        position={[0, 1.6, 7.8]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

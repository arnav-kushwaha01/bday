"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import {
  RoomShell,
  Door,
  ACCENT_GOLD,
  WestworldEdisonBulb,
  WestworldCandleLantern,
} from "../RoomPrimitives";
import { ExhibitFrame } from "./ExhibitFrame";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";
import { getVideoUrl } from "@/lib/assetManager";

/**
 * GalleryRoom — Room 1: Her Gallery.
 * High-ceiling architectural exhibition hall featuring mahogany wainscoting,
 * parquet noir floor, directional exhibition spotlights, red investigation string,
 * central detective's evidence table, and museum-grade interactive photo exhibits.
 */
export default function GalleryRoom() {
  const galleryPhotos = useMemo(
    () => anshikaData.photos.filter((p) => p.room === "HER_GALLERY"),
    []
  );

  // We place 13 prominent exhibits along the 3 walls
  const backWallPhotos = useMemo(() => galleryPhotos.slice(0, 3), [galleryPhotos]);
  const leftWallPhotos = useMemo(() => galleryPhotos.slice(3, 8), [galleryPhotos]);
  const rightWallPhotos = useMemo(() => galleryPhotos.slice(8, 13), [galleryPhotos]);

  const openMemory = useTransitionStore((s) => s.openMemory);

  return (
    <RoomShell width={22} depth={32} height={7}>
      {/* ── Ambient Room Lighting ── */}
      <ambientLight intensity={0.8} color="#ede3d4" />
      <pointLight position={[0, 5.5, 0]} intensity={2.2} color={THEME.evidence.amber} distance={25} />
      <pointLight position={[0, 5.5, -8]} intensity={2.0} color="#f59e0b" distance={22} />
      <pointLight position={[0, 5.5, 8]} intensity={2.0} color="#f59e0b" distance={22} />
      <spotLight
        position={[0, 6.2, -6]}
        target-position={[0, 3.2, -15.6]}
        intensity={3.5}
        angle={0.7}
        penumbra={0.6}
        color="#fff4e0"
      />

      {/* ── Wainscoting & Floor Detailing ── */}
      {/* Dark Walnut Lower Wainscoting Panels (Left & Right) */}
      <mesh position={[-10.85, 1.0, 0]}>
        <boxGeometry args={[0.1, 2.0, 31.8]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[10.85, 1.0, 0]}>
        <boxGeometry args={[0.1, 2.0, 31.8]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.15} />
      </mesh>
      {/* Wainscoting Chair Rail Trim (Left & Right) */}
      <mesh position={[-10.82, 2.02, 0]}>
        <boxGeometry args={[0.16, 0.08, 31.8]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[10.82, 2.02, 0]}>
        <boxGeometry args={[0.16, 0.08, 31.8]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Back Wall Wainscoting */}
      <mesh position={[0, 1.0, -15.85]}>
        <boxGeometry args={[21.8, 2.0, 0.1]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 2.02, -15.82]}>
        <boxGeometry args={[21.8, 0.08, 0.16]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Ceiling Beams with Westworld Hanging Edison Pendant Bulbs */}
      {[-10, -5, 0, 5, 10].map((z) => (
        <group key={`beam-${z}`} position={[0, 6.8, z]}>
          <mesh>
            <boxGeometry args={[21.8, 0.4, 0.5]} />
            <meshStandardMaterial color="#160f0a" roughness={0.8} />
          </mesh>
          {/* Hanging Westworld Edison Bulb */}
          <WestworldEdisonBulb position={[0, -1.2, 0]} cordLength={1.2} />
        </group>
      ))}

      {/* ── Archival Titles on Back Wall ── */}
      <group position={[0, 5.6, -15.7]}>
        <Text
          fontSize={0.65}
          color={ACCENT_GOLD.getStyle()}
          anchorX="center"
          letterSpacing={0.25}
        >
          HER GALLERY
        </Text>
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.16}
          color={THEME.folder.light}
          anchorX="center"
          letterSpacing={0.35}
        >
          {`EXHIBITION OF ${galleryPhotos.length} ARCHIVED PHOTOGRAPHS • CLASSIFIED CASE #1025`}
        </Text>
      </group>

      {/* ── Centerpiece: Detective's Investigation Table ── */}
      <group position={[0, 0, -1.5]}>
        {/* Heavy dark oak table */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.1, 1.8]} />
          <meshStandardMaterial color="#241a12" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Table Legs */}
        {[
          [-1.4, 0.22, -0.7],
          [1.4, 0.22, -0.7],
          [-1.4, 0.22, 0.7],
          [1.4, 0.22, 0.7],
        ].map(([lx, ly, lz], idx) => (
          <mesh key={`leg-${idx}`} position={[lx, ly, lz]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.45, 8]} />
            <meshStandardMaterial color="#1a120b" roughness={0.8} />
          </mesh>
        ))}

        {/* Vintage Archive Desk Lamp */}
        <group position={[-0.9, 0.52, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.14, 0.04, 16]} />
            <meshStandardMaterial color="#3a2e1d" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#3a2e1d" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Curved bronze shade */}
          <mesh position={[0.08, 0.38, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.08, 0.14, 0.22, 16]} />
            <meshStandardMaterial color="#1b4d2e" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Warm lamp bulb & light */}
          <pointLight position={[0.08, 0.32, 0]} intensity={1.5} color="#fed7aa" distance={4} />
        </group>


        {/* Crime Scene Evidence Tent Marker on Table */}
        <group position={[-0.4, 0.56, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.15, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            rotation={[0.2, 0, 0]}
            fontSize={0.07}
            color="#080605"
            fontWeight="bold"
            anchorX="center"
          >
            00
          </Text>
        </group>
      </group>

      {/* ── Interactable Investigation Dossier on the Central Table ── */}
      <InteractableObject
        id="gallery-table-dossier"
        type="evidence"
        position={[0.2, 0.52, -1.4]}
        interactionPrompt="[E] EXAMINE FORENSIC CASE DOSSIER"
        onInteract={() => {
          if (galleryPhotos[0]) {
            openMemory(galleryPhotos[0].id);
          }
        }}
        radius={3.2}
        showMarker={true}
      >
        <group>
          <mesh rotation={[0, 0.15, 0]}>
            <boxGeometry args={[0.65, 0.03, 0.85]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.02, -0.1]} rotation={[0, -0.25, 0]}>
            <boxGeometry args={[0.55, 0.02, 0.75]} />
            <meshStandardMaterial color={THEME.folder.light} roughness={0.9} />
          </mesh>
          {/* Flickering Westworld Candle Lantern on table */}
          <WestworldCandleLantern position={[-0.55, 0, 0.1]} scale={0.7} />
        </group>
      </InteractableObject>

      {/* Museum Bench at front center */}
      <group position={[0, 0, 6.5]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[2.8, 0.12, 0.8]} />
          <meshStandardMaterial color="#140f0a" roughness={0.8} />
        </mesh>
        {/* Leather cushion */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[2.7, 0.06, 0.72]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.5} />
        </mesh>
        {/* Bench legs */}
        {[-1.2, 1.2].map((bx) => (
          <mesh key={`bench-leg-${bx}`} position={[bx, 0.14, 0]}>
            <boxGeometry args={[0.1, 0.28, 0.65]} />
            <meshStandardMaterial color="#0a0705" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ── 1. Back Wall Hero Exhibits (Z = -15.6) ── */}
      {/* Centerpiece Hero Exhibit: Plays her last birthday video on loop! */}
      {backWallPhotos[0] && (
        <ExhibitFrame
          photo={backWallPhotos[0]}
          exhibitNumber={1}
          position={[0, 3.2, -15.6]}
          rotation={[0, 0, 0]}
          width={2.2}
          height={1.65}
          videoUrl={getVideoUrl("her_last_birthday_looking_gorgeous.mp4")}
        />
      )}
      {/* Flanking Exhibits on Back Wall */}
      {backWallPhotos[1] && (
        <ExhibitFrame
          photo={backWallPhotos[1]}
          exhibitNumber={2}
          position={[-4.5, 3.0, -15.6]}
          rotation={[0, 0, 0]}
          width={1.6}
          height={1.2}
        />
      )}
      {backWallPhotos[2] && (
        <ExhibitFrame
          photo={backWallPhotos[2]}
          exhibitNumber={3}
          position={[4.5, 3.0, -15.6]}
          rotation={[0, 0, 0]}
          width={1.6}
          height={1.2}
        />
      )}

      {/* ── 2. Left Wall Exhibits (X = -10.6, rotated toward center) ── */}
      {leftWallPhotos.map((photo, i) => {
        // Spaced along Z: -10, -5, 0, 5, 10
        const zPos = -10 + i * 5;
        const exhibitNum = 4 + i;
        // Frame #5 loops her Mocha Café video
        const vid = i === 1 ? getVideoUrl("her_slaying_in_her_look_in_mocha_cafe.mp4") : undefined;
        return (
          <ExhibitFrame
            key={photo.id}
            photo={photo}
            exhibitNumber={exhibitNum}
            position={[-10.6, 2.9, zPos]}
            rotation={[0, Math.PI / 2, 0]}
            width={1.5}
            height={1.12}
            videoUrl={vid}
          />
        );
      })}

      {/* ── 3. Right Wall Exhibits (X = 10.6, rotated toward center) ── */}
      {rightWallPhotos.map((photo, i) => {
        const zPos = -10 + i * 5;
        const exhibitNum = 9 + i;
        // Frame #11 loops her arcade jackpot tickets video!
        const vid = i === 2 ? getVideoUrl("she_pulling_loads_of_tickets_from_an_arcade_machine.mp4") : undefined;
        return (
          <ExhibitFrame
            key={photo.id}
            photo={photo}
            exhibitNumber={exhibitNum}
            position={[10.6, 2.9, zPos]}
            rotation={[0, -Math.PI / 2, 0]}
            width={1.5}
            height={1.12}
            videoUrl={vid}
          />
        );
      })}

      {/* ── Return Door leading back to Archive Hub (Z = 15.6) ── */}
      <Door
        position={[0, 1.6, 15.6]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { RoomShell, Door, ACCENT_GOLD } from "../RoomPrimitives";
import { ExhibitFrame } from "../gallery/ExhibitFrame";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";

/**
 * VersionsRoom — Room 2: Versions of Her.
 * Chronological Art Deco / Classified Archive timeline chamber celebrating
 * Anshika's journey through childhood, school, 2020 evolutions, and moods,
 * culminating in her 23rd Birthday Shrine (25 October).
 */
export default function VersionsRoom() {
  const openMemory = useTransitionStore((s) => s.openMemory);

  const versionPhotos = useMemo(
    () => anshikaData.photos.filter((p) => p.room === "VERSIONS"),
    []
  );

  // Group photos for key chronological alcoves
  const pChildhoodDiva = versionPhotos.find((p) => p.id === "ph-childhood-diva") || versionPhotos[0];
  const pChildhoodDon = versionPhotos.find((p) => p.id === "ph-childhood-don") || versionPhotos[1];
  const pSchoolHer = versionPhotos.find((p) => p.id === "ph-school-her") || versionPhotos[2];
  const p2020Cute = versionPhotos.find((p) => p.id === "ph-2020-cute") || versionPhotos[3];
  const p2020Hot = versionPhotos.find((p) => p.id === "ph-2020-hot") || versionPhotos[4];
  const pAngryLook = versionPhotos.find((p) => p.id === "ph-angry-look") || versionPhotos[5];
  const pCuteSad = versionPhotos.find((p) => p.id === "ph-cute-sad") || versionPhotos[6];
  const pJk2022 = versionPhotos.find((p) => p.id === "ph-jk-2022") || versionPhotos[7];

  return (
    <RoomShell width={20} depth={28} height={7}>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.75} color="#ede3d4" />
      <pointLight position={[0, 5.5, 0]} intensity={2.0} color={THEME.evidence.amber} distance={24} />
      <pointLight position={[0, 5.5, 7]} intensity={1.8} color="#f59e0b" distance={20} />
      <pointLight position={[0, 5.5, -7]} intensity={2.2} color="#f59e0b" distance={20} />

      {/* Birthday Shrine Hero Spotlight at back */}
      <spotLight
        position={[0, 6.2, -5]}
        target-position={[0, 2.2, -12]}
        intensity={3.8}
        angle={0.65}
        penumbra={0.6}
        color="#fff4e0"
      />

      {/* ── Floor Timeline Track (Embedded glowing brass strip) ── */}
      <group position={[0, 0.01, -0.5]}>
        {/* Main brass spine */}
        <mesh receiveShadow>
          <boxGeometry args={[0.3, 0.02, 19]} />
          <meshStandardMaterial color="#c49a45" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Amber neon centerline glow */}
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.08, 0.005, 18.6]} />
          <meshBasicMaterial color={THEME.evidence.bright} />
        </mesh>

        {/* Chronological Milestone Floor Inscriptions */}
        {[
          { label: "2003 • ORIGIN", z: 7.5 },
          { label: "2018 • SCHOOL", z: 3.5 },
          { label: "2020 • THE TRANSITION", z: -0.5 },
          { label: "2021 • THE MERGE", z: -4.5 },
          { label: "25 OCTOBER • 23RD BIRTHDAY", z: -8.5 },
        ].map((node) => (
          <group key={node.label} position={[0, 0.02, node.z]}>
            {/* Transverse brass bar */}
            <mesh>
              <boxGeometry args={[1.6, 0.01, 0.1]} />
              <meshStandardMaterial color="#c49a45" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Stamped text on floor */}
            <Text
              position={[0, 0.015, -0.16]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.12}
              color="#080605"
              fontWeight="bold"
              anchorX="center"
              letterSpacing={0.2}
            >
              {node.label}
            </Text>
          </group>
        ))}
      </group>

      {/* ── Wall Architectural Details ── */}
      {/* Vertical Brass Timeline Ribs on Left & Right Walls */}
      {[-8, -4, 0, 4, 8].map((z) => (
        <group key={`rib-${z}`}>
          {/* Left Rib */}
          <mesh position={[-9.85, 3.5, z]}>
            <boxGeometry args={[0.06, 6.8, 0.12]} />
            <meshStandardMaterial color="#8a6c38" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Right Rib */}
          <mesh position={[9.85, 3.5, z]}>
            <boxGeometry args={[0.06, 6.8, 0.12]} />
            <meshStandardMaterial color="#8a6c38" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── 1. Era 01: The Childhood Icon (Left Wall, Z = 7.5) ── */}
      {pChildhoodDiva && (
        <ExhibitFrame
          photo={pChildhoodDiva}
          exhibitNumber={1}
          position={[-9.6, 2.8, 7.5]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.4}
          height={1.05}
        />
      )}
      {/* Flanking Don Era */}
      {pChildhoodDon && (
        <ExhibitFrame
          photo={pChildhoodDon}
          exhibitNumber={2}
          position={[-9.6, 2.8, 4.0]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.3}
          height={0.98}
        />
      )}

      {/* ── 2. Era 02: School Days & Afterparty (Right Wall, Z = 7.5) ── */}
      {pSchoolHer && (
        <ExhibitFrame
          photo={pSchoolHer}
          exhibitNumber={3}
          position={[9.6, 2.8, 7.5]}
          rotation={[0, -Math.PI / 2, 0]}
          width={1.4}
          height={1.05}
        />
      )}

      {/* ── 3. Era 03: 2020 Cute & Hot Eras (Left Wall, Z = -0.5) ── */}
      {p2020Cute && (
        <ExhibitFrame
          photo={p2020Cute}
          exhibitNumber={4}
          position={[-9.6, 2.8, 0.5]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.3}
          height={0.98}
        />
      )}
      {p2020Hot && (
        <ExhibitFrame
          photo={p2020Hot}
          exhibitNumber={5}
          position={[-9.6, 2.8, -2.8]}
          rotation={[0, Math.PI / 2, 0]}
          width={1.3}
          height={0.98}
        />
      )}

      {/* ── 4. Era 04: The Personalities & Moods (Right Wall, Z = 0) ── */}
      {pAngryLook && (
        <ExhibitFrame
          photo={pAngryLook}
          exhibitNumber={6}
          position={[9.6, 2.8, 0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          width={1.4}
          height={1.05}
        />
      )}
      {pCuteSad && (
        <ExhibitFrame
          photo={pCuteSad}
          exhibitNumber={7}
          position={[9.6, 2.8, -2.8]}
          rotation={[0, -Math.PI / 2, 0]}
          width={1.3}
          height={0.98}
        />
      )}

      {/* ── 5. Era 05: Faith & Blessings (Right Wall, Z = -6.5) ── */}
      {pJk2022 && (
        <ExhibitFrame
          photo={pJk2022}
          exhibitNumber={8}
          position={[9.6, 2.8, -6.5]}
          rotation={[0, -Math.PI / 2, 0]}
          width={1.4}
          height={1.05}
        />
      )}

      {/* ── 6. CENTERPIECE: The 23rd Birthday Shrine & Dais (Z = -11.5) ── */}
      <group position={[0, 0, -11.5]}>
        {/* Tier 1 Elevated Dais */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <boxGeometry args={[6.5, 0.3, 3.8]} />
          <meshStandardMaterial color="#1a120b" roughness={0.7} />
        </mesh>
        {/* Tier 2 Elevated Dais with Crimson Velvet Runner */}
        <mesh position={[0, 0.32, 0]} receiveShadow>
          <boxGeometry args={[4.5, 0.15, 2.8]} />
          <meshStandardMaterial color="#8b1818" roughness={0.5} />
        </mesh>

        {/* Golden Central Birthday Pedestal */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.7, 1.2]} />
          <meshStandardMaterial color="#1c1611" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Brass Pedestal Top Plate */}
        <mesh position={[0, 1.11, 0]}>
          <boxGeometry args={[1.7, 0.04, 1.3]} />
          <meshStandardMaterial color="#c49a45" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Sacred 11:11 Birthday Clock */}
        <group position={[0, 1.3, -0.1]}>
          {/* Clock body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
            <meshStandardMaterial color="#3a2e1d" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* White enamel face */}
          <mesh position={[0, 0, 0.045]}>
            <circleGeometry args={[0.18, 24]} />
            <meshBasicMaterial color="#faf6eb" />
          </mesh>
          {/* Hands stopped at 11:11 */}
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.08}
            color="#b91c1c"
            fontWeight="bold"
            anchorX="center"
          >
            11:11
          </Text>
        </group>

        {/* Warm Golden Candle Lanterns on Dais */}
        {[-1.6, 1.6].map((lx) => (
          <group key={`lantern-${lx}`} position={[lx, 0.5, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.45, 12]} />
              <meshStandardMaterial color="#2d2216" metalness={0.7} roughness={0.3} />
            </mesh>
            <pointLight position={[0, 0.2, 0]} intensity={1.5} color="#fde047" distance={4} />
          </group>
        ))}

        {/* Yellow Evidence Marker #02 */}
        <group position={[-1.1, 0.45, 0.8]} rotation={[0, 0.3, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.18, 0.16, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            rotation={[0.2, 0, 0]}
            fontSize={0.08}
            color="#080605"
            fontWeight="bold"
            anchorX="center"
          >
            02
          </Text>
        </group>

        {/* Giant Birthday Inscription on Wall */}
        <group position={[0, 4.4, -2.1]}>
          <Text
            fontSize={0.58}
            color={ACCENT_GOLD.getStyle()}
            anchorX="center"
            letterSpacing={0.25}
          >
            HAPPY 23RD BIRTHDAY, ANSHIKA!
          </Text>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.18}
            color={THEME.classified.bright}
            anchorX="center"
            letterSpacing={0.4}
            fontWeight="bold"
          >
            25 OCTOBER 2003 ─── 25 OCTOBER 2026
          </Text>
          <Text
            position={[0, -1.05, 0]}
            fontSize={0.13}
            color={THEME.folder.light}
            anchorX="center"
            letterSpacing={0.3}
          >
            23 YEARS OF BEAUTY, MISCHIEF, STRENGTH & MAGIC
          </Text>
        </group>
      </group>

      {/* ── Interactable Birthday Dossier on the Dais Pedestal ── */}
      <InteractableObject
        id="versions-birthday-file"
        type="evidence"
        position={[0, 1.15, -11.5]}
        interactionPrompt="[E] UNSEAL 23RD BIRTHDAY CASE FILE: 25 OCTOBER"
        onInteract={() => {
          if (pChildhoodDiva) {
            openMemory(pChildhoodDiva.id);
          }
        }}
        radius={3.5}
        showMarker={true}
      >
        <group>
          {/* Birthday Manila file folder */}
          <mesh rotation={[-Math.PI / 2, 0, 0.1]}>
            <boxGeometry args={[0.7, 0.9, 0.04]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
          {/* Red Ribbon / Wax Seal */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color={THEME.classified.stamp} roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0.045, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.045}
            color="#fff8e7"
            fontWeight="bold"
            anchorX="center"
            letterSpacing={0.15}
          >
            25 OCT
          </Text>
        </group>
      </InteractableObject>

      {/* ── Return Door leading back to Archive Hub (Z = 13.5) ── */}
      <Door
        position={[0, 1.6, 13.5]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

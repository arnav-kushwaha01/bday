"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { RoomShell, Door, ACCENT_GOLD } from "../RoomPrimitives";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { useAppStore } from "@/store/useAppStore";
import { anshikaData } from "@/data/anshika";
import { THEME } from "@/lib/theme";

/**
 * EvidenceRoom — Highest interaction density in the archive.
 * Features 8 forensic evidence lockers with bespoke 3D props,
 * a central Red-String Detective's Mystery Board connecting the 3 clues,
 * a live real-time forensic progress counter, and birthday celebration markings.
 */
export default function EvidenceRoom() {
  const discovered = useAppStore((s) => s.discoveredEvidence);
  const openMemory = useTransitionStore((s) => s.openMemory);
  const focusObject = useTransitionStore((s) => s.focusObject);

  const totalEvidence = anshikaData.evidence.length;

  // The 3 mystery clues
  const clues = useMemo(() => anshikaData.mysteryClues, []);
  const allCluesSolved = useMemo(
    () => clues.every((c) => discovered.includes(c.id)),
    [clues, discovered]
  );

  const handleInspect = (id: string, pos: [number, number, number], lookAt: [number, number, number]) => {
    focusObject({
      id,
      position: pos,
      lookAt,
      duration: 1.0,
    });
    openMemory(id);
  };

  return (
    <RoomShell width={22} depth={22} height={6.5}>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.7} color="#ede3d4" />
      <pointLight position={[0, 5.0, 0]} intensity={2.2} color={THEME.evidence.amber} distance={22} />
      <pointLight position={[-6, 4.5, -4]} intensity={1.8} color="#f59e0b" distance={16} />
      <pointLight position={[6, 4.5, -4]} intensity={1.8} color="#f59e0b" distance={16} />
      <pointLight position={[0, 4.5, 5]} intensity={1.5} color="#fed7aa" distance={16} />

      {/* Clue Board Overhead Spotlight */}
      <spotLight
        position={[0, 5.5, 2.5]}
        target-position={[0, 1.8, -0.5]}
        intensity={3.0}
        angle={0.65}
        penumbra={0.5}
        color="#fff4e0"
      />

      {/* ── Floor Detailing & Caution Perimeter ── */}
      {/* Steel floor grating inlay */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[20.5, 0.02, 20.5]} />
        <meshStandardMaterial color="#120e0b" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Perimeter Yellow Caution Strip */}
      <group position={[0, 0.02, 0]}>
        {/* Left Caution Line */}
        <mesh position={[-9.8, 0, 0]}>
          <boxGeometry args={[0.2, 0.01, 20]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
        {/* Right Caution Line */}
        <mesh position={[9.8, 0, 0]}>
          <boxGeometry args={[0.2, 0.01, 20]} />
          <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Live Forensic Status Console on Back Wall (Z = -10.8) ── */}
      <group position={[0, 4.8, -10.8]}>
        <Text
          fontSize={0.55}
          color={ACCENT_GOLD.getStyle()}
          anchorX="center"
          letterSpacing={0.25}
        >
          FORENSIC EVIDENCE VAULT
        </Text>
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.2}
          color={THEME.evidence.primary}
          anchorX="center"
          letterSpacing={0.35}
          fontWeight="bold"
        >
          {`EVIDENCE RECOVERED: [ ${String(discovered.length).padStart(2, "0")} / ${String(totalEvidence).padStart(2, "0")} ]`}
        </Text>
        <Text
          position={[0, -1.15, 0]}
          fontSize={0.12}
          color={THEME.classified.bright}
          anchorX="center"
          letterSpacing={0.3}
        >
          CASE FILE #1025 • SUBJECT: ANSHIKA BAJPAI • BORN 25 OCTOBER 2003
        </Text>
      </group>

      {/* ── Centerpiece: Detective's Red-String Clue Board (Z = -0.5) ── */}
      <group position={[0, 0, -0.5]}>
        {/* Steel Stanchions */}
        {[-2.2, 2.2].map((sx) => (
          <group key={`stanchion-${sx}`} position={[sx, 1.6, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.08, 3.2, 12]} />
              <meshStandardMaterial color="#2d2218" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Stanchion Base */}
            <mesh position={[0, -1.55, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.32, 0.1, 16]} />
              <meshStandardMaterial color="#1a120b" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Cork / Slate Investigation Board */}
        <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 2.4, 0.12]} />
          <meshStandardMaterial color="#2b2016" roughness={0.8} />
        </mesh>
        {/* Brass Frame Trim */}
        <mesh position={[0, 1.85, 0]}>
          <boxGeometry args={[4.5, 2.5, 0.08]} />
          <meshStandardMaterial color="#8a6c38" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Board Header Banner */}
        <Text
          position={[0, 2.8, 0.08]}
          fontSize={0.11}
          color={THEME.evidence.primary}
          anchorX="center"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          {allCluesSolved ? "★ MYSTERY SOLVED: 23RD BIRTHDAY DOSSIER UNLOCKED ★" : "CASE NO. 1025 • MYSTERY CONNECTIONS"}
        </Text>

        {/* Clue 1: Origin (Top Center) */}
        <InteractableObject
          id="mc-1"
          type="evidence"
          position={[0, 2.25, 0.15]}
          interactionPrompt="[E] INSPECT CLUE 1: THE ORIGIN BUILDING"
          onInteract={() => handleInspect("mc-1", [0, 2.0, 1.8], [0, 2.25, 0.15])}
          radius={3.0}
          showMarker={true}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
            <meshStandardMaterial color={THEME.classified.stamp} roughness={0.3} />
          </mesh>
          <Text
            position={[0, -0.15, 0.04]}
            fontSize={0.065}
            color="#fff8e7"
            anchorX="center"
            letterSpacing={0.15}
          >
            CLUE 01: SAME SCHOOL
          </Text>
        </InteractableObject>

        {/* Clue 2: Coaching (Bottom Left) */}
        <InteractableObject
          id="mc-2"
          type="evidence"
          position={[-1.4, 1.5, 0.15]}
          interactionPrompt="[E] INSPECT CLUE 2: CLASS 9TH TRAJECTORY"
          onInteract={() => handleInspect("mc-2", [-1.4, 1.5, 1.8], [-1.4, 1.5, 0.15])}
          radius={3.0}
          showMarker={true}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
            <meshStandardMaterial color={THEME.classified.stamp} roughness={0.3} />
          </mesh>
          <Text
            position={[0, -0.15, 0.04]}
            fontSize={0.065}
            color="#fff8e7"
            anchorX="center"
            letterSpacing={0.15}
          >
            CLUE 02: PAUL SIR&#39;S CLASS
          </Text>
        </InteractableObject>

        {/* Clue 3: Relationship Start (Bottom Right) */}
        <InteractableObject
          id="mc-3"
          type="evidence"
          position={[1.4, 1.5, 0.15]}
          interactionPrompt="[E] INSPECT CLUE 3: THE MERGE DATE"
          onInteract={() => handleInspect("mc-3", [1.4, 1.5, 1.8], [1.4, 1.5, 0.15])}
          radius={3.0}
          showMarker={true}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
            <meshStandardMaterial color={THEME.classified.stamp} roughness={0.3} />
          </mesh>
          <Text
            position={[0, -0.15, 0.04]}
            fontSize={0.065}
            color="#fff8e7"
            anchorX="center"
            letterSpacing={0.15}
          >
            CLUE 03: 27-11-2021
          </Text>
        </InteractableObject>

        {/* Red Investigation String connecting the pins */}
        {/* Left string: (0, 2.25) to (-1.4, 1.5) */}
        <mesh position={[-0.7, 1.875, 0.14]} rotation={[0, 0, 0.49]}>
          <cylinderGeometry args={[0.008, 0.008, 1.59, 6]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
        {/* Right string: (0, 2.25) to (1.4, 1.5) */}
        <mesh position={[0.7, 1.875, 0.14]} rotation={[0, 0, -0.49]}>
          <cylinderGeometry args={[0.008, 0.008, 1.59, 6]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
        {/* Bottom horizontal string: (-1.4, 1.5) to (1.4, 1.5) */}
        <mesh position={[0, 1.5, 0.14]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 2.8, 6]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
      </group>

      {/* ── 8 Distinct Forensic Evidence Vitrines & Stations ── */}

      {/* Station 01: Kulhad78 Café File (Left Wall, Z = 5) */}
      <group position={[-9.2, 0, 5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Ceramic Kulhad Cup Prop */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.09, 0.24, 16]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </mesh>
        {/* Evidence Tent Marker 01 */}
        <group position={[0.4, 1.08, 0.3]} rotation={[0, -0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            01
          </Text>
        </group>
        <InteractableObject
          id="ev-kulhad78"
          type="evidence"
          position={[-9.2, 1.2, 5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #01: KULHAD78 CAFÉ FILE"
          onInteract={() => handleInspect("ev-kulhad78", [-7.2, 1.5, 5], [-9.2, 1.2, 5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 02: Wallet Evidence (Left Wall, Z = 1.5) */}
      <group position={[-9.2, 0, 1.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Open Leather Wallet */}
        <mesh position={[0, 1.08, 0]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.35, 0.06, 0.28]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.4} />
        </mesh>
        {/* Evidence Tent Marker 02 */}
        <group position={[0.4, 1.08, 0.3]} rotation={[0, -0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            02
          </Text>
        </group>
        <InteractableObject
          id="ev-wallet"
          type="evidence"
          position={[-9.2, 1.2, 1.5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #02: WALLET EVIDENCE"
          onInteract={() => handleInspect("ev-wallet", [-7.2, 1.5, 1.5], [-9.2, 1.2, 1.5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 03: Bus Departure Note (Left Wall, Z = -2) */}
      <group position={[-9.2, 0, -2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Bus Ticket on Pedestal */}
        <mesh position={[0, 1.06, 0]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.25]} />
          <meshStandardMaterial color="#e5d5be" roughness={0.9} />
        </mesh>
        {/* Evidence Marker 03 */}
        <group position={[0.4, 1.08, 0.3]} rotation={[0, -0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            03
          </Text>
        </group>
        <InteractableObject
          id="ev-bus-cry"
          type="evidence"
          position={[-9.2, 1.2, -2]}
          interactionPrompt="[E] EXAMINE EVIDENCE #03: THE BUS DEPARTURE"
          onInteract={() => handleInspect("ev-bus-cry", [-7.2, 1.5, -2], [-9.2, 1.2, -2])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 04: Sacred 11:11 Glowing Crystal (Left Wall, Z = -5.5) */}
      <group position={[-9.2, 0, -5.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Glowing Crystal Prism */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color={THEME.evidence.bright} emissive={THEME.evidence.primary} emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
        </mesh>
        <pointLight position={[0, 1.2, 0]} intensity={1.5} color={THEME.evidence.amber} distance={4} />
        {/* Evidence Marker 04 */}
        <group position={[0.4, 1.08, 0.3]} rotation={[0, -0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            04
          </Text>
        </group>
        <InteractableObject
          id="ev-1111"
          type="evidence"
          position={[-9.2, 1.2, -5.5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #04: 11:11 WISHES"
          onInteract={() => handleInspect("ev-1111", [-7.2, 1.5, -5.5], [-9.2, 1.2, -5.5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 05: School Records (Right Wall, Z = 5) */}
      <group position={[9.2, 0, 5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* School Notebook Prop */}
        <mesh position={[0, 1.08, 0]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.4, 0.06, 0.55]} />
          <meshStandardMaterial color="#1d3557" roughness={0.7} />
        </mesh>
        {/* Evidence Marker 05 */}
        <group position={[-0.4, 1.08, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            05
          </Text>
        </group>
        <InteractableObject
          id="ev-school-together"
          type="evidence"
          position={[9.2, 1.2, 5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #05: SCHOOL RECORDS"
          onInteract={() => handleInspect("ev-school-together", [7.2, 1.5, 5], [9.2, 1.2, 5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 06: The Flowers Incident (Right Wall, Z = 1.5) */}
      <group position={[9.2, 0, 1.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Glass Dome Cloche */}
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.35, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.1} metalness={0.2} transparent opacity={0.4} />
        </mesh>
        {/* Preserved Flower inside */}
        <mesh position={[0, 1.12, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#e11d48" roughness={0.7} />
        </mesh>
        {/* Evidence Marker 06 */}
        <group position={[-0.4, 1.08, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            06
          </Text>
        </group>
        <InteractableObject
          id="ev-flowers"
          type="evidence"
          position={[9.2, 1.2, 1.5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #06: THE FLOWERS INCIDENT"
          onInteract={() => handleInspect("ev-flowers", [7.2, 1.5, 1.5], [9.2, 1.2, 1.5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 07: Anniversary Gifts Lockbox (Right Wall, Z = -2) */}
      <group position={[9.2, 0, -2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Brass Lockbox with Red Ribbon */}
        <mesh position={[0, 1.12, 0]} rotation={[0, -0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.22, 0.32]} />
          <meshStandardMaterial color="#b48c48" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Evidence Marker 07 */}
        <group position={[-0.4, 1.08, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            07
          </Text>
        </group>
        <InteractableObject
          id="ev-gifts"
          type="evidence"
          position={[9.2, 1.2, -2]}
          interactionPrompt="[E] EXAMINE EVIDENCE #07: ANNIVERSARY ARTIFACTS"
          onInteract={() => handleInspect("ev-gifts", [7.2, 1.5, -2], [9.2, 1.2, -2])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* Station 08: Family Integration File (Right Wall, Z = -5.5) */}
      <group position={[9.2, 0, -5.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        {/* Framed Miniature Photo */}
        <mesh position={[0, 1.15, 0]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.35, 0.4, 0.04]} />
          <meshStandardMaterial color="#2c1a0e" roughness={0.5} />
        </mesh>
        {/* Evidence Marker 08 */}
        <group position={[-0.4, 1.08, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.16, 0.14, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          <Text position={[0, 0, 0.015]} rotation={[0.2, 0, 0]} fontSize={0.07} color="#080605" fontWeight="bold" anchorX="center">
            08
          </Text>
        </group>
        <InteractableObject
          id="ev-sister"
          type="evidence"
          position={[9.2, 1.2, -5.5]}
          interactionPrompt="[E] EXAMINE EVIDENCE #08: FAMILY INTEGRATION"
          onInteract={() => handleInspect("ev-sister", [7.2, 1.5, -5.5], [9.2, 1.2, -5.5])}
          radius={3.2}
          showMarker={true}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color={THEME.folder.base} roughness={0.8} />
          </mesh>
        </InteractableObject>
      </group>

      {/* ── Return Door leading back to Archive Vault (Z = 10.5) ── */}
      <Door
        position={[0, 1.6, 10.5]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

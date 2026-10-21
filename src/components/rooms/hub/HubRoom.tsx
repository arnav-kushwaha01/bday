"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import {
  RoomShell,
  Pedestal,
  EvidenceMarker,
  WestworldEdisonBulb,
  WestworldCandleLantern,
} from "../RoomPrimitives";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import {
  CorridorEntrance,
  ElevatorEntrance,
  VaultDoorEntrance,
  WindowPortalEntrance,
  BookcaseEntrance,
  FrostedOfficeDoorEntrance,
  StaircaseDescentEntrance,
  GrandFinalPortalEntrance,
} from "./HubEntrances";
import { CakeEasterEggSafe } from "@/components/easter-eggs/CakeEasterEggSafe";

const DUST_COUNT = 300;
const INITIAL_PARTICLE_POSITIONS = new Float32Array(DUST_COUNT * 3);
for (let i = 0; i < DUST_COUNT; i++) {
  const s1 = Math.sin((i + 1) * 12.9898) * 43758.5453;
  const s2 = Math.sin((i + 1) * 78.233) * 43758.5453;
  const s3 = Math.sin((i + 1) * 45.164) * 43758.5453;
  INITIAL_PARTICLE_POSITIONS[i * 3] = (s1 - Math.floor(s1) - 0.5) * 15;
  INITIAL_PARTICLE_POSITIONS[i * 3 + 1] = (s2 - Math.floor(s2)) * 5.5 + 0.1;
  INITIAL_PARTICLE_POSITIONS[i * 3 + 2] = (s3 - Math.floor(s3) - 0.5) * 15;
}

/**
 * HubRoom — the central murder/mystery archive vault with ANSHIKA case centerpiece,
 * 7 architecturally distinct entrances (corridor, elevator, vault door, window, bookcase,
 * office doors, staircase), numbered crime scene markers, and red investigation lines.
 */
export default function HubRoom() {
  const enterCinematic = useTransitionStore((s) => s.enterCinematic);
  const openMemory = useTransitionStore((s) => s.openMemory);
  const titleRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Fresh array for particle positions per component instance
  const particlePositions = useMemo(
    () => new Float32Array(INITIAL_PARTICLE_POSITIONS),
    []
  );

  useFrame((_, delta) => {
    // Gentle title float
    if (titleRef.current) {
      titleRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.02;
    }

    // Animate dust particles in warm amber lighting
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * 0.08;
        if (positions[i + 1] > 5.5) positions[i + 1] = 0.1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <RoomShell width={22} depth={22} height={7}>
      {/* ── Central Architectural Skylight / Dome Rim (Ceiling feature) ── */}
      <group position={[0, 6.9, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.6, 32]} />
          <meshStandardMaterial color={THEME.folder.desk} roughness={0.6} metalness={0.4} />
        </mesh>
        <pointLight position={[0, -0.5, 0]} intensity={1.2} color="#fef3c7" distance={16} />

        {/* 4 Hanging Westworld Edison bulbs from dome rim */}
        <WestworldEdisonBulb position={[2.5, -2.1, 0]} cordLength={2.1} />
        <WestworldEdisonBulb position={[-2.5, -2.1, 0]} cordLength={2.1} />
        <WestworldEdisonBulb position={[0, -2.1, 2.5]} cordLength={2.1} />
        <WestworldEdisonBulb position={[0, -2.1, -2.5]} cordLength={2.1} />
      </group>

      {/* ── ANSHIKA Centerpiece & Investigation Case Station ── */}
      <group ref={titleRef} position={[0, 3.5, -1.8]}>
        {/* Flanking Westworld Candle Lanterns */}
        <WestworldCandleLantern position={[-1.2, -1.6, 0.2]} scale={0.9} />
        <WestworldCandleLantern position={[1.2, -1.6, 0.2]} scale={0.9} />

        <Pedestal position={[0, -2.5, 0]}>
          {/* Glowing Manila Case Monolith on the pedestal — Clickable for Birthday Celebration */}
          <InteractableObject
            id="hub-centerpiece-monolith"
            type="object"
            position={[0, 0, 0]}
            interactionPrompt="✦ UNLOCK 23RD BIRTHDAY CELEBRATION & MELODY // ANSHIKA ✦"
            onInteract={() => openMemory("happy-birthday-celebration")}
            showMarker={true}
          >
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
              <group
                onClick={(e) => {
                  e.stopPropagation();
                  openMemory("happy-birthday-celebration");
                }}
              >
                {/* Manila Dossier Book Shape */}
                <mesh castShadow>
                  <boxGeometry args={[0.75, 0.95, 0.14]} />
                  <meshStandardMaterial
                    color={THEME.folder.base}
                    roughness={0.7}
                    metalness={0.1}
                    emissive={THEME.classified.stamp}
                    emissiveIntensity={0.15}
                  />
                </mesh>
                {/* Red classified stripe */}
                <mesh position={[0, 0, 0.075]}>
                  <planeGeometry args={[0.7, 0.16]} />
                  <meshStandardMaterial color={THEME.classified.bright} />
                </mesh>
                <Text
                  position={[0, 0, 0.08]}
                  fontSize={0.065}
                  color="#ffffff"
                  fontWeight={800}
                  letterSpacing={0.2}
                >
                  CASE #1025
                </Text>
              </group>
            </Float>
          </InteractableObject>
        </Pedestal>

        {/* Classified Stamp Above Title */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.12}
          color={THEME.classified.bright}
          fontWeight={700}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.4}
        >
          RESTRICTED ARCHIVE // TOP SECRET
        </Text>

        <Text
          fontSize={0.8}
          color={THEME.evidence.bright}
          fontWeight={400}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          maxWidth={10}
        >
          ANSHIKA
        </Text>

        <Text
          position={[0, -0.7, 0]}
          fontSize={0.14}
          color={THEME.evidence.primary}
          fontWeight={600}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.4}
        >
          CASE DOSSIER NO. 1025 • THE PRIVATE ARCHIVE
        </Text>

        {/* Key Spotlight on the centerpiece */}
        <spotLight
          position={[0, 4.5, 3]}
          target-position={[0, 3, -1.8]}
          intensity={1.5}
          angle={0.45}
          penumbra={0.8}
          color="#fef3c7"
          castShadow
        />
      </group>

      {/* ── Central Middle Platform & Floor Medallion (Interactive Birthday Trigger) ── */}
      <group position={[0, 0, -1.8]}>
        {/* Raised Circular Dais Platform */}
        <mesh
          position={[0, 0.08, 0]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            openMemory("happy-birthday-celebration");
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <cylinderGeometry args={[2.5, 2.7, 0.16, 48]} />
          <meshStandardMaterial
            color="#140f0b"
            roughness={0.65}
            metalness={0.35}
          />
        </mesh>

        {/* Brass Glowing Rim */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.45, 2.55, 48]} />
          <meshStandardMaterial
            color={THEME.evidence.primary}
            emissive={THEME.evidence.primary}
            emissiveIntensity={0.9}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Middle Platform Interactable Object */}
        <InteractableObject
          id="hub-birthday-platform"
          type="evidence"
          position={[0, 0.4, 0]}
          interactionPrompt="✦ UNLOCK 23RD BIRTHDAY CELEBRATION & MELODY // ANSHIKA ✦"
          onInteract={() => openMemory("happy-birthday-celebration")}
          showMarker={true}
        >
          <mesh visible={false}>
            <cylinderGeometry args={[2.6, 2.6, 0.6, 16]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>

        {/* Circular Medallion Rings */}
        <group position={[0, 0.18, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.7, 1.76, 32]} />
            <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.7} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.1, 1.15, 32]} />
            <meshBasicMaterial color={THEME.classified.bright} transparent opacity={0.6} />
          </mesh>
        </group>
      </group>

      {/* ── Red Investigation String Lines on Floor (Connecting to entrances) ── */}
      <group position={[0, 0.02, 0]}>
        {/* String to Corridor (Gallery) */}
        <mesh position={[-2.8, 0, -5.8]} rotation={[-Math.PI / 2, 0, -0.32]}>
          <planeGeometry args={[8.5, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
        {/* String to Elevator (Versions) */}
        <mesh position={[2.8, 0, -5.8]} rotation={[-Math.PI / 2, 0, 0.32]}>
          <planeGeometry args={[8.5, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
        {/* String to Vault Door (Evidence) */}
        <mesh position={[-5.8, 0, -2.4]} rotation={[-Math.PI / 2, 0, 0.1]}>
          <planeGeometry args={[8.2, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
        {/* String to Window (Distance) */}
        <mesh position={[-5.8, 0, 0.8]} rotation={[-Math.PI / 2, 0, -0.28]}>
          <planeGeometry args={[8.4, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
        {/* String to Bookcase (Little Things) */}
        <mesh position={[5.8, 0, -2.4]} rotation={[-Math.PI / 2, 0, -0.1]}>
          <planeGeometry args={[8.2, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
        {/* String to Office Doors (Main Character) */}
        <mesh position={[5.8, 0, 0.8]} rotation={[-Math.PI / 2, 0, 0.28]}>
          <planeGeometry args={[8.4, 0.025]} />
          <meshBasicMaterial color={THEME.classified.string} transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ── Floating dust particles ── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={THEME.evidence.primary}
          size={0.02}
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      {/* ── 7+1 ARCHITECTURALLY DISTINCT ENTRANCES ── */}

      {/* 1. Back Wall Left — Arched Corridor (HER GALLERY) */}
      <CorridorEntrance position={[-4, 0, -9.8]} />
      <EvidenceMarker number="01" position={[-5.4, 0, -9.2]} rotation={[0, 0.2, 0]} />

      {/* 2. Back Wall Right — Vintage Scissor Elevator (VERSIONS OF HER) */}
      <ElevatorEntrance position={[4, 0, -9.8]} />
      <EvidenceMarker number="02" position={[5.4, 0, -9.2]} rotation={[0, -0.2, 0]} />

      {/* Secret Archival Evidence Safe — EASTER EGG #01: THE 23RD BIRTHDAY CAKE */}
      <CakeEasterEggSafe position={[0, 0, -9.4]} />

      {/* 3. Left Wall Rear — Circular Steel Vault Door (EVIDENCE ROOM) */}
      <VaultDoorEntrance
        position={[-9.8, 0, -3]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <EvidenceMarker number="03" position={[-9.2, 0, -4.4]} rotation={[0, Math.PI / 2, 0]} />

      {/* 4. Left Wall Front — Panoramic Observation Window (THE DISTANCE) */}
      <WindowPortalEntrance
        position={[-9.8, 0, 3]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <EvidenceMarker number="04" position={[-9.2, 0, 4.4]} rotation={[0, Math.PI / 2, 0]} />

      {/* 5. Right Wall Rear — Secret Library Bookcase (LITTLE THINGS) */}
      <BookcaseEntrance
        position={[9.8, 0, -3]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <EvidenceMarker number="05" position={[9.2, 0, -4.4]} rotation={[0, -Math.PI / 2, 0]} />

      {/* 6. Right Wall Front — Double Frosted Office Doors (MAIN CHARACTER) */}
      <FrostedOfficeDoorEntrance
        position={[9.8, 0, 3]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <EvidenceMarker number="06" position={[9.2, 0, 4.4]} rotation={[0, -Math.PI / 2, 0]} />

      {/* 7. Front Wall Left — Descending Stone Staircase (UNWRITTEN CHAPTERS) */}
      <StaircaseDescentEntrance
        position={[-4, 0, 9.8]}
        rotation={[0, Math.PI, 0]}
      />
      <EvidenceMarker number="07" position={[-5.4, 0, 9.2]} rotation={[0, Math.PI, 0]} />

      {/* 8. Front Wall Right — Grand Ascending Portal with Velvet Ropes (THE FINAL FILE) */}
      <GrandFinalPortalEntrance
        position={[4, 0, 9.8]}
        rotation={[0, Math.PI, 0]}
      />
      <EvidenceMarker number="FINAL" position={[5.5, 0, 8.8]} rotation={[0, Math.PI, 0]} />

      {/* ── Floor Stencil Inscription ── */}
      <Text
        position={[0, 0.015, 7.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.11}
        color={THEME.folder.dark}
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.35}
      >
        EVIDENCE ARCHIVE // AUTHORIZED INVESTIGATOR ONLY
      </Text>
    </RoomShell>
  );
}

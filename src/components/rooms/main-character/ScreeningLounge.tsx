"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const CAST_IRON = new THREE.Color("#1a1510");
const MONITOR_BEZEL = new THREE.Color("#261c14");
const CRT_GLOW = "#38bdf8";
const REEL_AMBER = "#f59e0b";

/**
 * ScreeningLounge — The vintage film projection and motion-reel viewing station.
 * Left flank of Room 6 (X = -5.8, Z = -0.5).
 * Contains:
 * - Antique cinema film projector with dual rotating spools & light beam.
 * - Interactive CRT screen for "News Anchor Anshika" (vid-news-anchor).
 * - Interactive CRT screen for "Diva in the Wind" (vid-diva-wind).
 * - Brass stanchions and velvet ropes.
 */
export function ScreeningLounge({
  position = [-5.8, 0, -0.5],
}: {
  position?: [number, number, number];
}) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const spoolRef1 = useRef<THREE.Group>(null);
  const spoolRef2 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spoolRef1.current) spoolRef1.current.rotation.z += delta * 1.2;
    if (spoolRef2.current) spoolRef2.current.rotation.z += delta * 1.5;
  });

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* ─── Screening Room Platform / Rug ───────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[5.8, 3.2]} />
        <meshStandardMaterial color="#1b120c" roughness={0.85} />
      </mesh>
      {/* Brass Perimeter Inlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <planeGeometry args={[5.6, 3.0]} />
        <meshStandardMaterial color="#2d1d12" roughness={0.8} />
      </mesh>

      {/* ─── Archival Station Wall Banner ────────────────────────── */}
      <group position={[0, 4.6, -1.5]}>
        <Text
          position={[0, 0.16, 0]}
          fontSize={0.16}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.2}
        >
          MOTION PICTURE ARCHIVES // CINEMATIC REELS
        </Text>
        <Text
          position={[0, -0.12, 0]}
          fontSize={0.08}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.15}
        >
          IN FRONT OF THE CAMERA • PURE UNFILTERED CHARISMA
        </Text>
      </group>

      {/* ─── Screen 1: News Anchor Anshika (vid-news-anchor) ─────── */}
      <group position={[-1.6, 1.8, -1.2]}>
        {/* Mahogany Wall Console */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.45]} />
          <meshStandardMaterial color={THEME.folder.desk} roughness={0.65} />
        </mesh>
        {/* Brass Bevel on Console */}
        <mesh position={[0, -0.49, 0.23]}>
          <boxGeometry args={[1.82, 0.03, 0.04]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Vintage CRT Television Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.15, 0.4]} />
          <meshStandardMaterial color={MONITOR_BEZEL} roughness={0.7} />
        </mesh>
        {/* Inner Curved CRT Glass */}
        <mesh position={[0, 0, 0.19]}>
          <planeGeometry args={[1.2, 0.85]} />
          <meshStandardMaterial
            color="#080c14"
            emissive={CRT_GLOW}
            emissiveIntensity={0.2}
            roughness={0.15}
          />
        </mesh>

        {/* Glowing Test Screen Pattern / Scanlines */}
        <group position={[0, 0, 0.2]}>
          <Text
            position={[0, 0.18, 0]}
            fontSize={0.08}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.2}
          >
            [LIVE BROADCAST]
          </Text>
          <Text
            position={[0, 0.02, 0]}
            fontSize={0.07}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
          >
            NEWS ANCHOR ANSHIKA
          </Text>
          <Text
            position={[0, -0.14, 0]}
            fontSize={0.045}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            AUDIO NECESSARY • THE PROFESSIONAL ENERGY
          </Text>
        </group>

        {/* Screen Ambient Glow */}
        <pointLight position={[0, 0, 0.6]} intensity={0.65} color={CRT_GLOW} distance={2.5} />

        {/* Brass Plaque beneath CRT */}
        <group position={[0, -0.68, 0.24]}>
          <mesh>
            <boxGeometry args={[1.2, 0.16, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.045}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            REEL #01 • NEWS ANCHOR ANSHIKA (MP4)
          </Text>
        </group>

        {/* Interactable Screen Object */}
        <InteractableObject
          id="vid-news-anchor"
          type="video"
          position={[0, 0, 0]}
          interactionPrompt="[E] SCREEN VIDEO: NEWS ANCHOR ANSHIKA"
          onInteract={() => openMemory("vid-news-anchor")}
          radius={2.8}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.5, 1.2, 0.5]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Screen 2: Diva in the Wind (vid-diva-wind) ──────────── */}
      <group position={[1.6, 1.8, -1.2]}>
        {/* Mahogany Wall Console */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.45]} />
          <meshStandardMaterial color={THEME.folder.desk} roughness={0.65} />
        </mesh>
        {/* Brass Bevel on Console */}
        <mesh position={[0, -0.49, 0.23]}>
          <boxGeometry args={[1.82, 0.03, 0.04]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Vintage CRT Television Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.15, 0.4]} />
          <meshStandardMaterial color={MONITOR_BEZEL} roughness={0.7} />
        </mesh>
        {/* Inner Curved CRT Glass */}
        <mesh position={[0, 0, 0.19]}>
          <planeGeometry args={[1.2, 0.85]} />
          <meshStandardMaterial
            color="#140a08"
            emissive={REEL_AMBER}
            emissiveIntensity={0.2}
            roughness={0.15}
          />
        </mesh>

        {/* Glowing Screen Content */}
        <group position={[0, 0, 0.2]}>
          <Text
            position={[0, 0.18, 0]}
            fontSize={0.08}
            color={REEL_AMBER}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.2}
          >
            [CINEMA ARCHIVE]
          </Text>
          <Text
            position={[0, 0.02, 0]}
            fontSize={0.07}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
          >
            DIVA IN THE WIND
          </Text>
          <Text
            position={[0, -0.14, 0]}
            fontSize={0.045}
            color="#d4af37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            HAIR IN THE WIND • EFFORTLESS GLAMOUR
          </Text>
        </group>

        {/* Screen Ambient Glow */}
        <pointLight position={[0, 0, 0.6]} intensity={0.65} color={REEL_AMBER} distance={2.5} />

        {/* Brass Plaque beneath CRT */}
        <group position={[0, -0.68, 0.24]}>
          <mesh>
            <boxGeometry args={[1.2, 0.16, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.045}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            REEL #02 • DIVA IN THE WIND (MP4)
          </Text>
        </group>

        {/* Interactable Screen Object */}
        <InteractableObject
          id="vid-diva-wind"
          type="video"
          position={[0, 0, 0]}
          interactionPrompt="[E] SCREEN VIDEO: DIVA IN THE WIND"
          onInteract={() => openMemory("vid-diva-wind")}
          radius={2.8}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.5, 1.2, 0.5]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Center: Antique 35mm Film Projector on Tripod ────────── */}
      <group position={[0, 0, 0.7]} rotation={[0, Math.PI, 0]}>
        {/* Tripod Legs */}
        {[-0.25, 0.25].map((x) => (
          <mesh key={x} position={[x, 0.6, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
            <cylinderGeometry args={[0.02, 0.025, 1.2, 8]} />
            <meshStandardMaterial color={CAST_IRON} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.6, -0.22]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 1.2, 8]} />
          <meshStandardMaterial color={CAST_IRON} roughness={0.7} />
        </mesh>

        {/* Projector Body */}
        <group position={[0, 1.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.4, 0.45]} />
            <meshStandardMaterial color={CAST_IRON} roughness={0.6} metalness={0.5} />
          </mesh>

          {/* Brass Projection Lens Tube */}
          <mesh position={[0, 0.05, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.2, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>

          {/* Projector Beam Light */}
          <spotLight
            position={[0, 0.05, 0.35]}
            target-position={[0, 1.8, -2.5]}
            angle={0.4}
            penumbra={0.7}
            intensity={1.2}
            color="#fffbeb"
            distance={4.5}
          />

          {/* Top Film Spool */}
          <group ref={spoolRef1} position={[0, 0.32, -0.05]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <torusGeometry args={[0.16, 0.015, 8, 24]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
              <meshStandardMaterial color={CAST_IRON} />
            </mesh>
          </group>

          {/* Bottom Film Spool */}
          <group ref={spoolRef2} position={[0, -0.15, -0.22]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <torusGeometry args={[0.16, 0.015, 8, 24]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
              <meshStandardMaterial color={CAST_IRON} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─── Velvet Cinema Stanchions & Rope ─────────────────────── */}
      {[-2.4, 0, 2.4].map((x) => (
        <group key={x} position={[x, 0, 1.4]}>
          {/* Brass Base */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.06, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Brass Pole */}
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Polished Sphere Cap */}
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Red Velvet Rope */}
      <mesh position={[-1.2, 0.78, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.38, 12]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      <mesh position={[1.2, 0.78, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.38, 12]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
    </group>
  );
}

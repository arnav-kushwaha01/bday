"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = "#d4af37";
const CRIMSON_RED = "#b91c1c";
const MAHOGANY = "#1f150e";

interface LittleThingArtifactProps {
  id: string;
  index: number;
  content: string;
  position: [number, number, number];
}

/**
 * Procedural 3D symbolic physical prop for each specific memory quirk.
 */
function MemoryProp({ id }: { id: string }) {
  switch (id) {
    case "lt-1": // 'Annav' — Golden Telephone Handset & Telegram Envelope
      return (
        <group>
          {/* Handset Bar */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Earpiece */}
          <mesh position={[-0.12, 0.12, 0]}>
            <cylinderGeometry args={[0.06, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#1a140f" roughness={0.6} />
          </mesh>
          {/* Mouthpiece */}
          <mesh position={[0.12, -0.12, 0]}>
            <cylinderGeometry args={[0.03, 0.06, 0.08, 16]} />
            <meshStandardMaterial color="#1a140f" roughness={0.6} />
          </mesh>
          {/* Engraved Badge */}
          <mesh position={[0, -0.22, 0.04]}>
            <boxGeometry args={[0.26, 0.09, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <Text
            position={[0, -0.22, 0.055]}
            fontSize={0.04}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.15}
          >
            ANNAV
          </Text>
        </group>
      );

    case "lt-2": // 'I hate you' — Smirking Drama Masks (Crimson & Gold)
      return (
        <group>
          {/* Smirking Mask */}
          <mesh position={[-0.08, 0.04, 0]} rotation={[0, -0.2, 0.1]}>
            <sphereGeometry args={[0.13, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial color={CRIMSON_RED} roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Golden Smiling Mask */}
          <mesh position={[0.08, -0.04, 0.05]} rotation={[0, 0.2, -0.1]}>
            <sphereGeometry args={[0.13, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
        </group>
      );

    case "lt-3": // 'Why haven't you texted me for an hour' — Antique Brass Pocket Watch
      return (
        <group>
          {/* Watch Body */}
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.85} />
          </mesh>
          {/* Watch Face (Parchment) */}
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
          {/* Hour & Minute Hands locked at 1 hour */}
          <mesh position={[0, 0.03, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.015, 0.09, 0.005]} />
            <meshBasicMaterial color="#080605" />
          </mesh>
          <mesh position={[0.04, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <boxGeometry args={[0.012, 0.12, 0.005]} />
            <meshBasicMaterial color={CRIMSON_RED} />
          </mesh>
          {/* Crown Loop */}
          <mesh position={[0, 0.22, 0]}>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
          </mesh>
        </group>
      );

    case "lt-4": // 'Bahot busy hoge na' — Brass Magnifying Glass over Telegram
      return (
        <group>
          {/* Glass Lens Rim */}
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.13, 0.018, 12, 32]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.85} />
          </mesh>
          {/* Glass Lens */}
          <mesh position={[0, 0.08, 0]}>
            <circleGeometry args={[0.12, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Wooden Handle */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.028, 0.24, 12]} />
            <meshStandardMaterial color={MAHOGANY} roughness={0.6} />
          </mesh>
        </group>
      );

    case "lt-5": // 11:11 — Twin Glowing Celestial Obelisks
      return (
        <group>
          {/* Left Pillar 1 */}
          <mesh position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.045, 0.32, 0.045]} />
            <meshStandardMaterial
              color={BRASS_GOLD}
              emissive={BRASS_GOLD}
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
          {/* Left Pillar 2 */}
          <mesh position={[-0.03, 0, 0]}>
            <boxGeometry args={[0.045, 0.32, 0.045]} />
            <meshStandardMaterial
              color={BRASS_GOLD}
              emissive={BRASS_GOLD}
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
          {/* Colon */}
          <mesh position={[0.035, 0.06, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.035, -0.06, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Right Pillar 1 */}
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.045, 0.32, 0.045]} />
            <meshStandardMaterial
              color={BRASS_GOLD}
              emissive={BRASS_GOLD}
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
          {/* Right Pillar 2 */}
          <mesh position={[0.17, 0, 0]}>
            <boxGeometry args={[0.045, 0.32, 0.045]} />
            <meshStandardMaterial
              color={BRASS_GOLD}
              emissive={BRASS_GOLD}
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
        </group>
      );

    case "lt-6": // 'Crying over little things' — Faceted Teardrop Crystal Prism
      return (
        <group>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.14, 0.35, 8]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight color="#7dd3fc" intensity={0.9} distance={1.8} />
        </group>
      );

    case "lt-7": // 'Falls and trips constantly / Clumsiness' — Tilted Brass Boots & Caution Tag
      return (
        <group rotation={[0.2, -0.3, 0.35]}>
          <mesh position={[-0.05, 0, 0]}>
            <boxGeometry args={[0.07, 0.16, 0.14]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0.05, 0.06, -0.04]} rotation={[0.3, 0.2, -0.4]}>
            <boxGeometry args={[0.07, 0.16, 0.14]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      );

    case "lt-8": // 'Telling him how much she misses him' — Wax-Sealed Letter & Golden Quill
      return (
        <group>
          {/* Folded Parchment Envelope */}
          <mesh rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.28, 0.18, 0.015]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.85} />
          </mesh>
          {/* Crimson Wax Seal */}
          <mesh position={[0, 0, 0.015]}>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
            <meshStandardMaterial color={CRIMSON_RED} roughness={0.4} />
          </mesh>
          {/* Golden Quill Pen */}
          <mesh position={[0.1, 0.08, 0.04]} rotation={[0, 0, -0.7]}>
            <cylinderGeometry args={[0.005, 0.012, 0.3, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      );

    case "lt-9": // 'Sleeping in the library' — Stack of Leather Law Books & Spectacles
      return (
        <group>
          {/* Bottom Book */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.28, 0.05, 0.2]} />
            <meshStandardMaterial color="#451a03" roughness={0.7} />
          </mesh>
          {/* Middle Book */}
          <mesh position={[0.02, 0, 0.01]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.19]} />
            <meshStandardMaterial color={CRIMSON_RED} roughness={0.7} />
          </mesh>
          {/* Top Book */}
          <mesh position={[-0.01, 0.06, -0.01]} rotation={[0, -0.08, 0]}>
            <boxGeometry args={[0.24, 0.05, 0.18]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Reading Spectacles */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.006, 8, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
          </mesh>
        </group>
      );

    case "lt-10": // 'She gave him flowers / Role reversal' — Wild Roses under Glass Cloche
    default:
      return (
        <group>
          {/* Preserved Red Rose Blossom */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={CRIMSON_RED} roughness={0.5} />
          </mesh>
          {/* Rose Stem */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          {/* Cylindrical Glass Cloche Dome */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.28, 24, 1, true]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.6}
            />
          </mesh>
          {/* Cloche Top Knob */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} />
          </mesh>
        </group>
      );
  }
}

export function LittleThingArtifact({
  id,
  index,
  content,
  position,
}: LittleThingArtifactProps) {
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const openMemory = useTransitionStore((s) => s.openMemory);

  const [isNear, setIsNear] = useState(false);

  // Smooth proximity detection in useFrame
  useFrame(({ camera }) => {
    const artifactVec = new THREE.Vector3(...position);
    const dist = camera.position.distanceTo(artifactVec);
    const near = dist < 3.2;

    if (near !== isNear) {
      setIsNear(near);
    }

    // Smoothly interpolate spotlight & pointlight intensity based on player proximity
    const targetIntensity = near ? 2.4 : 0.4;
    if (spotlightRef.current) {
      spotlightRef.current.intensity = THREE.MathUtils.lerp(
        spotlightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        near ? 1.2 : 0.3,
        0.08
      );
    }
  });

  return (
    <group position={position}>
      {/* ─── Pedestal Base & Glass Cloche Tray ─────────────────── */}
      <group position={[0, -0.6, 0]}>
        {/* Mahogany Fluted Column */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.26, 0.32, 1.2, 16]} />
          <meshStandardMaterial color={MAHOGANY} roughness={0.7} />
        </mesh>

        {/* Brass Beveled Capital / Pedestal Cap */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.34, 0.28, 0.06, 24]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Observation Tag Number */}
        <group position={[0, 0.45, 0.31]}>
          <mesh>
            <planeGeometry args={[0.22, 0.12]} />
            <meshBasicMaterial color="#080605" />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.06}
            color={THEME.evidence.primary}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.1}
          >
            #{String(index + 1).padStart(2, "0")}
          </Text>
        </group>
      </group>

      {/* ─── Overhead Dedicated Gallery Spotlight ───────────────── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 3.2, 0.2]}
        target-position={[position[0], position[1], position[2]]}
        angle={0.45}
        penumbra={0.6}
        intensity={0.4}
        color="#fef3c7"
        distance={6}
      />

      <pointLight
        ref={pointLightRef}
        position={[0, 0.2, 0]}
        intensity={0.3}
        color={BRASS_GOLD}
        distance={2.5}
      />

      {/* ─── Floating Symbolic Memory Artifact ─────────────────── */}
      <Float speed={1.8} floatIntensity={0.25} rotationIntensity={0.3}>
        <group position={[0, 0.25, 0]}>
          <MemoryProp id={id} />
        </group>
      </Float>

      {/* ─── Dynamic Proximity Reveal Typography ───────────────── */}
      <group ref={textGroupRef} position={[0, 0.95, 0]}>
        {/* Header Label: Always visible, brightens on approach */}
        <Text
          position={[0, 0.22, 0]}
          fontSize={0.06}
          color={isNear ? THEME.evidence.primary : "#9c7a4c"}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
          letterSpacing={0.2}
        >
          THE LITTLE THING I NOTICE ABOUT YOU:
        </Text>

        {/* Detailed Quirk Content: Revealed prominently */}
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.075}
          color={isNear ? "#fef3c7" : "rgba(226, 217, 204, 0.6)"}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
          lineHeight={1.35}
          fontStyle="italic"
        >
          {`"${content}"`}
        </Text>
      </group>

      {/* ─── Interactable Object Registration ───────────────────── */}
      <InteractableObject
        id={id}
        type="evidence"
        position={position}
        interactionPrompt={`[E] INSPECT CASE DETAIL #${String(index + 1).padStart(2, "0")}`}
        onInteract={() => openMemory(id)}
        radius={2.8}
        showMarker={true}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </InteractableObject>
    </group>
  );
}

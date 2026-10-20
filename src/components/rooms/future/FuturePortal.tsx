"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const PORTAL_STONE = new THREE.Color("#16120e");
const CELESTIAL_VOID = new THREE.Color("#080a10");

interface FuturePortalProps {
  id: string;
  index: number;
  title: string;
  description: string;
  symbol: string;
  position: [number, number, number];
  rotationY: number;
}

/**
 * Procedural 3D Miniature Environment for each unwritten chapter symbol.
 */
function MiniatureEnvironment({ symbol }: { symbol: string }) {
  const spinRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.4;
    }
  });

  switch (symbol) {
    case "globe": // THE WORLD MAP
      return (
        <group ref={spinRef} position={[0, 1.7, 0.15]}>
          {/* Armillary Outer Ring */}
          <mesh rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.55, 0.02, 8, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Armillary Inner Ring */}
          <mesh rotation={[-0.4, Math.PI / 2, 0]}>
            <torusGeometry args={[0.48, 0.015, 8, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Celestial Terrestrial Globe */}
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          {/* Gold Continents Emboss */}
          <mesh>
            <icosahedronGeometry args={[0.355, 1]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.7} wireframe />
          </mesh>
          {/* Vintage Leather Travel Trunk at base */}
          <group position={[0, -0.65, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.28, 0.32]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.165]}>
              <boxGeometry args={[0.52, 0.03, 0.01]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
            </mesh>
          </group>
        </group>
      );

    case "lightning": // THE ADRENALINE FILE
      return (
        <group position={[0, 1.7, 0.15]}>
          {/* Stylized Paragliding Wing */}
          <mesh position={[0, 0.5, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.65, 0.15, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#e11d48" roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Glowing Golden Lightning Bolt */}
          <group ref={spinRef} position={[0, -0.05, 0]}>
            <mesh>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#facc15"
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>
            {/* Carabiner Loops */}
            {[-0.18, 0.18].map((x) => (
              <mesh key={x} position={[x, -0.3, 0]}>
                <torusGeometry args={[0.07, 0.015, 8, 16]} />
                <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
              </mesh>
            ))}
          </group>
        </group>
      );

    case "star": // MASTER OF ALL TRADES
      return (
        <group ref={spinRef} position={[0, 1.7, 0.15]}>
          {/* Radiant 8-Point Star */}
          <mesh>
            <octahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial
              color={BRASS_GOLD}
              emissive={BRASS_GOLD}
              emissiveIntensity={0.6}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          {/* Artist's Palette */}
          <group position={[-0.25, -0.4, 0]} rotation={[0.4, 0, -0.3]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            {/* Paint Dabs */}
            <mesh position={[0.08, 0.02, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-0.06, 0.02, 0.08]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0, 0.02, -0.08]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
          </group>
          {/* Violin Scroll / Clef */}
          <group position={[0.25, -0.35, 0]} rotation={[-0.2, 0, 0.3]}>
            <mesh>
              <torusGeometry args={[0.12, 0.025, 8, 16]} />
              <meshStandardMaterial color="#78350f" roughness={0.5} />
            </mesh>
          </group>
        </group>
      );

    case "mountain": // THE MOUNTAINS
      return (
        <group position={[0, 1.5, 0.15]}>
          {/* Center Main Peak */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <coneGeometry args={[0.45, 0.85, 4]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Main Peak Snowcap */}
          <mesh position={[0, 0.52, 0]}>
            <coneGeometry args={[0.22, 0.35, 4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Left Flank Peak */}
          <mesh position={[-0.32, 0.05, 0.05]} castShadow>
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[-0.32, 0.23, 0.05]}>
            <coneGeometry args={[0.15, 0.25, 4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Right Flank Peak */}
          <mesh position={[0.32, 0, -0.05]} castShadow>
            <coneGeometry args={[0.32, 0.55, 4]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0.32, 0.18, -0.05]}>
            <coneGeometry args={[0.16, 0.22, 4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Cloud Band */}
          <mesh position={[0, 0.05, 0.1]}>
            <torusGeometry args={[0.45, 0.06, 8, 20]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={0.5} />
          </mesh>
        </group>
      );

    case "wave": // THE COASTLINES
      return (
        <group position={[0, 1.6, 0.15]}>
          {/* Sunset Horizon Disk */}
          <mesh position={[0, 0.3, -0.15]}>
            <circleGeometry args={[0.38, 24]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#ea580c"
              emissiveIntensity={1.0}
            />
          </mesh>
          {/* Front Ocean Swell */}
          <mesh position={[0, -0.1, 0.08]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} transparent opacity={0.85} />
          </mesh>
          {/* White Seafoam Crest */}
          <mesh position={[0, -0.02, 0.15]} rotation={[0, 0, 0.2]}>
            <torusGeometry args={[0.48, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
          </mesh>
          {/* Miniature Shoreline Lighthouse */}
          <group position={[0.35, 0, 0.05]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.07, 0.35, 12]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </group>
      );

    case "city": // NEW YORK
      return (
        <group position={[0, 1.6, 0.15]}>
          {/* Center Chrysler-Style Spire */}
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.26, 0.8, 0.26]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Terraced Crown */}
            <mesh position={[0, 0.65, 0]}>
              <coneGeometry args={[0.13, 0.35, 4]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.9} />
            </mesh>
            {/* Spire Needle */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.008, 0.015, 0.25, 8]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.95} />
            </mesh>
          </group>
          {/* Left Tower */}
          <mesh position={[-0.26, 0.05, 0.04]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Right Tower */}
          <mesh position={[0.26, 0.1, -0.04]} castShadow>
            <boxGeometry args={[0.22, 0.7, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          {/* Glowing Windows */}
          <pointLight position={[0, 0.3, 0.2]} intensity={0.6} color="#fef08a" distance={2} />
        </group>
      );

    case "rocket": // THE CAREER ARC
      return (
        <group position={[0, 1.7, 0.15]}>
          {/* Laurel Wreath Arch */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.48, 0.025, 8, 24, Math.PI * 1.4]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Streamlined Rocket Fuselage */}
          <group ref={spinRef} position={[0, 0.1, 0]} rotation={[0, 0, 0.2]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.1, 0.45, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Nose Cone */}
            <mesh position={[0, 0.28, 0]}>
              <coneGeometry args={[0.06, 0.16, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            {/* Fins */}
            {[-0.08, 0.08].map((x) => (
              <mesh key={x} position={[x, -0.15, 0]}>
                <boxGeometry args={[0.06, 0.12, 0.02]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
            ))}
            {/* Flame Plume */}
            <mesh position={[0, -0.32, 0]}>
              <coneGeometry args={[0.08, 0.22, 12]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#ea580c"
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        </group>
      );

    case "home": // THE HOUSE (with dogs!)
      return (
        <group position={[0, 1.4, 0.15]}>
          {/* Cottage Walls */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.65, 0.42, 0.45]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          {/* Pitched Gable Roof */}
          <mesh position={[0, 0.48, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.52, 0.28, 4]} />
            <meshStandardMaterial color="#7f1d1d" roughness={0.6} />
          </mesh>
          {/* Stone Chimney */}
          <mesh position={[0.2, 0.55, -0.1]}>
            <boxGeometry args={[0.1, 0.25, 0.1]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Glowing Front Door / Window */}
          <mesh position={[0, 0.16, 0.23]}>
            <planeGeometry args={[0.18, 0.28]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={1.2}
            />
          </mesh>
          {/* Front Yard Lawn Platform */}
          <mesh position={[0, -0.02, 0.22]}>
            <boxGeometry args={[0.75, 0.04, 0.35]} />
            <meshStandardMaterial color="#14532d" roughness={0.9} />
          </mesh>
          {/* Dog Silhouette 1 (Golden Retriever) */}
          <group position={[-0.2, 0.06, 0.25]}>
            <mesh>
              <boxGeometry args={[0.12, 0.08, 0.06]} />
              <meshStandardMaterial color="#d97706" roughness={0.7} />
            </mesh>
            <mesh position={[0.07, 0.05, 0]}>
              <boxGeometry args={[0.05, 0.06, 0.05]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
          </group>
          {/* Dog Silhouette 2 */}
          <group position={[0.2, 0.05, 0.28]}>
            <mesh>
              <boxGeometry args={[0.1, 0.07, 0.05]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
            <mesh position={[-0.06, 0.04, 0]}>
              <boxGeometry args={[0.04, 0.05, 0.04]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
          </group>
        </group>
      );

    case "sun": // WHAT SHE DESERVES
    default:
      return (
        <group ref={spinRef} position={[0, 1.7, 0.15]}>
          {/* Central Radiant Sun Core */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* 12 Radiating Sun Rays */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((r) => {
            const rAngle = (r / 12) * Math.PI * 2;
            return (
              <mesh
                key={r}
                position={[Math.cos(rAngle) * 0.45, Math.sin(rAngle) * 0.45, 0]}
                rotation={[0, 0, rAngle - Math.PI / 2]}
              >
                <coneGeometry args={[0.05, 0.22, 4]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#f59e0b"
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
          {/* Ambient Sun Warmth Glow */}
          <pointLight position={[0, 0, 0.3]} intensity={1.2} color="#fde047" distance={3.5} />
        </group>
      );
  }
}

/**
 * FuturePortal — A monumental architectural archway and diorama for an unwritten chapter.
 */
export function FuturePortal({
  id,
  index,
  title,
  description,
  symbol,
  position,
  rotationY,
}: FuturePortalProps) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const [isNear, setIsNear] = useState(false);

  useFrame(({ camera }) => {
    const worldPos = new THREE.Vector3(...position);
    const dist = camera.position.distanceTo(worldPos);
    const near = dist < 3.8;
    if (near !== isNear) {
      setIsNear(near);
    }
    if (spotlightRef.current) {
      const targetIntensity = near ? 1.6 : 0.45;
      spotlightRef.current.intensity = THREE.MathUtils.lerp(
        spotlightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ─── Monumental Arch Pedestal Base ──────────────────────── */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.4, 0.8]} />
        <meshStandardMaterial color={PORTAL_STONE} roughness={0.7} />
      </mesh>
      {/* Brass Pedestal Rim */}
      <mesh position={[0, 0.41, 0.405]}>
        <boxGeometry args={[2.42, 0.04, 0.02]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* ─── Archway Framing Pillars ─────────────────────────────── */}
      {/* Left Pillar */}
      <mesh position={[-0.95, 2.0, 0]} castShadow>
        <boxGeometry args={[0.3, 3.2, 0.4]} />
        <meshStandardMaterial color={PORTAL_STONE} roughness={0.75} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[0.95, 2.0, 0]} castShadow>
        <boxGeometry args={[0.3, 3.2, 0.4]} />
        <meshStandardMaterial color={PORTAL_STONE} roughness={0.75} />
      </mesh>
      {/* Top Lintel Arch */}
      <mesh position={[0, 3.75, 0]} castShadow>
        <boxGeometry args={[2.4, 0.4, 0.45]} />
        <meshStandardMaterial color={PORTAL_STONE} roughness={0.7} />
      </mesh>
      {/* Brass Cornice Trim */}
      <mesh position={[0, 3.96, 0.23]}>
        <boxGeometry args={[2.42, 0.04, 0.03]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* ─── Celestial Void Interior Backdrop ────────────────────── */}
      <mesh position={[0, 2.0, -0.05]}>
        <planeGeometry args={[1.6, 3.0]} />
        <meshStandardMaterial color={CELESTIAL_VOID} roughness={0.9} />
      </mesh>

      {/* ─── Miniature 3D Environment Floating Inside Void ───────── */}
      <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.15}>
        <group>
          <MiniatureEnvironment symbol={symbol} />
        </group>
      </Float>

      {/* ─── Chapter Tag Number Plaque ───────────────────────────── */}
      <group position={[0, 0.65, 0.42]}>
        <mesh>
          <boxGeometry args={[1.6, 0.22, 0.02]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.065}
          color="#080605"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.15}
        >
          CHAPTER #{String(index + 1).padStart(2, "0")} • {title}
        </Text>
      </group>

      {/* ─── Dynamic Proximity Header & Description ──────────────── */}
      <group position={[0, 4.25, 0.25]}>
        <Text
          position={[0, 0.18, 0]}
          fontSize={0.08}
          color={isNear ? THEME.evidence.primary : "#9c7a4c"}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.2}
        >
          THE UNWRITTEN HORIZON
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.065}
          color={isNear ? "#fef3c7" : "rgba(226, 217, 204, 0.6)"}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
          lineHeight={1.35}
          fontStyle="italic"
        >
          {`"${description}"`}
        </Text>
      </group>

      {/* ─── Dedicated Overhead Spotlight ────────────────────────── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 4.5, 1.2]}
        target-position={[position[0], position[1] + 1.6, position[2]]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.45}
        color="#fef3c7"
        distance={6}
      />

      {/* ─── Interactable Object ─────────────────────────────────── */}
      <InteractableObject
        id={id}
        type="evidence"
        position={position}
        interactionPrompt={`[E] REVEAL FUTURE CHAPTER: ${title}`}
        onInteract={() => openMemory(id)}
        radius={3.2}
        showMarker={true}
      >
        <mesh visible={false}>
          <boxGeometry args={[2.0, 3.5, 1.0]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </InteractableObject>
    </group>
  );
}

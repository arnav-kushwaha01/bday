"use client";

import { Suspense } from "react";
import { Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl } from "@/lib/assetManager";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const DARK_WALNUT = new THREE.Color(THEME.folder.desk);
const GREEN_MARBLE = new THREE.Color("#064e3b");
const LEATHER_BURGUNDY = new THREE.Color("#4c0519");

/**
 * ExecutiveSuite — The "Boss Energy" boardroom & managing director suite.
 * Right flank of Room 6 (X = 5.8, Z = -0.5).
 * Contains:
 * - Executive desk with marble top, emerald lamp, and brass nameplate.
 * - Framed hero portrait of "Boss Energy" (ph-business-woman).
 * - Framed hero portrait of "Hot Working Woman" (ph-hot-working).
 * - High-back executive director's chair.
 */
export function ExecutiveSuite({
  position = [5.8, 0, -0.5],
}: {
  position?: [number, number, number];
}) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const photoBossUrl = getPhotoUrl("her_looking_like_a_sexy_business-woman.jpeg");
  const photoWorkUrl = getPhotoUrl("looking like a hot working woman.jpeg");

  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      {/* ─── Boardroom Rug / Platform ────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[5.8, 3.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>
      {/* Gold Border Inlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <planeGeometry args={[5.6, 3.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* ─── Wall Inscription Header ─────────────────────────────── */}
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
          EXECUTIVE SUITE // BOSS ENERGY
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
          FIERCE, INTELLECTUAL, INDEPENDENT & UNSTOPPABLE
        </Text>
      </group>

      {/* ─── Executive Desk ──────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Desk Base & Pedestals */}
        <mesh position={[-1.0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.85, 1.2]} />
          <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
        </mesh>
        <mesh position={[1.0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.85, 1.2]} />
          <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
        </mesh>

        {/* Green Marble Top */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.08, 1.3]} />
          <meshStandardMaterial color={GREEN_MARBLE} roughness={0.25} metalness={0.2} />
        </mesh>

        {/* Brass Desk Rim */}
        <mesh position={[0, 0.9, 0.655]}>
          <boxGeometry args={[2.82, 0.06, 0.03]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Emerald Banker's Lamp on Desk */}
        <group position={[-0.8, 0.94, -0.2]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.3, 0.04]} rotation={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.2, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#052e16" roughness={0.2} />
          </mesh>
          <pointLight position={[0, 0.25, 0.06]} intensity={0.7} color="#a7f3d0" distance={2.5} />
        </group>

        {/* Brass Executive Nameplate */}
        <group position={[0, 0.96, 0.4]}>
          <mesh rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.14, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <Text
            position={[0, 0.02, 0.02]}
            rotation={[-0.3, 0, 0]}
            fontSize={0.035}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            ANSHIKA BAJPAI
          </Text>
          <Text
            position={[0, -0.03, 0.02]}
            rotation={[-0.3, 0, 0]}
            fontSize={0.022}
            color="#451a03"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
            letterSpacing={0.1}
          >
            MANAGING DIRECTOR OF CHARM
          </Text>
        </group>

        {/* High-Back Executive Leather Chair */}
        <group position={[0, 0, -0.6]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.65, 0.12, 0.6]} />
            <meshStandardMaterial color={LEATHER_BURGUNDY} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.95, -0.26]} castShadow>
            <boxGeometry args={[0.62, 0.9, 0.1]} />
            <meshStandardMaterial color={LEATHER_BURGUNDY} roughness={0.65} />
          </mesh>
          {/* Brass Base Column */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ─── Executive Portrait 1: Boss Energy (ph-business-woman) ─ */}
      <group position={[-1.5, 2.3, -1.3]}>
        {/* Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.9, 0.08]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Matting */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.34, 1.74]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Photo Image */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0.045]}>
            <DreiImage
              url={photoBossUrl}
              scale={[1.25, 1.65]}
              transparent
              toneMapped={false}
            />
          </group>
        </Suspense>

        {/* Plaque */}
        <group position={[0, -1.08, 0.04]}>
          <mesh>
            <boxGeometry args={[1.2, 0.18, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.05}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            PORTRAIT #01 • BOSS ENERGY
          </Text>
        </group>

        {/* Dedicated Downlight */}
        <spotLight
          position={[0, 1.5, 0.8]}
          target-position={[0, 0, 0]}
          intensity={1.1}
          angle={0.4}
          color="#fef3c7"
          distance={3.5}
        />

        {/* Interactable Object */}
        <InteractableObject
          id="ph-business-woman"
          type="photo"
          position={[0, 0, 0]}
          interactionPrompt="[E] INSPECT: BOSS ENERGY"
          onInteract={() => openMemory("ph-business-woman")}
          radius={2.8}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.5, 1.9, 0.4]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Executive Portrait 2: Hot Working Woman (ph-hot-working) */}
      <group position={[1.5, 2.3, -1.3]}>
        {/* Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.9, 0.08]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Matting */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.34, 1.74]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Photo Image */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0.045]}>
            <DreiImage
              url={photoWorkUrl}
              scale={[1.25, 1.65]}
              transparent
              toneMapped={false}
            />
          </group>
        </Suspense>

        {/* Plaque */}
        <group position={[0, -1.08, 0.04]}>
          <mesh>
            <boxGeometry args={[1.2, 0.18, 0.02]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.05}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            PORTRAIT #02 • HOT WORKING WOMAN
          </Text>
        </group>

        {/* Dedicated Downlight */}
        <spotLight
          position={[0, 1.5, 0.8]}
          target-position={[0, 0, 0]}
          intensity={1.1}
          angle={0.4}
          color="#fef3c7"
          distance={3.5}
        />

        {/* Interactable Object */}
        <InteractableObject
          id="ph-hot-working"
          type="photo"
          position={[0, 0, 0]}
          interactionPrompt="[E] INSPECT: HOT WORKING WOMAN"
          onInteract={() => openMemory("ph-hot-working")}
          radius={2.8}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.5, 1.9, 0.4]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>
    </group>
  );
}

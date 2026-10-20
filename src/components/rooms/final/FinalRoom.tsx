"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell, Door, WestworldCandleLantern } from "../RoomPrimitives";
import { anshikaData } from "@/data/anshika";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const DARK_WALNUT = new THREE.Color(THEME.folder.desk);
const WARM_LIGHT = "#fef3c7";
const KRAFT_BROWN = new THREE.Color("#9c7a4c");
const WAX_RED = new THREE.Color(THEME.classified.stamp);

/**
 * FinalRoom — The quietest scene in the archive.
 *
 * Implements SPEC.md rules 6 & 25:
 * - No HUD, near-silence, one chair, one table, one object.
 * - Inscription sequence: "25 OCTOBER" → "ANSHIKA" → the message excerpt.
 * - FINAL FILE object on the desk that opens the custom audio/voice player and full handwritten message.
 * - Ends with "ARCHIVE STATUS: COMPLETE." and "HAPPY 23RD BIRTHDAY, ANSHIKA."
 * - Subtle return door to Hub.
 */
export default function FinalRoom() {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (spotLightRef.current) {
      // Very gentle, almost imperceptible breathing pulse of the single spotlight
      spotLightRef.current.intensity = 1.35 + Math.sin(t * 1.2) * 0.08;
    }
    if (glowLightRef.current) {
      glowLightRef.current.intensity = 0.35 + Math.sin(t * 2.0) * 0.1;
    }
  });

  return (
    <RoomShell width={12} depth={12} height={6.5}>
      {/* ─── Overhead Single Archival Spotlight ──────────────────── */}
      <spotLight
        ref={spotLightRef}
        position={[0, 4.2, 0]}
        target-position={[0, 0.8, 0]}
        intensity={1.4}
        color={WARM_LIGHT}
        distance={7.5}
        angle={0.42}
        penumbra={0.75}
        castShadow
      />

      {/* ─── Center Examination Table ───────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Table Top */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.06, 0.85]} />
          <meshStandardMaterial color={DARK_WALNUT} roughness={0.65} />
        </mesh>

        {/* Brass Beveled Table Trim */}
        <mesh position={[0, 0.74, 0.425]}>
          <boxGeometry args={[1.42, 0.04, 0.02]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Green Leather Center Blotter */}
        <mesh position={[0, 0.771, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 0.65]} />
          <meshStandardMaterial color="#064e3b" roughness={0.7} />
        </mesh>

        {/* Turned Wooden Table Legs */}
        {[
          [-0.6, 0.37, -0.35],
          [0.6, 0.37, -0.35],
          [-0.6, 0.37, 0.35],
          [0.6, 0.37, 0.35],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.025, 0.74, 12]} />
              <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
            </mesh>
            {/* Brass Foot Cap */}
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.028, 0.03, 0.04, 12]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Westworld Candle Lantern on table corner */}
        <WestworldCandleLantern position={[-0.45, 0.77, -0.15]} scale={0.7} />

        {/* ─── The Single Object: THE FINAL FILE ────────────────── */}
        <group position={[0, 0.81, 0]} rotation={[0, 0.08, 0]}>
          {/* Manila Folder Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.025, 0.32]} />
            <meshStandardMaterial color={KRAFT_BROWN} roughness={0.75} />
          </mesh>

          {/* Folder Tab Top */}
          <mesh position={[-0.14, 0.015, -0.155]}>
            <boxGeometry args={[0.12, 0.01, 0.03]} />
            <meshStandardMaterial color={KRAFT_BROWN} roughness={0.75} />
          </mesh>

          {/* Red Tie String Band */}
          <mesh position={[0, 0.014, 0]}>
            <boxGeometry args={[0.03, 0.008, 0.325]} />
            <meshStandardMaterial color={WAX_RED} roughness={0.8} />
          </mesh>

          {/* Crimson Wax Seal */}
          <mesh position={[0, 0.022, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.012, 16]} />
            <meshStandardMaterial color={WAX_RED} roughness={0.3} />
          </mesh>

          {/* Wax Seal Text */}
          <Text
            position={[0, 0.03, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.018}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            23
          </Text>

          {/* Golden Ambient Glow Light */}
          <pointLight
            ref={glowLightRef}
            position={[0, 0.15, 0]}
            intensity={0.4}
            color={BRASS_GOLD}
            distance={1.8}
          />

          {/* Interactable Object: The Final File */}
          <InteractableObject
            id="final-file-object"
            type="object"
            position={[0, 0, 0]}
            interactionPrompt="[E] OPEN FINAL FILE"
            onInteract={() => openMemory("final-file")}
            radius={2.6}
            showMarker={true}
          >
            <mesh visible={false}>
              <boxGeometry args={[0.5, 0.3, 0.4]} />
              <meshBasicMaterial wireframe />
            </mesh>
          </InteractableObject>
        </group>
      </group>

      {/* ─── Single Antique Chair ───────────────────────────────── */}
      <group position={[-0.85, 0, 0.25]} rotation={[0, 0.35, 0]}>
        {/* Leather Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#3b1111" roughness={0.65} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.88, -0.22]} castShadow>
          <boxGeometry args={[0.46, 0.78, 0.06]} />
          <meshStandardMaterial color="#3b1111" roughness={0.65} />
        </mesh>
        {/* Brass Studs Trim */}
        <mesh position={[0, 0.88, -0.18]}>
          <boxGeometry args={[0.42, 0.02, 0.02]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
        </mesh>
        {/* Turned Chair Legs */}
        {[
          [-0.2, 0.22, -0.2],
          [0.2, 0.22, -0.2],
          [-0.2, 0.22, 0.2],
          [0.2, 0.22, 0.2],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.02, 0.018, 0.44, 8]} />
            <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ─── Far Wall Inscription Sequence ──────────────────────── */}
      <group position={[0, 2.8, -5.8]}>
        {/* "25 OCTOBER" */}
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.22}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight={900}
        >
          25 OCTOBER 2003
        </Text>

        {/* "ANSHIKA" */}
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.65}
          color={BRASS_GOLD.getStyle()}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          fontWeight={900}
        >
          ANSHIKA BAJPAI
        </Text>

        {/* Subtitle / Excerpt */}
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.11}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          fontStyle="italic"
          maxWidth={7.5}
          textAlign="center"
        >
          {`"With you I actually came to life. I was alive for the first time."`}
        </Text>

        {/* Excerpt Body */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.075}
          color="#8a7d6b"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
          lineHeight={1.6}
        >
          {`"${anshikaData.finalMessage.slice(0, 220)}..."`}
        </Text>

        {/* Completion Header */}
        <Text
          position={[0, -0.95, 0]}
          fontSize={0.13}
          color={THEME.evidence.amber}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.35}
          fontWeight={900}
        >
          ★ ARCHIVE STATUS: COMPLETE ★
        </Text>

        {/* Birthday Inscription */}
        <Text
          position={[0, -1.35, 0]}
          fontSize={0.32}
          color={WARM_LIGHT}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
          fontWeight={900}
        >
          HAPPY 23RD BIRTHDAY, ANSHIKA.
        </Text>
      </group>

      {/* ─── Return Door to Archive Vault ───────────────────────── */}
      <Door
        position={[0, 1.6, 5.8]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

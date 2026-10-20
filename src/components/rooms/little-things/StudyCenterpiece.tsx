"use client";

import { Suspense } from "react";
import { Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl } from "@/lib/assetManager";

const MAHOGANY = new THREE.Color(THEME.folder.desk);
const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const BANKER_GREEN = "#052e16";

/**
 * StudyCenterpiece — The detective's central research station in Room 5.
 * Contains the antique partner's desk, emerald banker's lamp, framed hero photo
 * of Anshika on Arnav's birthday, and the open Forensic Case Ledger of her habits.
 */
export function StudyCenterpiece({
  position = [0, 0, -0.5],
}: {
  position?: [number, number, number];
}) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const photoUrl = getPhotoUrl("her_on_arnav's_last_birthday.jpeg");

  return (
    <group position={position}>
      {/* ─── Persian-Style Study Rug beneath Desk ───────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
      >
        <planeGeometry args={[4.2, 3.0]} />
        <meshStandardMaterial color="#3b1111" roughness={0.9} />
      </mesh>
      {/* Rug Gold Border */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.007, 0]}
        receiveShadow
      >
        <planeGeometry args={[4.0, 2.8]} />
        <meshStandardMaterial color="#501818" roughness={0.85} />
      </mesh>

      {/* ─── Antique Partner's Mahogany Desk ────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Desk Top */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.1, 1.2]} />
          <meshStandardMaterial color={MAHOGANY} roughness={0.65} />
        </mesh>

        {/* Green Leather Inlay on Desk Top */}
        <mesh position={[0, 0.955, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.95]} />
          <meshStandardMaterial
            color="#064e3b"
            roughness={0.7}
          />
        </mesh>

        {/* Brass Desk Corner Brackets */}
        {[-1.15, 1.15].map((x) =>
          [-0.55, 0.55].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.955, z]}>
              <boxGeometry args={[0.08, 0.02, 0.08]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Left Pedestal Drawers */}
        <mesh position={[-0.8, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.8, 1.1]} />
          <meshStandardMaterial color={MAHOGANY} roughness={0.7} />
        </mesh>

        {/* Right Pedestal Drawers */}
        <mesh position={[0.8, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.8, 1.1]} />
          <meshStandardMaterial color={MAHOGANY} roughness={0.7} />
        </mesh>

        {/* Brass Drawer Handles */}
        {[-0.8, 0.8].map((x) =>
          [0.3, 0.55, 0.8].map((y, idx) => (
            <mesh key={`${x}-${idx}`} position={[x, y, 0.56]}>
              <boxGeometry args={[0.15, 0.03, 0.02]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
            </mesh>
          ))
        )}
      </group>

      {/* ─── Vintage Green Glass Banker's Desk Lamp ─────────────── */}
      <group position={[0, 1.0, -0.3]}>
        {/* Brass Round Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.04, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Brass Curved Stem */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 12]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Emerald Shade */}
        <mesh position={[0, 0.32, 0.06]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.22, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={BANKER_GREEN} roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Banker's Lamp Warm Emerald Glow */}
        <pointLight position={[0, 0.28, 0.08]} intensity={0.9} color="#a7f3d0" distance={3.5} />
        <pointLight position={[0, 0.32, 0]} intensity={0.5} color="#fef3c7" distance={2} />
      </group>

      {/* ─── Item 1: Framed Hero Photo (Her on Arnav's Birthday) ── */}
      <group position={[-0.6, 0.96, 0.15]} rotation={[0, 0.25, 0]}>
        {/* Picture Frame Stand */}
        <mesh rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.52, 0.03]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Inner Frame Matting */}
        <mesh position={[0, 0.02, 0.016]} rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.34, 0.44]} />
          <meshStandardMaterial color="#1f150e" roughness={0.8} />
        </mesh>

        {/* Framed Photo Texture */}
        <Suspense fallback={null}>
          <group position={[0, 0.02, 0.018]} rotation={[-0.25, 0, 0]}>
            <DreiImage
              url={photoUrl}
              scale={[0.32, 0.42]}
              transparent
              toneMapped={false}
            />
          </group>
        </Suspense>

        {/* Small Evidence Tent Card */}
        <group position={[0.26, 0.05, 0.08]} rotation={[0, -0.3, 0]}>
          <mesh rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.16, 0.1]} />
            <meshBasicMaterial color={THEME.evidence.primary} side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, 0.01, 0.02]}
            rotation={[0.4, 0, 0]}
            fontSize={0.04}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            #05-A
          </Text>
        </group>

        {/* Interactable Photo Object */}
        <InteractableObject
          id="ph-arnav-bday"
          type="photo"
          position={[-0.6 + position[0], 1.2 + position[1], 0.15 + position[2]]}
          interactionPrompt="[E] INSPECT PHOTO: HER ON ARNAV'S LAST BIRTHDAY"
          onInteract={() => openMemory("ph-arnav-bday")}
          radius={2.5}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[0.5, 0.6, 0.2]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Item 2: Open Case Ledger (Annotated Habits) ─────────── */}
      <group position={[0.55, 0.96, 0.1]} rotation={[0, -0.15, 0]}>
        {/* Open Leather Ledger Cover */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.56, 0.02, 0.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
        {/* Left Page (Parchment) */}
        <mesh position={[-0.13, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 0.36]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.85} />
        </mesh>
        {/* Right Page (Parchment) */}
        <mesh position={[0.13, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 0.36]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.85} />
        </mesh>

        {/* Ledger Page Inscription Header */}
        <Text
          position={[-0.13, 0.025, -0.12]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.022}
          color="#991b1b"
          anchorX="center"
          fontWeight={900}
          letterSpacing={0.15}
        >
          CASE LEDGER #005
        </Text>
        <Text
          position={[-0.13, 0.025, -0.07]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.016}
          color="#1c1917"
          anchorX="center"
          fontWeight={800}
        >
          ANSHIKA BAJPAI
        </Text>
        <Text
          position={[-0.13, 0.025, 0.03]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.013}
          color="#44403c"
          maxWidth={0.22}
          textAlign="center"
          lineHeight={1.4}
        >
          Traits: Clumsy, Funny, Angry Birdie, Mastikhor, Beautiful. Loves Scooty rides & surprises.
        </Text>

        <Text
          position={[0.13, 0.025, -0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.018}
          color="#b45309"
          anchorX="center"
          fontWeight={800}
        >
          DAILY OBSERVATIONS
        </Text>
        <Text
          position={[0.13, 0.025, 0.02]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.013}
          color="#44403c"
          maxWidth={0.22}
          textAlign="center"
          lineHeight={1.4}
        >
          {`"11:11 wishes, sweet lies, and endless devotion. 23 years of sheer perfection."`}
        </Text>

        {/* Interactable Case Ledger Object */}
        <InteractableObject
          id="lt-ledger"
          type="evidence"
          position={[0.55 + position[0], 1.05 + position[1], 0.1 + position[2]]}
          interactionPrompt="[E] READ CASE LEDGER: THE ANNOTATED HABITS OF ANSHIKA"
          onInteract={() => openMemory("lt-ledger")}
          radius={2.5}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[0.6, 0.3, 0.4]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── Leather Detective Armchair behind Desk ─────────────── */}
      <group position={[0, 0, -0.75]}>
        {/* Chair Seat */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.55, 0.1, 0.5]} />
          <meshStandardMaterial color="#451a03" roughness={0.65} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.85, -0.22]}>
          <boxGeometry args={[0.52, 0.75, 0.08]} />
          <meshStandardMaterial color="#451a03" roughness={0.65} />
        </mesh>
        {/* Brass Studs */}
        <mesh position={[0, 0.85, -0.17]}>
          <boxGeometry args={[0.48, 0.02, 0.02]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

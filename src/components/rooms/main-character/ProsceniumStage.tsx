"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl, getVideoUrl } from "@/lib/assetManager";
import { ArchivalMediaMesh } from "@/components/media/ArchivalMediaMesh";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const VELVET_RED = new THREE.Color("#7f1d1d");
const DEEP_MAHOGANY = new THREE.Color(THEME.folder.desk);
const FOOTLIGHT_WARM = "#fef3c7";

/**
 * ProsceniumStage — The monumental theatrical centerpiece of Room 6.
 * Elevated stage with velvet drapes, footlights, marquee banner, and
 * the hero exhibit: "She's the Main Character" (ph-slay-mirror).
 */
export function ProsceniumStage({
  position = [0, 0, -5.5],
}: {
  position?: [number, number, number];
}) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const photoUrl = getPhotoUrl(
    "our_slay_photo_where_she's_the_main_character_and_i_am_in_the_mirror_behind_her_in_a_cafe_when_we_went_on_a_date.jpeg"
  );

  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    if (spotLightRef.current) {
      // Subtle organic sway of the theatrical spotlight
      const t = clock.getElapsedTime();
      spotLightRef.current.intensity = 1.8 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* ─── Elevated Stage Deck ─────────────────────────────────── */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[11.5, 0.5, 4.0]} />
        <meshStandardMaterial color={DEEP_MAHOGANY} roughness={0.65} />
      </mesh>

      {/* Brass Edge Trim on Stage Deck */}
      <mesh position={[0, 0.51, 1.99]}>
        <boxGeometry args={[11.5, 0.04, 0.04]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Stage Front Apron Steps */}
      <mesh position={[0, 0.125, 2.3]} receiveShadow>
        <boxGeometry args={[6.0, 0.25, 0.6]} />
        <meshStandardMaterial color="#1f150e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 2.58]}>
        <boxGeometry args={[6.0, 0.02, 0.04]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* ─── Brass Footlights across Front of Stage ─────────────── */}
      {[-4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5].map((x) => (
        <group key={x} position={[x, 0.52, 1.85]}>
          {/* Shell Housing */}
          <mesh rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[0.07, 12, 12, 0, Math.PI]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Glowing Filament */}
          <mesh position={[0, 0.02, -0.02]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={FOOTLIGHT_WARM}
              emissive={FOOTLIGHT_WARM}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.8, 1.8]} intensity={0.8} color="#fef3c7" distance={4} />

      {/* ─── Crimson Velvet Theater Curtains ─────────────────────── */}
      {/* Left Main Swag */}
      <group position={[-5.2, 3.2, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.65, 5.5, 16]} />
          <meshStandardMaterial color={VELVET_RED} roughness={0.85} />
        </mesh>
        {/* Gold Tassel Tie-Back */}
        <mesh position={[0.2, -0.8, 0.2]}>
          <torusGeometry args={[0.52, 0.04, 8, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Right Main Swag */}
      <group position={[5.2, 3.2, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.65, 5.5, 16]} />
          <meshStandardMaterial color={VELVET_RED} roughness={0.85} />
        </mesh>
        {/* Gold Tassel Tie-Back */}
        <mesh position={[-0.2, -0.8, 0.2]}>
          <torusGeometry args={[0.52, 0.04, 8, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Overhead Scalloped Velvet Valance */}
      <mesh position={[0, 5.8, 0.8]} castShadow>
        <boxGeometry args={[11.5, 0.65, 0.2]} />
        <meshStandardMaterial color={VELVET_RED} roughness={0.85} />
      </mesh>
      {/* Gold Valance Fringe */}
      <mesh position={[0, 5.46, 0.8]}>
        <boxGeometry args={[11.5, 0.04, 0.22]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
      </mesh>

      {/* ─── Gilded Proscenium Marquee Banner ───────────────────── */}
      <group position={[0, 6.4, 0.8]}>
        <mesh>
          <boxGeometry args={[10.5, 0.8, 0.15]} />
          <meshStandardMaterial color="#0d0a07" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[10.6, 0.85, 0.04]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.8} />
        </mesh>

        <Text
          position={[0, 0.16, 0.11]}
          fontSize={0.22}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.25}
        >
          SHE WAS NEVER THE SIDE CHARACTER
        </Text>
        <Text
          position={[0, -0.16, 0.11]}
          fontSize={0.11}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.2}
        >
          23 YEARS OF STEALING EVERY SCENE • ANSHIKA BAJPAI
        </Text>
      </group>

      {/* ─── Centerpiece Hero Exhibit: The Mirror Date ───────────── */}
      <group position={[0, 2.5, -0.8]}>
        {/* Backing Velvet Alcove Panel */}
        <mesh position={[0, 0, -0.1]} receiveShadow>
          <planeGeometry args={[4.2, 3.4]} />
          <meshStandardMaterial color="#2d0a0a" roughness={0.9} />
        </mesh>

        {/* Ornate Gilded Gold Picture Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.6, 0.12]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Inner Frame Molding */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[2.88, 2.28, 0.04]} />
          <meshStandardMaterial color="#1a1208" roughness={0.6} />
        </mesh>

        {/* Hero Photo / Looping Video Canvas */}
        <ArchivalMediaMesh
          photoUrl={photoUrl}
          videoUrl={getVideoUrl("her_looking_like_a_diva_while_air_distorts_her_hair_and_she_fixes_them_with_her_hands.mp4")}
          width={2.7}
          height={2.1}
          title="She's The Main Character"
          approximateDate="ICONIC ARCHIVE"
        />

        {/* Dedicated Overhead Follow Spotlight */}
        <spotLight
          ref={spotLightRef}
          position={[0, 3.8, 2.8]}
          target-position={[0, 2.5, -0.8]}
          angle={0.5}
          penumbra={0.7}
          intensity={1.8}
          color="#fffbeb"
          distance={8}
          castShadow
        />

        {/* Brass Exhibition Nameplate */}
        <group position={[0, -1.5, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[2.8, 0.34, 0.03]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <Text
            position={[0, 0.07, 0.02]}
            fontSize={0.09}
            color="#080605"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.15}
          >
            EXHIBIT #01: THE MAIN CHARACTER PRINCIPLE
          </Text>
          <Text
            position={[0, -0.07, 0.02]}
            fontSize={0.055}
            color="#38250e"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
            fontStyle="italic"
            letterSpacing={0.08}
          >
            {`"She is center stage. I am in the mirror behind her — proud witness."`}
          </Text>
        </group>

        {/* Interactable Object for Hero Photo */}
        <InteractableObject
          id="ph-slay-mirror"
          type="photo"
          position={[0, 0, 0]}
          interactionPrompt="[E] INSPECT: SHE'S THE MAIN CHARACTER"
          onInteract={() => openMemory("ph-slay-mirror")}
          radius={3.8}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[3.2, 2.6, 0.5]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>
    </group>
  );
}

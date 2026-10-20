"use client";

import { useRef, Suspense } from "react";
import * as THREE from "three";
import { Image as DreiImage, Text } from "@react-three/drei";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl } from "@/lib/assetManager";
import type { PhotoEntry } from "@/data/schema";

interface ExhibitFrameProps {
  photo: PhotoEntry;
  exhibitNumber: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

/**
 * Fallback canvas when texture/image is loading or missing.
 */
function ArchivalPhotoFallback({ width, height }: { width: number; height: number }) {
  return (
    <group position={[0, 0, 0.02]}>
      {/* Matte charcoal backing */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#14100c" roughness={0.8} />
      </mesh>
      {/* Stamped text */}
      <Text
        position={[0, 0.15, 0.01]}
        fontSize={0.08}
        color={THEME.folder.light}
        anchorX="center"
        letterSpacing={0.2}
      >
        EVIDENCE FILE
      </Text>
      <Text
        position={[0, -0.05, 0.01]}
        fontSize={0.06}
        color={THEME.evidence.primary}
        anchorX="center"
        letterSpacing={0.15}
      >
        RESTRICTED ARCHIVE
      </Text>
    </group>
  );
}

/**
 * ExhibitFrame — A museum-grade archival photo frame in the murder/mystery detective aesthetic.
 * Features beveled walnut wood, gold inlay, aged parchment matting, brass plaque,
 * yellow crime scene evidence marker, overhead gooseneck spotlight, and interactive focus inspection.
 */
export function ExhibitFrame({
  photo,
  exhibitNumber,
  position,
  rotation = [0, 0, 0],
  width = 1.4,
  height = 1.05,
}: ExhibitFrameProps) {
  const openMemory = useTransitionStore((s) => s.openMemory);
  const focusObject = useTransitionStore((s) => s.focusObject);
  const frameRef = useRef<THREE.Group>(null);

  const numStr = String(exhibitNumber).padStart(2, "0");
  const photoUrl = getPhotoUrl(photo.filename);

  // Compute camera focus target in front of the picture frame
  const handleInteract = () => {
    // Normal vector facing out from the frame based on rotation
    const rotY = rotation[1] || 0;
    const distance = 2.4;
    const eyeHeight = position[1];
    const camX = position[0] + Math.sin(rotY) * distance;
    const camZ = position[2] + Math.cos(rotY) * distance;

    focusObject({
      id: photo.id,
      position: [camX, eyeHeight, camZ],
      lookAt: [position[0], position[1], position[2]],
      duration: 1.0,
    });

    openMemory(photo.id);
  };

  const frameThickness = 0.08;
  const borderMargin = 0.16;
  const outerWidth = width + borderMargin * 2;
  const outerHeight = height + borderMargin * 2;

  return (
    <InteractableObject
      id={photo.id}
      type="photo"
      position={position}
      interactionPrompt={`[E] INSPECT EXHIBIT #${numStr}: ${photo.title}`}
      onInteract={handleInteract}
      radius={3.2}
      showMarker={false}
    >
      <group ref={frameRef} rotation={rotation}>
        {/* Outer walnut wood frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[outerWidth, outerHeight, frameThickness]} />
          <meshStandardMaterial
            color="#1d1610"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Inner gold / brass filigree rim */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[outerWidth - 0.04, outerHeight - 0.04, frameThickness]} />
          <meshStandardMaterial
            color="#99753c"
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>

        {/* Parchment matting */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[width + 0.08, height + 0.08]} />
          <meshStandardMaterial
            color="#e3d6be"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>

        {/* Photo Image Canvas with Suspense fallback */}
        <Suspense fallback={<ArchivalPhotoFallback width={width} height={height} />}>
          <group position={[0, 0, 0.045]}>
            <DreiImage
              url={photoUrl}
              scale={[width, height]}
              transparent
              toneMapped={false}
            />
          </group>
        </Suspense>

        {/* Brass Exhibition Nameplate beneath frame */}
        <group position={[0, -outerHeight / 2 - 0.16, 0.02]}>
          {/* Brass Plate */}
          <mesh castShadow>
            <boxGeometry args={[Math.min(outerWidth * 0.75, 1.1), 0.18, 0.02]} />
            <meshStandardMaterial
              color="#a67c3b"
              metalness={0.75}
              roughness={0.3}
            />
          </mesh>
          {/* Black Inscribed Title */}
          <Text
            position={[0, 0.03, 0.015]}
            fontSize={0.055}
            color="#080605"
            anchorX="center"
            letterSpacing={0.15}
            maxWidth={outerWidth * 0.7}
          >
            {photo.title.toUpperCase()}
          </Text>
          {/* Date / Exhibit Subtitle */}
          <Text
            position={[0, -0.045, 0.015]}
            fontSize={0.038}
            color="#3a2a18"
            anchorX="center"
            letterSpacing={0.2}
          >
            {`EXHIBIT #${numStr} • ${photo.approximateDate || "ARCHIVED"}`}
          </Text>
        </group>

        {/* Yellow Crime Scene / Evidence Tent Marker on right side */}
        <group position={[outerWidth / 2 + 0.18, -outerHeight / 2 + 0.05, 0.05]}>
          {/* Front slanted face */}
          <mesh rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 0.18, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          {/* Back slanted support */}
          <mesh position={[0, -0.02, -0.04]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.18, 0.02]} />
            <meshStandardMaterial color={THEME.evidence.primary} roughness={0.4} />
          </mesh>
          {/* Black stenciled number */}
          <Text
            position={[0, 0, 0.02]}
            rotation={[0.2, 0, 0]}
            fontSize={0.09}
            color="#080605"
            fontWeight="bold"
            anchorX="center"
          >
            {numStr}
          </Text>
        </group>

        {/* Overhead Track Spotlight Fixture */}
        <group position={[0, outerHeight / 2 + 0.28, 0.25]}>
          {/* Arm extending from wall */}
          <mesh rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
            <meshStandardMaterial color="#443522" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Lamp shade */}
          <mesh position={[0, -0.12, 0.1]} rotation={[-0.8, 0, 0]}>
            <coneGeometry args={[0.08, 0.12, 16]} />
            <meshStandardMaterial color="#2d2216" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Warm bulb glowing */}
          <mesh position={[0, -0.14, 0.08]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={THEME.evidence.amber} />
          </mesh>
          {/* Directional light focused on canvas */}
          <spotLight
            position={[0, 0, 0.1]}
            target-position={[0, -outerHeight / 2, -0.2]}
            intensity={1.8}
            color={THEME.evidence.amber}
            angle={0.65}
            penumbra={0.6}
            distance={5}
          />
        </group>
      </group>
    </InteractableObject>
  );
}

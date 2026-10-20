"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useInteractionStore } from "./interactionStore";
import type { Interactable } from "./types";

interface InteractableObjectProps {
  id: string;
  type: Interactable["type"];
  position: [number, number, number];
  interactionPrompt: string;
  onInteract: () => void;
  discoveryState?: "hidden" | "visible" | "discovered";
  optionalSound?: string;
  optionalAnimation?: string;
  radius?: number;
  showMarker?: boolean;
  children?: React.ReactNode;
}

export function InteractableObject({
  id,
  type,
  position,
  interactionPrompt,
  onInteract,
  discoveryState = "visible",
  optionalSound,
  optionalAnimation,
  showMarker = true,
  children,
}: InteractableObjectProps) {
  const registerInteractable = useInteractionStore(
    (s) => s.registerInteractable
  );
  const activeInteractable = useInteractionStore((s) => s.activeInteractable);
  const isActive = activeInteractable?.id === id;

  const ringRef = useRef<THREE.Mesh>(null);

  // Register on mount, unregister on unmount
  useEffect(() => {
    const unregister = registerInteractable({
      id,
      type,
      position,
      interactionPrompt,
      onInteract,
      discoveryState,
      optionalSound,
      optionalAnimation,
    });
    return unregister;
  }, [
    registerInteractable,
    id,
    type,
    position,
    interactionPrompt,
    onInteract,
    discoveryState,
    optionalSound,
    optionalAnimation,
  ]);

  // Subtle floating pulse animation on the marker ring
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
      const targetScale = isActive ? 1.15 : 1.0;
      ringRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 6
      );
    }
  });

  return (
    <group position={position}>
      {/* 3D Children props/meshes */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onInteract();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        {children}
      </group>

      {/* Proximity / Interaction Halo Indicator */}
      {showMarker && (
        <mesh
          ref={ringRef}
          position={[0, 0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial
            color={isActive ? "#f5e6d3" : "#c4a35a"}
            transparent
            opacity={isActive ? 0.8 : 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

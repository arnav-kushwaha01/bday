"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { THEME } from "@/lib/theme";

interface ArcadeMachine3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onOpenArcade: () => void;
}

export function ArcadeMachine3D({
  position = [6.2, 0, -2.5],
  rotation = [0, -Math.PI / 4, 0],
  onOpenArcade,
}: ArcadeMachine3DProps) {
  const machineRef = useRef<THREE.Group>(null);

  return (
    <InteractableObject
      id="arcade-cabinet-hub"
      type="easter-egg"
      position={position}
      interactionPrompt="[E] PLAY ANSHIKA ARCADE (3D CAR RACE, 3D SHOOTER & PUZZLES)"
      onInteract={onOpenArcade}
      radius={3.8}
      showMarker={false}
    >
      <group ref={machineRef} rotation={rotation}>
        {/* Main Cabinet Body */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.5, 0.8]} />
          <meshStandardMaterial color="#1a1215" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Slanted Marquee Hood */}
        <mesh position={[0, 2.35, 0.25]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.35, 0.4]} />
          <meshStandardMaterial color="#881337" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Glowing Marquee Sign */}
        <group position={[0, 2.36, 0.46]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.82, 0.22, 0.02]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.065}
            color="#ffffff"
            fontWeight={900}
            letterSpacing={0.15}
            anchorX="center"
            anchorY="middle"
          >
            ★ ANSHIKA ARCADE ★
          </Text>
        </group>

        {/* Slanted CRT Monitor Bezel */}
        <mesh position={[0, 1.6, 0.22]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.78, 0.65, 0.15]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Glowing CRT Screen */}
        <group position={[0, 1.6, 0.3]} rotation={[-0.25, 0, 0]}>
          <mesh>
            <planeGeometry args={[0.68, 0.52]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          {/* Neon Game Preview */}
          <Text
            position={[0, 0.12, 0.01]}
            fontSize={0.05}
            color="#fef08a"
            fontWeight={900}
            letterSpacing={0.1}
            anchorX="center"
          >
            INSERT COIN // 23RD BDAY
          </Text>
          <Text
            position={[0, 0.02, 0.01]}
            fontSize={0.038}
            color="#f43f5e"
            fontWeight={700}
            anchorX="center"
          >
            ♥ SHOOTER • 🏎 RACER • 🔤 PUZZLE
          </Text>
          <Text
            position={[0, -0.12, 0.01]}
            fontSize={0.035}
            color="#38bdf8"
            anchorX="center"
          >
            PRESS [E] TO PLAY
          </Text>
        </group>

        {/* Slanted Control Panel */}
        <group position={[0, 1.05, 0.35]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.88, 0.12, 0.42]} />
            <meshStandardMaterial color="#2d1521" roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Joystick 1 */}
          <group position={[-0.22, 0.08, 0]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
          </group>

          {/* Buttons */}
          {[-0.05, 0.06, 0.17].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.065, 0]}>
              <cylinderGeometry args={[0.022, 0.025, 0.02, 12]} />
              <meshBasicMaterial color={idx === 0 ? "#eab308" : idx === 1 ? "#3b82f6" : "#22c55e"} />
            </mesh>
          ))}
        </group>

        {/* Coin Door with illuminated slots */}
        <group position={[0, 0.45, 0.41]}>
          <mesh>
            <boxGeometry args={[0.45, 0.55, 0.02]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Orange glowing coin inserts */}
          {[-0.1, 0.1].map((cx, i) => (
            <mesh key={i} position={[cx, 0.1, 0.015]}>
              <boxGeometry args={[0.04, 0.08, 0.01]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          ))}
        </group>

        {/* Cabinet Neon Side Glow Lighting */}
        <pointLight position={[0, 1.8, 0.6]} intensity={1.5} color="#f43f5e" distance={3.5} />
      </group>
    </InteractableObject>
  );
}

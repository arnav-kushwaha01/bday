"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";
import { getPhotoUrl } from "@/lib/assetManager";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const DARK_WALNUT = new THREE.Color(THEME.folder.desk);
const BOXING_RED = new THREE.Color("#991b1b");
const FLASH_CHROME = new THREE.Color("#d1d5db");

/**
 * PaparazziAndFighterGallery — Houses the paparazzi flash camera, boxing gloves,
 * comedy joke exhibit, and wiretap intercept audio deck.
 * Positioned flanking the entrance walkway of Room 6.
 */
export function PaparazziAndFighterGallery() {
  const openMemory = useTransitionStore((s) => s.openMemory);

  const photoScaredUrl = getPhotoUrl("her_looking_scared(like from papparazi).jpeg");
  const photoBoxingUrl = getPhotoUrl("her_with_boxing_gloves.jpeg");
  const photoJokeUrl = getPhotoUrl("a_very_cute_joke_with_her_the_main_character.jpeg");

  const flashLightRef = useRef<THREE.PointLight>(null);
  const vuMeterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Intermittent paparazzi flash pulse
    if (flashLightRef.current) {
      const flash = Math.pow(Math.sin(t * 3.5), 18);
      flashLightRef.current.intensity = 0.2 + flash * 2.5;
    }
    // Audio VU meter bounce
    if (vuMeterRef.current) {
      vuMeterRef.current.scale.x = 0.5 + Math.abs(Math.sin(t * 5)) * 0.5;
    }
  });

  return (
    <group>
      {/* ─── LEFT FLANK: Paparazzi Press Station (X = -4.5, Z = 3.2) ─ */}
      <group position={[-4.5, 0, 3.2]} rotation={[0, 0.35, 0]}>
        {/* Speed Graphic Press Camera on Tripod */}
        <group position={[0, 0, 0]}>
          {/* Wooden Tripod Legs */}
          {[-0.22, 0.22].map((x) => (
            <mesh key={x} position={[x, 0.75, 0]} rotation={[0, 0, x > 0 ? -0.16 : 0.16]}>
              <cylinderGeometry args={[0.02, 0.025, 1.5, 8]} />
              <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.75, -0.22]} rotation={[0.16, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 1.5, 8]} />
            <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
          </mesh>

          {/* Camera Body Box */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[0.3, 0.35, 0.22]} />
            <meshStandardMaterial color="#17120e" roughness={0.8} />
          </mesh>
          {/* Camera Accordion Bellows */}
          <mesh position={[0, 1.5, 0.16]}>
            <boxGeometry args={[0.22, 0.26, 0.15]} />
            <meshStandardMaterial color="#292019" roughness={0.9} />
          </mesh>

          {/* Large Parabolic Flash Reflector Dish */}
          <mesh position={[0.26, 1.75, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.06, 0.1, 24, 1, true]} />
            <meshStandardMaterial color={FLASH_CHROME} roughness={0.15} metalness={0.95} />
          </mesh>
          {/* Flash Bulb */}
          <mesh position={[0.26, 1.75, 0.12]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={1.2} />
          </mesh>
          {/* Animated Flash Light */}
          <pointLight
            ref={flashLightRef}
            position={[0.26, 1.75, 0.35]}
            intensity={0.5}
            color="#fffbeb"
            distance={4}
          />
        </group>

        {/* Framed Exhibit: Paparazzi Moment (ph-scared) */}
        <group position={[0, 1.8, -0.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.6, 0.06]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.16, 1.46]} />
            <meshStandardMaterial color="#080605" roughness={0.9} />
          </mesh>

          {/* Photo Image */}
          <Suspense fallback={null}>
            <group position={[0, 0, 0.035]}>
              <DreiImage
                url={photoScaredUrl}
                scale={[1.1, 1.4]}
                transparent
                toneMapped={false}
              />
            </group>
          </Suspense>

          {/* Brass Tag */}
          <group position={[0, -0.92, 0.035]}>
            <mesh>
              <boxGeometry args={[1.1, 0.15, 0.02]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
            </mesh>
            <Text
              position={[0, 0, 0.015]}
              fontSize={0.045}
              color="#080605"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
              letterSpacing={0.1}
            >
              PAPARAZZI MOMENT (CONFIDENTIAL)
            </Text>
          </group>

          {/* Interactable */}
          <InteractableObject
            id="ph-scared"
            type="photo"
            position={[0, 0, 0]}
            interactionPrompt="[E] INSPECT: PAPARAZZI MOMENT"
            onInteract={() => openMemory("ph-scared")}
            radius={2.6}
            showMarker={true}
          >
            <mesh visible={false}>
              <boxGeometry args={[1.3, 1.6, 0.4]} />
              <meshBasicMaterial wireframe />
            </mesh>
          </InteractableObject>
        </group>
      </group>

      {/* ─── RIGHT FLANK 1: Boxing Gloves Exhibit (X = 4.5, Z = 3.2) ─ */}
      <group position={[4.5, 0, 3.2]} rotation={[0, -0.35, 0]}>
        {/* Mahogany Display Pedestal */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 1.0, 0.6]} />
          <meshStandardMaterial color={DARK_WALNUT} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[0.66, 0.04, 0.66]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* 3D Procedural Leather Boxing Gloves on Pedestal Hook */}
        <group position={[0, 1.35, 0]}>
          {/* Brass Suspension Hook */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} />
          </mesh>
          {/* Left Glove */}
          <group position={[-0.08, 0.05, 0]} rotation={[0, 0, 0.15]}>
            <mesh castShadow>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color={BOXING_RED} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.1, 12]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.8} />
            </mesh>
          </group>
          {/* Right Glove */}
          <group position={[0.08, 0.0, 0.04]} rotation={[0, 0, -0.15]}>
            <mesh castShadow>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color={BOXING_RED} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.1, 12]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* Framed Exhibit: Boxing Gloves (ph-boxing) */}
        <group position={[0, 1.8, -0.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.6, 0.06]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.16, 1.46]} />
            <meshStandardMaterial color="#080605" roughness={0.9} />
          </mesh>

          {/* Photo Image */}
          <Suspense fallback={null}>
            <group position={[0, 0, 0.035]}>
              <DreiImage
                url={photoBoxingUrl}
                scale={[1.1, 1.4]}
                transparent
                toneMapped={false}
              />
            </group>
          </Suspense>

          {/* Brass Tag */}
          <group position={[0, -0.92, 0.035]}>
            <mesh>
              <boxGeometry args={[1.1, 0.15, 0.02]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
            </mesh>
            <Text
              position={[0, 0, 0.015]}
              fontSize={0.045}
              color="#080605"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
              letterSpacing={0.1}
            >
              BOXING GLOVES • THE FIGHTER SPIRIT
            </Text>
          </group>

          {/* Interactable */}
          <InteractableObject
            id="ph-boxing"
            type="photo"
            position={[0, 0, 0]}
            interactionPrompt="[E] INSPECT: BOXING GLOVES (THE FIGHTER)"
            onInteract={() => openMemory("ph-boxing")}
            radius={2.6}
            showMarker={true}
          >
            <mesh visible={false}>
              <boxGeometry args={[1.3, 1.6, 0.4]} />
              <meshBasicMaterial wireframe />
            </mesh>
          </InteractableObject>
        </group>
      </group>

      {/* ─── RIGHT FLANK 2: Wiretap Audio Station (X = 4.2, Z = 0.5) ─ */}
      <group position={[4.2, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Wiretap Audio Recorder Station on Stand */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 1.0, 16]} />
          <meshStandardMaterial color="#1a140f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 16]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Vintage Tape Recorder Chassis */}
        <group position={[0, 1.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.22, 0.4]} />
            <meshStandardMaterial color="#2a1f18" roughness={0.6} />
          </mesh>
          {/* Twin Audio Tape Spools */}
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.12, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} />
            </mesh>
          ))}
          {/* Glowing Amber VU Meter */}
          <group position={[0, 0.06, 0.205]}>
            <mesh>
              <planeGeometry args={[0.16, 0.05]} />
              <meshBasicMaterial color="#080605" />
            </mesh>
            <mesh ref={vuMeterRef} position={[-0.07, 0, 0.005]}>
              <planeGeometry args={[0.12, 0.03]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
          </group>
          {/* Headphones Resting on Side */}
          <group position={[0.26, 0.08, 0]} rotation={[0, 0, 0.3]}>
            <mesh>
              <torusGeometry args={[0.1, 0.015, 8, 16]} />
              <meshStandardMaterial color="#080605" roughness={0.8} />
            </mesh>
          </group>

          {/* Indicator Light */}
          <pointLight position={[0, 0.15, 0.2]} intensity={0.5} color="#f59e0b" distance={1.8} />
        </group>

        {/* Inscription Header */}
        <group position={[0, 1.7, 0]}>
          <Text
            position={[0, 0.08, 0]}
            fontSize={0.065}
            color={THEME.evidence.primary}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.15}
          >
            WIRETAP INTERCEPT // UNSTOPPABLE ENERGY
          </Text>
          <Text
            position={[0, -0.04, 0]}
            fontSize={0.045}
            color="#e2d9cc"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
            fontStyle="italic"
          >
            {`"Wants to roam even on her periods — unstoppable life force."`}
          </Text>
        </group>

        {/* Interactable Audio Object */}
        <InteractableObject
          id="aud-roam-periods"
          type="audio"
          position={[0, 1.1, 0]}
          interactionPrompt="[E] PLAY INTERCEPTED WIRE: UNSTOPPABLE ENERGY"
          onInteract={() => openMemory("aud-roam-periods")}
          radius={2.6}
          showMarker={true}
        >
          <mesh visible={false}>
            <boxGeometry args={[0.6, 0.5, 0.5]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </InteractableObject>
      </group>

      {/* ─── LEFT FLANK 2: The Cute Joke Exhibit (X = -4.2, Z = 0.5) ─ */}
      <group position={[-4.2, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Wall Frame */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.6, 0.06]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.16, 1.46]} />
            <meshStandardMaterial color="#080605" roughness={0.9} />
          </mesh>

          {/* Photo Image */}
          <Suspense fallback={null}>
            <group position={[0, 0, 0.035]}>
              <DreiImage
                url={photoJokeUrl}
                scale={[1.1, 1.4]}
                transparent
                toneMapped={false}
              />
            </group>
          </Suspense>

          {/* Brass Tag */}
          <group position={[0, -0.92, 0.035]}>
            <mesh>
              <boxGeometry args={[1.1, 0.15, 0.02]} />
              <meshStandardMaterial color={BRASS_GOLD} roughness={0.25} metalness={0.85} />
            </mesh>
            <Text
              position={[0, 0, 0.015]}
              fontSize={0.045}
              color="#080605"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
              letterSpacing={0.1}
            >
              THE CUTE JOKE • SCENE STEALER
            </Text>
          </group>

          {/* Interactable */}
          <InteractableObject
            id="ph-cute-joke"
            type="photo"
            position={[0, 0, 0]}
            interactionPrompt="[E] INSPECT: THE CUTE JOKE"
            onInteract={() => openMemory("ph-cute-joke")}
            radius={2.6}
            showMarker={true}
          >
            <mesh visible={false}>
              <boxGeometry args={[1.3, 1.6, 0.4]} />
              <meshBasicMaterial wireframe />
            </mesh>
          </InteractableObject>
        </group>
      </group>
    </group>
  );
}

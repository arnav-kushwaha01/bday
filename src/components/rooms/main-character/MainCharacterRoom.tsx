"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell, Door } from "../RoomPrimitives";
import { ProsceniumStage } from "./ProsceniumStage";
import { ScreeningLounge } from "./ScreeningLounge";
import { ExecutiveSuite } from "./ExecutiveSuite";
import { PaparazziAndFighterGallery } from "./PaparazziAndFighterGallery";
import { THEME } from "@/lib/theme";

const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const VELVET_RED = new THREE.Color("#7f1d1d");
const WARM_AMBER = "#fef3c7";

/**
 * MainCharacterRoom — Room 6: The Main Character Theater & Executive Suite.
 *
 * Implements SPEC.md requirements:
 * - "She was never the side character. She's THE main character."
 * - Elevated proscenium theater stage with red velvet drapes, marquee header, and
 *   overhead follow-spotlight for Exhibit #01: "She's the Main Character" (ph-slay-mirror).
 * - Screening Lounge with vintage 35mm film projector and CRT screening consoles for
 *   motion reels: "News Anchor Anshika" (vid-news-anchor) and "Diva in the Wind" (vid-diva-wind).
 * - "Boss Energy" Executive Boardroom Suite with green marble desk, emerald banker's lamp,
 *   and framed portraits: "Boss Energy" (ph-business-woman) and "Hot Working Woman" (ph-hot-working).
 * - Paparazzi Press Flash Camera station with "Paparazzi Moment" (ph-scared).
 * - Fighter's Ring with 3D leather boxing gloves and "Boxing Gloves" (ph-boxing).
 * - Scene-Stealer Comedy Exhibit: "The Cute Joke" (ph-cute-joke).
 * - Wiretap Intercept Audio Deck with tape reels and headphones: "Wants to roam even on periods" (aud-roam-periods).
 * - Red velvet carpet runner and return door to Hub.
 */
export default function MainCharacterRoom() {
  return (
    <RoomShell width={18} depth={18} height={7.5}>
      {/* ─── Grand Red Velvet Runway Carpet ──────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.8]} receiveShadow>
        <planeGeometry args={[2.8, 12.0]} />
        <meshStandardMaterial color={VELVET_RED} roughness={0.85} />
      </mesh>
      {/* Gold Trim Left & Right */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.42, 0.004, 1.8]}>
        <planeGeometry args={[0.06, 12.0]} />
        <meshBasicMaterial color={THEME.evidence.primary} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.42, 0.004, 1.8]}>
        <planeGeometry args={[0.06, 12.0]} />
        <meshBasicMaterial color={THEME.evidence.primary} />
      </mesh>

      {/* Carpet Inscription at Entrance Aisle */}
      <group position={[0, 0.006, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.13}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
          fontWeight={900}
        >
          ✦ THE MAIN CHARACTER PREMIERE • CASE FILE #006 ✦
        </Text>
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.08}
          color="#fef3c7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          fontWeight={700}
        >
          23 YEARS OF NEVER BEING A BACKGROUND DETAIL
        </Text>
      </group>

      {/* ─── Grand Art Deco Overhead Theater Chandeliers ────────── */}
      {[-3.0, 3.0].map((z, idx) => (
        <group key={idx} position={[0, 5.2, z]}>
          {/* Suspension Rod from Ceiling (y = 7.5 down to 5.2) */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.3, 8]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Outer Brass Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.04, 8, 24]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Inner Brass Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.03, 8, 20]} />
            <meshStandardMaterial color={BRASS_GOLD} metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Warm Amber Bulbs */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => {
            const bAngle = (b / 8) * Math.PI * 2;
            return (
              <group
                key={b}
                position={[Math.cos(bAngle) * 1.2, 0.08, Math.sin(bAngle) * 1.2]}
              >
                <mesh>
                  <sphereGeometry args={[0.065, 12, 12]} />
                  <meshStandardMaterial
                    color={WARM_AMBER}
                    emissive={WARM_AMBER}
                    emissiveIntensity={1.4}
                  />
                </mesh>
              </group>
            );
          })}
          <pointLight
            intensity={1.1}
            color={WARM_AMBER}
            distance={11}
            decay={2}
          />
        </group>
      ))}

      {/* ─── Back Proscenium Stage Centerpiece ──────────────────── */}
      <ProsceniumStage position={[0, 0, -5.5]} />

      {/* ─── Left Flank: Screening Lounge (Motion Reels) ────────── */}
      <ScreeningLounge position={[-5.8, 0, -0.5]} />

      {/* ─── Right Flank: Executive Boardroom Suite (Boss Energy) ─ */}
      <ExecutiveSuite position={[5.8, 0, -0.5]} />

      {/* ─── Front Flanks: Paparazzi, Boxing & Wiretap Intercept ── */}
      <PaparazziAndFighterGallery />

      {/* ─── Return Door to Archive Vault (Hub Room) ───────────── */}
      <Door
        position={[0, 1.6, 8.4]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE"
        targetRoom="HUB"
      />
    </RoomShell>
  );
}

"use client";

import { Stars } from "@react-three/drei";
import { EarthGlobe } from "./EarthGlobe";
import { ObservatoryCorridor } from "./ObservatoryCorridor";
import { ObservationBalcony } from "./ObservationBalcony";

/**
 * DistanceRoom — The Showcase Observation Chamber.
 * Per SPEC.md Section 52:
 * "Distance (the showcase): corridor to window, room fades, optimized Earth globe
 * with atmosphere shader, stars, restrained bloom, two city-level points, animated arc,
 * text 'THAT'S THE DISTANCE.' then 'NOT THE FEELING.', camera pulls away, line remains.
 * Fallback to animated SVG map on LOW or no WebGL. Show computed distance only if both cities are supplied."
 */
export default function DistanceRoom() {
  return (
    <group>
      {/* ─── Celestial Observatory Starfield ─────────────────────── */}
      <Stars
        radius={80}
        depth={50}
        count={3500}
        factor={4}
        saturation={0}
        fade
        speed={1.2}
      />

      {/* ─── Ambient & Cosmic Lighting ───────────────────────────── */}
      {/* Deep celestial void ambient illumination */}
      <ambientLight intensity={0.25} color="#0c192c" />

      {/* Warm archival observatory key light */}
      <directionalLight
        position={[2, 6, 4]}
        intensity={0.55}
        color="#fef3c7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Distant starlight illumination on the globe */}
      <directionalLight
        position={[-5, 3, -8]}
        intensity={0.4}
        color="#38bdf8"
      />

      {/* ─── Architectural Components ────────────────────────────── */}
      {/* Entrance Corridor leading from Hub (z: 10.5 -> 2.0) */}
      <ObservatoryCorridor />

      {/* Observation Balcony with Telemetry Console, Telescope, and Reveal Typography */}
      <ObservationBalcony />

      {/* 3D Archival Earth Globe with Flight Arc & Holographic Beacons */}
      <EarthGlobe position={[0, 2.4, -5.0]} />
    </group>
  );
}

"use client";

import { Stars } from "@react-three/drei";
import { EarthGlobe } from "./EarthGlobe";
import { ObservatoryCorridor } from "./ObservatoryCorridor";
import { ObservationBalcony } from "./ObservationBalcony";
import { useAppStore } from "@/store/useAppStore";

export default function DistanceRoom() {
  const lightingMode = useAppStore((s) => s.lightingMode);
  const isLight = lightingMode === "normal";

  return (
    <group>
      {/* ─── Vast Celestial Observatory Starfield (Expansive Cosmos) ─── */}
      <Stars
        radius={140}
        depth={80}
        count={5500}
        factor={4.8}
        saturation={0.3}
        fade
        speed={1.4}
      />

      {/* ─── Ambient & Cosmic Lighting (Bright in Normal Mode) ─── */}
      <ambientLight
        intensity={isLight ? 0.95 : 0.35}
        color={isLight ? "#e0f2fe" : "#0c192c"}
      />

      {/* Key Starlight & Observatory Illuminator */}
      <directionalLight
        position={[4, 10, 6]}
        intensity={isLight ? 1.4 : 0.65}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Brilliant Cosmic Rim Light on the Earth */}
      <directionalLight
        position={[-8, 6, -10]}
        intensity={isLight ? 1.1 : 0.55}
        color="#38bdf8"
      />

      {/* Deep Space Celestial Nebula Fill Pointlights */}
      <pointLight position={[0, 12, -14]} intensity={isLight ? 1.6 : 0.8} color="#0284c7" distance={35} />
      <pointLight position={[0, -8, -10]} intensity={isLight ? 1.4 : 0.7} color="#f59e0b" distance={30} />

      {/* ─── Architectural Components ────────────────────────────── */}
      {/* Entrance Corridor leading from Hub */}
      <ObservatoryCorridor />

      {/* Observation Balcony with Telemetry Console, Telescope, and Reveal Typography */}
      <ObservationBalcony />

      {/* 3D Archival Earth Globe with Flight Arc, Holographic Beacons & Zoom */}
      <EarthGlobe position={[0, 2.6, -5.6]} />
    </group>
  );
}

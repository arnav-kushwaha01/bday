"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import { CameraRig, AdaptiveDpr } from "@/engine/camera/CameraRig";
import { PlayerController } from "@/engine/player/PlayerController";
import { DossierFile3D } from "@/components/dossier/DossierFile3D";
import { RoomLoader } from "@/engine/RoomLoader";
import { useAppStore } from "@/store/useAppStore";
import { QUALITY_CONFIGS } from "@/lib/qualityConfig";
import { THEME } from "@/lib/theme";

/**
 * ArchiveScene — Single Canvas wrapping the entire 3D experience.
 * Uses quality-tier config for DPR, shadows, and antialiasing.
 */
export default function ArchiveScene() {
  const quality = useAppStore((s) => s.settings.quality);
  const experienceMode = useAppStore((s) => s.experienceMode);
  const isDossierOpen = useAppStore((s) => s.isDossierOpen);
  const setDossierOpen = useAppStore((s) => s.setDossierOpen);
  const setExperienceMode = useAppStore((s) => s.setExperienceMode);
  const discoveredEvidence = useAppStore((s) => s.discoveredEvidence);
  const config = QUALITY_CONFIGS[quality];

  return (
    <Canvas
      dpr={config.dpr}
      shadows={config.shadowMapEnabled}
      camera={{ fov: 50, near: 0.1, far: 100, position: [0, 2.2, 1.8] }}
      gl={{
        antialias: config.antialiasing,
        powerPreference: "high-performance",
        alpha: false,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: THEME.noir.pitch,
      }}
    >
      <color attach="background" args={[THEME.noir.pitch]} />
      <fog attach="fog" args={[THEME.noir.pitch, 18, 55]} />

      <CameraRig />
      <PlayerController />
      <AdaptiveDpr />

      {experienceMode === "menu" ? (
        <DossierFile3D
          isOpen={isDossierOpen}
          onToggleOpen={() => setDossierOpen(!isDossierOpen)}
          onEnterArchive={() => setExperienceMode("active")}
          evidenceCount={discoveredEvidence.length}
        />
      ) : (
        <Suspense fallback={null}>
          <RoomLoader />
        </Suspense>
      )}

      <Preload all />
    </Canvas>
  );
}

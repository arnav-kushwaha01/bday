"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { THEME } from "@/lib/theme";

interface ArchivalMediaMeshProps {
  photoUrl: string;
  videoUrl?: string;
  width: number;
  height: number;
  title?: string;
  approximateDate?: string;
}

/**
 * Fallback slate rendered while texture or video is loading or if unavailable.
 * Stamped in authentic noir archive detective typography.
 */
function NoirLoadingSlate({
  width,
  height,
  title,
  subtitle,
}: {
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
}) {
  return (
    <group position={[0, 0, 0.048]}>
      {/* Matte charcoal archival canvas */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#14100d" roughness={0.8} />
      </mesh>

      {/* Decorative inner hairline border */}
      <lineSegments position={[0, 0, 0.002]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width - 0.06, height - 0.06)]} />
        <lineBasicMaterial color="#99753c" opacity={0.6} transparent />
      </lineSegments>

      {/* Stamped title */}
      <Text
        position={[0, 0.12, 0.005]}
        fontSize={Math.min(width * 0.07, 0.09)}
        color={THEME.folder.light}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
        maxWidth={width * 0.85}
        textAlign="center"
      >
        {title ? title.toUpperCase() : "EVIDENCE DOSSIER"}
      </Text>

      {/* Subtitle / date stamp */}
      <Text
        position={[0, -0.1, 0.005]}
        fontSize={Math.min(width * 0.05, 0.06)}
        color={THEME.evidence.primary}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {subtitle || "CONFIDENTIAL ARCHIVE"}
      </Text>
    </group>
  );
}

/**
 * Looping video texture display for 3D frames
 */
function LoopingVideoDisplay({
  url,
  width,
  height,
  title,
}: {
  url: string;
  width: number;
  height: number;
  title?: string;
}) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.autoplay = true;
    vid.preload = "auto";
    videoRef.current = vid;

    const vTex = new THREE.VideoTexture(vid);
    vTex.colorSpace = THREE.SRGBColorSpace;
    vTex.minFilter = THREE.LinearFilter;
    vTex.magFilter = THREE.LinearFilter;
    vTex.generateMipmaps = false;
    setTexture(vTex);

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }

    return () => {
      vid.pause();
      vid.src = "";
      vid.load();
      vTex.dispose();
      setTexture(null);
      videoRef.current = null;
    };
  }, [url]);

  if (!texture) {
    return <NoirLoadingSlate width={width} height={height} title={title} subtitle="BUFFERING VIDEO REEL..." />;
  }

  return (
    <group position={[0, 0, 0.052]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
      {/* Sleek video reel badge in top right corner */}
      <group position={[width / 2 - 0.22, height / 2 - 0.1, 0.005]}>
        <mesh>
          <boxGeometry args={[0.36, 0.11, 0.01]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
        <Text
          position={[0, 0, 0.006]}
          fontSize={0.045}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.08}
        >
          ▶ VIDEO
        </Text>
      </group>
    </group>
  );
}

/**
 * Crisp, non-z-fighting photo display
 */
function PhotoDisplay({
  url,
  width,
  height,
  title,
  approximateDate,
}: {
  url: string;
  width: number;
  height: number;
  title?: string;
  approximateDate?: string;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!url) {
      setHasError(true);
      return;
    }
    setHasError(false);
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      url,
      (tex) => {
        if (!isMounted) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn("Archival photo failed to load:", url, err);
        if (isMounted) setHasError(true);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (hasError || !texture) {
    return (
      <NoirLoadingSlate
        width={width}
        height={height}
        title={title}
        subtitle={hasError ? "CLASSIFIED EVIDENCE" : approximateDate || "AUTHENTIC RECORD"}
      />
    );
  }

  return (
    <mesh position={[0, 0, 0.052]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}

/**
 * ArchivalMediaMesh — Unified 3D media mesh for exhibition frames.
 * Renders either a looping video or a high-res photo with zero z-fighting and instant fallbacks.
 */
export function ArchivalMediaMesh({
  photoUrl,
  videoUrl,
  width,
  height,
  title,
  approximateDate,
}: ArchivalMediaMeshProps) {
  if (videoUrl) {
    return <LoopingVideoDisplay url={videoUrl} width={width} height={height} title={title} />;
  }

  return (
    <PhotoDisplay
      url={photoUrl}
      width={width}
      height={height}
      title={title}
      approximateDate={approximateDate}
    />
  );
}

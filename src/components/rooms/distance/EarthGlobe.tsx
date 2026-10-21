"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const GLOBE_RADIUS = 2.4;
const ROT_OFFSET_Y = Math.PI - 0.15; // Aligns India directly facing camera

/**
 * Converts geographic latitude and longitude into 3D Cartesian coordinates
 * on a sphere of radius R, with the globe's default rotation applied.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const vec = new THREE.Vector3(x, y, z);
  vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), ROT_OFFSET_Y);
  return vec;
}

/**
 * Generates an equirectangular procedural canvas texture for the Archival Earth.
 * Features dark noir oceans, archival coordinate graticule, stylized glowing continents,
 * radar target reticles for Her Home (Kanpur), His Home (Kanpur), and CDAC Hostel (Bangalore).
 */
function createArchivalEarthTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Deep Noir Oceans
  const oceanGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    width / 1.4
  );
  oceanGrad.addColorStop(0, "#081324");
  oceanGrad.addColorStop(0.5, "#050d1a");
  oceanGrad.addColorStop(1, "#02060e");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Helper: Lat/Lng to Canvas X/Y
  const toXY = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  });

  // 2. Archival Coordinate Graticule (Parallels & Meridians)
  ctx.strokeStyle = "rgba(45, 85, 125, 0.22)";
  ctx.lineWidth = 1;

  // Parallels every 15°
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Meridians every 30°
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator (Dashed gold)
  ctx.strokeStyle = "rgba(234, 179, 8, 0.45)";
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tropics of Cancer (23.5° N) & Capricorn (23.5° S)
  ctx.strokeStyle = "rgba(185, 28, 28, 0.35)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([8, 6]);
  const yCancer = ((90 - 23.5) / 180) * height;
  const yCap = ((90 + 23.5) / 180) * height;
  ctx.beginPath();
  ctx.moveTo(0, yCancer);
  ctx.lineTo(width, yCancer);
  ctx.moveTo(0, yCap);
  ctx.lineTo(width, yCap);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Continents & Landmasses
  ctx.fillStyle = "#111b2b";
  ctx.strokeStyle = "rgba(202, 138, 4, 0.65)";
  ctx.lineWidth = 1.5;

  const drawPolygon = (coords: Array<[number, number]>) => {
    if (coords.length < 3) return;
    ctx.beginPath();
    const first = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < coords.length; i++) {
      const pt = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Detailed Indian Subcontinent
  drawPolygon([
    [35, 74], // Kashmir
    [32, 78], // Himalayas
    [27, 88], // Sikkim/Nepal border
    [26, 90], // Assam
    [22, 92], // Bengal East
    [21, 87], // Bengal Delta
    [18, 83], // Odisha/Andhra
    [13, 80], // Chennai/Coromandel
    [8, 77.5], // Kanyakumari
    [10, 76], // Kerala / Malabar
    [15, 73.5], // Goa
    [19, 72.8], // Mumbai / Konkan
    [21, 72.5], // Gulf of Khambhat
    [23, 68.5], // Gujarat Rann of Kutch
    [25, 68], // Indus mouth
    [31, 71], // Punjab border
  ]);

  // Sri Lanka
  drawPolygon([
    [9.5, 80.5],
    [7.5, 81.5],
    [6.0, 80.5],
    [7.5, 79.5],
  ]);

  // Eurasia (Broad Archival Outline)
  drawPolygon([
    [70, 30],
    [70, 170],
    [60, 160],
    [45, 145],
    [35, 128],
    [22, 115],
    [10, 105],
    [20, 100],
    [25, 90],
    [32, 75],
    [25, 65],
    [25, 55],
    [15, 50],
    [15, 42],
    [30, 35],
    [36, 28],
    [44, 12],
    [36, -5],
    [48, -4],
    [55, 10],
    [70, 30],
  ]);

  // Africa
  drawPolygon([
    [35, -5],
    [32, 32],
    [12, 45],
    [0, 42],
    [-15, 40],
    [-34, 18],
    [-20, 12],
    [0, 9],
    [5, -2],
    [15, -17],
    [28, -12],
    [35, -5],
  ]);

  // Australia
  drawPolygon([
    [-12, 130],
    [-15, 136],
    [-12, 142],
    [-25, 153],
    [-38, 145],
    [-35, 115],
    [-22, 114],
    [-16, 123],
  ]);

  // North America
  drawPolygon([
    [70, -165],
    [70, -70],
    [50, -55],
    [30, -80],
    [25, -97],
    [18, -90],
    [15, -90],
    [20, -105],
    [32, -117],
    [50, -125],
    [60, -140],
    [70, -165],
  ]);

  // South America
  drawPolygon([
    [10, -75],
    [5, -50],
    [-8, -35],
    [-23, -42],
    [-40, -62],
    [-55, -68],
    [-40, -73],
    [-18, -70],
    [0, -80],
    [10, -75],
  ]);

  // 4. Radar Reticles & Target Markers on Texture
  const herHome = toXY(26.4499, 80.3319);
  const hisHome = toXY(26.4473, 80.3503);
  const cdac = toXY(12.8500, 77.6600);

  const drawReticle = (
    pos: { x: number; y: number },
    color: string,
    label: string,
    coords: string
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pos.x - 26, pos.y);
    ctx.lineTo(pos.x + 26, pos.y);
    ctx.moveTo(pos.x, pos.y - 26);
    ctx.lineTo(pos.x, pos.y + 26);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = color;
    ctx.fillText(label, pos.x + 32, pos.y - 6);
    ctx.font = "13px monospace";
    ctx.fillStyle = "#e2d9cc";
    ctx.fillText(coords, pos.x + 32, pos.y + 12);
  };

  drawReticle(
    herHome,
    "#eab308",
    "HER",
    "KANPUR"
  );
  drawReticle(
    cdac,
    "#38bdf8",
    "ME",
    "BANGALORE"
  );

  // Connecting Great-Circle Flight Trajectory Line on Texture
  ctx.strokeStyle = "rgba(234, 179, 8, 0.75)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(herHome.x, herHome.y);
  ctx.quadraticCurveTo((herHome.x + cdac.x) / 2 + 18, (herHome.y + cdac.y) / 2, cdac.x, cdac.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Telemetry Label at midpoint on canvas
  ctx.font = "bold 16px monospace";
  ctx.fillStyle = "#f59e0b";
  ctx.fillText(
    "1,540 KM",
    (herHome.x + cdac.x) / 2 - 35,
    (herHome.y + cdac.y) / 2 - 16
  );

  // 5. Archival Confidential Watermarks
  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "rgba(185, 28, 28, 0.45)";
  ctx.fillText("CLASSIFIED SPATIAL MATRIX // CASE FILE #004", 40, 50);
  ctx.font = "14px monospace";
  ctx.fillStyle = "rgba(156, 122, 76, 0.55)";
  ctx.fillText("OBSERVATORY TELEMETRY • KANPUR (HER HOME & ARNAV'S HOME) ◄——► CDAC BANGALORE (6-MONTH DIPLOMA)", 40, 75);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function EarthGlobe({ position = [0, 2.4, -5.0] }: { position?: [number, number, number] }) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const pulsePacket1Ref = useRef<THREE.Mesh>(null);
  const pulsePacket2Ref = useRef<THREE.Mesh>(null);
  const openMemory = useTransitionStore((s) => s.openMemory);

  // Drag-to-rotate state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Zoom in / out state (smoothly lerped)
  const targetZoomRef = useRef(1.0);
  const currentZoomRef = useRef(1.0);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [expandedMarker, setExpandedMarker] = useState<"her" | "me" | "distance" | "arnav-home" | null>(null);

  // Archival Texture
  const earthTexture = useMemo(() => createArchivalEarthTexture(), []);

  // 3D Cartesian coordinates on sphere surface
  const herHomePos = useMemo(() => latLngToVector3(26.4499, 80.3319, GLOBE_RADIUS), []);
  const hisHomePos = useMemo(() => latLngToVector3(26.4473, 80.3503, GLOBE_RADIUS), []);
  const cdacPos = useMemo(() => latLngToVector3(12.8500, 77.6600, GLOBE_RADIUS), []);

  // Arc Curve (Quadratic Bezier curving above sphere: Kanpur -> CDAC Bangalore)
  const { arcCurve, apexPos } = useMemo(() => {
    const mid = herHomePos.clone().add(cdacPos).multiplyScalar(0.5);
    const apex = mid.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.5);
    const curve = new THREE.QuadraticBezierCurve3(herHomePos, apex, cdacPos);
    return { arcCurve: curve, apexPos: apex };
  }, [herHomePos, cdacPos]);

  // Local Kanpur connection arc between Her Home & His Home
  const localKanpurCurve = useMemo(() => {
    const mid = herHomePos.clone().add(hisHomePos).multiplyScalar(0.5);
    const apex = mid.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.12);
    return new THREE.QuadraticBezierCurve3(herHomePos, apex, hisHomePos);
  }, [herHomePos, hisHomePos]);

  // Outward normal vectors for beacons
  const herHomeNormal = useMemo(() => herHomePos.clone().normalize(), [herHomePos]);
  const hisHomeNormal = useMemo(() => hisHomePos.clone().normalize(), [hisHomePos]);
  const cdacNormal = useMemo(() => cdacPos.clone().normalize(), [cdacPos]);

  // Global window listeners for drag rotation & mouse wheel zoom
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      if (Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) > 4) {
        hasMovedRef.current = true;
      }

      const rotSpeed = 0.0055;
      rotRef.current.y += dx * rotSpeed;
      rotRef.current.x += dy * rotSpeed;

      // Clamp vertical tilt so Earth remains upright
      rotRef.current.x = Math.max(-Math.PI / 2.8, Math.min(Math.PI / 2.8, rotRef.current.x));

      velRef.current = {
        x: dy * rotSpeed * 0.4,
        y: dx * rotSpeed * 0.4,
      };
    };

    const handleWindowPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (typeof window !== "undefined") {
          (window as unknown as { __isRotatingGlobe?: boolean }).__isRotatingGlobe = false;
        }
        document.body.style.cursor = "default";
      }
    };

    // Zoom on wheel scroll
    const handleWheel = (e: WheelEvent) => {
      // Scale zoom level smoothly
      targetZoomRef.current = THREE.MathUtils.clamp(
        targetZoomRef.current - e.deltaY * 0.0016,
        0.65,
        2.5
      );
      setZoomPercent(Math.round(targetZoomRef.current * 100));
    };

    // Expose global zoom functions for HUD controls
    if (typeof window !== "undefined") {
      (window as unknown as {
        __ZOOM_GLOBE_IN__?: () => void;
        __ZOOM_GLOBE_OUT__?: () => void;
        __RESET_GLOBE_ZOOM__?: () => void;
      }).__ZOOM_GLOBE_IN__ = () => {
        targetZoomRef.current = THREE.MathUtils.clamp(targetZoomRef.current + 0.25, 0.65, 2.5);
        setZoomPercent(Math.round(targetZoomRef.current * 100));
      };
      (window as unknown as {
        __ZOOM_GLOBE_IN__?: () => void;
        __ZOOM_GLOBE_OUT__?: () => void;
        __RESET_GLOBE_ZOOM__?: () => void;
      }).__ZOOM_GLOBE_OUT__ = () => {
        targetZoomRef.current = THREE.MathUtils.clamp(targetZoomRef.current - 0.25, 0.65, 2.5);
        setZoomPercent(Math.round(targetZoomRef.current * 100));
      };
      (window as unknown as {
        __ZOOM_GLOBE_IN__?: () => void;
        __ZOOM_GLOBE_OUT__?: () => void;
        __RESET_GLOBE_ZOOM__?: () => void;
      }).__RESET_GLOBE_ZOOM__ = () => {
        targetZoomRef.current = 1.0;
        setZoomPercent(100);
      };
    }

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleGlobePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    velRef.current = { x: 0, y: 0 };
    if (typeof window !== "undefined") {
      (window as unknown as { __isRotatingGlobe?: boolean }).__isRotatingGlobe = true;
    }
    document.body.style.cursor = "grabbing";
  };

  const handleMarkerClick = (
    e: ThreeEvent<MouseEvent>,
    markerKey: "her" | "me" | "distance" | "arnav-home"
  ) => {
    e.stopPropagation();
    if (!hasMovedRef.current) {
      setExpandedMarker((prev) => (prev === markerKey ? null : markerKey));
    }
  };

  // Animation frame: pulse packets along curve, rotate globe, and smoothly lerp zoom
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Pulse 1: Kanpur -> CDAC Bangalore
    if (pulsePacket1Ref.current) {
      const t1 = (time * 0.45) % 1;
      const pt1 = arcCurve.getPoint(t1);
      pulsePacket1Ref.current.position.copy(pt1);
      const scale1 = Math.sin(t1 * Math.PI) * 0.09 + 0.04;
      pulsePacket1Ref.current.scale.set(scale1, scale1, scale1);
    }

    // Pulse 2: CDAC Bangalore -> Kanpur
    if (pulsePacket2Ref.current) {
      const t2 = 1 - ((time * 0.45 + 0.5) % 1);
      const pt2 = arcCurve.getPoint(t2);
      pulsePacket2Ref.current.position.copy(pt2);
      const scale2 = Math.sin((1 - t2) * Math.PI) * 0.09 + 0.04;
      pulsePacket2Ref.current.scale.set(scale2, scale2, scale2);
    }

    // Globe Rotation with inertia & gentle idle spin
    if (!isDraggingRef.current) {
      rotRef.current.y += velRef.current.y;
      rotRef.current.x += velRef.current.x;
      velRef.current.y *= 0.94;
      velRef.current.x *= 0.94;

      // Gentle ambient idle rotation when not dragged
      if (Math.abs(velRef.current.y) < 0.0005) {
        rotRef.current.y += delta * 0.035;
      }
      // Slowly return tilt towards equator
      rotRef.current.x += (0 - rotRef.current.x) * 0.02;
    }

    // Smooth Zoom Lerp
    currentZoomRef.current = THREE.MathUtils.lerp(
      currentZoomRef.current,
      targetZoomRef.current,
      0.12
    );

    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = rotRef.current.y;
      globeGroupRef.current.rotation.x = rotRef.current.x;
      globeGroupRef.current.scale.setScalar(currentZoomRef.current);
    }
  });

  return (
    <group position={position}>
      {/* ─── Outer Astrolabe Celestial Orbit Armature (Expansive Cosmic Feel) ─── */}
      <group>
        {/* Equatorial Astrolabe Brass Ring */}
        <mesh rotation={[Math.PI / 3.2, 0.25, 0]}>
          <torusGeometry args={[GLOBE_RADIUS * 1.48, 0.022, 16, 100]} />
          <meshStandardMaterial
            color={THEME.evidence.primary}
            metalness={0.9}
            roughness={0.2}
            emissive={THEME.evidence.primary}
            emissiveIntensity={0.65}
          />
        </mesh>
        {/* Polar Celestial Coordinate Ring */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[GLOBE_RADIUS * 1.55, 0.014, 12, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.8}
            roughness={0.3}
            emissive="#38bdf8"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* ─── Main Rotating Globe & Markers Group (Scales with Zoom) ─── */}
      <group ref={globeGroupRef}>
        {/* Central Earth Sphere (Interactive with pointer drag) */}
        <mesh
          rotation={[0, ROT_OFFSET_Y, 0]}
          onPointerDown={handleGlobePointerDown}
          onPointerOver={() => {
            setIsHovered(true);
            if (!isDraggingRef.current) document.body.style.cursor = "grab";
          }}
          onPointerOut={() => {
            setIsHovered(false);
            if (!isDraggingRef.current) document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          {earthTexture ? (
            <meshStandardMaterial
              map={earthTexture}
              roughness={0.38}
              metalness={0.22}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial color="#081324" roughness={0.5} wireframe />
          )}
        </mesh>

        {/* Atmosphere Glowing Shell (Outer Rim) */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS * 1.055, 48, 48]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.16}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* ─── 3D Great-Circle Flight Arc (Kanpur ◄——► CDAC Bangalore) ── */}
        <mesh>
          <tubeGeometry args={[arcCurve, 64, 0.026, 8, false]} />
          <meshStandardMaterial
            color={THEME.evidence.primary}
            emissive={THEME.evidence.primary}
            emissiveIntensity={2.2}
            roughness={0.2}
          />
        </mesh>

        {/* Local Kanpur Connection Arc (Her Home ◄——► His Home) */}
        <mesh>
          <tubeGeometry args={[localKanpurCurve, 20, 0.016, 6, false]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>

        {/* Pulse Packet 1 (Kanpur -> CDAC Bangalore) */}
        <mesh ref={pulsePacket1Ref}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#fef08a" intensity={1.2} distance={1.8} />
        </mesh>

        {/* Pulse Packet 2 (CDAC Bangalore -> Kanpur) */}
        <mesh ref={pulsePacket2Ref}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
          <pointLight color="#38bdf8" intensity={1.2} distance={1.8} />
        </mesh>

        {/* ─── Floating Distance Badge at Arc Apex (Billboard: ALWAYS CAMERA FACING) ─── */}
        <group
          position={[
            apexPos.x,
            apexPos.y + (expandedMarker === "distance" ? 0.38 : 0.16),
            apexPos.z,
          ]}
          onClick={(e) => handleMarkerClick(e, "distance")}
          onPointerDown={handleGlobePointerDown}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <Billboard follow={true}>
            {expandedMarker === "distance" ? (
              /* Expanded Full Telemetry Card in 3D (Click again to close) */
              <group>
                <mesh position={[0, 0, -0.02]}>
                  <planeGeometry args={[2.0, 0.72]} />
                  <meshBasicMaterial color="#080605" transparent opacity={0.96} />
                </mesh>
                <mesh position={[0, 0, -0.019]}>
                  <planeGeometry args={[2.04, 0.76]} />
                  <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[0, 0.22, 0]}
                  fontSize={0.11}
                  color={THEME.evidence.primary}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={900}
                  letterSpacing={0.12}
                >
                  ✦ 1,540 KM SEPARATION ✦
                </Text>
                <Text
                  position={[0, 0.08, 0]}
                  fontSize={0.065}
                  color="#fef3c7"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={700}
                  letterSpacing={0.1}
                >
                  KANPUR (HER) ◄————► CDAC BANGALORE (ME)
                </Text>
                <Text
                  position={[0, -0.06, 0]}
                  fontSize={0.058}
                  color={THEME.classified.bright}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={800}
                  letterSpacing={0.12}
                >
                  {"THAT'S THE DISTANCE. NOT THE FEELING."}
                </Text>
                <Text
                  position={[0, -0.19, 0]}
                  fontSize={0.050}
                  color="#7dd3fc"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={700}
                  letterSpacing={0.1}
                >
                  FLIGHT ~2h 30m • TRAIN ~32h • LATENCY 0.00s
                </Text>
                <Text
                  position={[0, -0.28, 0]}
                  fontSize={0.040}
                  color="#9c7a4c"
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={700}
                  letterSpacing={0.12}
                >
                  [CLICK TO CLOSE]
                </Text>
              </group>
            ) : (
              /* Sleek Minimalist Pill: Small & Unobtrusive */
              <group>
                <mesh position={[0, 0, -0.02]}>
                  <planeGeometry args={[0.72, 0.22]} />
                  <meshBasicMaterial color="#080605" transparent opacity={0.88} />
                </mesh>
                <mesh position={[0, 0, -0.019]}>
                  <planeGeometry args={[0.75, 0.25]} />
                  <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.7} />
                </mesh>
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.095}
                  color={THEME.evidence.primary}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight={900}
                  letterSpacing={0.12}
                >
                  1,540 KM
                </Text>
              </group>
            )}
          </Billboard>
        </group>

        {/* ─── 1. Her Home Marker & Hologram (Kanpur) ────────────────── */}
        <group
          position={herHomePos}
          onClick={(e) => handleMarkerClick(e, "her")}
          onPointerDown={handleGlobePointerDown}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          {/* Glowing Pin Beacon */}
          <mesh position={[herHomeNormal.x * 0.10, herHomeNormal.y * 0.10, herHomeNormal.z * 0.10]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={3.5} />
          </mesh>
          <pointLight color="#eab308" intensity={1.5} distance={1.8} />

          {/* Minimalist Pill by default; Enlarges into extra info in-place when clicked */}
          <group position={[herHomeNormal.x * 0.26, herHomeNormal.y * 0.26 + 0.10, herHomeNormal.z * 0.26]}>
            <Billboard follow={true}>
              {expandedMarker === "her" ? (
                /* Enlarged Her Home Dossier Card in 3D (Click again to close) */
                <group>
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[1.85, 0.65]} />
                    <meshBasicMaterial color="#060504" transparent opacity={0.96} />
                  </mesh>
                  <mesh position={[0, 0, -0.019]}>
                    <planeGeometry args={[1.89, 0.69]} />
                    <meshBasicMaterial color="#eab308" transparent opacity={0.85} />
                  </mesh>
                  <Text
                    position={[0, 0.19, 0]}
                    fontSize={0.10}
                    color="#facc15"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={900}
                    letterSpacing={0.12}
                  >
                    ✦ HER // ANSHIKA [KANPUR] ✦
                  </Text>
                  <Text
                    position={[0, 0.05, 0]}
                    fontSize={0.062}
                    color="#fef3c7"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={700}
                    letterSpacing={0.08}
                  >
                    26.45° N, 80.33° E • HER ROOTS
                  </Text>
                  <Text
                    position={[0, -0.07, 0]}
                    fontSize={0.056}
                    color={THEME.classified.bright}
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={800}
                    letterSpacing={0.1}
                  >
                    25 OCT 2003 • 23 YEARS OF RADIANCE
                  </Text>
                  <Text
                    position={[0, -0.20, 0]}
                    fontSize={0.042}
                    color="#9c7a4c"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={700}
                    letterSpacing={0.12}
                  >
                    [CLICK AGAIN TO CLOSE]
                  </Text>
                </group>
              ) : (
                /* Sleek Tiny Minimalist Tag: Just HER */
                <group>
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[0.42, 0.18]} />
                    <meshBasicMaterial color="#060504" transparent opacity={0.88} />
                  </mesh>
                  <mesh position={[0, 0, -0.019]}>
                    <planeGeometry args={[0.45, 0.21]} />
                    <meshBasicMaterial color="#eab308" transparent opacity={0.7} />
                  </mesh>
                  <Text
                    position={[0, 0, 0]}
                    fontSize={0.085}
                    color="#facc15"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={900}
                    letterSpacing={0.12}
                  >
                    HER
                  </Text>
                </group>
              )}
            </Billboard>
          </group>
        </group>

        {/* ─── 2. CDAC Hostel Marker & Hologram (Bangalore: ME) ─────────── */}
        <group
          position={cdacPos}
          onClick={(e) => handleMarkerClick(e, "me")}
          onPointerDown={handleGlobePointerDown}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          {/* Glowing Pin Beacon */}
          <mesh position={[cdacNormal.x * 0.10, cdacNormal.y * 0.10, cdacNormal.z * 0.10]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3.5} />
          </mesh>
          <pointLight color="#38bdf8" intensity={1.5} distance={1.8} />

          {/* Minimalist Pill by default; Enlarges into extra info in-place when clicked */}
          <group position={[cdacNormal.x * 0.26, cdacNormal.y * 0.26 - 0.10, cdacNormal.z * 0.26]}>
            <Billboard follow={true}>
              {expandedMarker === "me" ? (
                /* Enlarged Me Dossier Card in 3D (Click again to close) */
                <group>
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[1.85, 0.65]} />
                    <meshBasicMaterial color="#060504" transparent opacity={0.96} />
                  </mesh>
                  <mesh position={[0, 0, -0.019]}>
                    <planeGeometry args={[1.89, 0.69]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
                  </mesh>
                  <Text
                    position={[0, 0.19, 0]}
                    fontSize={0.10}
                    color="#38bdf8"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={900}
                    letterSpacing={0.12}
                  >
                    ✦ ME // ARNAV [BANGALORE] ✦
                  </Text>
                  <Text
                    position={[0, 0.05, 0]}
                    fontSize={0.062}
                    color="#fef3c7"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={700}
                    letterSpacing={0.08}
                  >
                    12.85° N, 77.66° E • CDAC HOSTEL POST
                  </Text>
                  <Text
                    position={[0, -0.07, 0]}
                    fontSize={0.056}
                    color="#7dd3fc"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={700}
                    letterSpacing={0.1}
                  >
                    6-MONTH DIPLOMA • STUDYING &amp; WAITING
                  </Text>
                  <Text
                    position={[0, -0.20, 0]}
                    fontSize={0.042}
                    color="#9c7a4c"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={700}
                    letterSpacing={0.12}
                  >
                    [CLICK AGAIN TO CLOSE]
                  </Text>
                </group>
              ) : (
                /* Sleek Tiny Minimalist Tag: Just ME */
                <group>
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[0.38, 0.18]} />
                    <meshBasicMaterial color="#060504" transparent opacity={0.88} />
                  </mesh>
                  <mesh position={[0, 0, -0.019]}>
                    <planeGeometry args={[0.41, 0.21]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
                  </mesh>
                  <Text
                    position={[0, 0, 0]}
                    fontSize={0.085}
                    color="#38bdf8"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={900}
                    letterSpacing={0.12}
                  >
                    ME
                  </Text>
                </group>
              )}
            </Billboard>
          </group>
        </group>

        {/* ─── 3. Subtle Origin Pin (Arnav's Home in Kanpur) ────────────── */}
        <group
          position={hisHomePos}
          onClick={(e) => handleMarkerClick(e, "arnav-home")}
          onPointerDown={handleGlobePointerDown}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          {/* Subtle Glowing Pin Beacon */}
          <mesh position={[hisHomeNormal.x * 0.10, hisHomeNormal.y * 0.10, hisHomeNormal.z * 0.10]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>

      {/* ─── Interactive Rotate & Zoom Hint Plaque Below Globe ───────────── */}
      <group position={[0, -0.1, -3.6]}>
        <Billboard follow={true}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[4.4, 0.54]} />
            <meshBasicMaterial
              color={isHovered ? "#181411" : "#0c0a08"}
              transparent
              opacity={0.94}
            />
          </mesh>
          <mesh position={[0, 0, -0.019]}>
            <planeGeometry args={[4.44, 0.58]} />
            <meshBasicMaterial color={THEME.evidence.primary} transparent opacity={0.4} />
          </mesh>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.095}
            color={isHovered ? THEME.evidence.primary : "#fef08a"}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.18}
          >
            ✦ HOLD &amp; DRAG TO ROTATE • SCROLL WHEEL TO ZOOM IN/OUT [{zoomPercent}%] ✦
          </Text>
          <Text
            position={[0, -0.10, 0]}
            fontSize={0.065}
            color="#e2d9cc"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
            letterSpacing={0.14}
          >
            CLICK &quot;HER&quot;, &quot;ME&quot;, OR &quot;1,540 KM&quot; TO EXPAND INFO IN-PLACE (CLICK AGAIN TO CLOSE)
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

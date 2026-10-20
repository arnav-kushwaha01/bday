"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { InteractableObject } from "@/engine/interaction/InteractableObject";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { THEME } from "@/lib/theme";

const GLOBE_RADIUS = 2.4;
const ROT_OFFSET_Y = Math.PI - 0.15; // Aligns India/subcontinent directly facing camera

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
 * radar target reticles for Kanpur and Bangalore, and classified metadata stamps.
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
    [35, 128], // Korea/Japan
    [22, 115], // South China
    [10, 105], // SE Asia
    [20, 100],
    [25, 90],
    [32, 75],
    [25, 65], // Iran / Arabian Sea
    [25, 55], // Persian Gulf
    [15, 50], // Yemen
    [15, 42], // Red Sea
    [30, 35], // Suez / Med
    [36, 28], // Greece
    [44, 12], // Italy
    [36, -5], // Gibraltar
    [48, -4], // France
    [55, 10], // Baltic
    [70, 30],
  ]);

  // Africa
  drawPolygon([
    [35, -5],
    [32, 32],
    [12, 45], // Horn of Africa
    [0, 42],
    [-15, 40],
    [-34, 18], // Cape of Good Hope
    [-20, 12],
    [0, 9],
    [5, -2],
    [15, -17], // West Africa bulge
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
    [30, -80], // Florida
    [25, -97], // Gulf of Mexico
    [18, -90], // Yucatan
    [15, -90],
    [20, -105], // Mexico Pacific
    [32, -117], // California
    [50, -125], // Pacific NW
    [60, -140], // Alaska
    [70, -165],
  ]);

  // South America
  drawPolygon([
    [10, -75],
    [5, -50],
    [-8, -35], // Brazil bulge
    [-23, -42],
    [-40, -62],
    [-55, -68], // Cape Horn
    [-40, -73],
    [-18, -70],
    [0, -80],
    [10, -75],
  ]);

  // 4. Radar Reticles & Target Markers on Texture
  const kanpur = toXY(26.4499, 80.3319);
  const blr = toXY(12.9716, 77.5946);

  // Helper: draw target reticle
  const drawReticle = (
    pos: { x: number; y: number },
    color: string,
    label: string,
    coords: string
  ) => {
    // Rings
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(pos.x - 30, pos.y);
    ctx.lineTo(pos.x + 30, pos.y);
    ctx.moveTo(pos.x, pos.y - 30);
    ctx.lineTo(pos.x, pos.y + 30);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Text Label
    ctx.font = "bold 18px monospace";
    ctx.fillStyle = color;
    ctx.fillText(label, pos.x + 36, pos.y - 8);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#e2d9cc";
    ctx.fillText(coords, pos.x + 36, pos.y + 12);
  };

  drawReticle(
    kanpur,
    "#eab308",
    "KANPUR [ORIGIN // HER HOME]",
    "26.4499° N, 80.3319° E • 25.10.2003"
  );
  drawReticle(
    blr,
    "#38bdf8",
    "BANGALORE [STATION // ARNAV]",
    "12.9716° N, 77.5946° E • CURRENT POST"
  );

  // Connecting Trajectory Line on Texture
  ctx.strokeStyle = "rgba(234, 179, 8, 0.75)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(kanpur.x, kanpur.y);
  ctx.quadraticCurveTo((kanpur.x + blr.x) / 2 + 15, (kanpur.y + blr.y) / 2, blr.x, blr.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Telemetry Label at midpoint on canvas
  ctx.font = "bold 16px monospace";
  ctx.fillStyle = "#f59e0b";
  ctx.fillText(
    "GEODESIC DISTANCE: 1,540 KM",
    (kanpur.x + blr.x) / 2 - 120,
    (kanpur.y + blr.y) / 2 - 16
  );

  // 5. Archival Confidential Watermarks
  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "rgba(185, 28, 28, 0.45)";
  ctx.fillText("CLASSIFIED SPATIAL MATRIX // CASE FILE #004", 40, 50);
  ctx.font = "14px monospace";
  ctx.fillStyle = "rgba(156, 122, 76, 0.55)";
  ctx.fillText("OBSERVATORY TELEMETRY • INDIAN CONTINENTAL SURVEY • BIRTHDAY ARCHIVE", 40, 75);

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

  // Archival Texture
  const earthTexture = useMemo(() => createArchivalEarthTexture(), []);

  // 3D Cartesian coordinates for Kanpur and Bangalore on the sphere surface
  const kanpurPos = useMemo(() => latLngToVector3(26.4499, 80.3319, GLOBE_RADIUS), []);
  const blrPos = useMemo(() => latLngToVector3(12.9716, 77.5946, GLOBE_RADIUS), []);

  // Arc Curve (Quadratic Bezier curving above sphere)
  const { arcCurve, apexPos } = useMemo(() => {
    const mid = kanpurPos.clone().add(blrPos).multiplyScalar(0.5);
    const apex = mid.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.42);
    const curve = new THREE.QuadraticBezierCurve3(kanpurPos, apex, blrPos);
    return { arcCurve: curve, apexPos: apex };
  }, [kanpurPos, blrPos]);

  // World coordinates of interactable beacons for distance detection
  const kanpurWorldPos = useMemo(
    () => [
      position[0] + kanpurPos.x,
      position[1] + kanpurPos.y,
      position[2] + kanpurPos.z,
    ] as [number, number, number],
    [position, kanpurPos]
  );

  const blrWorldPos = useMemo(
    () => [
      position[0] + blrPos.x,
      position[1] + blrPos.y,
      position[2] + blrPos.z,
    ] as [number, number, number],
    [position, blrPos]
  );

  // Normal vectors for pointing beacons outward
  const kanpurNormal = useMemo(() => kanpurPos.clone().normalize(), [kanpurPos]);
  const blrNormal = useMemo(() => blrPos.clone().normalize(), [blrPos]);

  // Animation frame: move pulse packets along the arc and gently breathe
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Pulse 1: Kanpur -> Bangalore
    if (pulsePacket1Ref.current) {
      const t1 = (time * 0.45) % 1;
      const pt1 = arcCurve.getPoint(t1);
      pulsePacket1Ref.current.position.copy(pt1);
      const scale1 = Math.sin(t1 * Math.PI) * 0.08 + 0.04;
      pulsePacket1Ref.current.scale.set(scale1, scale1, scale1);
    }

    // Pulse 2: Bangalore -> Kanpur
    if (pulsePacket2Ref.current) {
      const t2 = 1 - ((time * 0.45 + 0.5) % 1);
      const pt2 = arcCurve.getPoint(t2);
      pulsePacket2Ref.current.position.copy(pt2);
      const scale2 = Math.sin((1 - t2) * Math.PI) * 0.08 + 0.04;
      pulsePacket2Ref.current.scale.set(scale2, scale2, scale2);
    }

    // Subtle breathing rotation
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = Math.sin(time * 0.15) * 0.04;
      globeGroupRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* ─── Main Rotating Globe & Markers Group ─────────────────── */}
      <group ref={globeGroupRef}>
        {/* Central Earth Sphere */}
        <mesh rotation={[0, ROT_OFFSET_Y, 0]}>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          {earthTexture ? (
            <meshStandardMaterial
              map={earthTexture}
              roughness={0.45}
              metalness={0.2}
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
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* ─── 3D Great-Circle Flight Arc ────────────────────────── */}
        <mesh>
          <tubeGeometry args={[arcCurve, 48, 0.02, 8, false]} />
          <meshStandardMaterial
            color={THEME.evidence.primary}
            emissive={THEME.evidence.primary}
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Pulse Packet 1 (Traveling along curve) */}
        <mesh ref={pulsePacket1Ref}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#fef08a" intensity={0.8} distance={1.2} />
        </mesh>

        {/* Pulse Packet 2 (Traveling along curve) */}
        <mesh ref={pulsePacket2Ref}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
          <pointLight color="#38bdf8" intensity={0.8} distance={1.2} />
        </mesh>

        {/* Floating Distance Badge at Arc Apex */}
        <group position={[apexPos.x, apexPos.y + 0.22, apexPos.z]}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.1, 0.36]} />
            <meshBasicMaterial color="#080605" transparent opacity={0.85} />
          </mesh>
          <Text
            position={[0, 0.06, 0]}
            fontSize={0.13}
            color={THEME.evidence.primary}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.12}
          >
            1,540 KM
          </Text>
          <Text
            position={[0, -0.07, 0]}
            fontSize={0.055}
            color="#fef3c7"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.2}
          >
            DIRECT TRAJECTORY
          </Text>
        </group>

        {/* ─── Kanpur Marker & Hologram ─────────────────────────── */}
        <group position={kanpurPos}>
          {/* Beacon Column pointing outwards */}
          <mesh position={[kanpurNormal.x * 0.15, kanpurNormal.y * 0.15, kanpurNormal.z * 0.15]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color="#eab308"
              emissive="#eab308"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Warm point light at city */}
          <pointLight color="#eab308" intensity={1.5} distance={2.5} />

          {/* 3D Floating City Tag */}
          <group position={[0.2, 0.18, 0.15]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.5, 0.44]} />
              <meshBasicMaterial color="#080605" transparent opacity={0.85} />
            </mesh>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.075}
              color="#eab308"
              anchorX="center"
              anchorY="middle"
              fontWeight={800}
              letterSpacing={0.1}
            >
              KANPUR (HER HOME)
            </Text>
            <Text
              position={[0, 0.0, 0]}
              fontSize={0.05}
              color="#fef3c7"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              26.45° N, 80.33° E
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={0.045}
              color={THEME.classified.bright}
              anchorX="center"
              anchorY="middle"
              fontWeight={700}
              letterSpacing={0.15}
            >
              25 OCT 2003 • 23 YEARS
            </Text>
          </group>
        </group>

        {/* ─── Bangalore Marker & Hologram ───────────────────────── */}
        <group position={blrPos}>
          {/* Beacon Column pointing outwards */}
          <mesh position={[blrNormal.x * 0.15, blrNormal.y * 0.15, blrNormal.z * 0.15]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Cyan point light at city */}
          <pointLight color="#38bdf8" intensity={1.5} distance={2.5} />

          {/* 3D Floating City Tag */}
          <group position={[0.25, -0.18, 0.15]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.5, 0.4]} />
              <meshBasicMaterial color="#080605" transparent opacity={0.85} />
            </mesh>
            <Text
              position={[0, 0.08, 0]}
              fontSize={0.075}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
              fontWeight={800}
              letterSpacing={0.1}
            >
              BANGALORE (ARNAV)
            </Text>
            <Text
              position={[0, -0.02, 0]}
              fontSize={0.05}
              color="#fef3c7"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              12.97° N, 77.59° E
            </Text>
            <Text
              position={[0, -0.11, 0]}
              fontSize={0.045}
              color="#9c7a4c"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
            >
              CURRENT POST • MISSING HER
            </Text>
          </group>
        </group>
      </group>

      {/* ─── In-World Distance Interactables ─────────────────────── */}
      <InteractableObject
        id="dist-kanpur-beacon"
        type="evidence"
        position={kanpurWorldPos}
        interactionPrompt="INSPECT HER LOCATION [KANPUR]"
        onInteract={() => openMemory("dist-kanpur")}
        showMarker={false}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </InteractableObject>

      <InteractableObject
        id="dist-bangalore-beacon"
        type="evidence"
        position={blrWorldPos}
        interactionPrompt="INSPECT HIS LOCATION [BANGALORE]"
        onInteract={() => openMemory("dist-bangalore")}
        showMarker={false}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </InteractableObject>
    </group>
  );
}

"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Door } from "../RoomPrimitives";
import { soundEngine } from "@/engine/audio/AudioManager";
import { THEME } from "@/lib/theme";
import { getVideoUrl, getPhotoUrl } from "@/lib/assetManager";
import { ArchivalMediaMesh } from "@/components/media/ArchivalMediaMesh";
import { useTransitionStore } from "@/engine/transitions/transitionStore";

// ─── 3D High-End Aerodynamic Hypercar ──────────────────────────────

function AnshikaHypercar({
  carRef,
  speed,
  steerAngle,
  isShieldActive,
  isNitroActive,
}: {
  carRef: React.RefObject<THREE.Group | null>;
  speed: number;
  steerAngle: number;
  isShieldActive: boolean;
  isNitroActive: boolean;
}) {
  const frontLeftWheel = useRef<THREE.Group>(null);
  const frontRightWheel = useRef<THREE.Group>(null);
  const rearWheels = useRef<THREE.Group>(null);
  const exhaustGlow = useRef<THREE.PointLight>(null);
  const underglow = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const wheelRot = (speed / 0.35) * delta;
    if (frontLeftWheel.current) {
      frontLeftWheel.current.rotation.x += wheelRot;
      frontLeftWheel.current.rotation.y = steerAngle * 0.55;
    }
    if (frontRightWheel.current) {
      frontRightWheel.current.rotation.x += wheelRot;
      frontRightWheel.current.rotation.y = steerAngle * 0.55;
    }
    if (rearWheels.current) {
      rearWheels.current.rotation.x += wheelRot;
    }
    if (exhaustGlow.current) {
      exhaustGlow.current.intensity = isNitroActive
        ? 3.5 + Math.random() * 1.5
        : Math.abs(speed) > 2
        ? 1.5 + Math.random() * 0.5
        : 0.2;
    }
    if (underglow.current) {
      underglow.current.intensity = isShieldActive ? 3.0 : 1.2;
    }
  });

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      {/* ── Main Carbon/Metallic Chassis (Sculpted Hypercar Profile) ── */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.85, 0.38, 4.4]} />
        <meshStandardMaterial
          color="#9f1239"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Aerodynamic Front Nose Cone / Low Splitter */}
      <mesh position={[0, 0.28, 2.1]} castShadow>
        <boxGeometry args={[1.75, 0.14, 0.8]} />
        <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Carbon Side Canards */}
      <mesh position={[-0.92, 0.32, 1.9]} rotation={[0, 0.2, 0.15]}>
        <boxGeometry args={[0.1, 0.1, 0.45]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      <mesh position={[0.92, 0.32, 1.9]} rotation={[0, -0.2, -0.15]}>
        <boxGeometry args={[0.1, 0.1, 0.45]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>

      {/* Sleek Curved Cockpit Glass Canopy */}
      <group position={[0, 0.74, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.38, 2.1]} />
          <meshStandardMaterial
            color="#020617"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        {/* Roof Air Intake Scoop */}
        <mesh position={[0, 0.24, -0.2]}>
          <boxGeometry args={[0.45, 0.12, 0.65]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>

      {/* Muscular Rear Wheel Arches / Haunches */}
      <mesh position={[-0.96, 0.5, -1.1]}>
        <boxGeometry args={[0.2, 0.38, 1.4]} />
        <meshStandardMaterial color="#881337" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.96, 0.5, -1.1]}>
        <boxGeometry args={[0.2, 0.38, 1.4]} />
        <meshStandardMaterial color="#881337" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Aggressive GT Rear Carbon Wing */}
      <group position={[0, 1.15, -2.1]}>
        {/* Main curved foil */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.08, 0.52]} />
          <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Carbon Wing Endplates */}
        <mesh position={[-1.1, 0.05, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.58]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} />
        </mesh>
        <mesh position={[1.1, 0.05, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.58]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} />
        </mesh>
        {/* Twin Vertical Mount Uprights */}
        <mesh position={[-0.55, -0.32, 0]}>
          <boxGeometry args={[0.06, 0.55, 0.18]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} />
        </mesh>
        <mesh position={[0.55, -0.32, 0]}>
          <boxGeometry args={[0.06, 0.55, 0.18]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} />
        </mesh>
      </group>

      {/* Projector LED Headlights & DRL Light Strips */}
      <group position={[0, 0.44, 2.18]}>
        <mesh position={[-0.72, 0, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.06]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.72, 0, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.06]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <spotLight
          position={[0, 0.3, 0]}
          target-position={[0, 0, 25]}
          color="#fef08a"
          intensity={4.5}
          distance={45}
          angle={0.65}
          penumbra={0.3}
        />
      </group>

      {/* Full-Width Rear LED Tail Light Strip */}
      <group position={[0, 0.52, -2.22]}>
        <mesh>
          <boxGeometry args={[1.7, 0.08, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight position={[0, 0, -0.1]} color="#ef4444" intensity={1.8} distance={5} />
      </group>

      {/* Golden Vanity License Plate: "ANSHIKA 23" */}
      <group position={[0, 0.32, -2.23]}>
        <mesh>
          <boxGeometry args={[0.7, 0.2, 0.02]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.08}
          color="#09090b"
          fontWeight={900}
          anchorX="center"
          anchorY="middle"
        >
          ANSHIKA 23
        </Text>
      </group>

      {/* Front Left Wheel Assembly with Brake Caliper */}
      <group ref={frontLeftWheel} position={[-0.98, 0.34, 1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
          <meshStandardMaterial color="#09090b" roughness={0.85} />
        </mesh>
        {/* Silver Alloy Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.14, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Red Brake Caliper */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.18]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Front Right Wheel Assembly with Brake Caliper */}
      <group ref={frontRightWheel} position={[0.98, 0.34, 1.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
          <meshStandardMaterial color="#09090b" roughness={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.14, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.18]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Rear Wheel Assembly */}
      <group ref={rearWheels}>
        <mesh
          position={[-1.02, 0.36, -1.2]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.36, 0.36, 0.36, 20]} />
          <meshStandardMaterial color="#09090b" roughness={0.85} />
        </mesh>
        <mesh
          position={[1.02, 0.36, -1.2]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.36, 0.36, 0.36, 0.36, 20]} />
          <meshStandardMaterial color="#09090b" roughness={0.85} />
        </mesh>
      </group>

      {/* Quad Titanium Exhaust Tips & Animated Nitro Afterburners */}
      <group position={[0, 0.24, -2.24]}>
        {[-0.45, -0.22, 0.22, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.25, 12]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        <pointLight
          ref={exhaustGlow}
          position={[0, 0, -0.4]}
          color={isNitroActive ? "#06b6d4" : "#f59e0b"}
          intensity={1.5}
          distance={5}
        />
      </group>

      {/* Neon Underglow Halo */}
      <pointLight
        ref={underglow}
        position={[0, 0.1, 0]}
        color={isShieldActive ? "#38bdf8" : "#ec4899"}
        intensity={1.4}
        distance={3.5}
      />

      {/* Protective Shield Bubble (when active) */}
      {isShieldActive && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[2.8, 20, 20]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.25}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Giant Stadium Grandstands with Animated Fans & Banners ─────────

function MegaStadiumGrandstand({
  position,
  rotation,
  bannerText,
  width = 60,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  bannerText: string;
  width?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5 Tiered Massive Bleachers */}
      {[0, 1, 2, 3, 4].map((tier) => (
        <group key={tier} position={[0, tier * 1.6 + 1.0, -tier * 2.2]}>
          {/* Concrete Tier Shelf */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[width, 1.2, 2.4]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          {/* Crowd Rows (Cheering animated spectators) */}
          {[-width * 0.4, -width * 0.25, -width * 0.1, 0, width * 0.1, width * 0.25, width * 0.4].map(
            (cx, i) => (
              <group key={i} position={[cx, 0.95, 0]}>
                <mesh>
                  <capsuleGeometry args={[0.3, 0.6, 6, 6]} />
                  <meshStandardMaterial
                    color={
                      (tier + i) % 4 === 0
                        ? "#f43f5e"
                        : (tier + i) % 4 === 1
                        ? "#facc15"
                        : (tier + i) % 4 === 2
                        ? "#38bdf8"
                        : "#22c55e"
                    }
                    roughness={0.7}
                  />
                </mesh>
                <mesh position={[0, 0.58, 0]}>
                  <sphereGeometry args={[0.22, 8, 8]} />
                  <meshStandardMaterial color="#fde047" roughness={0.6} />
                </mesh>
              </group>
            )
          )}
        </group>
      ))}

      {/* Front Glowing LED Digital Ribbon Banner */}
      <group position={[0, 1.8, 1.4]}>
        <mesh>
          <boxGeometry args={[width - 2, 1.4, 0.15]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.7} />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.65}
          color="#fef08a"
          fontWeight={900}
          letterSpacing={0.15}
          anchorX="center"
          anchorY="middle"
        >
          {bannerText}
        </Text>
      </group>
    </group>
  );
}

// ─── High-Mast Stadium Floodlight Tower ──────────────────────────────

function HighMastTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* High-tension steel pylon */}
      <mesh position={[0, 12, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.8, 24, 8]} />
        <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Crossbar Platform */}
      <mesh position={[0, 24, 0]}>
        <boxGeometry args={[5.5, 2.4, 1.0]} />
        <meshStandardMaterial color="#18181b" metalness={0.8} />
      </mesh>
      {/* 6 High-Power Stadium Lamps */}
      {[-1.8, 0, 1.8].map((x) =>
        [-0.5, 0.5].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, 24 + y, 0.55]}>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))
      )}
      <spotLight
        position={[0, 24, 1]}
        target-position={[0, 0, 0]}
        intensity={3.8}
        color="#fffbeb"
        distance={95}
        angle={0.7}
        penumbra={0.4}
      />
    </group>
  );
}

// ─── Circuit Checkpoints & Waypoint Definitions ──────────────────────

interface CircuitWaypoint {
  index: number;
  name: string;
  pos: [number, number]; // [x, z]
  radius: number;
}

const CIRCUIT_CHECKPOINTS: CircuitWaypoint[] = [
  { index: 0, name: "START / FINISH LINE", pos: [0, -70], radius: 18 },
  { index: 1, name: "TURN 1 APEX (EAST)", pos: [55, -20], radius: 24 },
  { index: 2, name: "BACKSTRETCH (NORTH)", pos: [35, 60], radius: 24 },
  { index: 3, name: "HAIRPIN CHICANE (WEST)", pos: [-45, 55], radius: 24 },
  { index: 4, name: "FINAL CORNER (WEST)", pos: [-50, -25], radius: 24 },
];

// ─── Obstacles & Power-Up Items ─────────────────────────────────────

interface TrackPowerUp {
  id: number;
  type: "nitro" | "shield" | "star" | "heart";
  pos: [number, number, number];
}

interface CircuitObstacle {
  id: number;
  type: "curfew" | "distance" | "cone" | "oilslick";
  pos: [number, number, number];
  label: string;
}

export interface RaceEventPopup {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

export default function CarRaceRoom() {
  const { camera } = useThree();
  const carRef = useRef<THREE.Group>(null);
  const carMarkerSvgRef = useRef<SVGGElement>(null);

  // Gameplay State
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number>(1);
  const [lapTime, setLapTime] = useState<number>(0);
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [nitroCount, setNitroCount] = useState<number>(3);
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [hasWonGrandPrix, setHasWonGrandPrix] = useState<boolean>(false);
  const [hudNotice, setHudNotice] = useState<string | null>(null);
  const [racePopups, setRacePopups] = useState<RaceEventPopup[]>([]);

  const triggerRacePopup = useCallback(
    (icon: string, title: string, subtitle: string, color: string = "#facc15") => {
      const id = Date.now() + Math.random();
      setRacePopups((prev) => [...prev.slice(-2), { id, icon, title, subtitle, color }]);
      setTimeout(() => {
        setRacePopups((prev) => prev.filter((p) => p.id !== id));
      }, 2800);
    },
    []
  );

  // Dynamic Car Kinematics
  const carPos = useRef(new THREE.Vector3(0, 0, -68));
  const carYaw = useRef<number>(0);
  const carSpeed = useRef<number>(0);
  const carSteer = useRef<number>(0);
  const slipAngle = useRef<number>(0);
  const collectedPowerupIds = useRef<Set<number>>(new Set());
  const triggeredObstacleIds = useRef<Set<number>>(new Set());

  // Input listener
  const keys = useRef<{ [k: string]: boolean }>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === " " && nitroCount > 0 && !isNitroActive) {
        setIsNitroActive(true);
        setNitroCount((n) => n - 1);
        soundEngine.playEngineRev();
        setTimeout(() => setIsNitroActive(false), 2800);
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, [nitroCount, isNitroActive]);

  // Powerups placed around the huge circuit track
  const powerUps: TrackPowerUp[] = useMemo(
    () => [
      { id: 101, type: "nitro", pos: [20, 0.8, -60] },
      { id: 102, type: "heart", pos: [52, 0.8, -35] },
      { id: 103, type: "star", pos: [55, 0.8, 15] },
      { id: 104, type: "nitro", pos: [45, 0.8, 55] },
      { id: 105, type: "shield", pos: [0, 0.8, 72] },
      { id: 106, type: "star", pos: [-42, 0.8, 55] },
      { id: 107, type: "heart", pos: [-55, 0.8, 10] },
      { id: 108, type: "nitro", pos: [-48, 0.8, -45] },
    ],
    []
  );

  // Obstacles placed along the chicane and corners
  const obstacles: CircuitObstacle[] = useMemo(
    () => [
      { id: 201, type: "cone", pos: [45, 0, -50], label: "OVERTHINKING HAZARD" },
      { id: 202, type: "curfew", pos: [56, 0, -5], label: "HOSTEL CURFEW 9PM" },
      { id: 203, type: "oilslick", pos: [48, 0, 35], label: "OIL SLICK" },
      { id: 204, type: "distance", pos: [15, 0, 70], label: "1,540 KM DISTANCE GATE" },
      { id: 205, type: "curfew", pos: [-35, 0, 65], label: "CURFEW GATE" },
      { id: 206, type: "oilslick", pos: [-52, 0, 30], label: "OIL SLICK" },
      { id: 207, type: "cone", pos: [-54, 0, -10], label: "OVERTHINKING CONES" },
      { id: 208, type: "distance", pos: [-35, 0, -60], label: "1,540 KM DISTANCE GATE" },
    ],
    []
  );

  // Main Vehicle Physics and Lap Detection Loop
  useFrame((_, delta) => {
    // Lap Timer
    if (!hasWonGrandPrix) {
      setLapTime((t) => t + delta);
    }

    // 1. Inputs
    let throttle = 0;
    let targetSteer = 0;

    if (keys.current["w"] || keys.current["arrowup"]) throttle += 1;
    if (keys.current["s"] || keys.current["arrowdown"]) throttle -= 0.85;
    if (keys.current["a"] || keys.current["arrowleft"]) targetSteer += 1;
    if (keys.current["d"] || keys.current["arrowright"]) targetSteer -= 1;

    // Smooth steering interpolation
    carSteer.current = THREE.MathUtils.lerp(carSteer.current, targetSteer, delta * 12);

    // 2. Acceleration Dynamics
    const maxForwardSpeed = isNitroActive ? 62.0 : 42.0;
    const accelRate = isNitroActive ? 40.0 : 22.0;
    const brakeRate = 28.0;
    const friction = 8.0;

    if (throttle > 0) {
      carSpeed.current = Math.min(maxForwardSpeed, carSpeed.current + accelRate * delta);
    } else if (throttle < 0) {
      carSpeed.current = Math.max(-14.0, carSpeed.current - brakeRate * delta);
    } else {
      // Natural rolling resistance
      if (carSpeed.current > 0) {
        carSpeed.current = Math.max(0, carSpeed.current - friction * delta);
      } else if (carSpeed.current < 0) {
        carSpeed.current = Math.min(0, carSpeed.current + friction * delta);
      }
    }

    // 3. Angular Turning Dynamics (with realistic drift / slip angle)
    if (Math.abs(carSpeed.current) > 0.5) {
      const turnAgility = 1.85;
      const turnRate = carSteer.current * turnAgility * (carSpeed.current / maxForwardSpeed);
      carYaw.current += turnRate * delta;

      // Calculate lateral slip
      slipAngle.current = THREE.MathUtils.lerp(
        slipAngle.current,
        -carSteer.current * 0.18 * (carSpeed.current / maxForwardSpeed),
        delta * 6
      );
    } else {
      slipAngle.current = 0;
    }

    // 4. Update Position
    const moveHeading = carYaw.current + slipAngle.current;
    carPos.current.x += Math.sin(moveHeading) * carSpeed.current * delta;
    carPos.current.z += Math.cos(moveHeading) * carSpeed.current * delta;

    // Outer Stadium Boundaries (Massive Arena 130m x 130m)
    carPos.current.x = Math.max(-85.0, Math.min(85.0, carPos.current.x));
    carPos.current.z = Math.max(-95.0, Math.min(95.0, carPos.current.z));

    // Update Car Mesh
    if (carRef.current) {
      carRef.current.position.set(carPos.current.x, 0, carPos.current.z);
      carRef.current.rotation.y = carYaw.current;
      // Body roll into corners and pitch on acceleration/braking
      carRef.current.rotation.z = -carSteer.current * 0.08 * (carSpeed.current / maxForwardSpeed);
      carRef.current.rotation.x = (throttle > 0 ? -0.02 : throttle < 0 ? 0.04 : 0);
    }

    // ── Update 2D SVG Mini-Map Radar Marker (Zero React Re-render Overhead) ──
    if (carMarkerSvgRef.current) {
      const mx = 90 + (carPos.current.x / 95) * 72;
      const my = 90 + (carPos.current.z / 95) * 72;
      const deg = (carYaw.current * 180) / Math.PI;
      carMarkerSvgRef.current.setAttribute(
        "transform",
        `translate(${mx.toFixed(1)}, ${my.toFixed(1)}) rotate(${deg.toFixed(1)})`
      );
    }

    setSpeedKmh(Math.round(Math.abs(carSpeed.current) * 3.6));

    // 5. Checkpoint & Lap Detection
    const targetWp = CIRCUIT_CHECKPOINTS[currentCheckpoint];
    if (targetWp) {
      const dx = carPos.current.x - targetWp.pos[0];
      const dz = carPos.current.z - targetWp.pos[1];
      const dist = Math.hypot(dx, dz);

      if (dist < targetWp.radius) {
        soundEngine.playTapeClick();
        setScore((s) => s + 200);

        if (currentCheckpoint === CIRCUIT_CHECKPOINTS.length - 1) {
          // Ready for Start/Finish line
          triggerRacePopup("🏁", "FINAL CHICANE CLEARED!", "FLOOR IT! ENTERING HOME STRETCH!", "#38bdf8");
          setCurrentCheckpoint(0);
        } else if (currentCheckpoint === 0) {
          // LAP COMPLETED! WINNER!
          setHasWonGrandPrix(true);
          soundEngine.playCrowdCheer();
          soundEngine.playHappyBirthdayMelody();
          setBestLapTime(lapTime);
          triggerRacePopup(
            "🏆",
            "GRAND PRIX CHAMPION!",
            `ANSHIKA WINS! LAP TIME: ${lapTime.toFixed(2)}s • EVIDENCE CLUE UNLOCKED`,
            "#fde047"
          );
        } else {
          triggerRacePopup("🚩", `CHECKPOINT: ${targetWp.name}`, `SECTOR SPLIT CLEAR • +200 PTS`, "#38bdf8");
          setCurrentCheckpoint((c) => c + 1);
        }
      }
    }

    // 6. Power-Up Collisions
    powerUps.forEach((item) => {
      if (!collectedPowerupIds.current.has(item.id)) {
        const dx = carPos.current.x - item.pos[0];
        const dz = carPos.current.z - item.pos[2];
        if (Math.hypot(dx, dz) < 3.2) {
          collectedPowerupIds.current.add(item.id);
          soundEngine.playTargetPop();

          if (item.type === "nitro") {
            setNitroCount((n) => Math.min(n + 1, 5));
            setScore((s) => s + 150);
            triggerRacePopup("⚡", "NITRO BOOST REFILLED!", "PRESS [SPACE] TO ENGAGE +40 KM/H SPEED BURST", "#06b6d4");
          } else if (item.type === "shield") {
            setIsShieldActive(true);
            setScore((s) => s + 250);
            triggerRacePopup("🛡️", "LOVE SHIELD ONLINE!", "IMMUNITY TO TRACK HAZARDS & CURFEWS FOR 6s", "#38bdf8");
            setTimeout(() => setIsShieldActive(false), 6000);
          } else if (item.type === "star") {
            setScore((s) => s + 500);
            triggerRacePopup("⭐", "11:11 LUCKY STAR!", "+500 PTS • ANSHIKA WISH MULTIPLIER", "#facc15");
          } else if (item.type === "heart") {
            setScore((s) => s + 300);
            triggerRacePopup("💖", "HEART OVERDRIVE!", "+300 PTS • MAXIMUM TURBO ADRENALINE", "#f43f5e");
          }
        }
      }
    });

    // 7. Obstacle Collisions
    obstacles.forEach((obs) => {
      if (!triggeredObstacleIds.current.has(obs.id)) {
        const dx = carPos.current.x - obs.pos[0];
        const dz = carPos.current.z - obs.pos[2];
        if (Math.hypot(dx, dz) < 3.0) {
          triggeredObstacleIds.current.add(obs.id);

          if (isShieldActive) {
            // Smash through with shield
            soundEngine.playTargetPop();
            setScore((s) => s + 200);
            triggerRacePopup("🛡️", "SHIELD SMASH!", `BLOWN PAST ${obs.label} • +200 PTS BONUS`, "#4ade80");
          } else {
            // Obstacle penalty
            soundEngine.playTapeClick();
            if (obs.type === "oilslick") {
              slipAngle.current = (Math.random() - 0.5) * 0.8;
              carSpeed.current *= 0.6;
              triggerRacePopup("⚠️", "OIL SLICK SPOTTED!", "TRACTION SLIP! COUNTERSTEER TO RECOVER", "#f97316");
            } else {
              carSpeed.current *= 0.4;
              triggerRacePopup("⚠️", "HAZARD IMPACT!", `HIT ${obs.label} • SPEED DUCKED`, "#ef4444");
            }
          }
          // Reset obstacle after 8 seconds
          setTimeout(() => triggeredObstacleIds.current.delete(obs.id), 8000);
        }
      }
    });

    // 8. Dynamic Cinema Chase Camera Follow
    const camDistance = 8.5 + (Math.abs(carSpeed.current) / maxForwardSpeed) * 3.5;
    const camHeight = 3.6 + (Math.abs(carSpeed.current) / maxForwardSpeed) * 0.8;

    const targetCamX = carPos.current.x - Math.sin(carYaw.current) * camDistance;
    const targetCamY = carPos.current.y + camHeight;
    const targetCamZ = carPos.current.z - Math.cos(carYaw.current) * camDistance;

    camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.14);
    camera.lookAt(
      carPos.current.x + Math.sin(carYaw.current) * 6.0,
      carPos.current.y + 1.2,
      carPos.current.z + Math.cos(carYaw.current) * 6.0
    );
  });

  return (
    <group>
      {/* ── Stadium Lighting ── */}
      <ambientLight intensity={0.8} color="#fef08a" />
      <directionalLight position={[0, 45, 0]} intensity={1.8} color="#fffbeb" castShadow />

      {/* 8 Giant High-Mast Floodlight Towers */}
      <HighMastTower position={[-80, 0, -90]} />
      <HighMastTower position={[80, 0, -90]} />
      <HighMastTower position={[-80, 0, 90]} />
      <HighMastTower position={[80, 0, 90]} />
      <HighMastTower position={[-85, 0, 0]} />
      <HighMastTower position={[85, 0, 0]} />
      <HighMastTower position={[0, 0, -95]} />
      <HighMastTower position={[0, 0, 95]} />

      {/* ── Massive Stadium Ground (Infield & Outfield Grass) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#052e16" roughness={0.9} />
      </mesh>

      {/* ── Grand Prix Circuit Track (Continuous Asphalt Course Loop) ── */}
      {/* 1. Main Start/Finish Straightaway (Z: -80 to 20, X: 0 to 20) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -40]} receiveShadow>
        <planeGeometry args={[18, 90]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      {/* 2. Turn 1 Sweeper East (Z: -20 to 50, X: 50) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[52, -0.01, 15]} receiveShadow>
        <planeGeometry args={[18, 90]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      {/* 3. North Hairpin Curve (Z: 68, X: -20 to 50) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 68]} receiveShadow>
        <planeGeometry args={[110, 18]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      {/* 4. West Back Straight & Chicane (Z: 20 to -60, X: -50) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, -0.01, 0]} receiveShadow>
        <planeGeometry args={[18, 110]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      {/* 5. South Sweeper returning to Start Line (Z: -70, X: -50 to 0) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, -0.01, -70]} receiveShadow>
        <planeGeometry args={[65, 18]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>

      {/* Track Center Line Markings */}
      {[-80, -60, -40, -20, 0, 20].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[0.4, 6]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      ))}

      {/* Red & White Apex Rumble Curbs on Corners */}
      {[-1, 1].map((side) =>
        [-80, -40, 0, 40, 60].map((z, idx) => (
          <mesh key={`${side}-${z}`} position={[side * 9.2, 0.08, z]}>
            <boxGeometry args={[0.8, 0.16, 10]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#ef4444" : "#ffffff"}
              roughness={0.4}
            />
          </mesh>
        ))
      )}

      {/* ── Start / Finish Line Overhead Gantry & Flashing Lights ── */}
      <group position={[0, 0, -70]}>
        {/* Support Gantry Pillars */}
        <mesh position={[-10.5, 5, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 10, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        <mesh position={[10.5, 5, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 10, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        {/* Overhead Gantry Signboard */}
        <mesh position={[0, 9.2, 0]}>
          <boxGeometry args={[22, 1.8, 0.5]} />
          <meshStandardMaterial color="#09090b" metalness={0.8} />
        </mesh>
        <Text
          position={[0, 9.2, 0.3]}
          fontSize={0.75}
          color="#fde047"
          fontWeight={900}
          letterSpacing={0.15}
          anchorX="center"
          anchorY="middle"
        >
          🏁 ANSHIKA 23RD BIRTHDAY GRAND PRIX 🏁
        </Text>
        {/* Checkered Finish Line Pattern on Road */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[18, 3.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ── Mega Stadium Bleachers & Cheering Crowds ── */}
      {/* North Grandstand */}
      <MegaStadiumGrandstand
        position={[0, 0, 88]}
        rotation={[0, Math.PI, 0]}
        bannerText="★ GO QUEEN ANSHIKA! • 23RD BIRTHDAY GRAND PRIX CHAMPION ★"
        width={90}
      />
      {/* South Grandstand */}
      <MegaStadiumGrandstand
        position={[0, 0, -88]}
        rotation={[0, 0, 0]}
        bannerText="★ SLAYYY ANSHIKA! • 1,540 KM CAN'T STOP TEAM ARNAV ★"
        width={90}
      />
      {/* East Grandstand */}
      <MegaStadiumGrandstand
        position={[75, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        bannerText="★ BEAUTIFUL • MASTERMIND • MAIN CHARACTER ★"
        width={100}
      />
      {/* West Grandstand */}
      <MegaStadiumGrandstand
        position={[-75, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        bannerText="★ FROM KULHAD78 TO FOREVER • SPEED QUEEN ★"
        width={100}
      />

      {/* ── Giant Trackside Jumbotrons Playing Anshika's Real Looping Videos ── */}
      {/* Jumbotron 1: Passenger Princess Video (North East) */}
      <group position={[68, 8, 45]} rotation={[0, -Math.PI / 2.3, 0]}>
        <mesh>
          <boxGeometry args={[14, 8.4, 0.4]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("anshika_on_our_last_anniversary.jpeg")}
          videoUrl={getVideoUrl("her_being_a_passenger_princess.mp4")}
          width={13.2}
          height={7.6}
          title="LIVE FEED // PASSENGER PRINCESS FOREVER"
        />
      </group>

      {/* Jumbotron 2: Slaying Diva Video (North West) */}
      <group position={[-68, 8, 45]} rotation={[0, Math.PI / 2.3, 0]}>
        <mesh>
          <boxGeometry args={[14, 8.4, 0.4]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("our_classic_heart_shaped_photo.jpeg")}
          videoUrl={getVideoUrl(
            "her_looking_like_a_diva_while_air_distorts_her_hair_and_she_fixes_them_with_her_hands.mp4"
          )}
          width={13.2}
          height={7.6}
          title="LIVE FEED // DIVA ON THE TRACK"
        />
      </group>

      {/* Jumbotron 3: Road Trip with Arnav & Big Brother (South East) */}
      <group position={[68, 8, -45]} rotation={[0, -Math.PI / 1.7, 0]}>
        <mesh>
          <boxGeometry args={[14, 8.4, 0.4]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("us looking hot her hotter.jpeg")}
          videoUrl={getVideoUrl("her_arnav_and_her_big_brother_in_a_car.mp4")}
          width={13.2}
          height={7.6}
          title="ROAD TRIP ARCHIVE // BROTHER & ARNAV"
        />
      </group>

      {/* Jumbotron 4: Slaying in Mocha Cafe (South West) */}
      <group position={[-68, 8, -45]} rotation={[0, Math.PI / 1.7, 0]}>
        <mesh>
          <boxGeometry args={[14, 8.4, 0.4]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("our photo in our school afterparty.jpeg")}
          videoUrl={getVideoUrl("her_slaying_in_her_look_in_mocha_cafe.mp4")}
          width={13.2}
          height={7.6}
          title="MOCHA CAFÉ // NUMBER 1 IN OUR HEARTS"
        />
      </group>

      {/* ── The 3D Drivable Hypercar ── */}
      <AnshikaHypercar
        carRef={carRef}
        speed={carSpeed.current}
        steerAngle={carSteer.current}
        isShieldActive={isShieldActive}
        isNitroActive={isNitroActive}
      />

      {/* ── 3D Power-Up Pickups Along Track ── */}
      {powerUps.map((item) => {
        if (collectedPowerupIds.current.has(item.id)) return null;
        return (
          <group key={item.id} position={item.pos}>
            <Float speed={3.5} rotationIntensity={0.6} floatIntensity={0.8}>
              {item.type === "nitro" && (
                <group>
                  <mesh>
                    <octahedronGeometry args={[0.7]} />
                    <meshBasicMaterial color="#06b6d4" />
                  </mesh>
                  <pointLight color="#06b6d4" intensity={2.0} distance={5} />
                </group>
              )}
              {item.type === "shield" && (
                <group>
                  <mesh>
                    <sphereGeometry args={[0.75, 16, 16]} />
                    <meshBasicMaterial color="#38bdf8" wireframe />
                  </mesh>
                  <pointLight color="#38bdf8" intensity={2.0} distance={5} />
                </group>
              )}
              {item.type === "star" && (
                <group>
                  <mesh>
                    <octahedronGeometry args={[0.8]} />
                    <meshBasicMaterial color="#facc15" />
                  </mesh>
                  <pointLight color="#facc15" intensity={2.5} distance={6} />
                </group>
              )}
              {item.type === "heart" && (
                <group>
                  <mesh>
                    <sphereGeometry args={[0.7, 16, 16]} />
                    <meshBasicMaterial color="#f43f5e" />
                  </mesh>
                  <pointLight color="#f43f5e" intensity={2.0} distance={5} />
                </group>
              )}
            </Float>
          </group>
        );
      })}

      {/* ── 3D Obstacles Along Track ── */}
      {obstacles.map((obs) => {
        if (triggeredObstacleIds.current.has(obs.id)) return null;
        return (
          <group key={obs.id} position={obs.pos}>
            {obs.type === "curfew" && (
              <group>
                <mesh position={[0, 1.0, 0]}>
                  <boxGeometry args={[4.2, 1.8, 0.4]} />
                  <meshStandardMaterial color="#dc2626" roughness={0.4} />
                </mesh>
                <Text
                  position={[0, 1.0, 0.25]}
                  fontSize={0.35}
                  color="#ffffff"
                  fontWeight={900}
                  anchorX="center"
                >
                  HOSTEL CURFEW 9PM
                </Text>
              </group>
            )}
            {obs.type === "distance" && (
              <group>
                <mesh position={[0, 1.8, 0]}>
                  <boxGeometry args={[5.5, 0.9, 0.35]} />
                  <meshBasicMaterial color="#f59e0b" />
                </mesh>
                <Text
                  position={[0, 1.8, 0.2]}
                  fontSize={0.3}
                  color="#000000"
                  fontWeight={900}
                  anchorX="center"
                >
                  1,540 KM DISTANCE GATE
                </Text>
              </group>
            )}
            {obs.type === "cone" && (
              <group position={[0, 0.6, 0]}>
                <mesh>
                  <coneGeometry args={[0.45, 1.2, 12]} />
                  <meshStandardMaterial color="#f97316" roughness={0.3} />
                </mesh>
              </group>
            )}
            {obs.type === "oilslick" && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                <circleGeometry args={[2.8, 16]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ── Checkpoint Gate Visuals ── */}
      {CIRCUIT_CHECKPOINTS.map((wp) => (
        <group key={wp.index} position={[wp.pos[0], 0, wp.pos[1]]}>
          {wp.index !== 0 && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[wp.radius * 0.85, wp.radius, 32]} />
              <meshBasicMaterial
                color={currentCheckpoint === wp.index ? "#fde047" : "#38bdf8"}
                transparent
                opacity={0.45}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* ── Victory Grand Prix Podium Celebration Banner ── */}
      {hasWonGrandPrix && (
        <group position={[0, 7.5, carPos.current.z + 14]}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
            <Text
              position={[0, 1.2, 0]}
              fontSize={1.1}
              color="#fde047"
              fontWeight={900}
              anchorX="center"
            >
              🏆 ANSHIKA WINS THE 23RD BDAY GRAND PRIX! 🏆
            </Text>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.45}
              color="#38bdf8"
              fontWeight={700}
              anchorX="center"
            >
              LAP RECORDED: {lapTime.toFixed(2)}s • EVIDENCE CLUE UNLOCKED
            </Text>
          </Float>
        </group>
      )}

      {/* ── Dynamic Race HUD & 2D Circuit Radar Mini-Map ── */}
      <Html fullscreen style={{ pointerEvents: "none" }}>
        {/* Floating Race Event Popups (Top Center) */}
        <div
          style={{
            position: "absolute",
            top: "4.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          {racePopups.map((popup) => (
            <div
              key={popup.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.6rem 1.4rem",
                background: "rgba(10, 10, 15, 0.88)",
                border: `1.5px solid ${popup.color}`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.7), 0 0 16px ${popup.color}44`,
                borderRadius: 8,
                backdropFilter: "blur(8px)",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>{popup.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span
                  style={{
                    color: popup.color,
                    fontWeight: 900,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  {popup.title}
                </span>
                <span style={{ color: "#d4d4d8", fontSize: "0.62rem", letterSpacing: "0.06em" }}>
                  {popup.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Circuit Mini-Map Radar (Bottom Right) */}
        <div
          style={{
            position: "absolute",
            bottom: "1.2rem",
            right: "1.2rem",
            background: "rgba(9, 9, 15, 0.92)",
            border: `1.5px solid ${THEME.evidence.primary}99`,
            borderRadius: 8,
            boxShadow: "0 12px 36px rgba(0,0,0,0.85), inset 0 0 12px rgba(250,204,21,0.06)",
            backdropFilter: "blur(10px)",
            padding: "0.65rem 0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            zIndex: 50,
            fontFamily: "var(--font-geist-mono), monospace",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.55rem" }}>
            <span style={{ color: THEME.evidence.primary, fontWeight: 800, letterSpacing: "0.15em" }}>
              CIRCUIT RADAR // 260M
            </span>
            <span style={{ color: "#4ade80", fontSize: "0.5rem", fontWeight: 700 }}>● LIVE GPS</span>
          </div>

          {/* SVG Map Canvas */}
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ background: "#050508", borderRadius: 4 }}>
            {/* Radar Grid Circles */}
            <circle cx="90" cy="90" r="82" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="90" cy="90" r="54" fill="none" stroke="#18181b" strokeWidth="1" />
            <circle cx="90" cy="90" r="26" fill="none" stroke="#18181b" strokeWidth="1" />
            <line x1="90" y1="8" x2="90" y2="172" stroke="#18181b" strokeWidth="1" />
            <line x1="8" y1="90" x2="172" y2="90" stroke="#18181b" strokeWidth="1" />

            {/* Circuit Track Path Loop */}
            <path
              d="M 90 35 L 133 74 L 117 137 L 54 133 L 50 70 Z"
              fill="none"
              stroke="#27272a"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 90 35 L 133 74 L 117 137 L 54 133 L 50 70 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />

            {/* Checkpoints */}
            {CIRCUIT_CHECKPOINTS.map((wp) => {
              const cx = 90 + (wp.pos[0] / 95) * 72;
              const cy = 90 + (wp.pos[1] / 95) * 72;
              const isTarget = currentCheckpoint === wp.index;
              return (
                <g key={wp.index}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isTarget ? 5.5 : 3.5}
                    fill={isTarget ? "#fde047" : "#0284c7"}
                    stroke={isTarget ? "#fff" : "#38bdf8"}
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx}
                    y={cy - 6}
                    fontSize="7"
                    fill={isTarget ? "#fde047" : "#94a3b8"}
                    textAnchor="middle"
                    fontWeight="800"
                  >
                    {wp.index === 0 ? "FINISH" : `CP${wp.index}`}
                  </text>
                </g>
              );
            })}

            {/* Power-up Pickups */}
            {powerUps.map((p) => {
              if (collectedPowerupIds.current.has(p.id)) return null;
              const px = 90 + (p.pos[0] / 95) * 72;
              const py = 90 + (p.pos[2] / 95) * 72;
              const col =
                p.type === "nitro"
                  ? "#06b6d4"
                  : p.type === "shield"
                  ? "#38bdf8"
                  : p.type === "star"
                  ? "#facc15"
                  : "#f43f5e";
              return <circle key={p.id} cx={px} cy={py} r="2.8" fill={col} />;
            })}

            {/* Obstacles */}
            {obstacles.map((obs) => {
              if (triggeredObstacleIds.current.has(obs.id)) return null;
              const ox = 90 + (obs.pos[0] / 95) * 72;
              const oy = 90 + (obs.pos[2] / 95) * 72;
              return <rect key={obs.id} x={ox - 2} y={oy - 2} width="4" height="4" fill="#ef4444" />;
            })}

            {/* Real-time Player Car Marker */}
            <g ref={carMarkerSvgRef} transform="translate(90, 35)">
              <circle r="6" fill="#f43f5e" fillOpacity="0.35" />
              <polygon points="0,-7 4,5 0,3 -4,5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
            </g>
          </svg>

          {/* Telemetry Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.52rem", color: "#a1a1aa" }}>
            <span>
              SPD: <strong style={{ color: "#fde047" }}>{speedKmh} KM/H</strong>
            </span>
            <span>
              LAP: <strong style={{ color: "#38bdf8" }}>{lapTime.toFixed(1)}s</strong>
            </span>
            <span>
              NITRO: <strong style={{ color: "#06b6d4" }}>{"⚡".repeat(nitroCount)}</strong>
            </span>
          </div>
        </div>
      </Html>

      {/* ── Return Door back to Archive Hub ── */}
      <Door
        position={[0, 1.6, -85]}
        rotation={[0, 0, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </group>
  );
}

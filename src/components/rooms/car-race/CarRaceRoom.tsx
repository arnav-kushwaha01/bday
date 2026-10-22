"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Door } from "../RoomPrimitives";
import { soundEngine } from "@/engine/audio/AudioManager";
import { THEME } from "@/lib/theme";
import { getVideoUrl, getPhotoUrl } from "@/lib/assetManager";
import { ArchivalMediaMesh } from "@/components/media/ArchivalMediaMesh";
import { useTransitionStore } from "@/engine/transitions/transitionStore";

// ─── 3D Drivable Vehicle (Anshika's Midnight Racer / Scooty) ────────

function AnshikaMidnightRacer({
  carRef,
  speed,
  steerAngle,
}: {
  carRef: React.RefObject<THREE.Group | null>;
  speed: number;
  steerAngle: number;
}) {
  const frontLeftWheel = useRef<THREE.Mesh>(null);
  const frontRightWheel = useRef<THREE.Mesh>(null);
  const rearWheels = useRef<THREE.Group>(null);
  const exhaustGlow = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const wheelRot = (speed / 0.35) * delta;
    if (frontLeftWheel.current) {
      frontLeftWheel.current.rotation.x += wheelRot;
      frontLeftWheel.current.rotation.y = steerAngle * 0.45;
    }
    if (frontRightWheel.current) {
      frontRightWheel.current.rotation.x += wheelRot;
      frontRightWheel.current.rotation.y = steerAngle * 0.45;
    }
    if (rearWheels.current) {
      rearWheels.current.rotation.x += wheelRot;
    }
    if (exhaustGlow.current) {
      exhaustGlow.current.intensity = Math.abs(speed) > 2 ? 1.8 + Math.random() * 0.8 : 0.4;
    }
  });

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      {/* ── Aerodynamic Main Chassis (Metallic Rose Gold & Noir) ── */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.7, 0.42, 3.8]} />
        <meshStandardMaterial
          color="#be185d"
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Sleek Cockpit Canopy / Glass Windshield */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[1.35, 0.38, 1.8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Front Hood Scoop */}
      <mesh position={[0, 0.52, 1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.4, 0.16, 1.2]} />
        <meshStandardMaterial color="#881337" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rear High-Downforce Spoiler */}
      <group position={[0, 1.05, -1.7]}>
        {/* Spoiler wing */}
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.08, 0.45]} />
          <meshStandardMaterial color="#e11d48" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spoiler struts */}
        <mesh position={[-0.6, -0.22, 0]}>
          <boxGeometry args={[0.06, 0.36, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} />
        </mesh>
        <mesh position={[0.6, -0.22, 0]}>
          <boxGeometry args={[0.06, 0.36, 0.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} />
        </mesh>
      </group>

      {/* Dual Neon Headlights (White-Gold LED) */}
      <group position={[0, 0.46, 1.92]}>
        <mesh position={[-0.65, 0, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.65, 0, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <spotLight
          position={[0, 0.2, 0]}
          target-position={[0, 0, 15]}
          color="#fef08a"
          intensity={3.5}
          distance={28}
          angle={0.6}
          penumbra={0.4}
        />
      </group>

      {/* Dual Neon Taillights (Glowing Red) */}
      <group position={[0, 0.5, -1.92]}>
        <mesh position={[-0.65, 0, 0]}>
          <boxGeometry args={[0.25, 0.08, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.25, 0.08, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight position={[0, 0, -0.1]} color="#ef4444" intensity={1.2} distance={3.5} />
      </group>

      {/* License Plate: "ANSHIKA 23" */}
      <group position={[0, 0.32, -1.93]}>
        <mesh>
          <boxGeometry args={[0.65, 0.18, 0.02]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.075}
          color="#09090b"
          fontWeight={900}
          anchorX="center"
          anchorY="middle"
        >
          ANSHIKA 23
        </Text>
      </group>

      {/* Front Wheels (Steerable) */}
      <mesh
        ref={frontLeftWheel}
        position={[-0.92, 0.32, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.32, 0.32, 0.28, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>
      <mesh
        ref={frontRightWheel}
        position={[0.92, 0.32, 1.2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.32, 0.32, 0.28, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* Rear Wheels */}
      <group ref={rearWheels}>
        <mesh
          position={[-0.94, 0.35, -1.1]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.32, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh
          position={[0.94, 0.35, -1.1]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.32, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
      </group>

      {/* Dual Exhaust Pipes with Glowing Nitro Afterburner */}
      <group position={[0, 0.26, -1.95]}>
        <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.9} />
        </mesh>
        <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.9} />
        </mesh>
        <pointLight
          ref={exhaustGlow}
          position={[0, 0, -0.4]}
          color="#38bdf8"
          intensity={1.5}
          distance={4}
        />
      </group>
    </group>
  );
}

// ─── Stadium Grandstands with Animated Cheering Crowds & Banners ────

function StadiumGrandstand({
  position,
  rotation,
  bannerText,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  bannerText: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 3 Tiered Bleacher Steps */}
      {[0, 1, 2].map((tier) => (
        <group key={tier} position={[0, tier * 1.1 + 0.6, -tier * 1.4]}>
          {/* Concrete Bleacher Bench */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[24, 0.8, 1.6]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          {/* Seated Crowd Silhouettes (Cheering 3D spectators) */}
          {[-9, -6, -3, 0, 3, 6, 9].map((cx, i) => (
            <group key={i} position={[cx, 0.65, 0]}>
              {/* Torso */}
              <mesh>
                <capsuleGeometry args={[0.22, 0.45, 6, 6]} />
                <meshStandardMaterial
                  color={
                    (tier + i) % 3 === 0
                      ? "#f43f5e"
                      : (tier + i) % 3 === 1
                      ? "#facc15"
                      : "#38bdf8"
                  }
                  roughness={0.7}
                />
              </mesh>
              {/* Head */}
              <mesh position={[0, 0.42, 0]}>
                <sphereGeometry args={[0.16, 8, 8]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Front Glowing Stadium Banner */}
      <group position={[0, 1.2, 1.0]}>
        <mesh>
          <boxGeometry args={[22, 1.0, 0.1]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.6} />
        </mesh>
        <Text
          position={[0, 0, 0.08]}
          fontSize={0.42}
          color="#fef08a"
          fontWeight={900}
          letterSpacing={0.12}
          anchorX="center"
          anchorY="middle"
        >
          {bannerText}
        </Text>
      </group>
    </group>
  );
}

// ─── Stadium Floodlight Tower ────────────────────────────────────────

function FloodlightTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Lattice Steel Mast */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 15, 8]} />
        <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Floodlight Bank Frame */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[3.2, 1.8, 0.6]} />
        <meshStandardMaterial color="#27272a" metalness={0.6} />
      </mesh>
      {/* 4 Glowing Floodlight Lamps */}
      {[-1, 1].map((x) =>
        [-0.4, 0.4].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, 15 + y, 0.35]}>
            <sphereGeometry args={[0.32, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))
      )}
      <spotLight
        position={[0, 15, 0.6]}
        target-position={[0, 0, 0]}
        intensity={2.8}
        color="#fffbeb"
        distance={45}
        angle={0.65}
        penumbra={0.5}
      />
    </group>
  );
}

// ─── Obstacles & Collectibles along Track ────────────────────────────

interface TrackObstacle {
  id: number;
  type: "curfew" | "distance" | "cone";
  distanceM: number;
  xOffset: number;
  label: string;
}

interface TrackCollectible {
  id: number;
  type: "heart" | "star" | "cupcake";
  distanceM: number;
  xOffset: number;
  points: number;
}

// ─── Main 3D Car Race Room ──────────────────────────────────────────

export default function CarRaceRoom() {
  const { camera } = useThree();
  const carRef = useRef<THREE.Group>(null);

  // Vehicle Dynamics State
  const [speed, setSpeed] = useState<number>(0);
  const [distanceTraveled, setDistanceTraveled] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [nitroCount, setNitroCount] = useState<number>(3);
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const [hasFinishedRace, setHasFinishedRace] = useState<boolean>(false);
  const [hitWarning, setHitWarning] = useState<string | null>(null);

  // Physics refs
  const carPos = useRef(new THREE.Vector3(0, 0, -20));
  const carYaw = useRef<number>(0);
  const currentSpeed = useRef<number>(0);
  const steerInput = useRef<number>(0);
  const throttleInput = useRef<number>(0);
  const collectedIds = useRef<Set<number>>(new Set());
  const bumpedObstacleIds = useRef<Set<number>>(new Set());

  // Input listeners
  const keys = useRef<{ [k: string]: boolean }>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === " " && nitroCount > 0 && !isNitroActive) {
        setIsNitroActive(true);
        setNitroCount((n) => n - 1);
        soundEngine.playEngineRev();
        setTimeout(() => setIsNitroActive(false), 2400);
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

  // Track procedural obstacles across 2,300 meters
  const obstacles: TrackObstacle[] = useMemo(() => {
    const list: TrackObstacle[] = [];
    const types: ("curfew" | "distance" | "cone")[] = ["curfew", "distance", "cone"];
    for (let d = 150; d < 2250; d += 140) {
      const type = types[(d / 140) % 3];
      const xOffset = ((d % 3) - 1) * 3.8;
      const label =
        type === "curfew"
          ? "HOSTEL CURFEW 9:00 PM"
          : type === "distance"
          ? "1,540 KM DISTANCE GATE"
          : "OVERTHINKING HAZARD";
      list.push({ id: d, type, distanceM: d, xOffset, label });
    }
    return list;
  }, []);

  // Track procedural collectibles across 2,300 meters
  const collectibles: TrackCollectible[] = useMemo(() => {
    const list: TrackCollectible[] = [];
    for (let d = 80; d < 2280; d += 65) {
      const type = d % 130 === 0 ? "star" : d % 195 === 0 ? "cupcake" : "heart";
      const xOffset = Math.sin(d * 0.1) * 4.2;
      const points = type === "star" ? 250 : type === "cupcake" ? 150 : 100;
      list.push({ id: d, type, distanceM: d, xOffset, points });
    }
    return list;
  }, []);

  // Main Vehicle Physics and Dynamic Follow-Camera Loop
  useFrame((_, delta) => {
    // 1. Process inputs
    let throttle = 0;
    let steer = 0;

    if (keys.current["w"] || keys.current["arrowup"]) throttle += 1;
    if (keys.current["s"] || keys.current["arrowdown"]) throttle -= 0.8;
    if (keys.current["a"] || keys.current["arrowleft"]) steer += 1;
    if (keys.current["d"] || keys.current["arrowright"]) steer -= 1;

    throttleInput.current = throttle;
    steerInput.current = steer;

    // 2. Compute Acceleration & Top Speed
    const topSpeed = isNitroActive ? 42.0 : 28.0;
    const accelRate = isNitroActive ? 32.0 : 18.0;
    const friction = 7.0;

    if (throttle > 0) {
      currentSpeed.current = Math.min(topSpeed, currentSpeed.current + accelRate * delta);
    } else if (throttle < 0) {
      currentSpeed.current = Math.max(-10.0, currentSpeed.current - accelRate * delta);
    } else {
      // Natural rolling friction deceleration
      if (currentSpeed.current > 0) {
        currentSpeed.current = Math.max(0, currentSpeed.current - friction * delta);
      } else if (currentSpeed.current < 0) {
        currentSpeed.current = Math.min(0, currentSpeed.current + friction * delta);
      }
    }

    // 3. Steering and Turning Dynamics
    if (Math.abs(currentSpeed.current) > 0.5) {
      const steerSpeed = 1.6;
      carYaw.current += steer * steerSpeed * (currentSpeed.current / topSpeed) * delta;
    }

    // 4. Update Position in 3D Arena
    const moveX = Math.sin(carYaw.current) * currentSpeed.current * delta;
    const moveZ = Math.cos(carYaw.current) * currentSpeed.current * delta;

    carPos.current.x += moveX;
    carPos.current.z += moveZ;

    // Keep car inside stadium arena bounds (oval boundary)
    carPos.current.x = Math.max(-14.5, Math.min(14.5, carPos.current.x));
    carPos.current.z = Math.max(-48.0, Math.min(48.0, carPos.current.z));

    // Update car visual position & rotation
    if (carRef.current) {
      carRef.current.position.set(carPos.current.x, 0, carPos.current.z);
      carRef.current.rotation.y = carYaw.current;
      // Slight bank roll into steering turns
      carRef.current.rotation.z = -steer * 0.08 * (currentSpeed.current / topSpeed);
    }

    // 5. Update Total Race Distance Progress
    if (currentSpeed.current > 0) {
      const newDistance = distanceTraveled + currentSpeed.current * delta * 4;
      setDistanceTraveled(newDistance);
      setSpeed(Math.round(currentSpeed.current * 3.6)); // km/h

      // Check collectibles collision
      collectibles.forEach((item) => {
        if (!collectedIds.current.has(item.id)) {
          if (Math.abs(newDistance - item.distanceM) < 8.0 && Math.abs(carPos.current.x - item.xOffset) < 1.8) {
            collectedIds.current.add(item.id);
            setScore((s) => s + item.points);
            soundEngine.playTargetPop();
          }
        }
      });

      // Check obstacles collision
      obstacles.forEach((obs) => {
        if (!bumpedObstacleIds.current.has(obs.id)) {
          if (Math.abs(newDistance - obs.distanceM) < 6.0 && Math.abs(carPos.current.x - obs.xOffset) < 2.0) {
            bumpedObstacleIds.current.add(obs.id);
            currentSpeed.current *= 0.45; // Slow down penalty
            soundEngine.playTapeClick();
            setHitWarning(`AVOIDED: ${obs.label}!`);
            setTimeout(() => setHitWarning(null), 1800);
          }
        }
      });

      // Check 2,300m Finish Line
      if (newDistance >= 2300 && !hasFinishedRace) {
        setHasFinishedRace(true);
        soundEngine.playCrowdCheer();
        soundEngine.playHappyBirthdayMelody();
      }
    }

    // 6. Smooth Third-Person Chase Camera Follow
    const camDistance = 6.8 + (currentSpeed.current / topSpeed) * 1.5;
    const camHeight = 3.0;

    const targetCamX = carPos.current.x - Math.sin(carYaw.current) * camDistance;
    const targetCamY = carPos.current.y + camHeight;
    const targetCamZ = carPos.current.z - Math.cos(carYaw.current) * camDistance;

    camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
    camera.lookAt(
      carPos.current.x + Math.sin(carYaw.current) * 4.0,
      carPos.current.y + 1.2,
      carPos.current.z + Math.cos(carYaw.current) * 4.0
    );
  });

  return (
    <group>
      {/* ── Stadium Ambient & Track Lighting ── */}
      <ambientLight intensity={0.7} color="#fef3c7" />
      <directionalLight position={[0, 30, 0]} intensity={1.5} color="#fffbeb" />

      {/* 4 Corner High-Mast Floodlight Towers */}
      <FloodlightTower position={[-18, 0, -50]} />
      <FloodlightTower position={[18, 0, -50]} />
      <FloodlightTower position={[-18, 0, 50]} />
      <FloodlightTower position={[18, 0, 50]} />

      {/* ── Stadium Oval Asphalt Track & Infield ── */}
      {/* Track Asphalt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 108]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* Track Center Line Markings */}
      {[-40, -25, -10, 5, 20, 35].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[0.35, 6]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      ))}

      {/* Track Apex Curbs (Red and White alternating curb stones) */}
      {[-15.2, 15.2].map((x) =>
        [-45, -30, -15, 0, 15, 30, 45].map((z, i) => (
          <mesh key={`${x}-${z}`} position={[x, 0.08, z]}>
            <boxGeometry args={[0.8, 0.16, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#ef4444" : "#ffffff"}
              roughness={0.5}
            />
          </mesh>
        ))
      )}

      {/* ── Stadium Bleachers with Cheering Fans & Banners ── */}
      {/* Left Grandstand */}
      <StadiumGrandstand
        position={[-18, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        bannerText="★ GO QUEEN ANSHIKA! • HAPPY 23RD BIRTHDAY ★"
      />
      {/* Right Grandstand */}
      <StadiumGrandstand
        position={[18, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        bannerText="★ SLAYYY ANSHIKA! • 1,540 KM CAN'T STOP TEAM ARNAV ★"
      />
      {/* Back Grandstand */}
      <StadiumGrandstand
        position={[0, 0, -52]}
        rotation={[0, 0, 0]}
        bannerText="★ 2,300 METERS OF LOVE & MEMORIES ★"
      />

      {/* ── Giant Stadium Jumbotrons with Anshika's Authentic Videos & Photos ── */}
      {/* Jumbotron 1: Passenger Princess Video */}
      <group position={[-16.8, 5.5, -20]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[9.4, 5.8, 0.3]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("anshika_on_our_last_anniversary.jpeg")}
          videoUrl={getVideoUrl("her_being_a_passenger_princess.mp4")}
          width={8.8}
          height={5.2}
          title="PASSENGER PRINCESS // LIVE STADIUM FEED"
        />
      </group>

      {/* Jumbotron 2: Slaying Diva Video */}
      <group position={[16.8, 5.5, -20]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[9.4, 5.8, 0.3]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("our_classic_heart_shaped_photo.jpeg")}
          videoUrl={getVideoUrl(
            "her_looking_like_a_diva_while_air_distorts_her_hair_and_she_fixes_them_with_her_hands.mp4"
          )}
          width={8.8}
          height={5.2}
          title="DIVA ON THE TRACK // CHEERING YOU ON"
        />
      </group>

      {/* Jumbotron 3: Car Video with Arnav & Brother */}
      <group position={[-16.8, 5.5, 20]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[9.4, 5.8, 0.3]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("us looking hot her hotter.jpeg")}
          videoUrl={getVideoUrl("her_arnav_and_her_big_brother_in_a_car.mp4")}
          width={8.8}
          height={5.2}
          title="ROAD TRIP MEMORY // BIG BROTHER & ARNAV"
        />
      </group>

      {/* Jumbotron 4: Mocha Cafe Slay Video */}
      <group position={[16.8, 5.5, 20]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[9.4, 5.8, 0.3]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <ArchivalMediaMesh
          photoUrl={getPhotoUrl("our photo in our school afterparty.jpeg")}
          videoUrl={getVideoUrl("her_slaying_in_her_look_in_mocha_cafe.mp4")}
          width={8.8}
          height={5.2}
          title="MOCHA CAFÉ SLAY // #1 CHEERLEADER"
        />
      </group>

      {/* ── 3D Start / Finish Line Overhead Archway ── */}
      <group position={[0, 0, 0]}>
        {/* Left Gantry Pillar */}
        <mesh position={[-15.2, 4.5, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 9, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Gantry Pillar */}
        <mesh position={[15.2, 4.5, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 9, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Overhead Gantry Banner */}
        <mesh position={[0, 8.2, 0]}>
          <boxGeometry args={[31, 1.4, 0.4]} />
          <meshStandardMaterial color="#09090b" metalness={0.6} />
        </mesh>
        <Text
          position={[0, 8.2, 0.25]}
          fontSize={0.6}
          color="#fde047"
          fontWeight={900}
          letterSpacing={0.15}
          anchorX="center"
          anchorY="middle"
        >
          🏁 ANSHIKA 23RD BIRTHDAY GRAND PRIX 🏁
        </Text>
      </group>

      {/* ── The Drivable Vehicle ── */}
      <AnshikaMidnightRacer
        carRef={carRef}
        speed={speed}
        steerAngle={steerInput.current}
      />

      {/* ── 3D Obstacles Rendered along Current Track View ── */}
      {obstacles.map((obs) => {
        // Render obstacles within relative proximity to car distance
        const relativeDist = obs.distanceM - distanceTraveled;
        if (relativeDist < -40 || relativeDist > 160) return null;
        const zPos = carPos.current.z + (relativeDist / 2300) * 80;

        return (
          <group key={obs.id} position={[obs.xOffset, 0, zPos]}>
            {obs.type === "curfew" && (
              <group>
                <mesh position={[0, 0.6, 0]}>
                  <boxGeometry args={[2.8, 1.2, 0.3]} />
                  <meshStandardMaterial color="#dc2626" roughness={0.5} />
                </mesh>
                <Text
                  position={[0, 0.6, 0.18]}
                  fontSize={0.2}
                  color="#ffffff"
                  fontWeight={900}
                  anchorX="center"
                >
                  CURFEW 9PM
                </Text>
              </group>
            )}
            {obs.type === "distance" && (
              <group>
                <mesh position={[0, 1.4, 0]}>
                  <boxGeometry args={[3.2, 0.6, 0.2]} />
                  <meshBasicMaterial color="#f59e0b" />
                </mesh>
                <Text
                  position={[0, 1.4, 0.12]}
                  fontSize={0.18}
                  color="#000000"
                  fontWeight={900}
                  anchorX="center"
                >
                  1,540 KM GATE
                </Text>
              </group>
            )}
            {obs.type === "cone" && (
              <mesh position={[0, 0.45, 0]}>
                <coneGeometry args={[0.35, 0.9, 12]} />
                <meshStandardMaterial color="#f97316" roughness={0.3} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ── 3D Floating Collectibles along Current Track View ── */}
      {collectibles.map((col) => {
        if (collectedIds.current.has(col.id)) return null;
        const relativeDist = col.distanceM - distanceTraveled;
        if (relativeDist < -30 || relativeDist > 140) return null;
        const zPos = carPos.current.z + (relativeDist / 2300) * 80;

        return (
          <group key={col.id} position={[col.xOffset, 1.2, zPos]}>
            <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
              {col.type === "heart" && (
                <mesh>
                  <sphereGeometry args={[0.35, 12, 12]} />
                  <meshBasicMaterial color="#f43f5e" />
                </mesh>
              )}
              {col.type === "star" && (
                <mesh>
                  <octahedronGeometry args={[0.4]} />
                  <meshBasicMaterial color="#facc15" />
                </mesh>
              )}
              {col.type === "cupcake" && (
                <mesh>
                  <cylinderGeometry args={[0.3, 0.2, 0.4, 12]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
              )}
            </Float>
          </group>
        );
      })}

      {/* ── Grand Prix Victory Celebration Banner ── */}
      {hasFinishedRace && (
        <group position={[0, 6.5, carPos.current.z + 12]}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
            <Text
              position={[0, 0.8, 0]}
              fontSize={0.8}
              color="#fde047"
              fontWeight={900}
              anchorX="center"
            >
              🏆 ANSHIKA WINS THE 23RD BDAY GRAND PRIX! 🏆
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.35}
              color="#38bdf8"
              fontWeight={700}
              anchorX="center"
            >
              2,300 METERS COMPLETE • CLASSIFIED EVIDENCE RECORDED
            </Text>
          </Float>
        </group>
      )}

      {/* ── Return Door leading back to Archive Hub ── */}
      <Door
        position={[0, 1.6, 50]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </group>
  );
}

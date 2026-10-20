"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Door } from "../RoomPrimitives";
import { THEME } from "@/lib/theme";

const STONE_FLOOR = new THREE.Color(THEME.noir.surface);
const WALNUT_WOOD = new THREE.Color(THEME.folder.desk);
const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const WARM_LAMP = "#fef3c7";

/**
 * ObservatoryCorridor — The atmospheric entrance corridor leading from the Hub vault
 * to the cosmic observation balcony. Features dark wood wall paneling, brass rivets,
 * embedded floor distance track, archival navigational charts, and vintage gooseneck sconces.
 */
export function ObservatoryCorridor() {
  return (
    <group>
      {/* ─── Corridor Floor ─────────────────────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 6.25]}
        receiveShadow
      >
        <planeGeometry args={[4.6, 9]} />
        <meshStandardMaterial color={STONE_FLOOR} roughness={0.88} metalness={0.12} />
      </mesh>

      {/* ─── Embedded Central Brass Floor Track ─────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 6.25]}
        receiveShadow
      >
        <planeGeometry args={[0.35, 8.6]} />
        <meshStandardMaterial
          color={BRASS_GOLD}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Floor Distance Inscription 1: 0 KM (Kanpur) */}
      <group position={[0, 0.01, 8.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.09}
          color="#120e0a"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.1}
        >
          0 KM • ORIGIN: KANPUR [25.10.2003]
        </Text>
      </group>

      {/* Floor Distance Inscription 2: 770 KM (Midpoint) */}
      <group position={[0, 0.01, 6.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.09}
          color="#120e0a"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.1}
        >
          770 KM • MIDPOINT // 11:11 TRAJECTORY
        </Text>
      </group>

      {/* Floor Distance Inscription 3: 1,540 KM (Bangalore) */}
      <group position={[0, 0.01, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.09}
          color="#120e0a"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.1}
        >
          1,540 KM • STATION: BANGALORE [ARNAV]
        </Text>
      </group>

      {/* ─── Left Corridor Wall ─────────────────────────────────── */}
      <group position={[-2.3, 2.2, 6.25]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[9, 4.4]} />
          <meshStandardMaterial color={WALNUT_WOOD} roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Wainscoting Dado Rail */}
        <mesh position={[0, -1.0, 0.03]}>
          <boxGeometry args={[9, 0.08, 0.06]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Archival Navigational Chart 1: KANPUR */}
        <group position={[0, 0.2, 0.05]}>
          {/* Wooden Frame */}
          <mesh>
            <boxGeometry args={[2.4, 1.5, 0.06]} />
            <meshStandardMaterial color="#0c0907" roughness={0.6} />
          </mesh>
          {/* Brass Border */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.28, 1.38, 0.03]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Chart Background */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[2.2, 1.3]} />
            <meshStandardMaterial color="#1a140f" roughness={0.9} />
          </mesh>

          {/* Chart Typography */}
          <Text
            position={[0, 0.45, 0.05]}
            fontSize={0.07}
            color={THEME.classified.bright}
            anchorX="center"
            fontWeight={900}
            letterSpacing={0.15}
          >
            ORIGIN DOSSIER: KANPUR (UP)
          </Text>
          <Text
            position={[0, 0.28, 0.05]}
            fontSize={0.055}
            color={THEME.evidence.primary}
            anchorX="center"
            letterSpacing={0.12}
          >
            {`COORDINATES: 26° 26' 59.6" N, 80° 19' 54.8" E`}
          </Text>
          <Text
            position={[0, 0.05, 0.05]}
            fontSize={0.045}
            color="#e2d9cc"
            anchorX="center"
            maxWidth={1.9}
            textAlign="center"
            lineHeight={1.4}
          >
            {`Where Anshika was born on 25 October 2003. Ground zero of all memories: Kulhad78 Cafe, Lord Krishna's JK Temple, our school days, and endless Scooty rides.`}
          </Text>
          <Text
            position={[0, -0.42, 0.05]}
            fontSize={0.05}
            color={THEME.folder.light}
            anchorX="center"
            letterSpacing={0.15}
          >
            STATUS: SACRED HOME • 23RD BIRTHDAY
          </Text>
        </group>
      </group>

      {/* ─── Right Corridor Wall ────────────────────────────────── */}
      <group position={[2.3, 2.2, 6.25]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[9, 4.4]} />
          <meshStandardMaterial color={WALNUT_WOOD} roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Wainscoting Dado Rail */}
        <mesh position={[0, -1.0, 0.03]}>
          <boxGeometry args={[9, 0.08, 0.06]} />
          <meshStandardMaterial color={BRASS_GOLD} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Archival Navigational Chart 2: BANGALORE */}
        <group position={[0, 0.2, 0.05]}>
          {/* Wooden Frame */}
          <mesh>
            <boxGeometry args={[2.4, 1.5, 0.06]} />
            <meshStandardMaterial color="#0c0907" roughness={0.6} />
          </mesh>
          {/* Brass Border */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.28, 1.38, 0.03]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Chart Background */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[2.2, 1.3]} />
            <meshStandardMaterial color="#1a140f" roughness={0.9} />
          </mesh>

          {/* Chart Typography */}
          <Text
            position={[0, 0.45, 0.05]}
            fontSize={0.07}
            color="#38bdf8"
            anchorX="center"
            fontWeight={900}
            letterSpacing={0.15}
          >
            STATION DOSSIER: BANGALORE (KA)
          </Text>
          <Text
            position={[0, 0.28, 0.05]}
            fontSize={0.055}
            color={THEME.evidence.primary}
            anchorX="center"
            letterSpacing={0.12}
          >
            {`COORDINATES: 12° 58' 17.8" N, 77° 35' 40.6" E`}
          </Text>
          <Text
            position={[0, 0.05, 0.05]}
            fontSize={0.045}
            color="#e2d9cc"
            anchorX="center"
            maxWidth={1.9}
            textAlign="center"
            lineHeight={1.4}
          >
            {`Where Arnav is stationed. Where every text is sent, every "Why haven't you texted me for an hour?" is answered, and where every plan to see her begins.`}
          </Text>
          <Text
            position={[0, -0.42, 0.05]}
            fontSize={0.05}
            color={THEME.folder.light}
            anchorX="center"
            letterSpacing={0.15}
          >
            DISTANCE: 1,540 KM • LATENCY: 0.00S
          </Text>
        </group>
      </group>

      {/* ─── Corridor Ceiling & Vaulted Rib Beams ───────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.4, 6.25]}>
        <planeGeometry args={[4.6, 9]} />
        <meshStandardMaterial color="#0c0907" roughness={0.95} side={THREE.BackSide} />
      </mesh>

      {/* 3 Wooden Rib Beams across ceiling */}
      {[4.0, 6.5, 9.0].map((zPos, idx) => (
        <group key={idx} position={[0, 4.25, zPos]}>
          <mesh>
            <boxGeometry args={[4.6, 0.3, 0.2]} />
            <meshStandardMaterial color="#1a120b" roughness={0.8} />
          </mesh>
          {/* Hanging Gooseneck Lamp */}
          <group position={[0, -0.2, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <coneGeometry args={[0.2, 0.15, 16, 1, true]} />
              <meshStandardMaterial color={BRASS_GOLD} metalness={0.7} side={THREE.DoubleSide} />
            </mesh>
            <pointLight position={[0, -0.32, 0]} intensity={0.65} color={WARM_LAMP} distance={5} />
          </group>
        </group>
      ))}

      {/* ─── Archway Transition to Balcony (z = 1.8) ─────────────── */}
      <group position={[0, 2.2, 1.8]}>
        {/* Left Pillar */}
        <mesh position={[-2.2, 0, 0]}>
          <boxGeometry args={[0.3, 4.4, 0.4]} />
          <meshStandardMaterial color="#1a120b" roughness={0.7} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[2.2, 0, 0]}>
          <boxGeometry args={[0.3, 4.4, 0.4]} />
          <meshStandardMaterial color="#1a120b" roughness={0.7} />
        </mesh>
        {/* Top Arch Beam */}
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[4.7, 0.3, 0.4]} />
          <meshStandardMaterial color="#1a120b" roughness={0.7} />
        </mesh>
        {/* Arch Inscription */}
        <Text
          position={[0, 2.05, 0.22]}
          fontSize={0.09}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
          letterSpacing={0.25}
        >
          [04] CELESTIAL DISTANCE OBSERVATORY
        </Text>
      </group>

      {/* ─── Return Door at Back of Corridor (z = 10.5) ─────────── */}
      <Door
        position={[0, 1.6, 10.5]}
        rotation={[0, Math.PI, 0]}
        label="RETURN TO ARCHIVE VAULT"
        targetRoom="HUB"
      />
    </group>
  );
}

"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/theme";

const WALNUT = new THREE.Color(THEME.folder.desk);
const BRASS_GOLD = new THREE.Color(THEME.evidence.primary);
const WARM_LIGHT = "#fef3c7";

const BOOK_COLORS = [
  "#831843", // Deep berry
  "#1e3a5f", // Classic navy
  "#14532d", // Forest green
  "#78350f", // Rich leather amber
  "#7f1d1d", // Crimson burgundy
  "#312e81", // Indigo
  "#1c1917", // Midnight charcoal
];

/**
 * Procedural bookcase section with 3 tiers of books and brass shelf trim.
 */
function BookcaseSection({
  position,
  rotation = [0, 0, 0],
  width = 3.6,
  height = 5.2,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  // Generate random book spines for each shelf
  const shelves = useMemo(() => {
    return [0.6, 1.8, 3.0, 4.2].map((yLevel) => {
      const books = [];
      let currentX = -width / 2 + 0.15;
      let bookIdx = 0;
      while (currentX < width / 2 - 0.2) {
        const bookWidth = 0.05 + ((bookIdx * 17) % 5) * 0.015;
        const bookHeight = 0.55 + ((bookIdx * 23) % 4) * 0.08;
        const bookDepth = 0.28;
        const color = BOOK_COLORS[bookIdx % BOOK_COLORS.length];
        books.push({
          x: currentX + bookWidth / 2,
          y: yLevel + bookHeight / 2,
          width: bookWidth,
          height: bookHeight,
          depth: bookDepth,
          color,
        });
        currentX += bookWidth + 0.01;
        bookIdx++;
      }
      return { yLevel, books };
    });
  }, [width]);

  return (
    <group position={position} rotation={rotation}>
      {/* Bookcase Back Panel */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color={WALNUT} roughness={0.8} />
      </mesh>

      {/* Outer Side Uprights */}
      <mesh position={[-width / 2, height / 2, 0.2]}>
        <boxGeometry args={[0.08, height, 0.44]} />
        <meshStandardMaterial color={WALNUT} roughness={0.7} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0.2]}>
        <boxGeometry args={[0.08, height, 0.44]} />
        <meshStandardMaterial color={WALNUT} roughness={0.7} />
      </mesh>

      {/* Top Cornice Header */}
      <mesh position={[0, height, 0.22]}>
        <boxGeometry args={[width + 0.12, 0.15, 0.48]} />
        <meshStandardMaterial color={BRASS_GOLD} roughness={0.3} metalness={0.75} />
      </mesh>

      {/* Horizontal Shelves & Books */}
      {shelves.map((shelf, sIdx) => (
        <group key={sIdx}>
          {/* Wooden Shelf Slab */}
          <mesh position={[0, shelf.yLevel, 0.2]}>
            <boxGeometry args={[width, 0.05, 0.42]} />
            <meshStandardMaterial color={WALNUT} roughness={0.7} />
          </mesh>
          {/* Brass Front Lip */}
          <mesh position={[0, shelf.yLevel, 0.415]}>
            <boxGeometry args={[width, 0.04, 0.015]} />
            <meshStandardMaterial color={BRASS_GOLD} roughness={0.35} metalness={0.75} />
          </mesh>

          {/* Individual Books on this shelf */}
          {shelf.books.map((b, bIdx) => (
            <mesh key={bIdx} position={[b.x, b.y, 0.2]} castShadow receiveShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial color={b.color} roughness={0.65} metalness={0.15} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Brass Gooseneck Lamp above the bookcase */}
      <group position={[0, height - 0.1, 0.45]}>
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0.1]}>
          <coneGeometry args={[0.16, 0.12, 16, 1, true]} />
          <meshStandardMaterial color={BRASS_GOLD} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, -0.22, 0.1]} intensity={0.55} color={WARM_LIGHT} distance={4.5} />
      </group>
    </group>
  );
}

/**
 * LibraryShelves — Lines the perimeter of Room 5 with monumental dark walnut
 * detective library bookcases, brass shelf rails, and warm study sconces.
 */
export function LibraryShelves() {
  return (
    <group>
      {/* ─── Back Wall Bookcases (Z = -7.6) ───────────────────────── */}
      <BookcaseSection position={[-5.0, 0, -7.6]} />
      <BookcaseSection position={[0, 0, -7.6]} />
      <BookcaseSection position={[5.0, 0, -7.6]} />

      {/* Central Archival Inscription Banner on Back Wall */}
      <group position={[0, 5.7, -7.4]}>
        <Text
          position={[0, 0.22, 0]}
          fontSize={0.2}
          color={THEME.classified.bright}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.25}
        >
          CASE FILE #005 // THE SECRET STUDY OF LITTLE THINGS
        </Text>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.09}
          color={THEME.evidence.primary}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.2}
        >
          23 YEARS OF EVERY QUIRK, EXPRESSION, SMILE & SWEET DETAIL
        </Text>
        <Text
          position={[0, -0.26, 0]}
          fontSize={0.07}
          color="#9c7a4c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          fontStyle="italic"
        >
          It is never just one big moment. It is every single little thing that makes you Anshika.
        </Text>
      </group>

      {/* ─── Left Wall Bookcases (X = -7.6) ──────────────────────── */}
      <BookcaseSection position={[-7.6, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />
      <BookcaseSection position={[-7.6, 0, 1.8]} rotation={[0, Math.PI / 2, 0]} />

      {/* ─── Right Wall Bookcases (X = +7.6) ─────────────────────── */}
      <BookcaseSection position={[7.6, 0, -3.8]} rotation={[0, -Math.PI / 2, 0]} />
      <BookcaseSection position={[7.6, 0, 1.8]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

"use client";

import { useRef, useState, Suspense, Component, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/theme";
import { getPhotoUrl } from "@/lib/assetManager";

interface DossierFile3DProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onEnterArchive: () => void;
  evidenceCount: number;
}

class TextureErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/**
 * DossierFile3D — Ultra-realistic detective desk scene with Westworld cowboy saloon vibes:
 * - Hanging Edison filament bulb in brass protective cage
 * - Wax candle in hurricane glass lantern with dynamic flickering flame & point light
 * - Open brass pocket watch with Roman numerals and golden hands
 * - Antique magnifying glass with rosewood handle & glass refraction
 * - Crystal glass inkwell & gold-nib fountain pen
 * - Manila evidence tag with coiled twine
 * - Realistic Kraft cardstock folder with rounded edges, crimson wax seal "23", and real Polaroid photo insert
 */
export function DossierFile3D({
  isOpen,
  onToggleOpen,
  onEnterArchive,
  evidenceCount,
}: DossierFile3DProps) {
  const flapGroupRef = useRef<THREE.Group>(null);
  const currentAngle = useRef(0);
  const [hovered, setHovered] = useState(false);

  // Dynamic light & flame refs for Westworld atmosphere
  const candleLightRef = useRef<THREE.PointLight>(null);
  const candleFlameRef = useRef<THREE.Mesh>(null);
  const edisonLightRef = useRef<THREE.PointLight>(null);

  // Smoothly animate folder flap opening and closing + candle flicker
  useFrame(({ clock }, delta) => {
    const targetAngle = isOpen ? -Math.PI * 0.68 : 0;
    currentAngle.current = THREE.MathUtils.lerp(
      currentAngle.current,
      targetAngle,
      delta * 5.5
    );

    if (flapGroupRef.current) {
      flapGroupRef.current.rotation.x = currentAngle.current;
    }

    const t = clock.getElapsedTime();

    // Realistic flickering flame and warm light dancing (Westworld candle glow)
    if (candleLightRef.current) {
      candleLightRef.current.intensity = 1.9 + Math.sin(t * 12) * 0.28 + Math.cos(t * 26) * 0.16;
    }
    if (candleFlameRef.current) {
      candleFlameRef.current.scale.y = 1 + Math.sin(t * 16) * 0.15;
      candleFlameRef.current.scale.x = 1 + Math.cos(t * 22) * 0.08;
    }

    // Subtle breathing pulse of the Edison filament light
    if (edisonLightRef.current) {
      edisonLightRef.current.intensity = 2.4 + Math.sin(t * 4) * 0.12;
    }
  });

  const heroPhotoUrl = getPhotoUrl("slay-mirror-date.jpg");

  return (
    <group position={[0, 0, 0]}>
      {/* ─── 1. WESTWORLD SALOON / COWBOY LIGHTING RIG ─── */}
      {/* Warm Ambient Fill Light (Makes everything luminous & visible, not pitch black) */}
      <ambientLight intensity={1.25} color="#fff1db" />

      {/* Main Overhead Desk Spotlight */}
      <spotLight
        position={[0, 4.2, 1.2]}
        target-position={[0, 0, 0.1]}
        intensity={hovered ? 2.2 : 1.8}
        color="#fff5e4"
        angle={0.65}
        penumbra={0.6}
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Left Flank: Edison Pendant Light (Warm tungsten golden glow) */}
      <pointLight
        ref={edisonLightRef}
        position={[-2.4, 2.2, 0.4]}
        intensity={2.4}
        distance={9}
        color="#ffab3d"
        castShadow
      />

      {/* Right Flank: Flickering Hurricane Candle Lantern Light */}
      <pointLight
        ref={candleLightRef}
        position={[2.2, 0.85, -0.2]}
        intensity={1.9}
        distance={7}
        color="#ffa336"
        castShadow
      />

      {/* ─── 2. DETECTIVE DESK SURFACE (Rustic Walnut with Beveled Rim) ─── */}
      {/* Heavy Timber Desk Top */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[11.5, 0.18, 8.5]} />
        <meshStandardMaterial
          color="#221812"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Beveled Edge Molding around desk rim */}
      {[-4.2, 4.2].map((z, i) => (
        <mesh key={`rim-z-${i}`} position={[0, -0.01, z]}>
          <boxGeometry args={[11.6, 0.035, 0.12]} />
          <meshStandardMaterial color="#17100b" roughness={0.7} />
        </mesh>
      ))}
      {[-5.7, 5.7].map((x, i) => (
        <mesh key={`rim-x-${i}`} position={[x, -0.01, 0]}>
          <boxGeometry args={[0.12, 0.035, 8.5]} />
          <meshStandardMaterial color="#17100b" roughness={0.7} />
        </mesh>
      ))}

      {/* Stitched Saddle Leather Desk Blotter Pad */}
      <group position={[0, -0.002, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[4.6, 0.015, 3.4]} />
          <meshStandardMaterial
            color="#140f0c"
            roughness={0.85}
            metalness={0.08}
          />
        </mesh>

        {/* Embossed Gold / Brass Corner Accents on Desk Pad */}
        {[
          [-2.2, 0.009, -1.6],
          [2.2, 0.009, -1.6],
          [-2.2, 0.009, 1.6],
          [2.2, 0.009, 1.6],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={idx} position={[cx, cy, cz]}>
            <boxGeometry args={[0.22, 0.008, 0.22]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* ─── 3. WESTWORLD PROPS ON THE DESK ─── */}

      {/* ── PROP A: Hanging Edison Filament Bulb with Brass Cage (Left) ── */}
      <group position={[-2.4, 0, 0.4]}>
        {/* Arched Cast-Iron Lamp Base & Stand */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.06, 24]} />
          <meshStandardMaterial color="#1a1714" roughness={0.7} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 2.4, 16]} />
          <meshStandardMaterial color="#1a1714" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Curved Overhanging Arm */}
        <mesh position={[0.25, 2.38, 0]} rotation={[0, 0, -Math.PI / 3.5]}>
          <cylinderGeometry args={[0.022, 0.022, 0.65, 16]} />
          <meshStandardMaterial color="#1a1714" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Twisted Cloth Cord */}
        <mesh position={[0.5, 2.15, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />
          <meshStandardMaterial color="#2d2218" roughness={0.9} />
        </mesh>
        {/* Brass Socket Cap */}
        <mesh position={[0.5, 1.95, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Glass Teardrop Edison Bulb */}
        <mesh position={[0.5, 1.82, 0]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshPhysicalMaterial
            color="#fff8e7"
            transmission={0.9}
            opacity={0.4}
            transparent
            roughness={0.05}
            ior={1.5}
          />
        </mesh>
        {/* Glowing Orange Tungsten Filament Coil inside Bulb */}
        <mesh position={[0.5, 1.82, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
          <meshBasicMaterial color="#ff9922" />
        </mesh>
        {/* Brass Protective Cage Struts */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            position={[0.5, 1.82, 0]}
            rotation={[0, (i * Math.PI) / 3, 0]}
          >
            <cylinderGeometry args={[0.004, 0.004, 0.24, 6]} />
            <meshStandardMaterial color="#9c7a38" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── PROP B: Flickering Hurricane Candle Lantern (Right) ── */}
      <group position={[2.2, 0, -0.2]}>
        {/* Turned Heavy Brass Candlestick Base */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.08, 24]} />
          <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.18, 20]} />
          <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Cylindrical Glass Hurricane Chimney */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.65, 24, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.88}
            opacity={0.3}
            transparent
            roughness={0.08}
            ior={1.48}
          />
        </mesh>
        {/* Ivory Beeswax Pillar Candle */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.095, 0.35, 20]} />
          <meshStandardMaterial color="#fffbe8" roughness={0.5} />
        </mesh>
        {/* Candle Wick */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
          <meshStandardMaterial color="#1a140f" roughness={0.9} />
        </mesh>
        {/* Flickering Teardrop Flame */}
        <mesh ref={candleFlameRef} position={[0, 0.59, 0]}>
          <coneGeometry args={[0.035, 0.1, 16]} />
          <meshBasicMaterial color="#ffaa22" />
        </mesh>
        {/* Flame Inner White Core */}
        <mesh position={[0, 0.575, 0]}>
          <coneGeometry args={[0.018, 0.05, 12]} />
          <meshBasicMaterial color="#fffae6" />
        </mesh>
      </group>

      {/* ── PROP C: Vintage Open Brass Pocket Watch (Bottom-Left) ── */}
      <group position={[-1.75, 0.02, 1.15]} rotation={[-Math.PI / 2, 0, 0.4]}>
        {/* Main Watch Case */}
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Open Hinged Lid */}
        <mesh position={[0, 0.22, 0.03]} rotation={[-0.7, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.015, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* White Porcelain Watch Face */}
        <mesh position={[0, 0, 0.016]}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial color="#faf6ee" roughness={0.4} />
        </mesh>
        {/* Watch Numerals & Time Hand */}
        <Text
          position={[0, 0.02, 0.02]}
          fontSize={0.038}
          color="#1a140f"
          fontWeight={700}
          anchorX="center"
          anchorY="middle"
        >
          XII
        </Text>
        <Text
          position={[0, -0.06, 0.02]}
          fontSize={0.032}
          color="#8a5a22"
          anchorX="center"
          anchorY="middle"
        >
          23 YEARS
        </Text>
      </group>

      {/* ── PROP D: Antique Brass & Rosewood Magnifying Glass (Right) ── */}
      <group position={[1.8, 0.025, 0.95]} rotation={[-Math.PI / 2, 0, -0.55]}>
        {/* Turned Rosewood Handle */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.028, 0.022, 0.45, 16]} />
          <meshStandardMaterial color="#2c160c" roughness={0.4} />
        </mesh>
        {/* Knurled Brass Ferrule Collar */}
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
          <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Brass Bezel Frame Ring */}
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[0.24, 0.022, 16, 36]} />
          <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Thick Convex Magnifying Lens */}
        <mesh position={[0, 0.12, 0]}>
          <circleGeometry args={[0.23, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.92}
            opacity={0.3}
            transparent
            roughness={0.04}
            ior={1.52}
          />
        </mesh>
      </group>

      {/* ── PROP E: Octagonal Crystal Inkwell & Gold-Nib Fountain Pen ── */}
      <group position={[-1.5, 0.03, -1.1]}>
        {/* Faceted Glass Inkwell */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.16, 8]} />
          <meshPhysicalMaterial
            color="#08080c"
            transmission={0.65}
            transparent
            roughness={0.1}
            ior={1.5}
          />
        </mesh>
        {/* Brass Knurled Lid */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Resting Fountain Pen with Gold Nib */}
        <group position={[0.12, 0.03, 0.1]} rotation={[0, 0.4, 0.08]}>
          {/* Black lacquered body */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.014, 0.48, 16]} />
            <meshStandardMaterial color="#0c0b0a" roughness={0.2} metalness={0.3} />
          </mesh>
          {/* Gold Filigree Band */}
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Gold Fountain Nib */}
          <mesh position={[0.27, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.016, 0.06, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ── PROP F: Manila Shipping / Evidence Tag with Twine String ── */}
      <group position={[1.35, 0.015, -1.05]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <mesh>
          <planeGeometry args={[0.55, 0.95]} />
          <meshStandardMaterial color="#d5b583" roughness={0.85} />
        </mesh>
        {/* Reinforced brown fiber eyelet */}
        <mesh position={[0, 0.38, 0.002]}>
          <ringGeometry args={[0.025, 0.06, 16]} />
          <meshStandardMaterial color="#784b23" roughness={0.9} />
        </mesh>
        {/* Twine String */}
        <mesh position={[0, 0.55, 0.005]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.01, 0.3, 0.005]} />
          <meshStandardMaterial color="#c29a65" roughness={0.95} />
        </mesh>
        <Text
          position={[0, 0.1, 0.005]}
          fontSize={0.055}
          color="#382619"
          fontWeight={900}
          anchorX="center"
          letterSpacing={0.15}
        >
          EXHIBIT
        </Text>
        <Text
          position={[0, -0.05, 0.005]}
          fontSize={0.045}
          color="#8b1c1c"
          fontWeight={700}
          anchorX="center"
          letterSpacing={0.2}
        >
          CASE NO. 1025
        </Text>
        <Text
          position={[0, -0.22, 0.005]}
          fontSize={0.038}
          color="#382619"
          anchorX="center"
          letterSpacing={0.1}
        >
          SUBJECT: ANSHIKA
        </Text>
      </group>

      {/* ─── 4. THE ULTRA-REALISTIC 3D MANILA DOSSIER FOLDER ─── */}
      <group
        position={[0, 0.02, 0.05]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {/* Folder Bottom Cover (Heavy 350gsm Textured Kraft Cardstock) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.024, 2.2]} />
          <meshStandardMaterial
            color={THEME.folder.base}
            roughness={0.78}
            metalness={0.08}
          />
        </mesh>

        {/* Realistic Beveled Rounded Borders on Folder */}
        {[-1.5, 1.5].map((x, i) => (
          <mesh key={`bevel-x-${i}`} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 2.2, 12]} />
            <meshStandardMaterial color={THEME.folder.dark} roughness={0.8} />
          </mesh>
        ))}

        {/* Folder Manila Tab (Top Right) */}
        <mesh position={[0.9, 0.002, -1.22]} castShadow>
          <boxGeometry args={[1.0, 0.022, 0.26]} />
          <meshStandardMaterial color={THEME.folder.tab} roughness={0.78} />
        </mesh>
        <Text
          position={[0.9, 0.018, -1.22]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.068}
          color={THEME.classified.stamp}
          fontWeight={900}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          ANSHIKA // CASE 1025
        </Text>

        {/* ── INSIDE CASE DOCUMENTS (Revealed when open) ── */}
        <group position={[0, 0.02, 0]}>
          {/* Stacked Multi-Layered Documents with subtle organic offsets lying flat */}
          <mesh position={[-0.04, 0.002, 0.02]} rotation={[-Math.PI / 2, 0, 0.01]} receiveShadow>
            <planeGeometry args={[2.7, 1.95]} />
            <meshStandardMaterial color="#ede4d3" roughness={0.92} />
          </mesh>
          <mesh position={[-0.05, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[2.65, 1.9]} />
            <meshStandardMaterial color={THEME.paper.bg} roughness={0.9} />
          </mesh>

          {/* Typewriter Header */}
          <Text
            position={[-1.22, 0.008, -0.78]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.078}
            color={THEME.noir.typewriter}
            fontWeight={900}
            anchorX="left"
            letterSpacing={0.15}
          >
            CONFIDENTIAL INVESTIGATION DOSSIER
          </Text>

          <Text
            position={[-1.22, 0.008, -0.62]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.058}
            color={THEME.classified.stamp}
            fontWeight={700}
            anchorX="left"
            letterSpacing={0.2}
          >
            SUBJECT: ANSHIKA BAJPAI • 25 OCTOBER 2003
          </Text>

          {/* Case Description / Summary */}
          <Text
            position={[-1.22, 0.008, -0.38]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.05}
            color="#2a241e"
            anchorX="left"
            maxWidth={1.42}
            lineHeight={1.45}
            letterSpacing={0.05}
          >
            STATUS: ACTIVE INVESTIGATION{"\n"}
            LOCATION: THE PRIVATE ARCHIVE VAULT{"\n"}
            SUBJECT AGE: 23 YEARS (HAPPY BIRTHDAY!){"\n"}
            EVIDENCE RECOVERED: {evidenceCount} / 12 PIECES{"\n"}
            DIRECTIVE: EXAMINE ALL 8 ARCHIVE WINGS,{"\n"}
            DECRYPT MEMORIES, AND UNSEAL THE FINAL FILE.
          </Text>

          {/* Red Rubber Stamped "CLASSIFIED // TOP PRIORITY" on paper */}
          <group position={[0.22, 0.01, -0.06]} rotation={[-Math.PI / 2, 0, -0.2]}>
            <mesh>
              <planeGeometry args={[1.1, 0.32]} />
              <meshBasicMaterial color="#b91c1c" wireframe />
            </mesh>
            <Text
              fontSize={0.13}
              color={THEME.classified.bright}
              fontWeight={900}
              letterSpacing={0.25}
              anchorX="center"
              anchorY="middle"
            >
              TOP PRIORITY
            </Text>
          </group>

          {/* 3D Action Stamp: Click to Enter Archive */}
          <group
            position={[-0.5, 0.012, 0.6]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onEnterArchive();
            }}
          >
            <mesh>
              <planeGeometry args={[1.45, 0.32]} />
              <meshStandardMaterial
                color={THEME.classified.stamp}
                roughness={0.5}
              />
            </mesh>
            {/* Gold border */}
            <mesh position={[0, 0, -0.001]}>
              <planeGeometry args={[1.49, 0.36]} />
              <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.006]}
              fontSize={0.064}
              color="#ffffff"
              fontWeight={900}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.22}
            >
              [ ENTER ARCHIVE VAULT ]
            </Text>
          </group>

          {/* ── REAL POLAROID EVIDENCE PHOTO (Clipped to right side of dossier) ── */}
          <group position={[0.78, 0.012, 0.12]} rotation={[-Math.PI / 2, 0, 0.06]}>
            {/* Polaroid Cardstock Frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <planeGeometry args={[0.82, 1.05]} />
              <meshStandardMaterial color="#fdfbf5" roughness={0.65} />
            </mesh>

            {/* Actual High-Res Photo Insert */}
            <group position={[0, 0.09, 0.002]}>
              <TextureErrorBoundary
                fallback={
                  <mesh>
                    <planeGeometry args={[0.72, 0.72]} />
                    <meshStandardMaterial color="#2d2218" roughness={0.8} />
                  </mesh>
                }
              >
                <Suspense
                  fallback={
                    <mesh>
                      <planeGeometry args={[0.72, 0.72]} />
                      <meshStandardMaterial color="#1a140f" roughness={0.8} />
                    </mesh>
                  }
                >
                  <DreiImage
                    url={heroPhotoUrl}
                    scale={[0.72, 0.72]}
                    toneMapped={false}
                  />
                </Suspense>
              </TextureErrorBoundary>
            </group>

            {/* Handwritten Polaroid Caption */}
            <Text
              position={[0, -0.38, 0.003]}
              fontSize={0.044}
              color="#1a140f"
              fontWeight={700}
              anchorX="center"
              letterSpacing={0.08}
            >
              SUBJECT: ANSHIKA (23)
            </Text>

            {/* Real 3D Bent Wire Brass Paperclip */}
            <group position={[0, 0.48, 0.01]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.045, 0.008, 12, 24, Math.PI]} />
                <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.045, -0.06, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.12, 10]} />
                <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[-0.045, -0.06, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.12, 10]} />
                <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ─── FOLDER HINGED TOP COVER (Flap) ─── */}
        <group ref={flapGroupRef} position={[0, 0.02, -1.1]}>
          {/* Flap body (offset relative to hinge) */}
          <mesh position={[0, 0.012, 1.1]} castShadow receiveShadow>
            <boxGeometry args={[3.0, 0.02, 2.2]} />
            <meshStandardMaterial
              color={hovered ? THEME.folder.light : THEME.folder.base}
              roughness={0.75}
              metalness={0.08}
            />
          </mesh>

          {/* FRONT COVER GRAPHICS (Visible when folder is closed) */}
          {/* Top Secret Bold Red Stamp */}
          <group position={[0, 0.026, 0.85]} rotation={[-Math.PI / 2, 0, -0.14]}>
            <Text
              fontSize={0.2}
              color={THEME.classified.bright}
              fontWeight={900}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.28}
            >
              TOP SECRET
            </Text>
            <Text
              position={[0, -0.17, 0]}
              fontSize={0.082}
              color={THEME.classified.stamp}
              fontWeight={700}
              anchorX="center"
              letterSpacing={0.3}
            >
              RESTRICTED ARCHIVE // 23RD BIRTHDAY
            </Text>
          </group>

          {/* Evidence Caution Yellow Sticker */}
          <mesh
            position={[-0.85, 0.026, 1.5]}
            rotation={[-Math.PI / 2, 0, 0.1]}
          >
            <planeGeometry args={[1.05, 0.36]} />
            <meshStandardMaterial
              color={THEME.evidence.primary}
              roughness={0.5}
            />
          </mesh>
          <Text
            position={[-0.85, 0.03, 1.5]}
            rotation={[-Math.PI / 2, 0, 0.1]}
            fontSize={0.058}
            color="#080605"
            fontWeight={900}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.16}
          >
            CASE #1025 // EVIDENCE
          </Text>

          {/* Circular Red String Grommets & Eyelet Discs */}
          <mesh position={[0.75, 0.028, 1.25]}>
            <cylinderGeometry args={[0.085, 0.085, 0.016, 20]} />
            <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0.75, 0.028, 1.68]}>
            <cylinderGeometry args={[0.085, 0.085, 0.016, 20]} />
            <meshStandardMaterial color="#c49a45" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Wound Crimson String connecting grommets */}
          <mesh position={[0.75, 0.032, 1.465]}>
            <boxGeometry args={[0.018, 0.012, 0.44]} />
            <meshStandardMaterial color={THEME.classified.string} roughness={0.8} />
          </mesh>

          {/* ── CRIMSON WAX SEAL EMBOSSED WITH "23" ── */}
          <group position={[0, 0.032, 1.4]}>
            {/* Glossy Wax Droplet Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.24, 0.022, 24]} />
              <meshStandardMaterial
                color="#881337"
                roughness={0.3}
                metalness={0.25}
              />
            </mesh>
            {/* Inner Seal Face */}
            <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.012, 24]} />
              <meshStandardMaterial
                color="#991b1b"
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
            {/* Embossed Roman Numerals "23" */}
            <Text
              position={[0, 0.022, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.12}
              color="#fbbf24"
              fontWeight={900}
              anchorX="center"
              anchorY="middle"
            >
              23
            </Text>
          </group>

          {/* Interactive Click Tip on Closed Folder */}
          <Text
            position={[0, 0.03, 1.95]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.068}
            color={hovered ? THEME.evidence.bright : THEME.folder.light}
            fontWeight={700}
            anchorX="center"
            letterSpacing={0.22}
          >
            [ CLICK FOLDER TO UNSEAL DOSSIER ]
          </Text>
        </group>
      </group>
    </group>
  );
}

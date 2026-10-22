"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { useInteractionStore } from "@/engine/interaction/interactionStore";
import type { Interactable } from "@/engine/interaction/types";
import { usePlayerStore } from "./playerStore";
import { CAMERA_STATES } from "@/engine/camera/cameraStates";
import { soundEngine } from "@/engine/audio/AudioManager";

const WALK_SPEED = 3.6;
const SPRINT_SPEED = 6.2;
const MOUSE_SENSITIVITY = 0.0022;
const MAX_PITCH = Math.PI / 2.5; // ~72 degrees
const MIN_PITCH = -Math.PI / 2.5;

export function PlayerController() {
  const currentRoom = useAppStore((s) => s.currentRoom);
  const cinematicMode = useAppStore((s) => s.cinematicMode);
  const experienceMode = useAppStore((s) => s.experienceMode);
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);

  const focusedTarget = useTransitionStore((s) => s.focusedTarget);
  const isTransitioning = useTransitionStore((s) => s.isTransitioning);
  const activeMemoryId = useTransitionStore((s) => s.activeMemoryId);
  const closeMemory = useTransitionStore((s) => s.closeMemory);
  const unfocusObject = useTransitionStore((s) => s.unfocusObject);
  const exitCinematic = useTransitionStore((s) => s.exitCinematic);
  const exitRoom = useTransitionStore((s) => s.exitRoom);

  const interactables = useInteractionStore((s) => s.interactables);
  const activeInteractable = useInteractionStore((s) => s.activeInteractable);
  const setActiveInteractable = useInteractionStore(
    (s) => s.setActiveInteractable
  );
  const triggerActiveInteraction = useInteractionStore(
    (s) => s.triggerActiveInteraction
  );

  const mobileJoystick = usePlayerStore((s) => s.mobileJoystick);
  const mobileLookDelta = usePlayerStore((s) => s.mobileLookDelta);
  const setMobileLookDelta = usePlayerStore((s) => s.setMobileLookDelta);
  const setIsTouchDevice = usePlayerStore((s) => s.setIsTouchDevice);

  const isInspectMode = usePlayerStore((s) => s.isInspectMode);
  const toggleInspectMode = usePlayerStore((s) => s.toggleInspectMode);

  const isInspectModeRef = useRef(isInspectMode);
  useEffect(() => {
    isInspectModeRef.current = isInspectMode;
  }, [isInspectMode]);

  const { camera, gl } = useThree();

  // Internal per-frame movement and orientation refs (NO React state per frame)
  const playerPos = useRef(new THREE.Vector3(...CAMERA_STATES.HUB.position));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isMouseDown = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const prevRoom = useRef(currentRoom);

  // Key state map
  const keys = useRef<Record<string, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false,
    c: false,
    space: false,
    shift: false,
  });

  // Track tap timestamps so brief key presses move smoothly
  const keyPressTime = useRef<Record<string, number>>({
    w: 0,
    a: 0,
    s: 0,
    d: 0,
    q: 0,
    e: 0,
    c: 0,
    space: 0,
  });

  // Reset player position when entering a new room
  useEffect(() => {
    if (prevRoom.current !== currentRoom) {
      const roomCamera = CAMERA_STATES[currentRoom] || CAMERA_STATES.HUB;
      playerPos.current.set(...roomCamera.position);
      // Face towards target
      const targetVec = new THREE.Vector3(...roomCamera.target);
      const dir = targetVec.clone().sub(playerPos.current);
      yaw.current = Math.atan2(-dir.x, -dir.z);
      pitch.current = 0;
      prevRoom.current = currentRoom;
      setActiveInteractable(null);
    }
  }, [currentRoom, setActiveInteractable]);

  // Keyboard and pointer event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key ? e.key.toLowerCase() : "";
      const now = performance.now();

      // [Y] Key toggles Inspect Mode (Flying 3D mode) — ignore key repeat
      if ((key === "y" || e.code === "KeyY") && !e.repeat) {
        e.preventDefault();
        toggleInspectMode();
        return;
      }

      if (key === "w" || e.code === "KeyW" || e.code === "ArrowUp") {
        keys.current.w = true;
        keyPressTime.current.w = now;
      }
      if (key === "a" || e.code === "KeyA" || e.code === "ArrowLeft") {
        keys.current.a = true;
        keyPressTime.current.a = now;
      }
      if (key === "s" || e.code === "KeyS" || e.code === "ArrowDown") {
        keys.current.s = true;
        keyPressTime.current.s = now;
      }
      if (key === "d" || e.code === "KeyD" || e.code === "ArrowRight") {
        keys.current.d = true;
        keyPressTime.current.d = now;
      }
      if (key === "q" || e.code === "KeyQ") {
        keys.current.q = true;
        keyPressTime.current.q = now;
      }
      if (key === "c" || e.code === "KeyC") {
        keys.current.c = true;
        keyPressTime.current.c = now;
      }
      if (key === " " || e.code === "Space") {
        keys.current.space = true;
        keyPressTime.current.space = now;
      }
      if (key === "e" || e.code === "KeyE") {
        keys.current.e = true;
        keyPressTime.current.e = now;
      }
      if (e.shiftKey || key === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.shift = true;

      // E or Space to interact in standard FPP mode (NEVER trigger in Inspect/Flying mode)
      if (!isInspectModeRef.current && (key === "e" || e.code === "KeyE" || e.code === "Space")) {
        if (!focusedTarget && !cinematicMode && activeInteractable) {
          e.preventDefault();
          triggerActiveInteraction();
        }
      }

      // Esc to back out / unfocus / exit cinematic
      if (key === "escape" || e.code === "Escape") {
        if (cinematicMode) {
          exitCinematic();
        } else if (activeMemoryId) {
          closeMemory();
        } else if (focusedTarget) {
          unfocusObject();
        } else if (currentRoom !== "HUB") {
          exitRoom();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : "";
      if (key === "w" || e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = false;
      if (key === "a" || e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = false;
      if (key === "s" || e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = false;
      if (key === "d" || e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = false;
      if (key === "q" || e.code === "KeyQ") keys.current.q = false;
      if (key === "e" || e.code === "KeyE") keys.current.e = false;
      if (key === "c" || e.code === "KeyC") keys.current.c = false;
      if (key === " " || e.code === "Space") keys.current.space = false;
      if (!e.shiftKey && (key === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight")) keys.current.shift = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Clear DOM button focus so subsequent key presses (W, Space, etc.) are delivered to the game canvas
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (typeof window !== "undefined" && (window as unknown as { __isRotatingGlobe?: boolean }).__isRotatingGlobe) {
        return;
      }
      isMouseDown.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isMouseDown.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (typeof window !== "undefined" && (window as unknown as { __isRotatingGlobe?: boolean }).__isRotatingGlobe) {
        isMouseDown.current = false;
        return;
      }

      // ── Proper 3D FPS Pointer Lock Aim ──
      if (typeof document !== "undefined" && document.pointerLockElement) {
        yaw.current -= e.movementX * MOUSE_SENSITIVITY;
        pitch.current -= e.movementY * MOUSE_SENSITIVITY;
        const minP = isInspectModeRef.current ? -Math.PI * 0.48 : MIN_PITCH;
        const maxP = isInspectModeRef.current ? Math.PI * 0.48 : MAX_PITCH;
        pitch.current = Math.max(minP, Math.min(maxP, pitch.current));
        return;
      }

      if (!isMouseDown.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      yaw.current -= dx * MOUSE_SENSITIVITY;
      pitch.current -= dy * MOUSE_SENSITIVITY;
      const minP = isInspectModeRef.current ? -Math.PI * 0.48 : MIN_PITCH;
      const maxP = isInspectModeRef.current ? Math.PI * 0.48 : MAX_PITCH;
      pitch.current = Math.max(minP, Math.min(maxP, pitch.current));
    };

    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    const handleWindowBlur = () => {
      Object.keys(keys.current).forEach((k) => (keys.current[k] = false));
      isMouseDown.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    const domElement = gl.domElement;
    domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("touchstart", handleTouchStart);
      domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    gl,
    currentRoom,
    cinematicMode,
    focusedTarget,
    activeMemoryId,
    activeInteractable,
    triggerActiveInteraction,
    closeMemory,
    unfocusObject,
    exitCinematic,
    exitRoom,
    setIsTouchDevice,
  ]);

  // Main per-frame movement and interaction update
  useFrame((_, delta) => {
    // 1. Process mouse/mobile look pitch limits based on Inspect Mode
    const minPitch = isInspectMode ? -Math.PI * 0.48 : MIN_PITCH;
    const maxPitch = isInspectMode ? Math.PI * 0.48 : MAX_PITCH;

    if (mobileLookDelta.x !== 0 || mobileLookDelta.y !== 0) {
      yaw.current -= mobileLookDelta.x * MOUSE_SENSITIVITY * 1.5;
      pitch.current -= mobileLookDelta.y * MOUSE_SENSITIVITY * 1.5;
      pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current));
      setMobileLookDelta(0, 0);
    }

    // 2. If in menu (dossier view), focused on object, in cinematic transition, or in dedicated vehicle mode (CAR_RACE), skip free walking movement
    if (experienceMode === "menu" || focusedTarget || isTransitioning || cinematicMode || currentRoom === "CAR_RACE") {
      return;
    }

    // 3. Calculate movement direction
    let moveForward = 0;
    let moveRight = 0;
    let moveUp = 0;

    const now = performance.now();
    const tapWindow = 400; // ms minimum movement duration per tap
    const isW = keys.current.w || (now - keyPressTime.current.w < tapWindow);
    const isS = keys.current.s || (now - keyPressTime.current.s < tapWindow);
    const isD = keys.current.d || (now - keyPressTime.current.d < tapWindow);
    const isA = keys.current.a || (now - keyPressTime.current.a < tapWindow);

    if (isW) moveForward += 1;
    if (isS) moveForward -= 1;
    if (isD) moveRight += 1;
    if (isA) moveRight -= 1;

    // Inspect mode vertical flying controls (Space/E: Up, Q/C: Down)
    if (isInspectMode) {
      const isUp = keys.current.space || keys.current.e || (now - keyPressTime.current.space < tapWindow) || (now - keyPressTime.current.e < tapWindow);
      const isDown = keys.current.q || keys.current.c || (now - keyPressTime.current.q < tapWindow) || (now - keyPressTime.current.c < tapWindow);
      if (isUp) moveUp += 1;
      if (isDown) moveUp -= 1;
    }

    // Add mobile joystick input
    if (mobileJoystick.y !== 0) moveForward -= mobileJoystick.y;
    if (mobileJoystick.x !== 0) moveRight += mobileJoystick.x;

    const baseSpeed = isInspectMode ? 5.5 : WALK_SPEED;
    const sprintSpeed = isInspectMode ? 11.0 : SPRINT_SPEED;
    const speed = keys.current.shift ? sprintSpeed : baseSpeed;

    if (isInspectMode) {
      // ─── 6DOF Flying in all directions X, Y, Z ───
      // Forward vector follows exact 3D camera look angle (including pitch)
      const fX = -Math.sin(yaw.current) * Math.cos(pitch.current);
      const fY = Math.sin(pitch.current);
      const fZ = -Math.cos(yaw.current) * Math.cos(pitch.current);

      // Horizontal right vector for strafing
      const rX = Math.cos(yaw.current);
      const rZ = -Math.sin(yaw.current);

      const dX = fX * moveForward + rX * moveRight;
      const dY = fY * moveForward + moveUp;
      const dZ = fZ * moveForward + rZ * moveRight;

      const len = Math.hypot(dX, dY, dZ);
      if (len > 0.0001) {
        playerPos.current.x += (dX / len) * speed * delta;
        playerPos.current.y += (dY / len) * speed * delta;
        playerPos.current.z += (dZ / len) * speed * delta;

        // Flying bounds (generously open for full room/dome inspection)
        playerPos.current.x = Math.max(-20.0, Math.min(20.0, playerPos.current.x));
        playerPos.current.y = Math.max(0.3, Math.min(22.0, playerPos.current.y));
        playerPos.current.z = Math.max(-20.0, Math.min(20.0, playerPos.current.z));
      }
    } else {
      // ─── Standard FPP Ground Walking ───
      const forwardX = -Math.sin(yaw.current);
      const forwardZ = -Math.cos(yaw.current);
      const rightX = Math.cos(yaw.current);
      const rightZ = -Math.sin(yaw.current);

      const dirX = forwardX * moveForward + rightX * moveRight;
      const dirZ = forwardZ * moveForward + rightZ * moveRight;
      const len = Math.hypot(dirX, dirZ);

      if (len > 0.0001) {
        const normX = dirX / len;
        const normZ = dirZ / len;
        playerPos.current.x += normX * speed * delta;
        playerPos.current.z += normZ * speed * delta;

        // Play subtle archival footstep sound (internally throttled to ~320ms)
        soundEngine.playFootstep();

        // Room boundary clamping (keep player inside room)
        let boundX = 7.2;
        let boundZ = 7.2;
        if (currentRoom === "HUB") {
          boundX = 9.2;
          boundZ = 9.2;
        } else if (currentRoom === "HER_GALLERY") {
          boundX = 9.8;
          boundZ = 14.8;
        } else if (currentRoom === "VERSIONS") {
          boundX = 8.8;
          boundZ = 12.8;
        } else if (currentRoom === "EVIDENCE") {
          boundX = 9.8;
          boundZ = 9.8;
        } else if (currentRoom === "DISTANCE") {
          boundX = 3.6;
          boundZ = 10.0;
        } else if (currentRoom === "LITTLE_THINGS") {
          boundX = 7.4;
          boundZ = 7.4;
        } else if (currentRoom === "MAIN_CHARACTER") {
          boundX = 8.4;
          boundZ = 8.4;
        } else if (currentRoom === "FUTURE") {
          boundX = 8.6;
          boundZ = 8.6;
        } else if (currentRoom === "FINAL") {
          boundX = 5.2;
          boundZ = 5.2;
        } else if (currentRoom === "SHOOTING_ARENA") {
          boundX = 24.0;
          boundZ = 24.0;
        }

        if (currentRoom === "DISTANCE") {
          playerPos.current.x = Math.max(-boundX, Math.min(boundX, playerPos.current.x));
          playerPos.current.z = Math.max(0.6, Math.min(10.0, playerPos.current.z));
        } else {
          playerPos.current.x = Math.max(-boundX, Math.min(boundX, playerPos.current.x));
          playerPos.current.z = Math.max(-boundZ, Math.min(boundZ, playerPos.current.z));
        }
        playerPos.current.y = 1.8; // Player eye height
      }
    }

    // 4. Update camera position and orientation
    const lerpRate = reducedMotion ? 1 : 1 - Math.pow(0.001, delta);
    camera.position.lerp(playerPos.current, lerpRate);

    // Compute look-at point from yaw and pitch
    const lookTarget = new THREE.Vector3(
      playerPos.current.x - Math.sin(yaw.current) * Math.cos(pitch.current) * 5,
      playerPos.current.y + Math.sin(pitch.current) * 5,
      playerPos.current.z - Math.cos(yaw.current) * Math.cos(pitch.current) * 5
    );
    camera.lookAt(lookTarget);

    // 5. Proximity detection to registered interactables
    let closestInteractable: Interactable | null = null;
    let closestDistSq = Infinity;
    const maxInteractDist = 4.2;

    for (const item of interactables.values()) {
      const itemPos = new THREE.Vector3(...item.position);
      const distSq = playerPos.current.distanceToSquared(itemPos);
      if (distSq <= maxInteractDist * maxInteractDist && distSq < closestDistSq) {
        closestDistSq = distSq;
        closestInteractable = item;
      }
    }

    const currentId = activeInteractable ? activeInteractable.id : null;
    const nextId = closestInteractable ? closestInteractable.id : null;
    if (currentId !== nextId) {
      setActiveInteractable(closestInteractable);
    }
  });

  return null;
}

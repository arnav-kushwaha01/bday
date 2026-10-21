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
    shift: false,
  });

  // Track tap timestamps so brief key presses move smoothly
  const keyPressTime = useRef<Record<string, number>>({
    w: 0,
    a: 0,
    s: 0,
    d: 0,
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
      const key = e.key ? e.key.toLowerCase() : "";
      const now = performance.now();
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
      if (e.shiftKey || key === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.shift = true;

      // E or Space to interact
      if (key === "e" || e.code === "KeyE" || e.code === "Space") {
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
      if (!e.shiftKey && (key === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight")) keys.current.shift = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
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
      if (!isMouseDown.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      yaw.current -= dx * MOUSE_SENSITIVITY;
      pitch.current -= dy * MOUSE_SENSITIVITY;
      pitch.current = Math.max(MIN_PITCH, Math.min(MAX_PITCH, pitch.current));
    };

    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    const domElement = gl.domElement;
    domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
    // 1. Process mobile swipe look if present
    if (mobileLookDelta.x !== 0 || mobileLookDelta.y !== 0) {
      yaw.current -= mobileLookDelta.x * MOUSE_SENSITIVITY * 1.5;
      pitch.current -= mobileLookDelta.y * MOUSE_SENSITIVITY * 1.5;
      pitch.current = Math.max(MIN_PITCH, Math.min(MAX_PITCH, pitch.current));
      setMobileLookDelta(0, 0);
    }

    // 2. If in menu (dossier view), focused on object, or in cinematic transition, skip free movement
    if (experienceMode === "menu" || focusedTarget || isTransitioning || cinematicMode) {
      return;
    }

    // 3. Calculate movement direction
    let moveForward = 0;
    let moveRight = 0;

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

    // Add mobile joystick input
    if (mobileJoystick.y !== 0) moveForward -= mobileJoystick.y;
    if (mobileJoystick.x !== 0) moveRight += mobileJoystick.x;

    const speed = keys.current.shift ? SPRINT_SPEED : WALK_SPEED;

    // Compute forward and right unit vectors relative to current camera yaw
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

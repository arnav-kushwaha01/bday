"use client";

import { useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { CAMERA_STATES, DOSSIER_CAMERA_STATE } from "@/engine/camera/cameraStates";

/**
 * CameraRig — orchestrates camera transitions between:
 * 1. Dossier file start view
 * 2. Room entry states
 * 3. Focused object inspection
 * 4. Cinematic mode camera moves
 * 5. Yields to PlayerController during free exploration
 */
export function CameraRig() {
  const currentRoom = useAppStore((s) => s.currentRoom);
  const cinematicMode = useAppStore((s) => s.cinematicMode);
  const experienceMode = useAppStore((s) => s.experienceMode);
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);

  const focusedTarget = useTransitionStore((s) => s.focusedTarget);
  const isTransitioning = useTransitionStore((s) => s.isTransitioning);
  const { size } = useThree();

  const targetPos = useRef(new THREE.Vector3(...DOSSIER_CAMERA_STATE.position));
  const targetLookAt = useRef(new THREE.Vector3(...DOSSIER_CAMERA_STATE.target));
  const currentLookAt = useRef(new THREE.Vector3(...DOSSIER_CAMERA_STATE.target));
  const prevRoom = useRef(currentRoom);
  const cinematicAngle = useRef(0);

  const updateTarget = useCallback(() => {
    const state = CAMERA_STATES[currentRoom] || CAMERA_STATES.HUB;
    targetPos.current.set(...state.position);
    targetLookAt.current.set(...state.target);
  }, [currentRoom]);

  useFrame(({ camera }, delta) => {
    const lerpFactor = reducedMotion ? 1 : 1 - Math.pow(0.001, delta);

    // 0. Dossier file view (start screen)
    if (experienceMode === "menu") {
      const aspect = size.width / Math.max(1, size.height);
      const portraitMultiplier =
        aspect < 1.0 ? Math.min(2.1, 1.05 / Math.max(0.42, aspect)) : 1.0;
      targetPos.current.set(
        DOSSIER_CAMERA_STATE.position[0],
        DOSSIER_CAMERA_STATE.position[1] * portraitMultiplier,
        DOSSIER_CAMERA_STATE.position[2] * portraitMultiplier
      );
      targetLookAt.current.set(...DOSSIER_CAMERA_STATE.target);
      camera.position.lerp(targetPos.current, lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // Detect room change
    if (prevRoom.current !== currentRoom) {
      updateTarget();
      prevRoom.current = currentRoom;
    }

    // 1. Focused object inspection state
    if (focusedTarget) {
      targetPos.current.set(...focusedTarget.position);
      targetLookAt.current.set(...focusedTarget.lookAt);
      camera.position.lerp(targetPos.current, lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 2. Cinematic mode slow orbit / pan
    if (cinematicMode) {
      cinematicAngle.current += delta * 0.15;
      const radius = 6.5;
      const height = 2.4;
      targetPos.current.set(
        Math.sin(cinematicAngle.current) * radius,
        height,
        Math.cos(cinematicAngle.current) * radius
      );
      targetLookAt.current.set(0, 1.6, 0);
      camera.position.lerp(targetPos.current, lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 3. Room entering transition
    if (isTransitioning) {
      camera.position.lerp(targetPos.current, lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // Otherwise, PlayerController operates the camera directly
  });

  return null;
}

/**
 * Adaptive DPR — adjusts pixel ratio based on frame rate to ensure steady 60fps.
 */
export function AdaptiveDpr() {
  const autoQuality = useAppStore((s) => s.settings.autoQuality);
  const gl = useThree((s) => s.gl);
  const frameCount = useRef(0);
  const lastTime = useRef<number | null>(null);

  useFrame(() => {
    if (!autoQuality) return;

    const now = performance.now();
    if (lastTime.current === null) {
      lastTime.current = now;
      return;
    }

    frameCount.current++;
    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) {
      const fps = (frameCount.current / elapsed) * 1000;
      frameCount.current = 0;
      lastTime.current = now;

      const currentDpr = gl.getPixelRatio();
      if (fps < 30 && currentDpr > 1) {
        gl.setPixelRatio(Math.max(1, currentDpr - 0.25));
      } else if (fps > 55 && currentDpr < 2) {
        gl.setPixelRatio(Math.min(2, currentDpr + 0.1));
      }
    }
  });

  return null;
}

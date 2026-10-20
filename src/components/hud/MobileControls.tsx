"use client";

import { useRef, useCallback, useEffect } from "react";
import { usePlayerStore } from "@/engine/player/playerStore";
import { useInteractionStore } from "@/engine/interaction/interactionStore";
import { useAppStore } from "@/store/useAppStore";

export function MobileControls() {
  const isTouchDevice = usePlayerStore((s) => s.isTouchDevice);
  const setIsTouchDevice = usePlayerStore((s) => s.setIsTouchDevice);
  const setMobileJoystick = usePlayerStore((s) => s.setMobileJoystick);
  const setMobileLookDelta = usePlayerStore((s) => s.setMobileLookDelta);
  const activeInteractable = useInteractionStore((s) => s.activeInteractable);
  const triggerActiveInteraction = useInteractionStore(
    (s) => s.triggerActiveInteraction
  );
  const cinematicMode = useAppStore((s) => s.cinematicMode);

  // Auto-detect touch capability
  useEffect(() => {
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
    }
  }, [setIsTouchDevice]);

  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const joystickTouchId = useRef<number | null>(null);
  const joystickCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const lookTouchId = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleJoystickStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const touch = e.changedTouches[0];
      joystickTouchId.current = touch.identifier;

      if (joystickRef.current) {
        const rect = joystickRef.current.getBoundingClientRect();
        joystickCenter.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    },
    []
  );

  const handleJoystickMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickTouchId.current) {
          const dx = touch.clientX - joystickCenter.current.x;
          const dy = touch.clientY - joystickCenter.current.y;
          const maxRadius = 40;
          const dist = Math.hypot(dx, dy);
          const clampedDist = Math.min(dist, maxRadius);
          const angle = Math.atan2(dy, dx);

          const knobX = Math.cos(angle) * clampedDist;
          const knobY = Math.sin(angle) * clampedDist;

          if (knobRef.current) {
            knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
          }

          setMobileJoystick(knobX / maxRadius, knobY / maxRadius);
          break;
        }
      }
    },
    [setMobileJoystick]
  );

  const handleJoystickEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId.current) {
          joystickTouchId.current = null;
          if (knobRef.current) {
            knobRef.current.style.transform = "translate(0px, 0px)";
          }
          setMobileJoystick(0, 0);
          break;
        }
      }
    },
    [setMobileJoystick]
  );

  // Swipe-to-look touch handler on right half of screen
  const handleLookStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleLookMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId.current) {
          const dx = touch.clientX - lastLookPos.current.x;
          const dy = touch.clientY - lastLookPos.current.y;
          lastLookPos.current = { x: touch.clientX, y: touch.clientY };
          setMobileLookDelta(dx, dy);
          break;
        }
      }
    },
    [setMobileLookDelta]
  );

  const handleLookEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId.current) {
        lookTouchId.current = null;
        break;
      }
    }
  }, []);

  if (!isTouchDevice || cinematicMode) return null;

  return (
    <>
      {/* Right-half look area (with touchAction none to prevent browser gesture capture) */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
        style={{
          position: "fixed",
          top: "15%",
          right: 0,
          bottom: "15%",
          width: "50%",
          zIndex: 40,
          pointerEvents: "auto",
          touchAction: "none",
        }}
      />

      {/* Virtual Joystick (Bottom Left) */}
      <div
        ref={joystickRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        style={{
          position: "fixed",
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          left: "calc(1.5rem + env(safe-area-inset-left, 0px))",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "rgba(26, 23, 20, 0.75)",
          border: "2px solid rgba(196, 163, 90, 0.5)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
          pointerEvents: "auto",
          touchAction: "none",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f5d485 0%, #c4a35a 50%, #4a4035 100%)",
            border: "1.5px solid rgba(245, 230, 211, 0.6)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
            pointerEvents: "none",
            transition: "transform 0.04s linear",
          }}
        />
      </div>

      {/* Floating Action Button for Interact (Bottom Right) with pulsing glow */}
      {activeInteractable && (
        <button
          onClick={triggerActiveInteraction}
          className="animate-pulse-interact"
          style={{
            position: "fixed",
            bottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
            right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c4a35a, #8a7d6b)",
            border: "2px solid #f5e6d3",
            color: "#0a0806",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 800,
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 65,
            pointerEvents: "auto",
            boxShadow: "0 4px 24px rgba(196, 163, 90, 0.6)",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          INTERACT
        </button>
      )}
    </>
  );
}

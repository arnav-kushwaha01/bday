"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { soundEngine } from "./AudioManager";

/**
 * useAudioSync — Synchronizes app state (room, mute, volume) with the AudioManager singleton.
 * Also handles first-gesture audio priming safely without violating browser autoplay policies.
 */
export function useAudioSync() {
  const audioEnabled = useAppStore((s) => s.settings.audioEnabled);
  const volume = useAppStore((s) => s.settings.volume);
  const currentRoom = useAppStore((s) => s.currentRoom);
  const experienceMode = useAppStore((s) => s.experienceMode);

  // Sync mute state
  useEffect(() => {
    soundEngine.setMuted(!audioEnabled);
  }, [audioEnabled]);

  // Sync volume
  useEffect(() => {
    soundEngine.setMasterVolume(volume);
  }, [volume]);

  // Sync room changes
  useEffect(() => {
    if (experienceMode === "active") {
      soundEngine.onRoomChange(currentRoom);
    }
  }, [currentRoom, experienceMode]);

  // Primer for user interaction to resume audio context
  useEffect(() => {
    const handleFirstGesture = () => {
      soundEngine.init();
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);
}

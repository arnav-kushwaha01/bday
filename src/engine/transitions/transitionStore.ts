import { create } from "zustand";
import { useAppStore, type RoomState } from "@/store/useAppStore";
import type { TransitionType } from "./types";

export interface FocusTarget {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
}

interface TransitionStore {
  isTransitioning: boolean;
  activeTransition: TransitionType | null;
  focusedTarget: FocusTarget | null;
  activeMemoryId: string | null;
  cinematicSequence: string | null;

  // Actions
  enterRoom: (room: RoomState, duration?: number) => void;
  exitRoom: () => void;
  focusObject: (target: FocusTarget) => void;
  unfocusObject: () => void;
  openMemory: (memoryId: string, focusTarget?: FocusTarget) => void;
  closeMemory: () => void;
  enterCinematic: (sequence?: string) => void;
  exitCinematic: () => void;
}

export const useTransitionStore = create<TransitionStore>((set, get) => ({
  isTransitioning: false,
  activeTransition: null,
  focusedTarget: null,
  activeMemoryId: null,
  cinematicSequence: null,

  enterRoom: (room: RoomState, duration = 1.2) => {
    if (get().isTransitioning) return;
    set({
      isTransitioning: true,
      activeTransition: "enterRoom",
      focusedTarget: null,
      activeMemoryId: null,
    });

    // Unfocus any memory or cinematic mode
    useAppStore.getState().setCinematicMode(false);

    // Smooth room change
    setTimeout(() => {
      useAppStore.getState().setRoom(room);
    }, (duration * 1000) / 2);

    setTimeout(() => {
      set({ isTransitioning: false, activeTransition: null });
    }, duration * 1000);
  },

  exitRoom: () => {
    get().enterRoom("HUB");
  },

  focusObject: (target: FocusTarget) => {
    set({
      focusedTarget: target,
      activeTransition: "focusObject",
    });
  },

  unfocusObject: () => {
    set({
      focusedTarget: null,
      activeTransition: null,
    });
  },

  openMemory: (memoryId: string, focusTarget?: FocusTarget) => {
    set({
      activeMemoryId: memoryId,
      focusedTarget: focusTarget || null,
      activeTransition: "openMemory",
    });
  },

  closeMemory: () => {
    set({
      activeMemoryId: null,
      focusedTarget: null,
      activeTransition: null,
    });
  },

  enterCinematic: (sequence?: string) => {
    useAppStore.getState().setCinematicMode(true);
    set({
      cinematicSequence: sequence || "default",
      activeTransition: "enterCinematic",
    });
  },

  exitCinematic: () => {
    useAppStore.getState().setCinematicMode(false);
    set({
      cinematicSequence: null,
      activeTransition: "exitCinematic",
    });
    // Clear transition flag after a moment
    setTimeout(() => {
      set({ activeTransition: null });
    }, 400);
  },
}));

// Expose in browser for dev testing & subagent automation
if (typeof window !== "undefined") {
  (window as unknown as { __TRANSITION_STORE__: typeof useTransitionStore }).__TRANSITION_STORE__ = useTransitionStore;
}

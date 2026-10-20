import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";

export const QualityTierSchema = z.enum(["ULTRA", "HIGH", "MEDIUM", "LOW"]);
export type QualityTier = z.infer<typeof QualityTierSchema>;

export const RoomStateSchema = z.enum([
  "HUB",
  "HER_GALLERY",
  "VERSIONS",
  "EVIDENCE",
  "DISTANCE",
  "LITTLE_THINGS",
  "MAIN_CHARACTER",
  "FUTURE",
  "FINAL",
]);
export type RoomState = z.infer<typeof RoomStateSchema>;

export const SaveDataSchema = z.object({
  currentRoom: RoomStateSchema,
  discoveredEvidence: z.array(z.string()),
  discoveredEasterEggs: z.array(z.string()),
  settings: z.object({
    quality: QualityTierSchema,
    autoQuality: z.boolean(),
    reducedMotion: z.boolean(),
    audioEnabled: z.boolean(),
    volume: z.number().min(0).max(1),
  }),
  cinematicMode: z.boolean(),
  experienceMode: z.enum(["menu", "active"]).default("menu"),
  isDossierOpen: z.boolean().default(false),
  viewMode: z.enum(["3d", "2d"]).default("3d"),
  version: z.number(), // versioning for migrations
});
export type SaveData = z.infer<typeof SaveDataSchema>;

export const isWebGLAvailable = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

const detectInitialQuality = (): QualityTier => {
  if (typeof window === "undefined") return "HIGH"; // SSR fallback
  
  // Basic heuristic: check hardware concurrency & device memory if available
  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    return (concurrency >= 6 && memory >= 6) ? "MEDIUM" : "LOW";
  } else {
    if (concurrency >= 12 && memory >= 8) return "ULTRA";
    if (concurrency >= 8 && memory >= 8) return "HIGH";
    if (concurrency >= 4) return "MEDIUM";
    return "LOW";
  }
};

const detectReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const INITIAL_STATE: Omit<SaveData, "version"> = {
  currentRoom: "HUB",
  discoveredEvidence: [],
  discoveredEasterEggs: [],
  settings: {
    quality: detectInitialQuality(),
    autoQuality: true,
    reducedMotion: detectReducedMotion(),
    audioEnabled: false,
    volume: 0.8,
  },
  cinematicMode: false,
  experienceMode: "menu",
  isDossierOpen: false,
  viewMode: "3d",
};

type AppStore = SaveData & {
  setRoom: (room: RoomState) => void;
  unlockEvidence: (id: string) => void;
  unlockEasterEgg: (id: string) => void;
  setQuality: (quality: QualityTier) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setCinematicMode: (enabled: boolean) => void;
  setExperienceMode: (mode: "menu" | "active") => void;
  setDossierOpen: (open: boolean) => void;
  setViewMode: (mode: "3d" | "2d") => void;
  restartExperience: () => void;
  continueArchive: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      version: 1, // Store version
      
      setRoom: (room) => set({ currentRoom: room }),
      
      unlockEvidence: (id) => set((state) => ({
        discoveredEvidence: state.discoveredEvidence.includes(id) 
          ? state.discoveredEvidence 
          : [...state.discoveredEvidence, id]
      })),
      
      unlockEasterEgg: (id) => set((state) => ({
        discoveredEasterEggs: state.discoveredEasterEggs.includes(id)
          ? state.discoveredEasterEggs
          : [...state.discoveredEasterEggs, id]
      })),
      
      setQuality: (quality) => set((state) => ({
        settings: { ...state.settings, quality, autoQuality: false }
      })),
      
      setAudioEnabled: (audioEnabled) => set((state) => ({
        settings: { ...state.settings, audioEnabled }
      })),
      
      setVolume: (volume) => set((state) => ({
        settings: { ...state.settings, volume }
      })),
      
      setReducedMotion: (reducedMotion) => set((state) => ({
        settings: { ...state.settings, reducedMotion }
      })),
      
      setCinematicMode: (cinematicMode) => set({ cinematicMode }),

      setExperienceMode: (experienceMode) => set({ experienceMode }),

      setDossierOpen: (isDossierOpen) => set({ isDossierOpen }),
      
      setViewMode: (viewMode) => set({ viewMode }),

      restartExperience: () => set((state) => ({
        ...INITIAL_STATE,
        experienceMode: "menu",
        isDossierOpen: false,
        viewMode: state.viewMode,
        settings: {
          ...INITIAL_STATE.settings,
          audioEnabled: state.settings.audioEnabled, // preserve audio choice
          volume: state.settings.volume,
          quality: state.settings.quality,
          autoQuality: state.settings.autoQuality,
        }
      })),
      
      continueArchive: () => {
        set({ experienceMode: "active" });
      },
    }),
    {
      name: "anshika-archive-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // We only persist meaningful things, not cinematic mode
        currentRoom: state.currentRoom,
        discoveredEvidence: state.discoveredEvidence,
        discoveredEasterEggs: state.discoveredEasterEggs,
        settings: state.settings,
        viewMode: state.viewMode,
        version: state.version,
      }),
      merge: (persistedState: unknown, currentState) => {
        try {
          // Validate incoming persisted data with Zod before applying
          const validData = SaveDataSchema.partial().parse(persistedState);
          return { ...currentState, ...validData };
        } catch (error) {
          console.error("Storage migration/validation failed, using defaults", error);
          return currentState;
        }
      },
    }
  )
);

// Expose in browser for dev testing & subagent automation
if (typeof window !== "undefined") {
  (window as unknown as { __APP_STORE__: typeof useAppStore }).__APP_STORE__ = useAppStore;
}

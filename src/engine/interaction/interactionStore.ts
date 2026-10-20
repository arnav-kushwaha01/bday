import { create } from "zustand";
import type { Interactable } from "./types";
import { soundEngine } from "@/engine/audio/AudioManager";

interface InteractionStore {
  interactables: Map<string, Interactable>;
  activeInteractable: Interactable | null;

  registerInteractable: (interactable: Interactable) => () => void;
  setActiveInteractable: (interactable: Interactable | null) => void;
  triggerActiveInteraction: () => void;
}

export const useInteractionStore = create<InteractionStore>((set, get) => ({
  interactables: new Map(),
  activeInteractable: null,

  registerInteractable: (interactable: Interactable) => {
    set((state) => {
      const next = new Map(state.interactables);
      next.set(interactable.id, interactable);
      return { interactables: next };
    });

    // Return unregister cleanup function
    return () => {
      set((state) => {
        const next = new Map(state.interactables);
        next.delete(interactable.id);
        const nextActive =
          state.activeInteractable?.id === interactable.id
            ? null
            : state.activeInteractable;
        return { interactables: next, activeInteractable: nextActive };
      });
    };
  },

  setActiveInteractable: (interactable) => {
    // Only update if ID actually changes to prevent unneeded re-renders
    if (get().activeInteractable?.id === interactable?.id) return;
    set({ activeInteractable: interactable });
  },

  triggerActiveInteraction: () => {
    const active = get().activeInteractable;
    if (active && active.onInteract) {
      if (active.type === "door") {
        soundEngine.playDoorLatch();
      } else {
        soundEngine.playInspect();
      }
      active.onInteract();
    }
  },
}));

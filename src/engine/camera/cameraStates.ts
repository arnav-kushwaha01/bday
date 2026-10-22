import type { RoomState } from "@/store/useAppStore";

// ─── Camera State Types ─────────────────────────────────────────
export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  transitionDuration: number;
  easing: string;
}

export const DOSSIER_CAMERA_STATE: CameraState = {
  position: [0, 2.2, 1.8],
  target: [0, 0, 0.2],
  fov: 48,
  transitionDuration: 2.2,
  easing: "power3.inOut",
};

export const CAMERA_STATES: Record<RoomState, CameraState> = {
  HUB: {
    position: [0, 2.5, 8],
    target: [0, 1.5, 0],
    fov: 55,
    transitionDuration: 2.0,
    easing: "power2.inOut",
  },
  HER_GALLERY: {
    position: [0, 2, 12],
    target: [0, 2, 0],
    fov: 50,
    transitionDuration: 2.2,
    easing: "power3.inOut",
  },
  VERSIONS: {
    position: [0, 2.0, 8.0],
    target: [0, 1.8, 0],
    fov: 50,
    transitionDuration: 2.2,
    easing: "power3.inOut",
  },
  EVIDENCE: {
    position: [0, 2.0, 5.5],
    target: [0, 1.8, -0.5],
    fov: 52,
    transitionDuration: 2.2,
    easing: "power3.inOut",
  },
  DISTANCE: {
    position: [0, 2.0, 5.2],
    target: [0, 2.0, -5.0],
    fov: 52,
    transitionDuration: 2.5,
    easing: "power3.inOut",
  },
  LITTLE_THINGS: {
    position: [0, 2.0, 3.5],
    target: [0, 1.8, -2.5],
    fov: 52,
    transitionDuration: 2.2,
    easing: "power3.inOut",
  },
  MAIN_CHARACTER: {
    position: [0, 2, 5],
    target: [0, 1.5, 0],
    fov: 50,
    transitionDuration: 2.5,
    easing: "power3.inOut",
  },
  FUTURE: {
    position: [0, 2.0, 4.5],
    target: [0, 1.8, -1.0],
    fov: 50,
    transitionDuration: 2.5,
    easing: "power3.inOut",
  },
  FINAL: {
    position: [0, 1.8, 3.5],
    target: [0, 1.1, 0],
    fov: 42,
    transitionDuration: 3.2,
    easing: "power4.inOut",
  },
  SHOOTING_ARENA: {
    position: [0, 1.8, 6.0],
    target: [0, 1.8, -4.0],
    fov: 55,
    transitionDuration: 2.2,
    easing: "power3.inOut",
  },
  CAR_RACE: {
    position: [0, 3.2, 7.5],
    target: [0, 1.0, 0],
    fov: 60,
    transitionDuration: 2.0,
    easing: "power2.inOut",
  },
};

import type { RoomState } from "@/store/useAppStore";

export type TransitionType =
  | "enterRoom"
  | "exitRoom"
  | "focusObject"
  | "openMemory"
  | "closeMemory"
  | "enterCinematic"
  | "exitCinematic";

export interface TransitionConfig {
  type: TransitionType;
  from?: RoomState;
  to?: RoomState;
  duration: number;
  delay?: number;
}

export const ROOM_TRANSITION_DURATION = 1.5; // seconds for DOM overlay fade
export const CAMERA_TRANSITION_DURATION = 2.0; // seconds for 3D camera move

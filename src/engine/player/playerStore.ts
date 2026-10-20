import { create } from "zustand";

interface PlayerStore {
  isMoving: boolean;
  isSprinting: boolean;
  mobileJoystick: { x: number; y: number };
  mobileLookDelta: { x: number; y: number };
  isTouchDevice: boolean;

  setMobileJoystick: (x: number, y: number) => void;
  setMobileLookDelta: (x: number, y: number) => void;
  setIsTouchDevice: (isTouch: boolean) => void;
  setMovementState: (isMoving: boolean, isSprinting: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isMoving: false,
  isSprinting: false,
  mobileJoystick: { x: 0, y: 0 },
  mobileLookDelta: { x: 0, y: 0 },
  isTouchDevice: false,

  setMobileJoystick: (x, y) => set({ mobileJoystick: { x, y } }),
  setMobileLookDelta: (x, y) => set({ mobileLookDelta: { x, y } }),
  setIsTouchDevice: (isTouch) => set({ isTouchDevice: isTouch }),
  setMovementState: (isMoving, isSprinting) => set({ isMoving, isSprinting }),
}));

"use client";

import { Suspense, lazy, useMemo } from "react";
import { useAppStore, type RoomState } from "@/store/useAppStore";

// Lazy-load all rooms for code splitting
const HubRoom = lazy(() => import("@/components/rooms/hub/HubRoom"));
const GalleryRoom = lazy(() => import("@/components/rooms/gallery/GalleryRoom"));
const VersionsRoom = lazy(() => import("@/components/rooms/versions/VersionsRoom"));
const EvidenceRoom = lazy(() => import("@/components/rooms/evidence/EvidenceRoom"));
const DistanceRoom = lazy(() => import("@/components/rooms/distance/DistanceRoom"));
const LittleThingsRoom = lazy(() => import("@/components/rooms/little-things/LittleThingsRoom"));
const MainCharacterRoom = lazy(() => import("@/components/rooms/main-character/MainCharacterRoom"));
const FutureRoom = lazy(() => import("@/components/rooms/future/FutureRoom"));
const FinalRoom = lazy(() => import("@/components/rooms/final/FinalRoom"));

const ROOM_COMPONENTS: Record<RoomState, React.LazyExoticComponent<() => React.JSX.Element>> = {
  HUB: HubRoom,
  HER_GALLERY: GalleryRoom,
  VERSIONS: VersionsRoom,
  EVIDENCE: EvidenceRoom,
  DISTANCE: DistanceRoom,
  LITTLE_THINGS: LittleThingsRoom,
  MAIN_CHARACTER: MainCharacterRoom,
  FUTURE: FutureRoom,
  FINAL: FinalRoom,
};

/**
 * RoomLoader — lazy-loads the active room component.
 * Only one room is mounted at a time to keep memory lean.
 */
export function RoomLoader() {
  const currentRoom = useAppStore((s) => s.currentRoom);

  const RoomComponent = useMemo(() => ROOM_COMPONENTS[currentRoom], [currentRoom]);

  return (
    <Suspense fallback={null}>
      <RoomComponent />
    </Suspense>
  );
}

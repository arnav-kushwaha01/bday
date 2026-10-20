export interface Interactable {
  id: string;
  type: "photo" | "video" | "audio" | "evidence" | "object" | "door" | "easter-egg";
  position: [number, number, number];
  interactionPrompt: string;
  onInteract: () => void;
  discoveryState: "hidden" | "visible" | "discovered";
  optionalSound?: string;
  optionalAnimation?: string;
}

export interface InteractionEvent {
  interactableId: string;
  timestamp: number;
  type: Interactable["type"];
}

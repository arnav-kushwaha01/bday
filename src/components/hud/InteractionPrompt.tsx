"use client";

import { useInteractionStore } from "@/engine/interaction/interactionStore";
import { useTransitionStore } from "@/engine/transitions/transitionStore";
import { useAppStore } from "@/store/useAppStore";
import { usePlayerStore } from "@/engine/player/playerStore";
import { THEME } from "@/lib/theme";

export function InteractionPrompt() {
  const activeInteractable = useInteractionStore((s) => s.activeInteractable);
  const triggerActiveInteraction = useInteractionStore(
    (s) => s.triggerActiveInteraction
  );
  const cinematicMode = useAppStore((s) => s.cinematicMode);
  const focusedTarget = useTransitionStore((s) => s.focusedTarget);
  const isTouchDevice = usePlayerStore((s) => s.isTouchDevice);

  if (!activeInteractable || cinematicMode || focusedTarget) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isTouchDevice
          ? "calc(6.8rem + env(safe-area-inset-bottom, 0px))"
          : "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        maxWidth: "calc(100vw - 2rem)",
        background: "rgba(12, 10, 9, 0.94)",
        backdropFilter: "blur(14px)",
        border: `1.5px solid ${THEME.evidence.primary}`,
        borderRadius: "3px",
        padding: "clamp(0.45rem, 1.8vw, 0.6rem) clamp(0.8rem, 3vw, 1.4rem)",
        cursor: "pointer",
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px ${THEME.evidence.glow}`,
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={triggerActiveInteraction}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = THEME.evidence.bright;
        e.currentTarget.style.transform = "translateX(-50%) translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME.evidence.primary;
        e.currentTarget.style.transform = "translateX(-50%) translateY(0)";
      }}
    >
      {/* Evidence Marker Keycap badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: THEME.evidence.primary,
          border: `1px solid ${THEME.evidence.bright}`,
          borderRadius: "2px",
          color: "#080605",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.65rem",
          fontWeight: 800,
          padding: "0.2rem 0.55rem",
          letterSpacing: "0.05em",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
        }}
      >
        {isTouchDevice ? "TAP" : "E"}
      </span>

      {/* Action text */}
      <span
        style={{
          color: THEME.folder.light,
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {activeInteractable.interactionPrompt}
      </span>
    </div>
  );
}

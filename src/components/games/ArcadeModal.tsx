"use client";

import { useState } from "react";
import { THEME } from "@/lib/theme";
import { HeartShootingArena } from "./HeartShootingArena";
import { MidnightCarRacer } from "./MidnightCarRacer";
import { LoveWordGame } from "./LoveWordGame";
import { BirthdaySudoku } from "./BirthdaySudoku";
import { TicTacToeGame } from "./TicTacToeGame";
import { ClassifiedWiretaps } from "./ClassifiedWiretaps";

export type ArcadeTab = "hearts" | "racer" | "word" | "sudoku" | "tictactoe" | "tapes";

interface ArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ArcadeTab;
}

export function ArcadeModal({ isOpen, onClose, initialTab = "hearts" }: ArcadeModalProps) {
  const [activeTab, setActiveTab] = useState<ArcadeTab>(initialTab);

  if (!isOpen) return null;

  const TABS = [
    { id: "hearts" as ArcadeTab, label: "♥ HEART SHOOTER", tag: "SHOOT 23" },
    { id: "racer" as ArcadeTab, label: "🏎 MIDNIGHT RACER", tag: "2300M GRAND PRIX" },
    { id: "word" as ArcadeTab, label: "🔤 WORD PUZZLE", tag: "ANSHIKA CLUES" },
    { id: "sudoku" as ArcadeTab, label: "🔢 23 SUDOKU", tag: "4x4 & 9x9" },
    { id: "tictactoe" as ArcadeTab, label: "✦ TIC-TAC-TOE", tag: "VS ARNAV" },
    { id: "tapes" as ArcadeTab, label: "📼 SECRET TAPES", tag: "11 VOICENOTES" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(8, 6, 5, 0.88)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.5rem, 2vw, 1.5rem)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          height: "min(92vh, 680px)",
          background: "#0e0a08",
          border: `2px solid ${THEME.evidence.primary}`,
          borderRadius: 8,
          boxShadow: `0 0 35px rgba(234, 179, 8, 0.4), 0 20px 50px rgba(0, 0, 0, 0.9)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Arcade Cabinet Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.8rem 1.2rem",
            background: "linear-gradient(90deg, #1c140e 0%, #2b1d14 50%, #1c140e 100%)",
            borderBottom: `1.5px solid ${THEME.evidence.primary}`,
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span
              style={{
                background: THEME.evidence.primary,
                color: "#080605",
                fontSize: "0.68rem",
                fontWeight: 900,
                padding: "0.2rem 0.5rem",
                borderRadius: 2,
              }}
            >
              CABINET #23
            </span>
            <div>
              <div
                style={{
                  fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  color: "#fff",
                }}
              >
                ANSHIKA BIRTHDAY ARCADE // LOUNGE
              </div>
              <div style={{ fontSize: "0.62rem", color: THEME.folder.light, letterSpacing: "0.1em" }}>
                INTERACTIVE MINI-GAMES • CLASSIFIED WIRETAPS • 23RD BIRTHDAY SPECIAL
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid #ef4444",
              borderRadius: 4,
              color: "#fca5a5",
              fontSize: "0.85rem",
              fontWeight: 800,
              padding: "0.35rem 0.8rem",
              cursor: "pointer",
            }}
          >
            ✕ CLOSE [ESC]
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div
          style={{
            display: "flex",
            gap: "0.3rem",
            padding: "0.5rem 0.8rem",
            background: "rgba(20, 15, 12, 0.95)",
            borderBottom: "1px solid rgba(234, 179, 8, 0.2)",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? "rgba(234, 179, 8, 0.2)" : "transparent",
                  border: `1px solid ${isActive ? THEME.evidence.primary : "transparent"}`,
                  borderRadius: 4,
                  padding: "0.45rem 0.85rem",
                  color: isActive ? "#fef08a" : THEME.folder.light,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 800 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.15rem",
                  transition: "all 0.15s",
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: "0.55rem", opacity: 0.75, letterSpacing: "0.08em" }}>{tab.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Active Game / Feature View Container */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          {activeTab === "hearts" && <HeartShootingArena />}
          {activeTab === "racer" && <MidnightCarRacer />}
          {activeTab === "word" && <LoveWordGame />}
          {activeTab === "sudoku" && <BirthdaySudoku />}
          {activeTab === "tictactoe" && <TicTacToeGame />}
          {activeTab === "tapes" && <ClassifiedWiretaps />}
        </div>
      </div>
    </div>
  );
}

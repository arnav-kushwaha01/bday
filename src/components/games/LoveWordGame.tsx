"use client";

import { useState } from "react";
import { THEME } from "@/lib/theme";

interface WordPuzzle {
  word: string;
  clue: string;
  hint: string;
  secretMemory: string;
}

const PUZZLES: WordPuzzle[] = [
  {
    word: "ANSHIKA",
    clue: "The prettiest birthday girl, prodigy, and the undisputed main character of this entire world.",
    hint: "Her name starts with A and has 7 letters.",
    secretMemory: "Born on 25 October 2003. Strong, gorgeous, and the best thing that ever entered Arnav's life.",
  },
  {
    word: "KANPUR",
    clue: "The sacred home city where our dates, school days, and love story first began.",
    hint: "City along the Ganges, famous for JK Temple.",
    secretMemory: "Where we roamed together, shared kulhad tea at Kulhad78, and made unforgettable memories.",
  },
  {
    word: "ELEVEN",
    clue: "The exact clock time she stops everything to make a wish (11:11).",
    hint: "Two numbers in one wish.",
    secretMemory: "Every 11:11 she remembers Arnav and prays for their future together.",
  },
  {
    word: "SCOOTY",
    clue: "Her absolute favorite vehicle for midnight dates, hugging Arnav from behind as passenger princess.",
    hint: "Two-wheeler joyride.",
    secretMemory: "Wind in her hair, arms wrapped around him, cruising through the quiet night streets.",
  },
  {
    word: "SNOOKER",
    clue: "The green table cue game where Arnav held her hand to teach her how to strike.",
    hint: "Cues, colored balls, and pockets.",
    secretMemory: "She looked so cute trying to aim, smiling at how close they were standing.",
  },
  {
    word: "KULHAD",
    clue: "The clay cup cafe where we took our very first official photo as friends.",
    hint: "Kulhad78 Cafe.",
    secretMemory: "Arnav was shy, she was adorable, and destiny started weaving its thread.",
  },
];

export function LoveWordGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]);

  const currentPuzzle = PUZZLES[puzzleIndex];
  const maxMistakes = 6;

  const isWordSolved = currentPuzzle.word
    .split("")
    .every((letter) => guessedLetters.has(letter));

  const isFailed = mistakes >= maxMistakes;

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || isWordSolved || isFailed) return;

    setGuessedLetters((prev) => new Set(prev).add(letter));

    if (!currentPuzzle.word.includes(letter)) {
      setMistakes((m) => m + 1);
    } else {
      // Check if this guess completes the word
      const allFound = currentPuzzle.word
        .split("")
        .every((l) => l === letter || guessedLetters.has(l));
      if (allFound && !solvedPuzzles.includes(puzzleIndex)) {
        setSolvedPuzzles((prev) => [...prev, puzzleIndex]);
      }
    }
  };

  const nextPuzzle = () => {
    setGuessedLetters(new Set());
    setMistakes(0);
    setShowHint(false);
    setPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  const selectPuzzle = (idx: number) => {
    setGuessedLetters(new Set());
    setMistakes(0);
    setShowHint(false);
    setPuzzleIndex(idx);
  };

  const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
        background: "rgba(16, 12, 10, 0.98)",
        color: "#f8fafc",
        overflowY: "auto",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
    >
      {/* Puzzle Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {PUZZLES.map((p, idx) => {
          const isCurrent = idx === puzzleIndex;
          const isDone = solvedPuzzles.includes(idx);
          return (
            <button
              key={p.word}
              onClick={() => selectPuzzle(idx)}
              style={{
                background: isCurrent
                  ? "rgba(225, 29, 72, 0.3)"
                  : isDone
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(30, 20, 16, 0.6)",
                border: `1px solid ${
                  isCurrent ? "#f43f5e" : isDone ? "#22c55e" : THEME.folder.dark
                }`,
                borderRadius: 3,
                color: isCurrent ? "#fff" : isDone ? "#4ade80" : "#a8a29e",
                fontSize: "0.65rem",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
                fontWeight: isCurrent ? 700 : 500,
              }}
            >
              {isDone ? "✓ " : ""}PUZZLE #{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Clue Card */}
      <div
        style={{
          background: "rgba(24, 18, 14, 0.8)",
          border: `1px solid ${THEME.evidence.primary}66`,
          borderRadius: 4,
          padding: "0.8rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ fontSize: "0.65rem", color: THEME.evidence.primary, fontWeight: 800 }}>
          DOSSIER CLUE #{puzzleIndex + 1}
        </div>
        <div style={{ fontSize: "0.85rem", color: "#fef08a", marginTop: "0.3rem", lineHeight: 1.5 }}>
          &ldquo;{currentPuzzle.clue}&rdquo;
        </div>
        {showHint && (
          <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: "0.4rem" }}>
            💡 HINT: {currentPuzzle.hint}
          </div>
        )}
      </div>

      {/* Word Letters Display */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          margin: "1.2rem 0",
          flexWrap: "wrap",
        }}
      >
        {currentPuzzle.word.split("").map((letter, i) => {
          const revealed = guessedLetters.has(letter) || isFailed;
          return (
            <div
              key={i}
              style={{
                width: 44,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: revealed ? "rgba(244, 63, 94, 0.2)" : "rgba(30, 22, 18, 0.8)",
                border: `2px solid ${
                  revealed ? "#f43f5e" : THEME.evidence.primary
                }`,
                borderRadius: 4,
                fontSize: "1.4rem",
                fontWeight: 900,
                color: revealed ? "#fff" : "transparent",
                boxShadow: revealed ? "0 0 12px rgba(244, 63, 94, 0.4)" : "none",
                transition: "all 0.2s",
              }}
            >
              {revealed ? letter : ""}
            </div>
          );
        })}
      </div>

      {/* Mistakes Counter */}
      <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.8rem" }}>
        MISTAKES:{" "}
        <span style={{ color: mistakes > 3 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>
          {mistakes} / {maxMistakes}
        </span>
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            style={{
              marginLeft: "1rem",
              background: "none",
              border: "none",
              color: "#38bdf8",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.7rem",
            }}
          >
            Show Hint
          </button>
        )}
      </div>

      {/* Solved Secret Memory Card */}
      {isWordSolved && (
        <div
          style={{
            background: "rgba(34, 197, 94, 0.15)",
            border: "1px solid #22c55e",
            borderRadius: 6,
            padding: "0.8rem 1.2rem",
            marginBottom: "1rem",
            textAlign: "center",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div style={{ color: "#4ade80", fontWeight: 900, fontSize: "0.88rem" }}>
            ★ PUZZLE SOLVED: {currentPuzzle.word}! ★
          </div>
          <div style={{ color: "#f8fafc", fontSize: "0.75rem", marginTop: "0.3rem" }}>
            {currentPuzzle.secretMemory}
          </div>
          <button
            onClick={nextPuzzle}
            style={{
              marginTop: "0.8rem",
              background: "#22c55e",
              color: "#080605",
              fontWeight: 800,
              border: "none",
              borderRadius: 3,
              padding: "0.35rem 1rem",
              fontSize: "0.72rem",
              cursor: "pointer",
            }}
          >
            NEXT PUZZLE ▶
          </button>
        </div>
      )}

      {/* Failed Card */}
      {isFailed && !isWordSolved && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #ef4444",
            borderRadius: 6,
            padding: "0.8rem 1.2rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#f87171", fontWeight: 800, fontSize: "0.85rem" }}>
            Word was: {currentPuzzle.word}
          </div>
          <button
            onClick={() => selectPuzzle(puzzleIndex)}
            style={{
              marginTop: "0.6rem",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 800,
              border: "none",
              borderRadius: 3,
              padding: "0.35rem 1rem",
              fontSize: "0.72rem",
              cursor: "pointer",
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {/* On-screen Keyboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "center", marginTop: "auto" }}>
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} style={{ display: "flex", gap: "0.3rem" }}>
            {row.map((letter) => {
              const isUsed = guessedLetters.has(letter);
              const isCorrect = isUsed && currentPuzzle.word.includes(letter);
              const isWrong = isUsed && !currentPuzzle.word.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isUsed || isWordSolved || isFailed}
                  style={{
                    width: "clamp(26px, 6.5vw, 36px)",
                    height: "clamp(34px, 8vw, 42px)",
                    background: isCorrect
                      ? "#22c55e"
                      : isWrong
                      ? "rgba(60, 40, 36, 0.6)"
                      : "rgba(34, 26, 20, 0.9)",
                    border: `1px solid ${
                      isCorrect ? "#4ade80" : isWrong ? "#451a03" : THEME.folder.dark
                    }`,
                    borderRadius: 3,
                    color: isCorrect ? "#000" : isWrong ? "#78716c" : "#fff",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: isUsed ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

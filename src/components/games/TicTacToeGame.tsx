"use client";

import { useState } from "react";
import { THEME } from "@/lib/theme";

type CellValue = "♥" | "✦" | null;

export function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [anshikaScore, setAnshikaScore] = useState(0);
  const [arnavScore, setArnavScore] = useState(0);
  const [dialog, setDialog] = useState<string>("Your turn, my birthday girl! (You are ♥)");
  const [winner, setWinner] = useState<"♥" | "✦" | "draw" | null>(null);

  const checkWinner = (b: CellValue[]): "♥" | "✦" | "draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [x, y, z] of lines) {
      if (b[x] && b[x] === b[y] && b[x] === b[z]) {
        return b[x];
      }
    }
    if (b.every((cell) => cell !== null)) {
      return "draw";
    }
    return null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;

    // Player (Anshika) plays ♥
    const nextBoard = [...board];
    nextBoard[idx] = "♥";

    const winCheck = checkWinner(nextBoard);
    if (winCheck) {
      setBoard(nextBoard);
      setWinner(winCheck);
      if (winCheck === "♥") {
        setAnshikaScore((s) => s + 1);
        setDialog("You won! You're the smartest and prettiest girl ever! 👑");
      } else if (winCheck === "draw") {
        setDialog("A tie! We're equally matched lovers! ♥");
      }
      return;
    }

    setBoard(nextBoard);
    setDialog("Hmm... let Arnav think of a move...");

    // Arnav AI moves after short natural delay
    setTimeout(() => {
      // Find available spots
      const emptyIndices = nextBoard
        .map((val, i) => (val === null ? i : -1))
        .filter((i) => i !== -1);

      if (emptyIndices.length === 0) return;

      // Smart move: check if Arnav can win or block
      let aiIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

      // Check block
      for (const i of emptyIndices) {
        const testB = [...nextBoard];
        testB[i] = "♥";
        if (checkWinner(testB) === "♥") {
          aiIndex = i; // block Anshika
          break;
        }
      }

      nextBoard[aiIndex] = "✦";
      const aiWin = checkWinner(nextBoard);
      setBoard(nextBoard);

      if (aiWin) {
        setWinner(aiWin);
        if (aiWin === "✦") {
          setArnavScore((s) => s + 1);
          setDialog("Arnav got lucky! But you're still the winner of my heart ♥");
        } else if (aiWin === "draw") {
          setDialog("A tie! Even in games we are synchronized ♥");
        }
      } else {
        const BANTER = [
          "Your turn! Don't look at me with those pretty eyes, I'll melt!",
          "Planning something sneaky, aren't you?",
          "I'm totally letting you win because it's your birthday!",
          "Look at you being a tactical mastermind!",
        ];
        setDialog(BANTER[Math.floor(Math.random() * BANTER.length)]);
      }
    }, 450);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDialog("New match! Anshika (♥) vs Arnav (✦)!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
        background: "rgba(16, 12, 10, 0.98)",
        color: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
    >
      {/* Score Board */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          background: "rgba(28, 20, 16, 0.8)",
          border: `1px solid ${THEME.evidence.primary}66`,
          borderRadius: 6,
          padding: "0.5rem 1.4rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#f43f5e", fontSize: "0.75rem", fontWeight: 800 }}>ANSHIKA (♥)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>{anshikaScore}</div>
        </div>
        <div style={{ fontSize: "0.8rem", color: THEME.folder.light }}>VS</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#38bdf8", fontSize: "0.75rem", fontWeight: 800 }}>ARNAV (✦)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>{arnavScore}</div>
        </div>
      </div>

      {/* Dialog Bubble */}
      <div
        style={{
          color: "#fef08a",
          fontSize: "0.78rem",
          textAlign: "center",
          maxWidth: 360,
          minHeight: "2.2rem",
          marginBottom: "1rem",
          lineHeight: 1.4,
        }}
      >
        &ldquo;{dialog}&rdquo;
      </div>

      {/* 3x3 Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
          width: "min(100%, 260px)",
          aspectRatio: "1/1",
          background: "rgba(45, 30, 24, 0.5)",
          padding: "8px",
          borderRadius: 8,
          border: `1.5px solid ${THEME.evidence.primary}`,
          boxShadow: `0 0 20px ${THEME.evidence.glow}`,
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={cell !== null || winner !== null}
            style={{
              background: cell
                ? cell === "♥"
                  ? "rgba(244, 63, 94, 0.18)"
                  : "rgba(56, 189, 248, 0.18)"
                : "rgba(22, 16, 12, 0.9)",
              border: `1px solid ${
                cell === "♥" ? "#f43f5e" : cell === "✦" ? "#38bdf8" : THEME.folder.dark
              }`,
              borderRadius: 6,
              color: cell === "♥" ? "#f43f5e" : "#38bdf8",
              fontSize: "2rem",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: cell || winner ? "default" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={resetGame}
        style={{
          marginTop: "1.4rem",
          background: THEME.evidence.primary,
          color: "#080605",
          fontWeight: 800,
          border: "none",
          borderRadius: 4,
          padding: "0.45rem 1.4rem",
          fontSize: "0.75rem",
          cursor: "pointer",
          letterSpacing: "0.1em",
        }}
      >
        PLAY ANOTHER ROUND
      </button>
    </div>
  );
}

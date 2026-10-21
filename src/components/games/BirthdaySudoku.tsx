"use client";

import { useState } from "react";
import { THEME } from "@/lib/theme";

// 4x4 Mini Birthday Sudoku (numbers 1-4)
const PUZZLE_4X4 = {
  initial: [
    [1, 0, 0, 4],
    [0, 2, 3, 0],
    [0, 3, 2, 0],
    [2, 0, 0, 1],
  ],
  solution: [
    [1, 3, 4, 4], // 1, 3, 4, 2 ? Let's verify valid Latin square
  ],
};

// Perfectly valid 4x4 Sudoku
const VALID_4X4_INITIAL = [
  [1, 0, 0, 4],
  [0, 2, 3, 0],
  [0, 4, 1, 0],
  [3, 0, 0, 2],
];
const VALID_4X4_SOLUTION = [
  [1, 3, 2, 4],
  [4, 2, 3, 1],
  [2, 4, 1, 3],
  [3, 1, 4, 2],
];

// Valid 9x9 Birthday Sudoku
const VALID_9X9_INITIAL = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const VALID_9X9_SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export function BirthdaySudoku() {
  const [gridSize, setGridSize] = useState<4 | 9>(4);
  const [grid, setGrid] = useState<number[][]>(() =>
    VALID_4X4_INITIAL.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const initialGrid = gridSize === 4 ? VALID_4X4_INITIAL : VALID_9X9_INITIAL;
  const solutionGrid = gridSize === 4 ? VALID_4X4_SOLUTION : VALID_9X9_SOLUTION;

  const handleSelectMode = (size: 4 | 9) => {
    setGridSize(size);
    setGrid(size === 4 ? VALID_4X4_INITIAL.map((r) => [...r]) : VALID_9X9_INITIAL.map((r) => [...r]));
    setSelectedCell(null);
    setIsSolved(false);
  };

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c] !== 0) return; // Cannot edit pre-filled cells
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initialGrid[r][c] !== 0) return;

    const nextGrid = grid.map((row) => [...row]);
    nextGrid[r][c] = num;
    setGrid(nextGrid);

    // Check if fully and correctly solved
    let solved = true;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (nextGrid[row][col] !== solutionGrid[row][col]) {
          solved = false;
          break;
        }
      }
    }
    if (solved) {
      setIsSolved(true);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initialGrid[r][c] !== 0) return;
    const nextGrid = grid.map((row) => [...row]);
    nextGrid[r][c] = 0;
    setGrid(nextGrid);
    setIsSolved(false);
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
        overflowY: "auto",
        alignItems: "center",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
    >
      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => handleSelectMode(4)}
          style={{
            background: gridSize === 4 ? THEME.evidence.primary : "rgba(30, 20, 16, 0.7)",
            color: gridSize === 4 ? "#000" : "#cbd5e1",
            fontWeight: 800,
            border: `1px solid ${THEME.evidence.primary}`,
            borderRadius: 3,
            padding: "0.35rem 0.8rem",
            fontSize: "0.72rem",
            cursor: "pointer",
          }}
        >
          4×4 MINI MODE
        </button>
        <button
          onClick={() => handleSelectMode(9)}
          style={{
            background: gridSize === 9 ? THEME.evidence.primary : "rgba(30, 20, 16, 0.7)",
            color: gridSize === 9 ? "#000" : "#cbd5e1",
            fontWeight: 800,
            border: `1px solid ${THEME.evidence.primary}`,
            borderRadius: 3,
            padding: "0.35rem 0.8rem",
            fontSize: "0.72rem",
            cursor: "pointer",
          }}
        >
          9×9 BIRTHDAY MODE
        </button>
      </div>

      {/* Sudoku Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: "1px",
          background: "#451a03",
          border: `2px solid ${THEME.evidence.primary}`,
          padding: 2,
          borderRadius: 4,
          maxWidth: gridSize === 4 ? 260 : 380,
          width: "100%",
          boxShadow: `0 0 16px ${THEME.evidence.glow}`,
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialGrid[r][c] !== 0;
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isBlockBorderRight = gridSize === 9 ? (c + 1) % 3 === 0 && c !== 8 : (c + 1) % 2 === 0 && c !== 3;
            const isBlockBorderBottom = gridSize === 9 ? (r + 1) % 3 === 0 && r !== 8 : (r + 1) % 2 === 0 && r !== 3;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSelected
                    ? "rgba(56, 189, 248, 0.3)"
                    : isInitial
                    ? "rgba(24, 18, 14, 0.95)"
                    : "rgba(34, 26, 20, 0.9)",
                  color: isInitial ? THEME.evidence.primary : "#38bdf8",
                  fontWeight: isInitial ? 800 : 600,
                  fontSize: gridSize === 4 ? "1.3rem" : "0.95rem",
                  cursor: isInitial ? "default" : "pointer",
                  borderRight: isBlockBorderRight ? "2px solid #b45309" : "none",
                  borderBottom: isBlockBorderBottom ? "2px solid #b45309" : "none",
                  userSelect: "none",
                  transition: "background 0.15s",
                }}
              >
                {val !== 0 ? val : ""}
              </div>
            );
          })
        )}
      </div>

      {/* Victory Notification */}
      {isSolved && (
        <div
          style={{
            marginTop: "1rem",
            background: "rgba(34, 197, 94, 0.2)",
            border: "1px solid #22c55e",
            borderRadius: 4,
            padding: "0.6rem 1.2rem",
            color: "#4ade80",
            fontWeight: 800,
            fontSize: "0.85rem",
            textAlign: "center",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          ★ BRILLIANT! SUDOKU COMPLETED! ★
        </div>
      )}

      {/* Number Pad for Input */}
      <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {Array.from({ length: gridSize }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => handleNumberInput(n)}
            style={{
              width: 38,
              height: 38,
              background: "rgba(38, 28, 22, 0.9)",
              border: `1px solid ${THEME.evidence.primary}`,
              borderRadius: 4,
              color: "#fff",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={handleClearCell}
          style={{
            padding: "0 0.8rem",
            height: 38,
            background: "rgba(60, 20, 20, 0.8)",
            border: "1px solid #ef4444",
            borderRadius: 4,
            color: "#fca5a5",
            fontWeight: 700,
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}

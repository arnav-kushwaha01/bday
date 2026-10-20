"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false — the entire experience uses window/document/WebGL
const ArchiveExperience = dynamic(
  () => import("@/components/ArchiveExperience"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0a0806",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#c4a35a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            letterSpacing: "0.4em",
            fontWeight: 300,
          }}
        >
          ANSHIKA
        </div>
        <div
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.6em",
            color: "#6b5f50",
            marginTop: "0.5rem",
          }}
        >
          THE ARCHIVE
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <ArchiveExperience />;
}

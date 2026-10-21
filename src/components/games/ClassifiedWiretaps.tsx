"use client";

import { useState, useRef, useEffect } from "react";
import { THEME } from "@/lib/theme";
import { getAudioUrl } from "@/lib/assetManager";

interface VoiceNote {
  id: string;
  filename: string;
  title: string;
  mood: string;
  durationEst: string;
  description: string;
}

const WIRETAP_NOTES: VoiceNote[] = [
  {
    id: "tape-deep-love",
    filename: "her_telling_me_how_much_and_deeply_she_loves_me.ogg",
    title: "DEEP LOVE CONFESSION",
    mood: "Pure Romance",
    durationEst: "0:45",
    description: "Anshika expressing how deeply and truly she loves Arnav with all her soul.",
  },
  {
    id: "tape-dumbo",
    filename: "cutely_calling_me_dumbo.ogg",
    title: "CUTELY CALLING ME DUMBO",
    mood: "Playful Teasing",
    durationEst: "0:20",
    description: "Calling Arnav 'Dumbo' in the most adorable giggle and cute tone ever.",
  },
  {
    id: "tape-manchurian",
    filename: "excited_about_me_coming_back_from_college_and_us_eating_mabchurian_rice.ogg",
    title: "MANCHURIAN RICE REUNION",
    mood: "Hyper Excited",
    durationEst: "0:38",
    description: "Super hyped about Arnav returning from Bangalore and planning their Manchurian Rice feast.",
  },
  {
    id: "tape-weather",
    filename: "being_the_cutest_over_arnav_going_to_college_far_that_she_says_thats_why_the_weather_got_bad.ogg",
    title: "THE WEATHER GOT BAD",
    mood: "Dramatic & Cute",
    durationEst: "0:30",
    description: "Blaming the bad weather on the tragedy of Arnav being far away at college.",
  },
  {
    id: "tape-studying",
    filename: "being_angry_and_telling_me_if_i_am_not_busy_studying_and_doing_spmething_else_then_i_am_in_trouble.ogg",
    title: "STUDY WARNING // IN TROUBLE",
    mood: "Angry Birdie",
    durationEst: "0:25",
    description: "Warning Arnav that if he isn't studying hard right now, he is in big trouble!",
  },
  {
    id: "tape-stay-away",
    filename: "being_so_angry_that_telling_me_to_just_stay_away_from_her_anyhow.ogg",
    title: "JUST STAY AWAY!",
    mood: "Feisty Drama",
    durationEst: "0:22",
    description: "Pretending to be furious and telling him to stay away (while being hopelessly cute).",
  },
  {
    id: "tape-cuteness",
    filename: "so_adorable_while_calling_me_cute_and_telling_me_that_i_am_proud_of_my_cuteness.ogg",
    title: "PROUD OF MY CUTENESS",
    mood: "Affectionate",
    durationEst: "0:32",
    description: "Adoring Arnav's cuteness and teasing him about being proud of it.",
  },
  {
    id: "tape-food",
    filename: "telling_me_how_cute_and_dumb_i_am_in_context_of_food.ogg",
    title: "CUTE & DUMB FOODIE",
    mood: "Foodie Banter",
    durationEst: "0:28",
    description: "Laughing at how cute and clueless Arnav is when it comes to ordering and food.",
  },
  {
    id: "tape-texts",
    filename: "telling_me_that_i_am_so_cute_to_like_every_text_of_her_whic_makes_her_happy_and_loved.ogg",
    title: "LIKING EVERY TEXT",
    mood: "Heartwarming",
    durationEst: "0:35",
    description: "Sharing how happy it makes her when Arnav hearts and likes every single text she sends.",
  },
  {
    id: "tape-missed",
    filename: "telling_me_to_listen_the_above_voicenote_in_cutely_angrytone_because_i_missed_it.ogg",
    title: "LISTEN TO MY VOICENOTE!",
    mood: "Demanding Diva",
    durationEst: "0:18",
    description: "Cutest angry order demanding Arnav listen to the voice note he missed earlier.",
  },
  {
    id: "tape-roam",
    filename: "wanna_roam_even_on_periods.ogg",
    title: "WANNA ROAM ANYWAY",
    mood: "Unstoppable Free Spirit",
    durationEst: "0:26",
    description: "Wanting to go out and roam Kanpur on scooty no matter what.",
  },
];

export function ClassifiedWiretaps() {
  const [activeTape, setActiveTape] = useState<VoiceNote>(WIRETAP_NOTES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTape = (tape: VoiceNote) => {
    setActiveTape(tape);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(getAudioUrl(tape.filename));
    audio.volume = 0.95;
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      playTape(activeTape);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
      {/* Top Tape Deck Header */}
      <div
        style={{
          background: "rgba(28, 20, 16, 0.9)",
          border: `1.5px solid ${THEME.evidence.primary}`,
          borderRadius: 8,
          padding: "1rem 1.4rem",
          marginBottom: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: `0 0 20px ${THEME.evidence.glow}`,
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {/* Cassette Spools Animation */}
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#221711",
                border: "3px dashed #eab308",
                animation: isPlaying ? "spin 2s linear infinite" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#0c0806" }} />
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#221711",
                border: "3px dashed #eab308",
                animation: isPlaying ? "spin 2s linear infinite" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#0c0806" }} />
            </div>
          </div>

          <div>
            <div style={{ color: THEME.evidence.primary, fontSize: "0.68rem", fontWeight: 800 }}>
              NOW PLAYING // WIRE-REEL #1025
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", marginTop: "0.2rem" }}>
              {activeTape.title}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#fef08a", marginTop: "0.15rem" }}>
              Mood: {activeTape.mood} • {activeTape.description}
            </div>
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={togglePlay}
          style={{
            background: isPlaying ? "#ef4444" : THEME.evidence.primary,
            border: "none",
            borderRadius: "50%",
            width: 52,
            height: 52,
            color: "#080605",
            fontSize: "1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontWeight: 900,
            boxShadow: "0 0 16px rgba(234, 179, 8, 0.6)",
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>

      {/* Tape Library List */}
      <div style={{ fontSize: "0.72rem", color: THEME.folder.light, fontWeight: 700, marginBottom: "0.5rem" }}>
        ARCHIVED VOICE INTERCEPTS ({WIRETAP_NOTES.length} TAPES)
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        {WIRETAP_NOTES.map((tape, idx) => {
          const isSelected = activeTape.id === tape.id;
          return (
            <div
              key={tape.id}
              onClick={() => playTape(tape)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.65rem 1rem",
                background: isSelected ? "rgba(234, 179, 8, 0.18)" : "rgba(24, 18, 14, 0.8)",
                border: `1px solid ${isSelected ? THEME.evidence.primary : THEME.folder.dark}`,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                <span
                  style={{
                    color: isSelected ? THEME.evidence.primary : "#64748b",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                >
                  #{String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: isSelected ? "#fff" : "#e2e8f0" }}>
                    {tape.title}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{tape.description}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: THEME.evidence.primary,
                    background: "rgba(234, 179, 8, 0.1)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: 3,
                  }}
                >
                  {tape.mood}
                </span>
                <span style={{ color: isSelected && isPlaying ? "#22c55e" : "#eab308", fontSize: "0.9rem" }}>
                  {isSelected && isPlaying ? "▶ Playing" : "▶"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

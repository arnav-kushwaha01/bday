import { z } from "zod";

// ─── Coordinates ────────────────────────────────────────────────
export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
  tag: z.string().optional(),
  description: z.string().optional(),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

// ─── Photo Entry ────────────────────────────────────────────────
export const PhotoEntrySchema = z.object({
  id: z.string(),
  filename: z.string(),
  title: z.string(),
  description: z.string(),
  memory: z.string().optional(),
  approximateDate: z.string().optional(),
  room: z.string(),
  importance: z.enum(["hero", "featured", "standard", "easter-egg"]),
  discoverable: z.boolean(),
});
export type PhotoEntry = z.infer<typeof PhotoEntrySchema>;

// ─── Video Entry ────────────────────────────────────────────────
export const VideoEntrySchema = z.object({
  id: z.string(),
  filename: z.string(),
  title: z.string(),
  description: z.string(),
  meaning: z.string().optional(),
  approximateDate: z.string().optional(),
  room: z.string(),
  playMode: z.enum(["inline", "cinematic", "interaction"]),
  muted: z.boolean(),
});
export type VideoEntry = z.infer<typeof VideoEntrySchema>;

// ─── Audio Entry ────────────────────────────────────────────────
export const AudioEntrySchema = z.object({
  id: z.string(),
  filename: z.string(),
  purpose: z.string(),
  room: z.string(),
  trigger: z.enum(["interaction", "proximity", "manual"]),
  volumePriority: z.enum(["high", "medium", "low"]),
});
export type AudioEntry = z.infer<typeof AudioEntrySchema>;

// ─── Evidence ───────────────────────────────────────────────────
export const EvidenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  unlockedMessage: z.string(),
  presentation: z.enum(["overlay", "hologram", "voice-note", "text", "photo"]),
  associatedMedia: z.string().optional(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

// ─── Mystery Clue ───────────────────────────────────────────────
export const MysteryClueSchema = z.object({
  id: z.string(),
  clue: z.string(),
  hint: z.string(),
});
export type MysteryClue = z.infer<typeof MysteryClueSchema>;

// ─── Little Thing ───────────────────────────────────────────────
export const LittleThingSchema = z.object({
  id: z.string(),
  content: z.string(),
  icon: z.string().optional(),
});
export type LittleThing = z.infer<typeof LittleThingSchema>;

// ─── Unwritten Chapter ─────────────────────────────────────────
export const UnwrittenChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  symbol: z.string().optional(),
});
export type UnwrittenChapter = z.infer<typeof UnwrittenChapterSchema>;

// ─── Easter Egg ─────────────────────────────────────────────────
export const EasterEggSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  trigger: z.string(),
  reward: z.string(),
});
export type EasterEgg = z.infer<typeof EasterEggSchema>;

// ─── Personal Info ──────────────────────────────────────────────
export const PersonalInfoSchema = z.object({
  name: z.string(),
  birthDate: z.string(),
  year: z.number(),
  traits: z.array(z.string()),
  favorites: z.array(z.string()),
  interests: z.array(z.string()),
  habits: z.array(z.string()),
  quirks: z.array(z.string()),
  thingsShesSays: z.array(z.string()),
  thingsSheLoves: z.array(z.string()),
  thingsSheDislikes: z.array(z.string()),
  relationshipStart: z.string(),
});

// ─── Distance Map ───────────────────────────────────────────────
export const DistanceMapSchema = z.object({
  herLocation: CoordinatesSchema,
  hisLocation: CoordinatesSchema,
  currentLocation: CoordinatesSchema,
  school: CoordinatesSchema,
});

// ─── Full Data Schema ───────────────────────────────────────────
export const AnshikaDataSchema = z.object({
  personal: PersonalInfoSchema,
  distance: DistanceMapSchema,
  photos: z.array(PhotoEntrySchema),
  videos: z.array(VideoEntrySchema),
  audio: z.array(AudioEntrySchema),
  evidence: z.array(EvidenceSchema),
  mysteryClues: z.array(MysteryClueSchema),
  littleThings: z.array(LittleThingSchema),
  unwrittenChapters: z.array(UnwrittenChapterSchema),
  easterEggs: z.array(EasterEggSchema),
  finalMessage: z.string(),
  videoMessageSlot: z.string().optional(),
});

export type AnshikaData = z.infer<typeof AnshikaDataSchema>;

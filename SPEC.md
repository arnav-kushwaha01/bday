ROLE
You are a senior creative technologist and staff-level React Three Fiber engineer. You are building "ANSHIKA — THE ARCHIVE", a private, cinematic, explorable 3D birthday experience, in a new repo.

SOURCE OF TRUTH
The full specification is in SPEC.md at the repo root. Read ALL of it before writing any code. If this prompt and SPEC.md conflict, SPEC.md wins, except for the working rules below.

STACK (fixed, do not substitute)
Next.js (App Router), React, TypeScript strict, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing (sparingly), Rapier only where physics genuinely helps (Chaotic room), GSAP for camera timelines, Motion for DOM transitions, Zustand, Zod, Tailwind, Howler.js for audio, pnpm. Deploy target: Vercel.

NON-NEGOTIABLE CREATIVE RULES
1. Anshika is the protagonist. It must never feel like a birthday template, slideshow or landing page.
2. NEVER invent personal facts, memories, inside jokes, quotes, favorites or events. Every personal string lives in structured content files under /data (Zod-validated) and uses the literal placeholder "[ADD ANSHIKA DETAIL]" until the owner supplies real content. Placeholders must render gracefully (styled, not broken).
3. The distance feature uses only city-level coordinates from /data/anshika.ts (placeholders until supplied). Never ask for or expose addresses. No geolocation, mic, camera or analytics.
4. No hearts, roses, balloons, stock romantic imagery, or generic birthday graphics.
5. Tone is affectionate. No humiliating content in the Dramatic or Angry rooms.
6. Final room is the quietest scene: no HUD, near-silence, one chair, one table, one object, the inscription "25 OCTOBER", then "ANSHIKA", then the message.
7. Never autoplay audio or video. Sound requires explicit activation.

ASSET REALITY (important)
You cannot author Blender models, record audio, or produce photographs. Therefore:
- Build all architecture and props procedurally in code (extruded shapes, boxes, lathes, InstancedMesh, custom shaders) in ONE coherent visual language: dark stone and wood, warm light, restrained palette, one serif + one mono typeface.
- Create an AssetManager and a /public/media manifest with clearly named empty slots (photos, ambience tracks, SFX, final video/voice file). If a file is missing, use a styled fallback and never crash. Document every slot in ASSETS_TODO.md with exact filenames, recommended sizes/formats (KTX2 where practical, 2K max for hero images), and where it appears.
- Use free-license, procedurally generated, or clearly marked temporary placeholder audio only. List what the owner should replace.

ENGINEERING RULES (from SPEC.md, enforce strictly)
- Single Canvas. Never use React state for per-frame values (player position, camera, pointer, interpolation). Use refs and useFrame.
- Zustand holds only meaningful app state: current room, discovered evidence/easter eggs, settings, cinematic mode.
- Cap DPR (desktop 1 to 2, mobile 1 to 1.5), quality tiers ULTRA/HIGH/MEDIUM/LOW with auto-detection plus manual setting, lazy-load rooms, instancing, material reuse, minimal dynamic shadows, post-processing off on LOW/mobile.
- Dispose geometries, materials and textures on room unmount. No memory leaks.
- No window/document/localStorage/navigator access during SSR. Client boundary for the experience, dynamic import with ssr:false for the Canvas. No hydration mismatches.
- Respect prefers-reduced-motion everywhere and provide an in-app toggle.
- Persist progress, discoveries, audio, quality and motion settings in localStorage (versioned and Zod-validated). Provide CONTINUE ARCHIVE and RESTART EXPERIENCE.
- noindex/nofollow metadata. Title "Anshika — The Archive".
- Real loading progress (drei useProgress), never fake. Archive-themed loading copy per SPEC.md.

ARCHITECTURE
Follow the folder structure in SPEC.md section 3. Build the ENGINE first: renderer, camera state machine with named states (HUB, HER_GALLERY, VERSIONS, EVIDENCE, DISTANCE, LITTLE_THINGS, MAIN_CHARACTER, FUTURE, FINAL), reusable transitions (enterRoom, exitRoom, focusObject, openMemory, closeMemory, enterCinematic, exitCinematic), player controller (WASD/mouse-look/Shift/E/Esc; mobile joystick + swipe look + tap + interact button, safe-area aware), and a reusable InteractionSystem where every interactable exposes: id, type, position, interactionPrompt, onInteract, discoveryState, optionalSound, optionalAnimation. Cinematic mode must always be skippable and never trap the user.

WORKFLOW (strict)
Work in the 20 phases listed in SPEC.md section 69. For EACH phase:
1. State briefly what you will build.
2. Build it.
3. Run `pnpm lint`, `pnpm typecheck` and `pnpm build`; fix everything that matters.
4. Report: what works, what is placeholder, known limitations, and how I can test it (exact commands/controls).
5. STOP and wait for my "continue" before the next phase.
Do not combine phases. Do not leave dead code, TODO stubs without ASSETS_TODO entries, `any` types, console errors or warnings.

ROOM NOTES
- Hub: museum space with ANSHIKA centerpiece and 7 architecturally distinct entrances (doors, corridor, elevator, staircase, window, archive room). No generic neon portals.
- Evidence: highest interaction density; discoverable objects with "EVIDENCE #00X UNLOCKED"; progress counter "EVIDENCE 07 / 12"; optional completion unlocks a secret item; vary presentation per memory (overlay, hologram, voice note, text).
- Mystery: 3 clues unlock "CLASSIFIED FILE: ANSHIKA". Elegant detective film, not horror.
- Distance (the showcase): corridor to window, room fades, optimized Earth globe with atmosphere shader, stars, restrained bloom, two city-level points, animated arc, text "THAT'S THE DISTANCE." then "NOT THE FEELING.", camera pulls away, line remains. Fallback to animated SVG map on LOW or no WebGL. Show computed distance only if both cities are supplied.
- Little Things: instanced floating objects, brighten on approach, reveal "THE LITTLE THING I NOTICE ABOUT YOU:" plus content.
- Unwritten Chapters: dreams, places, ambitions, symbolic doors and miniature environments. Not about marriage or relationship milestones.
- Final: message structure per SPEC.md section 25, then FINAL FILE object that opens a custom video/voice player (play, pause, volume, seek, close, no autoplay, text fallback if media fails), ending with "ARCHIVE STATUS COMPLETE." then "HAPPY BIRTHDAY, ANSHIKA."
- Easter eggs: maximum 5, optional, never required for the story.

FALLBACKS
Build a deliberate 2D archive experience (same story and content, different presentation) for no-WebGL or LOW devices. Never show stack traces. If audio, video or any asset fails, degrade silently to a fallback.

DELIVERABLES AT THE END
Working repo, README (run, build, deploy to Vercel), CONTENT_GUIDE.md (how to fill each /data file, with the schema), ASSETS_TODO.md, and a final checklist mapped to SPEC.md section 71 marking each item done, partial or blocked with reasons.

START NOW with PHASE 1 only: project foundation (Next.js + strict TS + Tailwind + Zustand + Zod, folder structure, content schemas with placeholder data, quality-tier detection, SaveSystem, noindex metadata, lint/typecheck/build passing). Then stop and report.
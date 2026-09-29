# PROJECT_CONTEXT.md — Corporate Training Catch-Up Platform

*Documentation for Human Developers & AI Agents*  
*Last Updated: 14 September 2026*

---

## 1. Project Overview & Core Mission

This repository contains the **Corporate Training Catch-Up Platform**, a browser-based application engineered to deliver approximately **10-minute immersive 3D recap experiences** for corporate learners who missed live training sessions.

### Authoritative Programme Hierarchy:
```
Lesson 1 — Level 1: AI Foundations & Literacy
├── Module 1 — Understanding AI Basics and How to Use It (~10-minute independent recap)
├── Module 2 — Smart Comparison Made Easy with AI (~10-minute independent recap)
├── Module 3 — Build AI Agents for Your Team (~10-minute independent recap)
├── Module 4 — Dynamic Presentation and Report with AI (~10-minute independent recap)
├── Module 5 — AI Ethics, Privacy and Security at Work (~10-minute independent recap)
└── Module 6 — The Group AI Challenge (~10-minute independent recap)
```

**Critical Architecture Rule:** These are **six separate, independent modules**. Each module possesses its own complete recap experience (narrative, 3D scenes, camera choreography, presentation board visuals, workplace examples, interactive knowledge check, and key takeaway). They are **never** combined into a single video or recap.

---

## 2. Technical Stack & Architecture

* **Build System & Dev Server:** Vite (`v7.x`) with `@vitejs/plugin-react`
* **Language & Types:** TypeScript (`~5.9.x`) under strict type checking and `erasableSyntaxOnly`
* **Frontend Framework:** React 19 (`react` & `react-dom` `v19.1.1`)
* **3D Real-Time Engine:** Babylon.js (`@babylonjs/core` `v8.37.0`) rendering to an HTML `<canvas>`
* **Visual Philosophy:** Calm, premium executive corporate learning environment with subtle atmospheric dusk/twilight lighting. Avoids game, cartoon, edutainment, or RPG tropes.
* **Separation of Concerns:**
  * **React** owns application routing (`access` $\rightarrow$ `module-select` $\rightarrow$ `lesson-player`), HUD overlays, timeline controls, subtitles, and interactive knowledge-check modals.
  * **Babylon.js** owns 3D meshes (classroom, lighting, plinth, table), camera interpolation (`UniversalCamera` rig), dynamic 2D canvas texture generation for the presentation board, and instructor avatar updating.
  * **Curriculum & Content** are stored purely as typed TypeScript data contracts (`LessonRecap`, `LessonBeat`, `BoardContent`). No lesson content is hardcoded into the 3D scene engine.

---

## 3. Directory & File Structure

```
catchup-poc/
├── index.html                           # HTML app shell
├── package.json                         # Dependencies & scripts
├── tsconfig.json / tsconfig.app.json    # Strict TypeScript compiler options
├── vite.config.ts                       # Vite configuration (port 5173)
├── PROJECT_CONTEXT.md                   # Comprehensive project documentation
├── README.md                            # High-level overview & setup instructions
└── src/
    ├── main.tsx                         # React entry point mounting to #root
    ├── App.tsx                          # AppView state machine (access, module-select, player)
    ├── index.css                        # Obsidian/slate styling with gold accents
    ├── vite-env.d.ts                    # Vite client types for CSS/assets
    ├── types/
    │   └── lesson.ts                    # Core contracts: CourseLesson, CourseModule, LessonRecap, LessonBeat
    ├── content/
    │   ├── catalog.ts                   # Official curriculum hierarchy (Lesson 1 -> 6 Modules)
    │   ├── registry.ts                  # Dynamic lesson recap resolver & registry
    │   └── sampleLesson.ts              # Module 1 ~78s technical baseline demonstration
    ├── screens/
    │   ├── AccessCodeScreen.tsx         # Access code verification (TTDA-L1)
    │   ├── ModuleSelectScreen.tsx       # Selection screen for Lesson 1's six modules
    │   └── LessonSelectScreen.tsx       # Alternate module selection screen
    ├── lesson/
    │   ├── LessonPlayer.tsx             # Player coordinator (Canvas, HUD, Subtitles, Check dialog)
    │   ├── LessonHud.tsx                # HUD controls: Scene chips, camera toggles, timeline slider
    │   ├── KnowledgeCheck.tsx           # Accessible HTML modal question overlay
    │   └── useLessonPlayback.ts         # Generic, purely data-driven playback clock
    ├── scene/
    │   ├── SceneCanvas.tsx              # React wrapper managing Babylon engine lifecycle
    │   ├── ClassroomScene.ts            # Babylon Scene, camera, lighting, board texture updates
    │   ├── cameraRig.ts                 # Smooth lerping between camera shots (wide, instructor, board)
    │   ├── classroom.ts                 # Room geometry (walls, floor, trim, plinth, desk)
    │   ├── presentationBoard.ts         # High-res (1280x720) 2D canvas drawing routines
    │   └── instructor/
    │       ├── types.ts                 # Modular InstructorHandle and CreateInstructor contracts
    │       └── createPlaceholderInstructor.ts # Procedural humanoid figure with idle breathing
    └── audio/
        └── AudioController.ts           # Speech synthesis controller (ready for ElevenLabs MP3s)
```

---

## 4. Source Material & Mapping Standards

All recap content must strictly derive from authoritative project sources in this order of priority:
1. **Official Level 1 Handbook:** *Empowering Innovation: Bridging AI Concepts to Corporate Readiness*, The Shift Project (Presented by Colin B Raj; Toshiba / Lourdes Training / Kadosh AI; pages 1–59).
2. **Training Transcripts & Live Session Logs:** Actual participant submissions, trainer instructions, and demonstrated workflows.
3. **Original Video Recordings:** Used only if a transcript is ambiguous or a visual demonstration requires visual confirmation.

### Source Classification Taxonomy:
* **[A] Official Teaching:** Authoritative concepts, principles, and frameworks presented by the trainer.
* **[B] Demonstration:** Workflows, live tool demonstrations, and prompt execution.
* **[C] Exercise:** Structured participant exercises, prompts, and cluster assignments.
* **[D] Useful Participant Example:** High-value participant prompt formulations or domain questions.
* **[E] AI-Generated Output:** Output generated during exercises (used as illustrative examples, not facts).
* **[F] Noise:** Logistics, technical interruptions, greetings, off-topic chat (strictly filtered out).

---

## 5. Current Implementation Status

| Module | Official Title | Status | Duration | Playable In App |
| :--- | :--- | :--- | :--- | :--- |
| **Module 1** | Understanding AI Basics and How to Use It | Complete (~10-Min Full Production Recap) + Preserved 78s Baseline Demo | ~10:00 (Full Recap) / ~78s (Baseline Demo) | Playable via dual buttons in UI (`Start Full Recap` / `Play 78s Technical Demo`) |
| **Module 2** | Smart Comparison Made Easy with AI | Source Mapped; Structure Defined | Target: ~10:00 | Marked *Content mapping in progress* in UI |
| **Module 3** | Build AI Agents for Your Team | Source Mapped; Structure Defined | Target: ~10:00 | Marked *Content mapping in progress* in UI |
| **Module 4** | Dynamic Presentation and Report with AI | Source Mapped; Structure Defined | Target: ~10:00 | Marked *Content mapping in progress* in UI |
| **Module 5** | AI Ethics, Privacy and Security at Work | Source Mapped; Structure Defined | Target: ~10:00 | Marked *Content mapping in progress* in UI |
| **Module 6** | The Group AI Challenge | Source Mapped; Structure Defined | Target: ~10:00 | Marked *Content mapping in progress* in UI |

---

## 6. Awang 3D Mascot Asset Assessment

A comprehensive technical inspection was conducted on the provided character design sheet (`Sir collin character sheet .png` / `awang.png`) and the generated 3D asset archive (`Meshy_AI_Confident_Professiona_0914053522_texture_fbx.zip`).

### Key Technical Findings:
1. **File Format:** Kaydara Binary FBX generated via Meshy AI (`Meshy_AI_Confident_Professiona_0914053522_texture.fbx`).
2. **File Size:** **82.5 MB uncompressed** (FBX) + 12.4 MB of textures.
3. **Meshes:** 27 individual static mesh geometries matching the 2D character sheet ("The Leader - Confident, Approachable, Inspiring").
4. **Textures:** 4 high-resolution maps: Base Color (6.4 MB), Normal Map (4.8 MB), Roughness (1.1 MB), Metallic (74 KB).
5. **Rigging & Armature:** **No skeleton exists** (`Skin: 0`, `Deformer: 0`, `LimbNode: 0`, `Skeleton: 0`). It is a static, unrigged 3D sculpt.
6. **Animations:** **No animation tracks exist** (`AnimationStack: 0`, `AnimationCurve: 0`).
7. **WebGL / Browser Suitability:**
   * Babylon.js does not parse binary FBX files directly at runtime; it requires glTF/GLB.
   * 82.5 MB is far too heavy for smooth web delivery.
   * **Required Pipeline:** Auto-rig the mesh with a humanoid skeleton (via Mixamo, AccuRig, or Blender), attach subtle speaking and presentation animations, optimize geometry and textures, and export as a lightweight binary `.glb` (target: 3–6 MB).
8. **Decoupled Architecture:** The codebase encapsulates the instructor behind [`InstructorHandle`](file:///c:/Users/jayak/Projects/catchup-poc/src/scene/instructor/types.ts#L4-L8) (`root`, `update()`, `dispose()`). The procedural humanoid avatar currently serves as the functional, zero-cost baseline. Once Awang is rigged and converted to GLB, it can be dropped into [`ClassroomScene.ts`](file:///c:/Users/jayak/Projects/catchup-poc/src/scene/ClassroomScene.ts) by providing an `AwangInstructor` factory without changing a single line of lesson playback code.

---

## 7. Audio & Narration Architecture

* **Current Implementation:** [`AudioController.ts`](file:///c:/Users/jayak/Projects/catchup-poc/src/audio/AudioController.ts) wraps the browser's `window.speechSynthesis` API. It handles cancellation, speech rate, and pitch.
* **Production Path:** Each `LessonBeat` is structured to support an optional `audioUrl` pointing to an ElevenLabs pre-rendered MP3 file. When `audioUrl` is present, `AudioController` plays the high-quality pre-rendered voice clip; otherwise, it falls back gracefully to client synthesis.

---

## 8. Deployment & Cloudflare Pages Preparation

* **Local Verification:** Production build verified with `npm run build` (`tsc -b && vite build`), generating optimized bundles in `dist/` in 11.68s.
* **Cloudflare Pages Configuration:**
  * Build Command: `npm run build`
  * Build Output Directory: `dist`
  * Node Version: `20+` or `22+`
* **Zero Hardcoded Secrets:** The application relies strictly on local state and public static assets with no client-side secret exposure.

---

## 9. Next Recommended Tasks

1. **Phase 2 Complete:** Master content mapping, duplicate detection, and ~10-minute structures for all six modules are finalized.
2. **Phase 3 Complete:** Implemented the full ~10-minute Module 1 recap payload in [`src/content/moduleOneRecap.ts`](file:///c:/Users/jayak/Projects/catchup-poc/src/content/moduleOneRecap.ts) (600s, 9 beats, token prediction, CRE framework, platform matrix, 10-step prompting, interactive check) while preserving [`sampleLesson.ts`](file:///c:/Users/jayak/Projects/catchup-poc/src/content/sampleLesson.ts) as the quick ~78s technical demonstration. Both are directly launchable from the Module Select screen.
3. **Phase 4 (Next):** Implement Module 2 (*Smart Comparison Made Easy with AI*) complete ~10-minute recap payload: 7-step comparison workflow, multi-document review, budget variance matrix, exception identification, and source validation.
4. **Awang Rigging Preparation:** Convert `Meshy_AI_Confident_Professiona` FBX to an optimized, rigged `.glb` model with subtle presentation animations.

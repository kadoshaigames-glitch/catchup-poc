# Catch-Up POC · Corporate Training 3D Recap

A browser-based technical proof-of-concept for an interactive, immersive 3D corporate training recap platform.

---

## Overview

This prototype demonstrates a modern corporate learning catch-up experience where learners can access concise, interactive 3D recaps of individual course lessons.

The POC specifically demonstrates **Module 1, Section 1** (*What is AI? Key Definitions You Need to Know*) from the authoritative course syllabus as a **~78-second interactive technical demonstration**. In production, each lesson will have its own dedicated ~10-minute recap without combining multiple lessons into one.

---

## What This POC Proves

1. **Professional Web Application Architecture:**
   - Clean separation of concerns: React handles application flow, HUD, and HTML overlays; Babylon.js handles 3D rendering and dynamic board textures.
   - Built on standard web technologies: Vite, React 19, TypeScript, Babylon.js.

2. **3D Immersive Executive Classroom:**
   - Procedural 3D classroom environment (`ClassroomScene.ts`, `classroom.ts`) with subdued corporate aesthetics, balanced lighting, and presentation plinth.

3. **Modular & Replaceable Instructor:**
   - Decoupled via `InstructorHandle` and `CreateInstructor` factory types (`src/scene/instructor/types.ts`).
   - Uses a procedural humanoid placeholder (`createPlaceholderInstructor.ts`) designed to be swapped for a final company 3D mascot (e.g., GLB asset) without modifying the lesson player or scene logic.

4. **Smooth Multi-Angle Camera Rig:**
   - Smooth interpolation between predefined camera perspectives (`wide`, `instructor`, `board`).

5. **Dynamic 2D-on-3D Presentation Board:**
   - High-resolution dynamic texture (`presentationBoard.ts`) rendering:
     - Module and lesson title slides.
     - Single core definition cards with workplace examples.
     - Progressive nested concept layer diagrams (AI → ML → DL → Generative AI).
     - Multi-column comparison tables.
     - Key takeaway conclusions.

6. **Interactive Lesson Playback & HUD:**
   - Timeline scrubber with formatted timestamps and play/pause controls.
   - Timed scene navigation chips for rapid jumping between lesson beats.
   - Manual camera angle switching chips.
   - Subtitle narration captions.

7. **Interactive Knowledge-Check Overlay:**
   - Pure HTML/CSS accessible modal that pauses 3D playback at designated beats.
   - Immediate feedback confirming the takeaway upon answer submission before resuming playback.

8. **Multiple Independent Lessons Architecture:**
   - Structured curriculum model (`CatalogModule` → `CatalogLesson[]`).
   - Centralized lesson recap registry (`src/content/registry.ts`) enabling new lessons (`Lesson 2`, `Lesson 3`, etc.) to be registered and resolved without touching playback or 3D scene code.

---

## Architecture & Folder Structure

```
catchup-poc/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx                    # React application entry point
    ├── App.tsx                     # Top-level screen coordinator (AppView)
    ├── index.css                   # Obsidian/gold corporate styling
    ├── types/
    │   └── lesson.ts               # Core contracts (Module, Lesson, Beat, Question)
    ├── content/
    │   ├── catalog.ts              # Course curriculum hierarchy
    │   ├── registry.ts             # Lesson recap resolver & registry
    │   └── sampleLesson.ts         # Module 1, Lesson 1 timed storyboard data
    ├── screens/
    │   ├── AccessCodeScreen.tsx    # Access code verification (TTDA-L1)
    │   ├── ModuleSelectScreen.tsx  # Module selection view
    │   └── LessonSelectScreen.tsx  # Individual lesson selection view
    ├── lesson/
    │   ├── LessonPlayer.tsx        # Player coordinating canvas, HUD, & overlays
    │   ├── LessonHud.tsx           # Timeline, scene jumps, camera controls
    │   ├── KnowledgeCheck.tsx      # Modal question dialog
    │   └── useLessonPlayback.ts    # Generic, data-driven playback clock
    ├── scene/
    │   ├── SceneCanvas.tsx         # React wrapper for Babylon canvas
    │   ├── ClassroomScene.ts       # Babylon engine, scene loop, & texture updates
    │   ├── cameraRig.ts            # Smooth camera lerping
    │   ├── classroom.ts            # Room geometry & materials
    │   ├── presentationBoard.ts    # 2D canvas texture drawing routines
    │   └── instructor/
    │       ├── types.ts            # Decoupled instructor interfaces
    │       └── createPlaceholderInstructor.ts # Procedural placeholder avatar
    └── audio/
        └── AudioController.ts      # Web Speech API placeholder controller
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Accessing the POC
1. Enter the prototype course access code: **`TTDA-L1`**
2. Select **Module 1: Understanding AI Basics and How to Use It**
3. Select **Lesson 1: What is AI? Key Definitions You Need to Know**
4. Experience the interactive 3D lesson recap (~78 seconds).

---

## Production Roadmap & Remaining Limitations
- **Placeholder Audio:** Currently uses the browser's Web Speech API (`speechSynthesis`). In production, this will be swapped for high-quality pre-recorded voice audio files referenced in lesson beat data.
- **Placeholder Instructor:** The humanoid figure will be replaced by the official 3D company mascot model using a Babylon.js GLTF/GLB loader.
- **Duration Expansion:** Lesson 1 will be expanded from this 78-second demonstration into a full ~10-minute immersive recap.
- **Additional Lessons:** Lessons 2–4 will be added as independent `LessonRecap` definitions registered in `registry.ts`.

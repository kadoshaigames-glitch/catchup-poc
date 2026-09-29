export type AppView =
  | "welcome"
  | "access"
  | "module-select"
  | "lesson-player";

export type CameraShotId = "wide" | "instructor" | "board";

export type DefinitionRow = {
  term: string;
  meaning: string;
  workplaceExample: string;
};

export type PlatformRow = {
  name: string;
  bestFor: string;
  strength: string;
};

export type BoardContent =
  | {
      kind: "titles";
      programmeLine: string;
      moduleTitle: string;
      lessonTitle: string;
    }
  | {
      kind: "definition";
      heading: string;
      row: DefinitionRow;
    }
  | {
      kind: "layers";
      heading: string;
      layers: string[];
    }
  | {
      kind: "definitionsTable";
      heading: string;
      rows: DefinitionRow[];
    }
  | {
      kind: "tokenPrediction";
      heading: string;
      sentence: string;
      tokens: { word: string; probability: string }[];
      contextNote: string;
    }
  | {
      kind: "platformMatrix";
      heading: string;
      platforms: PlatformRow[];
    }
  | {
      kind: "promptComparison";
      heading: string;
      weakTitle: string;
      weakPrompt: string;
      strongTitle: string;
      strongPrompt: string;
    }
  | {
      kind: "takeaway";
      heading: string;
      text: string;
    }
  | {
      kind: "processFlow";
      heading: string;
      steps: {
        stepNumber: number;
        title: string;
        subtitle: string;
        highlight?: boolean;
      }[];
    }
  | {
      kind: "timeline";
      heading: string;
      milestones: {
        year: string;
        title: string;
        impact: string;
      }[];
    }
  | {
      kind: "temperatureSpectrum";
      heading: string;
      currentValue?: number;
      zones: {
        range: string;
        label: string;
        useCases: string;
        color?: string;
      }[];
      note?: string;
    }
  | {
      kind: "scorecardTable";
      heading: string;
      headers: string[];
      rows: {
        cells: string[];
        highlight?: "green" | "amber" | "red" | "neutral";
      }[];
      note?: string;
    }
  | {
      kind: "kpiVariance";
      heading: string;
      metrics: {
        label: string;
        value: string;
        delta?: string;
        deltaType?: "positive" | "warning" | "neutral";
        subtext?: string;
      }[];
      narrativeTitle?: string;
      narrativeText?: string;
    }
  | {
      kind: "governanceCard";
      heading: string;
      redFlags: { title: string; detail: string }[];
      greenFlags: { title: string; detail: string }[];
    }
  | {
      kind: "checklistCard";
      heading: string;
      categories: { title: string; items: string[] }[];
      footerNote?: string;
    };

export type KnowledgeCheck = {
  question: string;
  options: { id: string; label: string }[];
  correctId: string;
  confirmText: string;
};

export type LessonBeat = {
  id: string;
  startSec: number;
  hudLabel: string;
  camera: CameraShotId;
  board: BoardContent;
  narration: string;
  audioSrc?: string;
  knowledgeCheck?: KnowledgeCheck;
};

export type LessonRecap = {
  id: string;
  moduleId: string;
  title: string;
  durationSec: number;
  prototypeNote: string;
  beats: LessonBeat[];
};

export type CourseModule = {
  id: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  description: string;
  available: boolean;
  recapId?: string;
  statusLabel: string;
  recapMinutes: number;
};

export type CourseLesson = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  modules: CourseModule[];
};

// Aliases for compatibility
export type CatalogLesson = CourseModule;
export type CatalogModule = CourseLesson;

import type { DefinitionRow, LessonRecap } from "../types/lesson";

const rowAi: DefinitionRow = {
  term: "Artificial Intelligence (AI)",
  meaning:
    "Systems that can sense, think, learn, and act, performing tasks that typically require human intelligence",
  workplaceExample:
    "A system that reviews documents and flags unusual values automatically",
};

const rowMl: DefinitionRow = {
  term: "Machine Learning (ML)",
  meaning:
    "A subset of AI where systems learn from data and improve over time without being explicitly programmed",
  workplaceExample:
    "A model that predicts delivery delays or flags unusual cost movements based on past records",
};

const rowAutomation: DefinitionRow = {
  term: "Automation",
  meaning:
    "Using technology to perform repetitive tasks without human intervention",
  workplaceExample:
    "Automatically sending reminders when a submission, approval or delivery date is approaching",
};

const rowGenAi: DefinitionRow = {
  term: "Generative AI",
  meaning:
    "AI that creates new content, text, images, code, or data, based on patterns it has learned",
  workplaceExample:
    "Using ChatGPT to draft a memo, summarise a discussion, or rewrite a reporting note",
};

const takeaway =
  "Not all AI is generative, but generative AI is one of the most practical forms of AI for teams because it helps with summarising, comparing, drafting, analysing, and presenting information more quickly.";

/**
 * Module 1, Section 1 only. Timed demonstration (~78s) of the same lesson
 * that production will expand to ~10 minutes. No content from later sections.
 */
export const sampleLesson: LessonRecap = {
  id: "m1-l1",
  moduleId: "module-1",
  title: "What is AI? Key Definitions You Need to Know",
  durationSec: 78,
  prototypeNote:
    "Prototype demonstration of the Lesson 1 recap experience (~78 seconds). The production recap of this same lesson will run approximately 10 minutes.",
  beats: [
    {
      id: "intro",
      startSec: 0,
      hudLabel: "Introduction",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations, Literacy",
        moduleTitle: "Module 1 · Understanding AI Basics and How to Use It",
        lessonTitle: "Lesson 1 · What is AI? Key Definitions You Need to Know",
      },
      narration:
        "Understanding AI Basics and How to Use It. Let's start with clarity. The world of AI comes with a lot of jargon, but understanding a few key terms will set you up for success.",
    },
    {
      id: "concept",
      startSec: 10,
      hudLabel: "AI defined",
      camera: "instructor",
      board: {
        kind: "definition",
        heading: "Core definition",
        row: rowAi,
      },
      narration:
        "Artificial Intelligence, or AI: systems that can sense, think, learn, and act, performing tasks that typically require human intelligence. Workplace example: a system that reviews documents and flags unusual values automatically.",
    },
    {
      id: "layers",
      startSec: 28,
      hudLabel: "How they relate",
      camera: "board",
      board: {
        kind: "layers",
        heading: "How they relate to each other",
        layers: [
          "Artificial Intelligence (AI) is the broadest category",
          "Machine Learning (ML) sits within AI",
          "Deep Learning (DL) sits within ML",
          "Generative AI is one of the most useful applications built on these technologies",
        ],
      },
      narration:
        "Think of these concepts as layers. Artificial Intelligence is the broadest category. Machine Learning sits within AI. Deep Learning sits within ML. Generative AI is one of the most useful applications built on these technologies.",
    },
    {
      id: "table",
      startSec: 42,
      hudLabel: "Definitions",
      camera: "board",
      board: {
        kind: "definitionsTable",
        heading: "Core definitions",
        rows: [rowMl, rowAutomation, rowGenAi],
      },
      narration:
        "Machine Learning is a subset of AI where systems learn from data and improve over time without being explicitly programmed. A model that predicts delivery delays or flags unusual cost movements based on past records. Automation: using technology to perform repetitive tasks without human intervention. Automatically sending reminders when a submission, approval or delivery date is approaching. Generative AI: AI that creates new content, text, images, code, or data, based on patterns it has learned. Using ChatGPT to draft a memo, summarise a discussion, or rewrite a reporting note.",
    },
    {
      id: "check",
      startSec: 58,
      hudLabel: "Knowledge check",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Knowledge check",
        text: "Which statement matches this lesson?",
      },
      narration: "Which statement matches this lesson?",
      knowledgeCheck: {
        question: "Which statement matches this lesson?",
        options: [
          { id: "a", label: "All AI is generative AI." },
          {
            id: "b",
            label:
              "Not all AI is generative, but generative AI is one of the most practical forms of AI for teams.",
          },
          {
            id: "c",
            label: "Machine learning is broader than artificial intelligence.",
          },
        ],
        correctId: "b",
        confirmText: takeaway,
      },
    },
    {
      id: "close",
      startSec: 68,
      hudLabel: "Key takeaway",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Key takeaway",
        text: takeaway,
      },
      narration: takeaway,
    },
  ],
};

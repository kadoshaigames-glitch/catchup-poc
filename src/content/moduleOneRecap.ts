import type { DefinitionRow, LessonRecap, PlatformRow } from "../types/lesson";

const rowAi: DefinitionRow = {
  term: "Artificial Intelligence (AI)",
  meaning:
    "Systems that can sense, think, learn, and act, performing tasks that typically require human intelligence.",
  workplaceExample:
    "A system that automatically reviews incoming vendor documents and flags unusual or missing values.",
};

const rowMl: DefinitionRow = {
  term: "Machine Learning (ML)",
  meaning:
    "A subset of AI where systems learn from historical data and improve over time without being explicitly programmed.",
  workplaceExample:
    "A predictive model that anticipates component delivery delays or identifies abnormal cost variances.",
};

const rowAutomation: DefinitionRow = {
  term: "Automation",
  meaning:
    "Using rules-based technology to execute repetitive, predefined tasks without human intervention.",
  workplaceExample:
    "Automatically sending notification emails when a submission, milestone, or approval date is approaching.",
};

const rowGenAi: DefinitionRow = {
  term: "Generative AI",
  meaning:
    "AI models that generate net-new content—text, code, structured tables, or images—based on patterns learned from training data.",
  workplaceExample:
    "Using Copilot or ChatGPT to draft a formal memo, summarize a 15-page SOP, or synthesize meeting notes.",
};

const platforms: PlatformRow[] = [
  {
    name: "ChatGPT (OpenAI)",
    strength: "Conversational, versatile, large knowledge base",
    bestFor: "Drafting emails, rewriting commentary, brainstorming",
  },
  {
    name: "Claude (Anthropic)",
    strength: "High context window, dense document analysis",
    bestFor: "Reviewing lengthy technical specs, policies, contracts",
  },
  {
    name: "Gemini (Google)",
    strength: "Multimodal processing of images, text, and tables",
    bestFor: "Interpreting charts, scanned diagrams, visual dashboards",
  },
  {
    name: "Grok (xAI)",
    strength: "Real-time internet access, live search",
    bestFor: "Tracking market news, public developments, industry updates",
  },
  {
    name: "Copilot (Microsoft)",
    strength: "Native Microsoft 365 enterprise integration",
    bestFor: "Drafting in Word, analyzing in Excel, slide decks in PowerPoint",
  },
];

const takeawayText =
  "1. AI predicts based on learned patterns; context directs the prediction.\n2. Match the specific task to the right platform.\n3. Brief AI as a team member using Context, Role, and Expectation (CRE).\n4. Ground prompts with low temperature for factual corporate tasks.";

/**
 * Module 1: Full ~10-minute interactive production recap.
 * Authoritatively validated against Level 1 Handbook (pp. 5–13) and live training records.
 */
export const moduleOneRecap: LessonRecap = {
  id: "l1-m1",
  moduleId: "module-1",
  title: "Module 1 · Understanding AI Basics and How to Use It",
  durationSec: 600,
  prototypeNote:
    "Full ~10-minute production recap grounded in the Level 1 Handbook and session transcripts. Covers definitions, token probability, platforms, CRE framework, prompt walkthrough, and knowledge check.",
  beats: [
    {
      id: "m1-intro",
      startSec: 0,
      hudLabel: "1. Welcome & Overview",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations & Literacy",
        moduleTitle: "Module 1 · Understanding AI Basics and How to Use It",
        lessonTitle: "10-Minute Comprehensive Catch-Up Recap",
      },
      narration:
        "Welcome to Module 1: Understanding AI Basics and How to Use It. Artificial intelligence is no longer a future concept—it is an everyday workplace capability to help you work faster, think more clearly, and eliminate manual busywork. Over the next ten minutes, we will unpack what AI actually is, understand the prediction engine behind it, match your tasks to the right tools, and master prompt engineering using the CRE and 10-step frameworks.",
      audioSrc: "/assets/audio/awang/Awang-intro.mp3",
    },
    {
      id: "m1-definitions",
      startSec: 45,
      hudLabel: "2. Core Definitions",
      camera: "board",
      board: {
        kind: "definitionsTable",
        heading: "Core Definitions & Workplace Examples",
        rows: [rowAi, rowMl, rowAutomation, rowGenAi],
      },
      narration:
        "Let us begin with clarity. The AI landscape has a lot of jargon, but four core terms define the technology. Artificial Intelligence encompasses systems that can sense, think, learn, and act. Machine Learning is a subset where algorithms learn from data without explicit line-by-line programming. Automation executes rule-based repetitive tasks like calendar triggers. And Generative AI creates net-new content based on patterns it has internalized. Notice the distinction: automation follows fixed rules, whereas generative AI produces novel text, code, or analysis.",
    },
    {
      id: "m1-layers",
      startSec: 135,
      hudLabel: "3. How Concepts Relate",
      camera: "board",
      board: {
        kind: "layers",
        heading: "How AI Concepts Relate to Each Other",
        layers: [
          "1. Artificial Intelligence (AI) is the overarching field",
          "2. Machine Learning (ML) sits within AI",
          "3. Deep Learning (DL) sits within Machine Learning",
          "4. Generative AI is a practical application built upon these layers",
        ],
      },
      narration:
        "Think of these concepts as nested layers. Artificial Intelligence is the broadest category. Machine Learning sits within AI. Deep Learning—powering multi-layered neural networks—sits within Machine Learning. And Generative AI represents the modern application layer built on top of these foundations. Not all AI is generative, but generative AI is the most practical day-to-day tool for corporate teams because it directly accelerates summarizing, comparing, drafting, and analyzing information.",
    },
    {
      id: "m1-history",
      startSec: 185,
      hudLabel: "4. History of AI Milestones",
      camera: "board",
      board: {
        kind: "timeline",
        heading: "Evolution of AI: 8 Milestones That Built Today's Tools",
        milestones: [
          {
            year: "1950",
            title: "Alan Turing & The Turing Test",
            impact: "Proposed machines could simulate human intelligence and reasoning.",
          },
          {
            year: "1956",
            title: "Dartmouth Workshop",
            impact: "Coined the official academic term 'Artificial Intelligence'.",
          },
          {
            year: "1970s–90s",
            title: "The Expert Systems Era",
            impact: "Rule-based logic deployed for medical diagnosis and engineering tasks.",
          },
          {
            year: "1997",
            title: "IBM Deep Blue",
            impact: "First computer system to defeat reigning world chess champion.",
          },
          {
            year: "2012",
            title: "AlexNet & Deep Learning",
            impact: "Deep neural networks surpassed human error benchmarks in vision.",
          },
          {
            year: "2017",
            title: "The Transformer Architecture",
            impact: "'Attention Is All You Need' paper unlocked modern Large Language Models.",
          },
          {
            year: "2022",
            title: "ChatGPT & Generative AI",
            impact: "Brought natural conversational capability directly to millions of users.",
          },
          {
            year: "2024–2026",
            title: "Multimodal Enterprise AI",
            impact: "Autonomous agents, vision-voice reasoning, and deep corporate workflow integration.",
          },
        ],
      },
      narration:
        "AI did not appear overnight. As documented in the Level 1 Handbook, its trajectory spans from Alan Turing's 1950 test of machine intelligence and the 1956 Dartmouth conference, through rule-based expert systems, to the pivotal 2017 Transformer architecture paper that enabled modern LLMs. Understanding this lineage reminds us that AI is an engineered mathematical system built to process patterns, not a sentient mind.",
    },
    {
      id: "m1-prediction",
      startSec: 250,
      hudLabel: "5. Token Prediction Engine",
      camera: "board",
      board: {
        kind: "tokenPrediction",
        heading: "How Generative AI Actually Generates Output",
        sentence: "The cat sat on the [ _____ ]",
        tokens: [
          { word: "mat", probability: "38% likelihood" },
          { word: "rug", probability: "24% likelihood" },
          { word: "floor", probability: "16% likelihood" },
          { word: "sofa", probability: "12% likelihood" },
          { word: "roof", probability: "10% likelihood" },
        ],
        contextNote:
          "AI does not possess human understanding or consciousness. It calculates statistical probability to predict the most likely continuation based on context. When you change one word in the prompt, the probability distribution shifts completely. This is why prompt context determines output quality.",
      },
      narration:
        "Before learning prompt design, we must understand how AI actually thinks. Large Language Models do not understand language the way humans do. Instead, they predict the statistically most probable next word based on patterns across vast training datasets. Consider the sentence: 'The cat sat on the...'. The model predicts plausible completions like 'mat', 'rug', or 'floor'. Now, imagine changing the stem to: 'The purchase order was delayed because the supplier...'. The probabilities immediately shift to words like 'failed', 'missed', or 'rescheduled'. Context dictates prediction. Prompting is not chatting—it is briefing a statistical engine.",
    },
    {
      id: "m1-platforms",
      startSec: 330,
      hudLabel: "6. Platform Selection",
      camera: "instructor",
      board: {
        kind: "platformMatrix",
        heading: "Leading Enterprise AI Platforms Comparison",
        platforms: platforms,
      },
      narration:
        "Never force one AI tool to do everything. Each platform has distinct strengths. Use ChatGPT for conversational drafting, templates, and rapid brainstorming. Turn to Claude when you need to ingest dense 50-page technical specifications or legal contracts, where low hallucination and deep context are vital. Use Google Gemini when analyzing visual dashboards, charts, or scanned sheets. Use Grok when you need live market updates and real-time web verification. And use Microsoft Copilot when you want native support inside Word, Excel, PowerPoint, Outlook, and Teams.",
    },
    {
      id: "m1-cre",
      startSec: 405,
      hudLabel: "7. CRE & Temperature Calibration",
      camera: "board",
      board: {
        kind: "temperatureSpectrum",
        heading: "Prompt Control: CRE Framework & Temperature Calibration Dial",
        zones: [
          {
            range: "0.0 — 0.5",
            label: "Deterministic & Strict",
            useCases:
              "Corporate policies, financial variance analysis, statutory compliance checklists, SOP verification, contract clause auditing.",
            color: "#38bdf8",
          },
          {
            range: "0.6 — 1.0",
            label: "Balanced & Communicative",
            useCases:
              "Executive summaries, client emails, departmental meeting agendas, standard reporting commentary, presentation narrative drafts.",
            color: "#fbbf24",
          },
          {
            range: "1.1 — 2.0",
            label: "Creative & Exploratory",
            useCases:
              "Strategic brainstorming, marketing campaign concepts, workshop exercises, speculative risk scenarios, creative naming.",
            color: "#f87171",
          },
        ],
        note: "Handbook Rule: Combine Context, Role, and Expectation (CRE) with low temperature (0.0–0.5) for fact-grounded corporate tasks.",
      },
      narration:
        "A vague prompt yields generic, unusable output. To get executive-level results, apply the CRE framework: Context, Role, Expectation. Context briefs the situation: who is asking and what background data applies. Role instructs the AI on its specific vantage point: for example, an experienced procurement specialist or quality assurance engineer. Expectation dictates the deliverables: format, tone, audience, and constraints. When precision is required, calibrate temperature. Keep temperature between 0.0 and 0.5 for compliance checklists, financial summaries, and technical procedures to minimize variance and eliminate hallucinations.",
    },
    {
      id: "m1-walkthrough",
      startSec: 490,
      hudLabel: "8. Prompt Walkthrough",
      camera: "board",
      board: {
        kind: "promptComparison",
        heading: "Applied Prompting: Weak vs. Structured CRE",
        weakTitle: "Weak Prompt (Generic & Ineffective)",
        weakPrompt:
          "\"Write a follow-up email to a supplier about an overdue purchase order.\"\n\nResult:\nProduces a polite but vague template that lacks dates, PO numbers, business urgency, or specific response timelines. Requires heavy manual rewriting.",
        strongTitle: "CRE Framework Prompt (Executive-Ready)",
        strongPrompt:
          "\"CONTEXT: I am a Procurement Executive following up with 12 suppliers on overdue site deliveries.\nROLE: Professional procurement coordinator with 10 years experience.\nEXPECTATION: Write a firm but polite email to a supplier whose delivery is 5 working days overdue. Include: (1) PO reference placeholder, (2) original delivery date, (3) request for confirmed delivery within 2 working days, (4) impact on project schedule. Under 150 words.\"\n\nResult: Immediate, professional, and directly sendable.",
      },
      narration:
        "Compare the two prompts on your screen. The one-line prompt produces a generic email that is polite but useless for operations. The CRE prompt establishes the operational stakes: the 5 days overdue status, the 48-hour deadline for a revised date, the project milestone consequence, and a strict 150-word ceiling. The output generated from the CRE prompt is crisp, professional, and ready to dispatch immediately. Good prompting is not luck—it is disciplined briefing.",
    },
    {
      id: "m1-check",
      startSec: 550,
      hudLabel: "9. Knowledge Check",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Module 1 Knowledge Check",
        text: "Which statement best describes how to achieve reliable, policy-compliant AI outputs for corporate reporting?",
      },
      narration:
        "Before concluding, let us test our understanding of prompt engineering and model behavior.",
      knowledgeCheck: {
        question:
          "Which prompting practice best ensures reliable, factual AI outputs for enterprise business tasks?",
        options: [
          {
            id: "a",
            label:
              "Keep prompts under 10 words and set temperature to maximum (2.0) for greater AI autonomy.",
          },
          {
            id: "b",
            label:
              "Structure the prompt using Context, Role, and Expectation (CRE), define explicit constraints, and keep temperature low (0.0–0.5).",
          },
          {
            id: "c",
            label:
              "Instruct the AI to browse public forums to find unverified corporate solutions.",
          },
        ],
        correctId: "b",
        confirmText:
          "Correct! High-quality enterprise output requires explicit context, a defined professional role, clear constraints, and low temperature (0.0–0.5) to ensure factual consistency.",
      },
    },
    {
      id: "m1-takeaway",
      startSec: 570,
      hudLabel: "10. Key Takeaways",
      camera: "wide",
      board: {
        kind: "takeaway",
        heading: "Module 1 Key Takeaways",
        text: takeawayText,
      },
      narration:
        "Here are your core takeaways from Module 1. First, AI predicts based on learned patterns; context directs that prediction. Second, select the platform suited to your specific task rather than forcing one tool. Third, always brief AI using Context, Role, and Expectation. And fourth, use low temperature for factual corporate work. You are now equipped with the foundations. Proceed to Module 2 to see how AI revolutionizes document comparison and variance analysis.",
    },
  ],
};
